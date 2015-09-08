var ANALYSIS_NEEDLE = "analysis/needleplot/needle/setting_needleplot";
var MUTATIONALLANDSCAPE_COMUTATION = "population/comutationplot/interface_comutationplot";
var ANALYSIS_PATHWAY = "analysis/pathwayplot/pathway/setting_pathwayplot";

/* Old chart */
var COMUTS_INTER = "comutationplot/interface_comutationplot";
var DEG = "degplot/setting_degplot";
var XY = "xyplot/setting_xyplot";
var MA = "maplot/setting_maplot";
var PCA = "pcaplot/interface_pcaplot";

define( "router", [ "utils", ANALYSIS_NEEDLE, MUTATIONALLANDSCAPE_COMUTATION, ANALYSIS_PATHWAY, XY, MA, DEG, PCA, COMUTS_INTER ], function(_utils, _aNeedle, _mlsComutation, _aPathway, _xy, _ma, _deg, _pca, _comutation)	{
	var getFunction = function(_chartName)	{
		return {
			analysis_needle : _aNeedle,
			analysis_pathway : _aPathway,
			mutational_landscape_comutation : _mlsComutation,

			xy : _xy,
			ma : _ma,
			deg : _deg,
			pca : _pca,
			needle : _aNeedle,
			comutation : _comutation
		}[_chartName];
	}

	var checkResStatus = function(_res)	{
		if(_res.message !== "OK" && _res.lenght < 1)	{
			console.log("failed message is ", _res.message);
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
			getFunction(_chartName)(_res);
		
			if(document.querySelector(".chart_container") !== null)	{
				_utils.loading(null, ".chart_container").end(); 
			}
		});
	}

	return function(_chartName, _dataUrl)	{
		ajaxData(_chartName, _dataUrl, checkResStatus);
	}
});