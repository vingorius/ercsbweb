var ANALYSIS_NEEDLE = "analysis/needleplot/needle/setting_needleplot";
var MUTATIONALLANDSCAPE_COMUTATION = "population/comutationplot/interface_comutationplot";

define( "router", [ "utils", ANALYSIS_NEEDLE, MUTATIONALLANDSCAPE_COMUTATION ], function(_utils, _aNeedle, _mlsComutation)	{
	var getFunction = function(_chartName)	{
		return {
			analysis_needle : _aNeedle,
			mutational_landscape_comutation : _mlsComutation
		}[_chartName];
	}

	var checkResStatus = function(_res)	{
		if(_res.status === 1001)	{
			alert(_res.message);
			window.history.back();
		}
	}

	var ajaxData = function(_chartName, _dataUrl, _callback)	{
		$.ajax({
			type : "GET",
			url : _dataUrl,
			cache : true
		})
		.done(function(_res)	{
			_callback(_res);
			fade_in();
			getFunction(_chartName)(_res); 
			fade_out();
		});
	}

	var fade_in = function()	{
		$(".chart_container").fadeIn(1000);
	}

	var fade_out = function()	{
		$(".loading").fadeOut();
	}

	return function(_chartName, _dataUrl)	{
		ajaxData(_chartName, _dataUrl, checkResStatus);
	}
});