define("population/comutationplot/navigation/event_comutationnavigation", ["utils", "size", "population/comutationplot/vo_comutationplot"], function(_utils, _size, _VO)	{
	return 	function(_data) {
		var eventClick = function()	{
			var sign = ((/up/i).test($(this)[0].id)) ? 1 : -1;

			if(((getInputValue() / 100) * sign) + getInputValue() <= 100)	{
				return;
			}
			changeInputValue(sign);
			getScale();
		}

		var getInputValue = function()    {
			return _utils.getNum($("#comutationplot_scale_input").val());;
		}

		var changeInputValue = function(_sign, _value)   {
			$("#comutationplot_scale_input").val((getInputValue() + ((_value || 10) * _sign)) + "%");
		}

		var getScale = function()	{
			var old = _VO.VO.getInitWidth();
			var now = old + (old * ((getInputValue() - 100) / 100));
			var x = _utils.ordinalScale(_VO.VO.getSample(), 0, now);
			var y = _utils.ordinalScale(_VO.VO.getGene(), 0, _VO.VO.getInitHeight());

			_VO.VO.setWidth(now);

			d3.selectAll(".comutationplot_groups, .comutationplot_sample, .comutationplot_heatmap")
			.attr("width", now);

			d3.selectAll("#comutationplot_heatmap_border_rect")
			.attr("width", now);

			comutationRedraw(now, x, y);
			sampleRedraw(now, x);
			groupRedraw(now, x);
		}

		var groupRedraw = function(_value, _x)	{
			var rects = d3.selectAll(".comutationplot_bar_group_rects");
			
			_utils.attributeXY(rects, "x", _x, "sample", false);

			rects
			.attr("width", _x.rangeBand());
		}

		var sampleRedraw = function(_value, _x)	{
			_utils.translateXY(d3.selectAll(".comutationplot_sample_bargroup"), _x, 0, "name", 0, false, false);
			_utils.attributeSize(d3.selectAll(".comutationplot_sample_bars"), "width", _x);
		}

		var comutationRedraw = function(_value, _x, _y)	{
			_utils.attributeSize(d3.selectAll(".comutationplot_cells"), "width", _x);
			_utils.translateXY(d3.selectAll(".comutationplot_cellgroup"), _x, _y, "sample", "gene", false, false);
			_utils.translateXY(d3.selectAll(".comutationplot_patient_cellgroup"), 0, _y, "sample", "gene", true, true);
		}

		var getInit = function(_d)	{
			var vo = _VO.VO;
			var init_y = _utils.ordinalScale(vo.getInitGene(), 0, vo.getInitHeight());
			var init_x = _utils.ordinalScale(vo.getInitSample(), 0, vo.getInitWidth());

			vo.setGene(vo.getInitGene());
			vo.setSample(vo.getInitSample());

			sampleRedraw(vo.getInitWidth(), init_x);
			groupRedraw(vo.getInitWidth(), init_x);
			comutationRedraw(vo.getInitWidth(), init_x, init_y);
			
			if(getInputValue() === 100)	{
				changeInputValue(-1, 0);
			}
			changeInputValue(-1, (getInputValue() - 100));
			
			_utils.callAxis(d3.selectAll(".comutationplot_gene_yaxis"), init_y, "right");
			_utils.translateXY(d3.selectAll(".comutationplot_pq_bargroup"), 0, init_y, 0, "gene", false, false);	
			_utils.translateXY(d3.selectAll(".comutationplot_gene_bargroup"), 0, init_y, 0, "name", false, false);
			d3.select(".comutationplot_heatmap").attr("width", vo.getInitWidth());
			$("#comutationplot_heatmap").width(vo.getInitWidth());
			$("#comutationplot_sample, #comutationplot_border, #comutationplot_groups").scrollLeft(0);
		}

		var mOver = function(_d)	{
			(/initial/).test(this.id) ? _utils.tooltip.show(this, "<b>Initialization</b>", "rgba(178, 0, 0, 0.6)") : 
			(/down/).test(this.id) ? _utils.tooltip.show(this, "<b>Scale down </br> minimum(100%)</b>", "rgba(178, 0, 0, 0.6)") : 
			_utils.tooltip.show(this, "<b>Scale up </br> maximun(infinity)</b>", "rgba(178, 0, 0, 0.6)");
		}

		var mOut = function(_d)	{
			_utils.tooltip.hide();
		}
		return {
			over : mOver,
			out : mOut,
			click : eventClick,
			init : getInit
		}
	}
});