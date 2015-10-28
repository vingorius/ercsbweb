define("population/comutationplot/comutation/view_comutation", ["utils", "size", "population/comutationplot/comutation/event_comutation", "population/comutationplot/vo_comutationplot"], function(_utils, _size, _event, _VO)	{
	var getAlteration = function(_type)	{
		return _utils.alterationPrecedence(_utils.defMutName(_type));
	}

	var makeBorder = function(_svg, _width, _height)	{
		_svg.append("rect")
		.attr("id", "comutationplot_heatmap_border_rect")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", _width)
		.attr("height", _height)
		.style("fill", "none")
		.style("stroke", "#d4d4d4")
		.style("stroke-width", 1);
	}

	var view = function(_data)	{
		var size = _data.size;
		var width = _data.is_patient ? size.width :  _VO.VO.getWidth();
		var svg = _size.mkSvg("#" + _data.class_name + "_heatmap", width, size.height);

		makeBorder(svg, width, size.height);

		var yAxis = d3.svg.axis()
		.scale(_data.y)
		.orient("left");

		var cell_group = svg.selectAll("." + _data.class_name + "_cellgroup")
		.data(_data.all_data)
		.enter().append("g")
		.attr("class", _data.class_name + "_cellgroup")
		.attr("transform", function(_d, _i)	{
			var target = $(this)[0];

			_d.x = _data.x;
			_d.y = _data.y;

			if(getAlteration(_d.type).alteration === "Somatic Mutation")	{
				target.parentNode.appendChild(target);
			}
			return "translate(" + _data.x(_d.sample) + ", " + _data.y(_d.gene) +")";
		});

		var cell = cell_group.append("rect")
		.attr("class", function(_d) {
			return "" + _data.class_name + "_cells " + _d.sample + "-" + _d.gene;	
		})
		.style("fill", function(_d) { 
			return _utils.colour(_utils.defMutName(_d.type)); 
		})
		.on("mouseover", _event.m_over)
		.on("mouseout", _event.m_out)
		.attr("x", 0)
		.attr("y", function(_d)	{
			if(getAlteration(_d.type).alteration === "CNV")	{
				return 0;
			} 
			return (_data.y.rangeBand() / 2) - ((_data.y.rangeBand() / 2.5) / 2); 
		})
		.attr("width", _data.x.rangeBand())
		.attr("height", function(_d) {
			if(getAlteration(_d.type).alteration === "CNV")	{
				_d.sign = 0;
				return _data.y.rangeBand() / _VO.VO.getTopBetween();
			} 
			_d.sign = 2;
			return (_data.y.rangeBand() / 3) / _VO.VO.getTopBetween(); 
		});
		_event.move_scroll();
	}
	return {
		view : view
	}
});