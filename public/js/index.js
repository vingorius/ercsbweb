require.config({
	baseUrl : "/js/",
	paths : {
		router : "chartrouter",
		header : "chartheader/",
		size : "size",
		utils : "chart/utils",
	}
});

/* Memoize example
---------------------------------------------------*/
// var fibonacci2 = (function()	{
// 	var memo = {};

// 	function f(n)	{
// 		var value;

// 		if(n in memo)	{
// 			value = memo[n];
// 		}
// 		else {
// 			if(n === 0 || n === 1)
// 				value = n;
// 			else 
// 				value = f(n - 1) + f(n - 2);

// 			memo[n] = value;
// 		}

// 		return value;
// 	}
// 	return f;
// }());

require(["router", "utils"], function(_router, _utils)  {
	$(function()    {
		// fibonacci2(45);
		var chart = _utils.find_pathname(window.location.pathname) + "plot";
		_utils.loading(chart.toUpperCase());
		_router();
		// _header($(".container.chart_base_container"));
	});
});
