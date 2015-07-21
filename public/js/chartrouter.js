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

	var create_xmlhttprequest = function()	{
		return (window.XMLHttpRequest) 
		? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	}

	var request_xhr = function()	{
		var xhr = create_xmlhttprequest();
		// $(".chart_base_container").hide();
		xhr.open("GET", chart_set.url, true);
		xhr.onreadystatechange = function(_event)	{
			if(xhr.readyState === 4 && xhr.status === 200)	{
				var res = JSON.parse(xhr.responseText);
				chart_set.func(res);
			}
			else { 
				return; 
			}
		}
		xhr.onload = function(_event)	{
			console.log("onload", _event)
			setTimeout(function() {
				$(".chart_base_container").fadeIn();
				$("#loading_area").fadeOut();
			}, 2000);
		}
		xhr.onerror = function(_event)	{
			console.log("onerror", _event)
		}
		xhr.send(null);
	}

	var request_data = function()    {    
		$.get(chart_set.url, function(_res)   { 
			chart_set.func(_res); 
		});
	}

	return function()	{
		// request_data();
		request_xhr();
	}
});