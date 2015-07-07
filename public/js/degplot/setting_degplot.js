define("degplot/setting_degplot", ["utils", "size", "degplot/view_degplot"], function(_utils, _size, _view)	{
	var getClass = function(_id)	{
		for (var i = 0, len = document.getElementsByTagName("*").length ; i < len ; i++)	{
			if(document.getElementsByTagName("*")[i].className === _id)	{
				return document.getElementsByTagName("*")[i];
			}
		} 
	}

	var rgb = function(_color) 	{
		return d3.rgb(_color);
	}

	return function(_data)	{
		var data = _data || [];
		var tbody = getClass("degplot_tbody");
		var color_list = [
			[ rgb("#fff"), rgb("#5B7936") ],
			[ rgb("#fff"), rgb("#812E2C") ],
			[ rgb("#fff"), rgb("#0E3251") ]
		];

		for(var i = 0, len = color_list.length ; i < len ; i++)	{

		}

		var si_color_scale = d3.scale.ordinal()
		.domain([0, 10])
		.range([rgb("#fff"), rgb("#5B7936")]);

		console.log(si_color_scale(10))

		_view.view(data.data.pathway_list, tbody);
	}
});	