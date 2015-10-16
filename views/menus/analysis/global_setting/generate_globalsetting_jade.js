/*
  만든날: 2015.09.21
  만든이: 김종호
  globalsetting_%cancer_type.jade 파일을 만드는 쉘 실행 노드프로그램이다.
  사용법 : node generate_globalsetting_jade.js luad
  를 실행하면 globalsetting_luad.jade 파일을 만든다.

  주의 : 이 파일을 절대로 Beautifier, Formatter를 실행하지 마라.
  multiline 안에 있는 템플릿이 바뀐다.
 */


var fs = require('fs');
var mysql = require('mysql');
var util = require('util');
var multiline = require('multiline');

var cancer_type = process.argv[2];
if(cancer_type === undefined){
    console.log('Usage: node generate_globalsetting_jade.js luad');
    process.exit(1);
}

var filename = 'globalsetting_' + cancer_type +'.jade';
var out = fs.createWriteStream(filename, {
    flags: 'w'
});

var connection = mysql.createConnection({
    host: '192.168.191.160',
    database: 'omics_data',
    user: 'root',
    password: 'whdgkqrhks101'
});

var sql = multiline(function() {
    /*
    select *
      from omics_data.ucsc_sample_subtype a
     where a.value not in ('NA','0')
       and a.cancer_type = ?
     order by 1
    */
});

var modalHeader = multiline(function() {
/*
div#%sModal.modal.fade(tabindex='-1', role='dialog', aria-labelledby='%sModalLabel')
    div.modal-dialog(role='document')
        div.modal-content
            div.modal-header
                button.close(type='button', data-dismiss='modal', aria-label='Close')
                    span(aria-hidden='true') ×
                h4#%sModalLabel.modal-title Cohort Selection - %s
            div.modal-body
                div#accordion.panel-group(role='tablist', aria-multiselectable='true')

*/
});

var panelDefault = multiline(function() {
/*
                    div.panel.panel-default
                        div#heading_%s.panel-heading(role='tab')
                            h4.panel-title
                                a(role='button', data-toggle='collapse', data-parent='#accordion', href='#collapse_%s', aria-expanded='%s', aria-controls='collapse_%s') %s
                                small#sub_message_%s.sub_message
                        div#collapse_%s.panel-collapse.collapse%s(role='tabpanel', aria-labelledby='heading_%s')
                            div.panel-body
                                div
                                    input#%s_all(type='checkbox',name='%s_all', value='All',checked)
                                    span.sub_menu_span All
                                hr(style={'border-top-style': 'dashed','width': '150px', 'margin': '5px'})

*/
});


var panelItem = multiline(function() {
/*
                                div
                                    input(type='checkbox',name='%s_item',value='%s')
                                    span.sub_menu_span %s

*/
});

var modalFooter = multiline(function() {
/*
            div.modal-footer
                button.btn.btn-default(type='button', data-dismiss='modal') Close
                button#saveChanges.btn.btn-primary(type='button', data-dismiss='modal') Save changes

*/
});

function upperToHyphenLower(match) {
    return ' ' + match.charAt(1).toUpperCase();
}

function upper(match) {
    return match.toUpperCase();
}

connection.connect();
// connection.query('select * from omics_data.ucsc_sample_subtype a where a.value not in (\'NA\',\'0\') order by 1', function(err, rows, fields) {
connection.query(sql,[cancer_type], function(err, rows, fields) {
    if (err) throw err;
    out.write(util.format(modalHeader,cancer_type,cancer_type,cancer_type,cancer_type.toUpperCase()));
    // console.log('The solution is: ', rows);
    var prevSubTypeId = '';
    var inclass = '.in';
    var ariaExpanded = 'true';

    rows.forEach(function(row) {
        // console.log(row);
        var subtypeid = row.subtype_id.toLowerCase();
        var subtypeTitle = row.subtype.replace(/^(\w)/,upper).replace(/(_\w)/g,upperToHyphenLower);
        // console.log(subtypeTitle);
        if (prevSubTypeId !== row.subtype_id) {
            out.write(util.format(panelDefault,subtypeid,subtypeid,ariaExpanded,subtypeid,subtypeTitle,subtypeid,subtypeid,inclass,subtypeid,subtypeid,subtypeid));
            // console.log(row.subtype_id);
            inclass = '';
            ariaExpanded = 'false';
        }
        out.write(util.format(panelItem,subtypeid,row.id,row.value));
        prevSubTypeId = row.subtype_id;
    });
    out.write(util.format(modalFooter));
    out.end();
});

connection.end();
