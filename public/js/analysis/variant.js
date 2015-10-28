$(function() {
    'use strict';

    $('#classification_all').click(function() {
        // console.log(this.checked);
        if (this.checked) {
            $('input[type=checkbox][name=classification]').prop('checked', false);
        }
    });
    $('input[type=checkbox][name=classification]').click(function() {
        // console.log(this.checked);
        if (this.checked && $('#classification_all').prop('checked')) {
            $('#classification_all').prop('checked', false);
        }
    });
    $('#filterButton').click(function(e) {
        // console.log($('#ex1').val());
        // console.log(getClassificationParameter());
        // console.log($('input[type=checkbox][name=cosmic]').prop('checked'));
        $('#table').bootstrapTable('removeAll');
        $('#table').bootstrapTable('refresh', {});
    });

    function getClassificationParameter() {
        if ($('#classification_all').prop('checked')) {
            return $('#classification_all').val();
        }
        var checked = [];
        $('input[type=checkbox][name=classification]:checked').each(function(_i, _o) {
            checked.push(_o.value);
        });
        return checked.join(',');
    }

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

    var table = $('#table');
    table.bootstrapTable({
        url: '/models/patient/getSampleVariantList',
        classes: 'table',
        method: 'get',
        // cache: false, // False to disable caching of AJAX requests.
        width: '1200px',
        // showColumns: true,
        // showRefresh: true,
        // sortName: 'gene',
        // sortName: 'patientsOfPosition',
        // sortable: true,
        // sortOrder: 'desc',
        pagination: true,
        pageSize: 5,
        queryParams: function(params) {
            params.sample_id = $('#sample_id').val();
            params.cancer_type = $('#cancer_type').val();
            params.frequency = $('#frequency').val();
            params.classification = getClassificationParameter();
            params.cosmic = $('input[type=checkbox][name=cosmic]').prop('checked') ? 'Y' : 'N';
            params.filter_option = bg_public.getFilterOption().join(',');
            params.driver = $('input[type=checkbox][name=driver]').prop('checked') ? 'Y' : 'N';
            // console.log('params:', params);
            return params;
        },
        rowStyle: function(row, index) { // make first row active
            if (index === 0) return {
                classes: 'info'
            };
            return {};
        },
        columns: [{
            field: 'state',
            title: '#',
            radio: true,
            align: 'center',
            valign: 'middle',
            clickToSelect: true,
        }, {
            field: 'gene',
            title: 'Gene',
            sortable: true,
            align: 'center',
            formatter: function(value, row) {
                //var params = [row.cancer_type, row.sample_id, row.gene, row.transcript];
                return '<a target=\'ncbi\' href="http://www.ncbi.nlm.nih.gov/gene?term=(' + value + '[Sym]) AND 9606[Taxonomy ID]">' + value + '</a> ';
            },
            events: 'tsEvents', // needleplot.js
        }, {
            field: 'class',
            title: 'Classification',
            sortable: true,
            align: 'center',
            formatter: function(value, row) {
                return value.replace('_Mutation', '');
            }
        }, {
            field: 'cds',
            title: 'CDS Change',
            align: 'center',
        }, {
            field: 'alt',
            title: 'AA Change',
            align: 'center',
        }, {
            field: 'uniprot_id',
            title: 'Protein',
            align: 'center',
            formatter: function(value, row) {
                //var params = [row.cancer_type, row.sample_id, row.gene, row.transcript];
                return '<a target=\'pfam\' href="http://pfam.xfam.org/protein/' + value + '">' + value + '</a> ';
            },
            // events: 'tsEvents', // needleplot.js
        }, {
            field: 'pdomain',
            title: 'Domain',
            align: 'center',
            formatter: function(value, row) {
                if (value === undefined || value === '') return '';
                var info = '<a href="#"><i class="fa fa-info-circle" data-toggle="tooltip" data-placement="top" title="' + row.pdomain_desc + '"></i></a>';
                var span = '<a target="pdomain" href="http://pfam.xfam.org/family/' + value + '">' + value + ' </a>';
                return span + info;
            }
        }, {
            field: 'pdomain_desc',
            title: 'Domain Description',
            align: 'center',
            visible: false,
        }, {
            field: 'patientsOfPosition',
            title: '<span>Frq. in Gene</span><a href="#"> <i class="fa fa-info-circle" data-toggle="tooltip" data-placement="top" title="no. of the patients who has a specific mutation among the patients with a specific gene in Frq. in Total"></i></a>',
            sortable: true,
            align: 'center',
            formatter: function(value, row) {
                var pct = 0;
                if (row.patientsOfTranscript !== 0) pct = (row.patientsOfPosition / row.patientsOfTranscript) * 100;
                return pct.toFixed(2) + '%' + ' (' + row.patientsOfPosition + '/' + row.patientsOfTranscript + ')';
            }
        }, {
            field: 'patientsOfPosition',
            title: '<span>Frq. in Total</span><a href="#"> <i class="fa fa-info-circle" data-toggle="tooltip" data-placement="top" title="no. of the patients who has a specific mutation among the whole patients selected from public data (TCGA)"></i></a>',
            sortable: true,
            align: 'center',
            formatter: function(value, row) {
                var pct = 0;
                var patientsOfCancer = bg_public.getFilteredCount();
                if (patientsOfCancer !== 0) pct = (row.patientsOfPosition / patientsOfCancer) * 100;
                return pct.toFixed(2) + '%' + ' (' + row.patientsOfPosition + '/' + patientsOfCancer + ')';
            }
        }, {
            field: 'target',
            title: 'Actionable target?',
            align: 'center',
            formatter: function(value, row) {
                if (value === null) return '';
                var targets = value.split(',');
                if (targets.length > 0) {
                    var data_content = '';
                    targets.forEach(function(target) {
                        console.log(target);
                        var link = getDrugLink(target);
                        // data_content = data_content + '<a class=\'text-nowrap\' href=\'#\'>' + target + '</a><br>';
                        data_content += link + '<br>';
                    });
                    data_content = data_content + '';
                    console.log('data_content', data_content);

                    var data = getDrugLink(targets[0]) + ' ';
                    if (targets.length > 1) {
                        data += '<a tabindex="0" role="button" data-trigger="focus" data-placement="bottom" data-toggle="popover" data-html="true" title="FDA Approved"' +
                            ' data-content="' + data_content + '">' +
                            '<span class="badge">' + targets.length + '</span></a>';
                    }
                    return data;
                }
            }
        }]
    });


    table.on('load-success.bs.table', function(_event, _data, _args) {

        if (_data === undefined || _data.length === 0) {
            // Remove previous chart...
            $("div[id^=needleplot]").css("display", "none");
            return;
        }

        $("div[id^=needleplot]").css("display", "block");
        var data = _data[0];

        // params.classification = getClassificationParameter();

        // main.js에 있는 부분을 여기 써주는 이유는, 비동기로 데이터를 읽어오기 때문에, main.js 가 실행된 후에 table row 데이터가 들어오기 때문이다.
        $('[data-toggle="tooltip"]').tooltip();
        $('[data-toggle="popover"]').popover();

        table.bootstrapTable('check', 0); //first row check,
        // 첫번째 row를 check 하였기에 이벤트에서 처리함.
        // Init.requireJs(
        //     "analysis_needle",
        //     "/rest/needleplot?cancer_type=" + data.cancer_type + "&sample_id=" + data.sample_id + "&gene=" + data.gene + "&transcript=" + data.transcript + "&classification=" + getClassificationParameter() + "&filter=" + bg_public.getFilterOption().join(',')
        // );
        //http://192.168.191.159/rest/needleplot?cancer_type=luad&sample_id=Pat99&gene=EGFR&transcript=ENST00000275493
    });


    // table.on('all.bs.table', function(_name, _args) {
    //     console.log('All',_name, _args);
    // });
    // table.on('click-cell.bs.table', function(_event, _field, _value, _row, _args) {
    table.on('check.bs.table', function(_table, _row) {
        $('.selected').addClass('info').siblings().removeClass('info');
        Init.requireJs(
            "analysis_needle",
            "/rest/needleplot?cancer_type=" + _row.cancer_type + "&sample_id=" + _row.sample_id + "&gene=" + _row.gene + "&transcript=" + _row.transcript + "&classification=" + getClassificationParameter() + "&filter=" + bg_public.getFilterOption().join(',')
        );
    });

    table.on('post-body.bs.table', function(_event, _data, _args) {
        $('[data-toggle="popover"]').popover();
    });

    // window.tsEvents = {
    //     'click #gene': function(_event, _value, _row, _index) {
    //         $(this).closest('tr').addClass('info').siblings().removeClass('info');
    //         Init.requireJs(
    //             "analysis_needle",
    //             "/rest/needleplot?cancer_type=" + _row.cancer_type + "&sample_id=" + _row.sample_id + "&gene=" + _row.gene + "&transcript=" + _row.transcript + "&classification=" + getClassificationParameter() + "&filter=" + bg_public.getFilterOption().join(',')
    //         );
    //     }
    // };
});
