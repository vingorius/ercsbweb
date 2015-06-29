$(document).ready(function() {
    Ladda.bind('button[type=submit]');

    //set clicked navbar as active  
    $(document).ready(function() {
        $('ul.nav.navbar-nav').find('a[href="' + location.pathname + '"]')
            .closest('li').addClass('active');
    });
});
