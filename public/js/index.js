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
		var total_heap = window.performance.memory.totalJSHeapSize;
		var used_heap = window.performance.memory.usedJSHeapSize;
		var lastused_heap = 0;

		if(used_heap < lastused_heap)	{
			console.log("Garbage collected !!!");
		}

		lastused_heap = used_heap;

		var chart = _utils.find_pathname(window.location.pathname) + "plot";
		_utils.loading(chart.toUpperCase());
		_router();
		// _header($(".container.chart_base_container"));
	});
});