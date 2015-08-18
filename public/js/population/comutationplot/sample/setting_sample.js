var SAMPLE = "population/comutationplot/sample/";

define(SAMPLE + "setting_sample", ["utils", "size", SAMPLE + "view_sample"], function(_utils, _size, _view)	{
	var count_by_order = function(_mutation_list, _importance)	{
		var sample_list = [];

		for(var i = 0, len = _mutation_list.length ; i < len ; i++)	{
			var sample = _mutation_list[i];
			var is_sample = _utils.get_json_in_array(sample.sample, sample_list, "sample");

			if(!is_sample)	{
				sample_list.push({
					sample : sample.sample,
					types : [{ type : sample.type, count : 1 }],
					counts : 1
				});
			}
			else {
				var is_type = _utils.get_json_in_array(sample.type, is_sample.types, "type");

				if(!is_type)	{ is_sample.types.push({ type : sample.type, count : 1 }); }
				else { is_type.count += 1; }

				is_sample.counts += 1;
			}
		}
		return stacked(sample_list, _importance);
	}

	var stacked = function(_sample_list, _importance)  {
		for(var i = 0, len = _sample_list.length ; i < len ; i++)	{
			var stack_sample = _sample_list[i];
			stack_sample.types = sort_by_mutation(stack_sample.types, _importance);

			for(var j = 0, leng = stack_sample.types.length ; j < leng ; j++)	{
				var type = stack_sample.types[j];

				if(j === 0)    { type.start = 0; }
				else {
					var pre_type = stack_sample.types[j - 1];
					type.start = pre_type.count + pre_type.start;
				}
			}
		}
		return _sample_list;
	}

	var sort_by_mutation = function(_types, _importance)	{
		return _types.sort(function(_a, _b)	{
			return (_importance.indexOf(_a.type) < _importance.indexOf(_b.type)) ? 1 : -1
		});
	}

	var get_max = function(_count_sample)	{
		return d3.max(_count_sample.map(function(_d) {
			return _d.counts;
		}));
	}

	return function(_mutation_list, _samples, _importance)	{
		var count_sample = count_by_order(_mutation_list, _importance);
		var size = _size.define_size("comutationplot_sample", 20, 20, 0, 0);
		var title_size = _size.define_size("comutationplot_sample_yaxis_title", 20, 20, 20, 20);
		var max = Math.ceil(get_max(count_sample) / 10) * 10;
		var y = _utils.linearScale(0, max, (size.height - (size.margin.bottom / 2)), (size.margin.top * 1.5));

		_utils.remove_svg("comutationplot_sample");

		_view.view({
			data : count_sample,
			size : size,
			max : max,
			x : _utils.ordinalScale(_samples, size.margin.left, (size.width - size.margin.left)), 
			y : y
		});
		_view.titleView({
			data : count_sample,
			size : size,
			title_size : title_size,
			max : max,
			y : y
		})
	}
});