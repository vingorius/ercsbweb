define("comutationnavigation/event_comutationnavigation", ["utils", "size"], function(_utils, _size)	{
	return 	function(_data) {
		var data = _data || {};

		var get_click = function()	{
			var target = $(this)[0];
			var type = target.id.substring(target.id.lastIndexOf("_") + 1, target.id.length);
			var sign = (type === "up") ? 1 : -1;

			if(((get_input_value() / 100) * sign) + get_input_value() < 100)	{
				return;
			}

			change_input_value(sign);

			scale_sample();
			scale_comutation();
		}

		var get_input_value = function()    {
			var input = $("#comutation_scale_input");

			return Number(input.val().substring(0, input.val().length - 1));
		}

		var change_input_value = function(_sign)   {
			var input = $("#comutation_scale_input");
			var value = 10;

			input.val(Number(get_input_value() + (value * _sign)) + "%");
		}

		var calculate_value = function()	{
			return (get_input_value() - 100) / 100;
		}

		var scale_sample = function()	{
			var sample = d3.select("#comutationplot_sample");
			var rects = d3.selectAll(".samplebar_group rect");

			var old = $("#comutationplot_sample").width();
			var now = old + (old * calculate_value());

			var x = _utils.ordinalScale(data.samples, data.size.margin.left, now - data.size.margin.left);

			if(old > now)	{
				return;
			}

			sample
			.attr("width", now);

			rects
			.attr("x", function(_d) { return x(_d.sample); })
			.attr("width", function(_d ) { return x.rangeBand(); });
		}

		var scale_comutation = function()	{
			var comutation = d3.select("#comutationplot_mutationseq");
			var groups = d3.selectAll(".comuts_cell_group");
			var rects = d3.selectAll(".comuts_cell_group rect");
			var origin = $("#comutationplot_mutationseq");

			var old = origin.width();
			var now = old + (old * calculate_value());

			var x = _utils.ordinalScale(data.samples, 0, now);
			var y = _utils.ordinalScale(data.genes, data.size.margin.top,
				(origin.height() - data.size.margin.bottom));

			if(old > now)	{
				return;
			}

			comutation
			.attr("width", now);

			groups
			.attr("transform", function(_d)	{
				return "translate(" + x(_d.sample) + ", " + y(_d.gene) + ")";
			});

			rects
			.attr("x", 0)
			.attr("width", function(_d) { return x.rangeBand(); });
		}

		return {
			click : get_click
		}
	}
});