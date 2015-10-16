var Init = (function()	{
	return {
		requireJs : function(_chartName, _dataUrl)	{
			var define_array = [];

			(function insertChartFunction()	{
				define_array.push("utils")
				define_array.push({
					analysis_needle : "analysis/needleplot/needle/setting_needleplot",								
					analysis_pathway : "analysis/pathwayplot/pathway/setting_pathwayplot",
					mutational_landscape_comutation : "population/comutationplot/interface_comutationplot",
					xy : "xyplot/setting_xyplot",													
					ma : "maplot/setting_maplot",
					deg : "degplot/setting_degplot",
					pca : "pcaplot/interface_pcaplot",
					needle : "analysis/needleplot/needle/setting_needleplot",
					comutation : "comutationplot/interface_comutationplot"					
				}[_chartName]);
			}());

			require.config({
				baseUrl : "/js/",
				paths : {
					router : "chart/init",
					size : 'chart/size',
					utils : 'chart/utils',
				}
			});
			
			require(["router", "utils"], function(_router, _utils)	{
				if(_chartName !== "deg")	{
					$(".chart_container").css("visibility", "hidden");
					_utils.loading(_chartName, ".chart_container").start();
				}
				(function()	{
					_router(_chartName, _dataUrl);
				}());
			});

			define("router", define_array, function()	{
				var utils = arguments[0];
				var func = arguments[1];
				return function(_chartName, _dataUrl)	{
					function checkResStatus(_res)	{
						if(_res.message !== "OK" && _res.length < 1)	{
							console.log("failed message is ", _res.message);
							window.history.back();
						}
					}

					function ajaxData()	{
						$.ajax({
							type : "GET",
							url : _dataUrl,
							cache : true,
						})
						.done(function(_res)	{
							checkResStatus(_res);
							func(_res);
						});	
					}

					 function handlerOption()	{
						$("#down_png")
						.on("click", function()	{
							utils.downloadImage("chart_png", "png");
						})
						.tooltip({
							container : "body",
							title : "export chart image",
							placement : "right"
						});
					}

					ajaxData();
					handlerOption();

					if(_chartName !== "deg")	{
						utils.loading(null, ".chart_container").end();
					}
				}
			})
		}
	}
}());