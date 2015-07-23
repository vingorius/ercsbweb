require.config({
	baseUrl : "/js",
	
	paths : {
		router : "chartrouter",
		header : "chartheader/",
		size : "size",
		utils : "utils",
	}
});

require(["router", "utils"], function(_router, _utils)  {
	$(function()    {
		var chart = _utils.find_pathname(window.location.pathname) + "plot";
		_utils.loading(chart.toUpperCase());
		_router();
		// _header($(".container.chart_base_container"));
	});
});