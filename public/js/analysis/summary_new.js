function getDrugLink(value) {
    var array = value.split('|');
    var link = '';
    // console.log('value', value, 'array', array);
    if (array.length === 3) {
        var url;
        if (array[1] === 'N') {
            url = 'http://www.cancer.gov/about-cancer/treatment/drugs/';
        } else {
            url = 'http://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=';
        }
        link = '<a target=drug class=\'text-nowrap\' href=\'' + url + array[2] + '\'>' + array[0] + '</a>';
    } else {
        link = array[0];
    }
    // console.log(array, link);
    return link;
}

function drugPopoverFormatter(value, row, delimiter, title) {
    if (value === null) return '';
    delimiter = delimiter || ',';
    title = title || '';

    var targets = value.split(delimiter);
    // console.log(targets);
    if (targets.length > 0) {
        var data_content = '';
        targets.forEach(function(target) {
            data_content += getDrugLink(target) + '<br>';
        });

        var data = getDrugLink(targets[0]) + ' ';
        if (targets.length > 1) {
            data += '<a tabindex="0" role="button" data-trigger="focus" data-container="body" data-placement="bottom" data-toggle="popover" data-html="true" title="' + title + '" data-content="' + data_content + '">' +
                '<span class="badge badge-link">' + targets.length + '</span></a>';
        }
        return data;
    }
}

$(function() {
    'use strict';
    var cancer_type = $('#cancer_type').val();
    var sample_id = $('#sample_id').val();
    // Data를 읽는다.
    $.ajax({
            method: "GET",
            url: "/models/patient/getSummary",
            data: {
                cancer_type: cancer_type,
                sample_id: sample_id,
            }
        })
        .done(function(data) {
            renderData(data);
        })
        .fail(function(data) {
            alert('fail: ' + data);
        })
        .always(function() {
            $('[data-toggle="popover"]').popover();
        });

    // Driver Gene을 클릭했을 경우, 모달을 띄운다.
    $('#driveModal').on('show.bs.modal', function(event) {
        var modal = $(this);
        var gene = $(event.relatedTarget).data('gene');
        $.ajax({
                method: "GET",
                url: "/models/drug/getDriveGeneInfo",
                data: {
                    gene_id: gene,
                }
            })
            .done(function(data) {
                modal.find('.modal-title').html('<h3 class="modal-gene">' + gene + ' <small>Cancer Drug Target</small></h3> ');
                modal.find('.modal-body .overview').html(data[0].o_html);
                modal.find('.modal-body .alter').html(data[0].a_html);
                modal.find('.modal-body .therapeutic').html(data[0].a_html);
                // modal.find('.modal-body input').val('recipient');
            })
            .fail(function(data) {
                console.log('fail', data);
            });
    });

    function renderData(data) {
        $('#sample_name').text(sample_id + ', ');
        $('.cancername').text(cancer_type.toUpperCase());
        $('#info_cancer_name').text(data.info.cancer_name);
        $('#genomic_alt').text(data.genomic_alt);
        $('#mutational_cd').text(data.mutational_cd);
        $('#cosmic_cgc').text(data.cosmic_cgc);
        $('#fda_cancer').text(data.fda_cancer);
        $('#fda_other_cancer').text(data.fda_other_cancer);
        $('#clinical_trials').text(data.clinical_trials);

        $('#info_age').text(data.info.age);
        $('#info_gender').text(data.info.gender);
        $('#info_smoking_history').text(data.info.smoking_history);
        $('#info_expression_subtype').text(data.info.expression_subtype);
        $('#info_histological_type').text(data.info.histological_type);
        $('#info_pathology').text(data.info.pathology);
        $('#info_pathologic_stage').text(data.info.pathologic_stage);
        $('#info_EGFR_mut').text(data.info.EGFR_mut);
        $('#info_KRAS_mut').text(data.info.KRAS_mut);
        $('#info_targeted_molecular_therapy').text(data.info.targeted_molecular_therapy);
        $('#info_radiation_therapy').text(data.info.radiation_therapy);
        $('#info_primary_therapy_outcome_success').text(data.info.primary_therapy_outcome_success);

        var table = $('#implication_table');
        table.bootstrapTable({
            data: data.implications,
            pagination: true,
            pageSize: 5,
            columns: [{
                field: 'gene',
                title: 'Gene',
                sortable: true,
                align: 'center',
                formatter: function(value, row) {
                    var url = 'http://www.ncbi.nlm.nih.gov/gene?term=(' + value + '[Sym]) AND 9606[Taxonomy ID]';
                    return "<a href='" + url + "' target='ncbi'>" + value + "</a>";
                }
            }, {
                field: 'alt',
                title: 'Genomic Alterations',
                sortable: true,
                align: 'center',
                formatter: function(value, row) {
                    if (value === null) return '';
                    var delimiter = ',';
                    var title = 'Alterations';

                    var targets = value.split(delimiter);
                    // console.log(targets);
                    if (targets.length > 0) {
                        var data_content = '';
                        targets.forEach(function(target) {
                            target = target.replace(/'/g, "\'");
                            target = target.replace(/_Mutation/g, "");
                            data_content = data_content + '<span class=\'text-nowrap\' href=\'#\'>' + target + '</span><br>';
                        });
                        data_content = data_content + '';

                        var data = '<span>' + targets[0].replace(/_Mutation/g, "") + '</span> ';
                        if (targets.length > 1) {
                            data += '<a tabindex="0" role="button" data-trigger="focus" data-container="body" data-placement="bottom" data-toggle="popover" data-html="true" title="' + title + '" data-content="' + data_content + '">' +
                                '<span class="badge badge-link">' + targets.length + '</span></a>';
                        }
                        return data;
                    }
                }
            }, {
                field: 'fda_cancer',
                title: 'Approved Drugs in ' + cancer_type.toUpperCase(),
                sortable: true,
                align: 'center',
                formatter: function(value, row) {
                    return drugPopoverFormatter(value, row, ',', 'FDA Approved');
                },
            }, {
                field: 'fda_other_cancer',
                title: 'Approved Drugs in Others',
                sortable: true,
                align: 'center',
                formatter: function(value, row) {
                    return drugPopoverFormatter(value, row, ',', 'FDA Approved');
                },
            }, {
                field: 'patientsOfPosition',
                title: 'Frequency in ' + cancer_type.toUpperCase(),
                sortable: true,
                align: 'center',
                formatter: function(value, row) {
                    var frq = (row.patientsOfPosition / row.totalPatients * 100).toFixed(2);
                    return frq + '% (' + row.patientsOfPosition + '/' + row.totalPatients + ')';
                },

            }, {
                field: 'mdAnderson',
                title: 'Cancer Gene?',
                sortable: true,
                align: 'center',
                width: '150px',
                formatter: function(value, row) {
                    var html = '';
                    if (row.mdAnderson > 0) {
                        html += '<div class="col-xs-6"><a href="#" data-toggle="modal" data-target="#driveModal" data-gene="' + row.gene + '">';
                        html += '<span class="label label-danger">Driver</span></a></div>';
                    } else {
                        html += '<div class="col-xs-6"></div>';
                    }
                    if (row.countOfCOSMIC > 0) {
                        html += '<div class="col-xs-6"><span class="label label-primary">COSMIC</span></div>';
                    } else {
                        html += '<div class="col-xs-6"></div>';
                    }
                    return html;
                },
            }]
        });

        table.on('post-body.bs.table', function(_event, _data, _args) {
            $('[data-toggle="popover"]').popover();
        });
    }
});
