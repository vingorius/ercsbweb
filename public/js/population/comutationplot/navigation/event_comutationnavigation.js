var COMUTS_NAVI = "population/comutationplot/navigation/";
var VO = "population/comutationplot/vo_comutationplot";

define(COMUTS_NAVI + "event_comutationnavigation", ["utils", "size", VO], function(_utils, _size, _VO)	{
	return 	function(_data) {
		var data = _data || {};

		var scroll_status = function()	{
			var scroll = $("#comutationplot_heatmap");

			if(get_input_value() === 100)	{ 
				scroll.css("overflow", "hidden"); 
			}
			else { 
				scroll.css("overflow-x", "scroll"); 
			}
		}

		var get_click = function()	{
			var target = $(this)[0];
			var type = target.id.substring(target.id.lastIndexOf("_") + 1, target.id.length);
			var sign = (type === "up") ? 1 : -1;

			if(((get_input_value() / 100) * sign) + get_input_value() <= 100)	{
				return;
			}
			change_input_value(sign);
			scroll_status();
			scale_sample();
			scale_group();
			scale_comutation();
		}

		var get_input_value = function()    {
			var input = $("#comutationplot_scale_input");

			return Number(input.val().substring(0, input.val().length - 1));
		}

		var change_input_value = function(_sign, _value)   {
			var input = $("#comutationplot_scale_input");
			var value = _value || 10;

			input.val(Number(get_input_value() + (value * _sign)) + "%");
		}

		var calculate_value = function()	{
			return (get_input_value() - 100) / 100;
		}

		var scale_group = function()	{
			var group = d3.select(".comutationplot_groups");
			var rects = d3.selectAll(".comutationplot_bar_group_rects");
			var old = $("#comutationplot_groups").width();
			var now = old + (old * calculate_value());
			var x = _utils.ordinalScale(_VO.VO.getSample(), 0, now);
	
			if(old > now)	{
				return;
			}			

			redraw_group(now, x);
		}

		var redraw_group = function(_value, _x)	{
			var group = d3.select(".comutationplot_groups");
			var rects = d3.selectAll(".comutationplot_bar_group_rects");

			group
			.attr("width", _value);

			rects
			.transition().duration(400)
			.attr("x", function(_d)	{
				return _x(_d.sample);
			})
			.attr("width", function(_d)	{
				return _x.rangeBand();
			});
		}

		var scale_sample = function()	{
			var sample = d3.select(".comutationplot_sample");
			var rects = d3.selectAll(".comutationplot_sample_bars");
			var old = $("#comutationplot_sample").width();
			var now = old + (old * calculate_value());
			var x = _utils.ordinalScale(_VO.VO.getSample(), 0, now);

			if(old > now)	{ 
				return;
			}

			redraw_sample(now, x);
		}

		var redraw_sample = function(_value, _x)	{
			var sample = d3.select(".comutationplot_sample");
			var rects = d3.selectAll(".comutationplot_sample_bars");

			sample
			.attr("width", _value);

			d3.selectAll(".comutationplot_sample_bargroup")
			.transition().duration(400)
			.attr("transform", function(_d)	{
				return "translate(" + _x(_d.sample) + ", 0)";
			});

			rects
			.attr("width", function(_d ) {
				return _x.rangeBand(); 
			});
		}

		var scale_comutation = function()	{
			var comutation = d3.select(".comutationplot_heatmap");
			var groups = d3.selectAll(".comutationplot_cellgroup");
			var rects = d3.selectAll(".comutationplot_cells");
			var origin = $("#comutationplot_heatmap");
			var old = origin.width();
			var now = old + (old * calculate_value());
			var x = _utils.ordinalScale(_VO.VO.getSample(), 0, now);
			var y = _utils.ordinalScale(_VO.VO.getGene(), 0, (origin.height() - data.size.margin.bottom));

			if(old > now)	{ 
				return; 
			}
			
			redraw_comutation(now, x, y);
		}

		var redraw_comutation = function(_value, _x, _y)	{
			var comutation = d3.select(".comutationplot_heatmap");
			var groups = d3.selectAll(".comutationplot_cellgroup");
			var rects = d3.selectAll(".comutationplot_cells");
			var origin = $("#comutationplot_heatmap");

			_VO.VO.setWidth(_value);

			comutation
			.attr("width", _value);

			groups
			.transition().duration(400)
			.attr("transform", function(_d)	{
				if(!_y(_d.gene))	{
				return "translate(" + _x(_d.sample) + ", " + _y(_d.gene) +")";	
				}
				return "translate(" + _x(_d.sample) + ", " + _y(_d.gene) +")";
			});

			rects
			.attr("x", 0)
			.attr("width", function(_d) { 
				return _x.rangeBand(); 
			});
		}

		var timeout = function(_func, _sec)	{
			setTimeout(_func, _sec);
		}	

		var get_init = function(_d)	{
			var sample = d3.select(".comutationplot_sample");
			var sample_rects = d3.selectAll(".comutationplot_sample_bars");
			var comutation = d3.select(".comutationplot_heatmap");
			var comutation_groups = d3.selectAll(".comutationplot_cellgroup");
			var comutation_rects = d3.selectAll(".comutationplot_cells");
			var vo = _VO.VO;
			var y = _utils.ordinalScale(vo.getInitGene(), 0, (vo.getInitHeight() - vo.getInitMarginBottom()));
			var x = _utils.ordinalScale(vo.getInitSample(), 0, vo.getInitWidth());

			vo.setGene(vo.getInitGene());
			vo.setSample(vo.getInitSample());

			redraw_sample(vo.getInitWidth(), x);
			redraw_group(vo.getInitWidth(), x);
			redraw_comutation(vo.getInitWidth(), x, y);
			
			if(get_input_value() === 100)	{
				change_input_value(-1, 0);
			}

			change_input_value(-1, (get_input_value() - 100));
			scroll_status();

			timeout(function() { 
				d3.selectAll(".comutationplot_sample_bargroup")
				.transition().duration(400)
				.attr("transform", function(_d)	{
					return "translate(" + x(_d.sample) + ", 0)";
				});

				sample_rects
				.transition().duration(400)
				.attr("width", function(_d ) {
					return x.rangeBand(); 
				});
			}, 300);
			
			timeout(function() { 
				d3.selectAll(".comutationplot_pq_bargroup")
				.transition().duration(400)
				.attr("transform", function(_d)	{
					return "translate(0, " + y(_d.gene) + ")"
				});
				d3.selectAll(".comutationplot_pq_bars")
				.transition().duration(400)
				.attr("height", function(_d)	{
					return y.rangeBand() / 1.2;
				});
			}, 400);

			timeout(function() { 
				d3.selectAll(".comutationplot_gene_yaxis")
				.transition().duration(400)
				.call(d3.svg.axis().scale(y).orient("right")); 
			}, 400);

			timeout(function() { 
				d3.selectAll(".comutationplot_gene_bargroup")
				.transition().duration(400)
				.attr("transform", function(_d)	{
					return "translate(0, " + y(_d.gene) + ")";
				});
				d3.selectAll(".comutationplot_gene_bars")
				.transition().duration(400)
				.attr("height", function(_d)	{
					return y.rangeBand() / 1.2;
				});
			}, 400);

			timeout(function() { 
				d3.selectAll(".comutationplot_cellgroup")
				.transition().duration(400)
				.attr("transform", function(_d)	{
					if(!x(_d.sample))	{
						return "translate(" + _d.x(_d.sample) + ", " + _d.y(_d.gene) +")";	
					}
					return "translate(" + x(_d.sample) + ", " + y(_d.gene) +")";	
				}); 
			}, 500);
		}
		return {
			click : get_click,
			init : get_init
		}
	}
});