$(document).ready(function() {
	// Ladda.bind('button[type=submit]');

	//set clicked navbar as active x
	// $(document).ready(function() {
	//     $('ul.nav.navbar-nav').find('a[href="' + location.pathname + '"]')
	//         .closest('li').addClass('active');
	// });
	$(document).ready(function() {
		var paths = location.pathname.split('/');
		if ($('#' + paths[paths.length - 1]).length) {
			$('#' + paths[paths.length - 1]).addClass('in');
		}
	});
});
