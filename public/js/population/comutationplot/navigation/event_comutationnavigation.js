var COMUTS_NAVI = "population/comutationplot/navigation/";
var VO = "population/comutationplot/vo_comutationplot";

define(COMUTS_NAVI + "event_comutationnavigation", ["utils", "size", VO], function(_utils, _size, _VO)	{
	return 	function(_data) {
		var size = _data.size;

		var eventClick = function()	{
			var target = $(this)[0];
			var type = target.id.substring(target.id.lastIndexOf("_") + 1, target.id.length);
			var sign = (type === "up") ? 1 : -1;

			if(((getInputValue() / 100) * sign) + getInputValue() <= 100)	{
				return;
			}
			changeInputValue(sign);
			sampleScale();
			groupScale();
			comutationScale();
		}

		var getInputValue = function()    {
			var input = $("#comutationplot_scale_input");

			return Number(input.val().substring(0, input.val().length - 1));
		}

		var changeInputValue = function(_sign, _value)   {
			var value = _value || 10;

			$("#comutationplot_scale_input")
			.val(Number(getInputValue() + (value * _sign)) + "%");
		}

		var calculatedValue = function()	{
			return (getInputValue() - 100) / 100;
		}

		var groupScale = function()	{
			var old = $("#comutationplot_groups").width();
			var now = old + (old * calculatedValue());
			var x = _utils.ordinalScale(_VO.VO.getSample(), 0, now * size.magnification);
	
			if(old > now)	{
				return;
			}			
			groupRedraw(now, x);
		}

		var groupRedraw = function(_value, _x)	{
			var rects = d3.selectAll(".comutationplot_bar_group_rects");

			d3.select(".comutationplot_groups")
			.attr("width", _value * size.magnification);
			
			_utils.attributeXY(rects, "x", _x, "sample", false);

			rects
			.attr("width", function(_d)	{
				return _x.rangeBand() / size.left_between;
			});
		}

		var sampleScale = function()	{
			var old = $("#comutationplot_sample").width();
			var now = old + (old * calculatedValue());
			var x = _utils.ordinalScale(_VO.VO.getSample(), 0, now * size.magnification);

			if(old > now)	{ 
				return;
			}
			sampleRedraw(now, x);
		}

		var sampleRedraw = function(_value, _x)	{
			d3.select(".comutationplot_sample")
			.attr("width", _value * size.magnification);

			_utils.translateXY(d3.selectAll(".comutationplot_sample_bargroup"), _x, 0, "sample", 0, false, false);
			_utils.attributeSize(d3.selectAll(".comutationplot_sample_bars"), "width", _x, size.left_between);
		}

		var comutationScale = function()	{
			var origin = $("#comutationplot_border");
			var old = origin.width();
			var now = old + (old * calculatedValue());
			var x = _utils.ordinalScale(_VO.VO.getSample(), 0, now * size.magnification);
			var y = _utils.ordinalScale(_VO.VO.getGene(), 0, (origin.height() - size.margin.bottom));

			if(old > now)	{ 
				return; 
			}
			comutationRedraw(now, x, y);
		}

		var comutationRedraw = function(_value, _x, _y)	{
			_VO.VO.setWidth(_value);

			d3.select(".comutationplot_heatmap")
			.attr("width", _value * size.magnification);
			$("#comutationplot_heatmap")
			.css("width", _value * size.magnification);

			_utils.attributeSize(d3.selectAll(".comutationplot_cells"), "width", _x, size.left_between);
			_utils.translateXY(d3.selectAll(".comutationplot_cellgroup"), _x, _y, "sample", "gene", false, false);
			_utils.translateXY(d3.selectAll(".comutationplot_patient_cellgroup"), 0, 0, "sample", "gene", true, true);
		}

		var getInit = function(_d)	{
			var vo = _VO.VO;
			var y = _utils.ordinalScale(vo.getInitGene(), 0, (vo.getInitHeight() - vo.getInitMarginBottom()));
			var x = _utils.ordinalScale(vo.getInitSample(), 0, vo.getInitWidth() * size.magnification);

			vo.setGene(vo.getInitGene());
			vo.setSample(vo.getInitSample());

			sampleRedraw(vo.getInitWidth(), x);
			groupRedraw(vo.getInitWidth(), x);
			comutationRedraw(vo.getInitWidth(), x, y);
			
			if(getInputValue() === 100)	{
				changeInputValue(-1, 0);
			}

			changeInputValue(-1, (getInputValue() - 100));
			
			_utils.callAxis(d3.selectAll(".comutationplot_gene_yaxis"), y, "right");
			_utils.translateXY(d3.selectAll(".comutationplot_pq_bargroup"), 0, y, 0, "gene", false, false);	
			_utils.translateXY(d3.selectAll(".comutationplot_gene_bargroup"), 0, y, 0, "gene", false, false);

			$("#comutationplot_sample, #comutationplot_border, #comutationplot_groups").scrollLeft(0);
		}

		var initOver = function(_d)	{
			_utils.tooltip(this, "<b>Initialization</b>", "rgba(178, 0, 0, 0.6)");
		}

		var upOver = function(_d)	{
			_utils.tooltip(this, "<b>Scale up </br> maximun(infinity)</b>", "rgba(178, 0, 0, 0.6)");
		}

		var downOver = function(_d)	{
			_utils.tooltip(this, "<b>Scale down </br> minimum(100%)</b>", "rgba(178, 0, 0, 0.6)");
		}

		var mOut = function(_d)	{
			_utils.tooltip();
		}

		return {
			initover : initOver,
			upover : upOver,
			downover : downOver,
			out : mOut,
			click : eventClick,
			init : getInit
		}
	}
});