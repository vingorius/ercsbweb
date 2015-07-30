var COMUTS_INTER = "comutationplot/interface_comutationplot";
var DEG = "degplot/setting_degplot";
var XY = "xyplot/setting_xyplot";
var MA = "maplot/setting_maplot";
var PCA = "pcaplot/interface_pcaplot";
var NEEDLE = "needleplot/needle/setting_needleplot";
var FLOW = "flowplot/setting_flowplot";

var PATHNAME = window.location.pathname;
var NOW = PATHNAME.substring(PATHNAME.lastIndexOf("/") + 1,
	PATHNAME.indexOf("plot"));

var CHART = {
	comutation : {
		INIT : COMUTS_INTER,
		URL : "/rest/tumorportal_cmp?type=BRCA"
	},
	needle : {
		INIT : NEEDLE,
		URL : "/rest/needleplot?gene=EGFR"
	},
	xy : {
		INIT : XY,
		URL : "/rest/xyplot"
	},
	ma : {
		INIT : MA,
		URL : "/rest/maplot"
	},
	pca : {
		INIT : PCA,
		URL : "/datas/PCA.dat.tsv"
	},
	deg : {
		INIT : DEG,
		URL : "/rest/degplot"
	},
	flow : {
		INIT : FLOW,
		URL : "/rest/flowplot"
	}
}[NOW];

define("router", [CHART.INIT, "utils"], function(TARGET, _utils)	{
	var chart_set = { url : CHART.URL, func : TARGET };

	var fade_in = function()	{
		$(".chart_base_container").fadeIn(1000);
	}

	var check_status = function(_res)	{
		if(_res.status === 1001)	{
			alert(_res.message);
			window.history.back();
		}
	}

	var fade_out = function()	{
		$(".loading").fadeOut();
	}

	var request_data = function(_callback)    {    
		$.get(chart_set.url)
		.done(function(_res)   {
			_callback(_res);
			fade_in();
			chart_set.func(_res); 
			fade_out();
		});
	}

	return function()	{
		request_data(check_status);
	}
});
// setTimeout(function() { _utils.saveImg("table_component"); }, 3000);