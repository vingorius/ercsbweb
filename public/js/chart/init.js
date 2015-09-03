var Init = (function()	{
	return {
		requireJs : function(_chartName, _dataUrl)	{
			require.config({
				baseUrl : "/js/",
				paths : {
					router : 'chart/router',
					size : 'chart/size',
					utils : 'chart/utils'
				}
			});

			require(["router", "utils"], function(_router, _utils)	{
				(function()	{
					if(document.querySelector(".chart_container") !== null)	{
						_utils.removeSvg("svg");
						_utils.loading(_chartName, ".chart_container").start();
					}
					_router(_chartName, _dataUrl);
				}());
			});
		}
	}
}());

