define("legend/setting_legend", ["utils", "size", "legend/view_legend"], function(_utils, _size, _view)   {
	var get_possible_width_list = function(_data) {
		var data = _data || [];
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d");
		ctx.font = "10px Arial";        
		var result = [];

		data.type_list.map(function(_d) {
			var width = ctx.measureText(_d).width;

			result.push({
				type : _d,
				width : width
			});
		});

		return result;
	}

	var get_possible_width = function(_data, _size) {
		var possible_width_list = get_possible_width_list(_data);
		var text_margin = 10;
		var result = 0;

		for(var i = 0, len = possible_width_list.length ; i < len ; i++)    {
			result += (possible_width_list[i].width + text_margin);
		}

		return _size.rect_size * 2 * _data.type_list.length + result
		+ _size.margin.left + _size.margin.right;
	}

	var get_possible_height = function(_data, _size)    {
		return _size.rect_size * 2 * _data.type_list.length + _size.margin.top + _size.margin.bottom;
	}

	var check_area = function(_p_width, _p_height, _size, _data) {
		if((_size.width < (_p_width - (_size.rect_size * 2 * _data.length + _size.margin.left + _size.margin.right)) / _data.length) || (_size.height < _size.rect_size))  {
			return -1;
		}

		if(_size.width < _p_width && _size.height > _p_height)    {
			return 0;
		}
		else if(_size.width > _p_width && _size.height < _p_height) {
			return 1;
		}
		else {
			return 0;
		}
	}

	var get_importance_name = function(_importance)	{
		var result = [];

		for(var i = 0, len = _importance.length ; i < len ; i++)	{
			result.push(_importance[i].name);
		}
		return result;
	}

	var align_by_importance = function(_type_list, _importance)	{
		var type_list = [];

		for(var i = 0, len = _type_list.length ; i < len ; i++)	{
			type_list[_importance.indexOf(_type_list[i])] = _type_list[i];
		}	
		return type_list;
	}

	return function(_data, _id, _option, _importance)	{
		var data = _data || [];
		var id = _id || "";
		var size = _size.define_size(id, 10, 10, 10, 10);
		size.rect_size = 10;
		data.type_list = align_by_importance(data.type_list, get_importance_name(_importance));
		var x = _utils.ordinalScale(data.type_list, size.margin.left, size.rwidth);
		var y = _utils.ordinalScale(data.type_list, size.margin.top, size.rheight);
		var p_width = get_possible_width(data, size);
		var p_height = get_possible_height(data, size);

		var choose_scale_location = function(_d)  {
			var d = _d || "";

			return {
				"0" : { rx : 0, ry : y(_d), tx : (size.rect_size * 2), ty : (y(_d) + size.rect_size) },
				"1" : { rx : x(_d), ry : 0, tx : (x(_d) +  size.rect_size * 2), ty : size.rect_size }
			}[check_area(p_width, p_height, size, data)];
		}

		_view.view({
			data : data,
			id : id,
			size : size,
			x : x,
			y : y,
			location : choose_scale_location,
			figure : _option
		});
	}
});