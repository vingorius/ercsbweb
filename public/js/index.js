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
		_utils.loading("loading");
		_router();
		// _header($(".container.chart_base_container"));
	});
});