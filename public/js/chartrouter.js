var COMUTS_INTER = "comutationplot/interface_comutationplot";
var DEG = "degplot/setting_degplot";
var XY = "xyplot/setting_xyplot";
var MA = "maplot/setting_maplot";
var PCA = "pcaplot/interface_pcaplot";
var NEEDLE = "needleplot/needle/setting_needleplot";

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
	}
}[NOW];

define("router", [CHART.INIT, "utils"], function(TARGET, _utils)	{
	var chart_set = { url : CHART.URL, func : TARGET };

	var request_data = function()    {    
		$.get(chart_set.url)
		.done(function(_res)   { 
			chart_set.func(_res);
			$(".chart_base_container").fadeIn();
			$("#loading_area").fadeOut(); 
		});
	}

	return function()	{
		request_data();
	}
});