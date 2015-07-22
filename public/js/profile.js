 $(function() {
     // Default Options
     $.fn.editable.defaults.url = '/admin/users/';
     $.fn.editable.defaults.ajaxOptions = {
         type: 'put',
         dataType: 'json',
         cache: false,
     };
     $.fn.editable.defaults.success = function(res) {};
     $.fn.editable.defaults.error = function(res) {
         return res.responseText;
     };

     // Define Columns
     $('#fullname').editable({
         type: 'text',
         validate: function(value) {
             if ($.trim(value) === '') {
                 return 'This field is required';
             }
         }
     });

     $('#gender').editable({
         type: 'select',
         source: [{
             value: 'M',
             text: 'Male'
         }, {
             value: 'F',
             text: 'Female'
         }],
     });

     $('#birth').editable({
         type: 'combodate',
         format: 'YYYY-MM-DD',
         viewformat: 'MM/DD/YYYY',
         template: 'MMMM / D / YYYY',
         combodate: {
             minYear: 1930,
             maxYear: 2000,
             minuteStep: 1
         }
     });

     $('#mobile').editable({
         type: 'text',
         validate: function(value) {
             if ($.trim(value) === '') {
                 return 'This field is required';
             }
             if(! value.match(/^\d{9,}$/)){
                 return 'It must be number, more than 9.';
             }
         }
     });

     // For Source of Country Data
     var source = $.fn.countrySelect.getCountryData().map(function(_d) {
         console.log(_d);
         return {
             value: _d.name,
             text: _d.name
         };
     });

     $('#country').editable({
         type: 'select',
         source: source
     });

     $('#company_name').editable({
         type: 'text',
     });
     $('#company_address').editable({
         type: 'text',
     });
     $('#company_position').editable({
         type: 'text',
     });

 });
