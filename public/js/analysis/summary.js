$(function() {
    $('#driveModal').on('show.bs.modal', function(event) {
        var modal = $(this);
        var gene = $(event.relatedTarget).data('gene');
        console.log('gene',gene);
        $.ajax({
                method: "GET",
                url: "/models/drug/getDriveGeneInfo",
                data: {
                    gene_id: gene,
                }
            })
            .done(function(data) {
                console.log('done',data);
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
});
