var COMUTATION = "population/comutationplot/comutation/";
var VO = "population/comutationplot/vo_comutationplot";

define(COMUTATION + "setting_comutation", ["utils", "size", COMUTATION + "view_comutation", VO], function(_utils, _size, _view, _VO)	{
	return function(_all_data, _samples, _genes)	{
		var size = _size.define_size("comutationplot_heatmap", 0, 0, 0, 0);

		_VO.VO.setInitWidth(size.width);
		_VO.VO.setInitHeight(size.height + 2);
		_VO.VO.setInitMarginTop(size.margin.top);
		_VO.VO.setInitMarginBottom(size.margin.bottom);
		_VO.VO.setInitMarginLeft(size.margin.left);
		_VO.VO.setInitMarginRight(size.margin.right);

		_VO.VO.setWidth(size.width);
		_VO.VO.setHeight(size.height);
		_VO.VO.setMarginTop(size.margin.top);
		_VO.VO.setMarginBottom(size.margin.bottom);
		_VO.VO.setMarginLeft(size.margin.left);
		_VO.VO.setMarginRight(size.margin.right);

		_utils.remove_svg("comutationplot_heatmap");
		
		_view.view({
			all_data : _all_data,
			samples : _samples,
			genes : _genes,
			size : size,
			x : _utils.ordinalScale(_samples, 0, size.width),
			y : _utils.ordinalScale(_genes,0, size.height)
		});
	}
});