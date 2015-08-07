define("chart/legend/setting_legend", ["utils", "size", "chart/legend/view_legend"], function(_utils, _size, _view)   {
	var checkBox = function(_t_max, _size, _size_set)	{
		var t_size = (_t_max * 2) + (_size.rect_size * 3);
		if(t_size > _size.rwidth)	{ return true; }	// 범례 하나 밖에 포함하지 못하는 폭이 좁은 사각형
		else { return false; }						// 범례 하나 이상 포함하는 폭이 넓은 사각형
	}

	var arranged = function(_data, _type, _size_set, _size)	{
		var rect_type = checkBox(t_max, _size, _size_set);
		var t_max =  d3.max(_size_set, function(_d)	{ return _d.width; });
		var space = 50;
		var accumulated = space;
		var result = {};
		var y_index = (_type === "text") ? 1 : 0.1;

		for(var i = 0, len = _size_set.length ; i < len ; i++)	{
			if((accumulated + t_max) > _size.rwidth)	{
				accumulated = space;
				y_index += (rect_type) ? i * 1.5 : 1 + 0.5;

			}
			if(_data === _size_set[i].name)	{
				result.x = (_type === "text") ? accumulated : accumulated - (_size.rect_size * 2);
				result.y = (_size_set[i].height * y_index);
			}
			accumulated += t_max + space;
		}
		return result;
	}

	var getsize_by_canvas = function(_data)	{
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d");
		ctx.font = "14px Arial";
		var width = ctx.measureText(_data).width;
		var height = parseInt(ctx.font);

		return { 
			name : _data, 
			width : width, 
			height : height 
		};
	}

	var listTextLength = function(_data)	{
		var size_set = [];

		for(var i = 0, len = _data.type_list.length ; i < len ; i++)	{
			var item = _data.type_list[i];
			size_set.push(getsize_by_canvas(item));
		}
		return size_set;
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
		var size = _size.define_size(_id, 0, 0, 0, 0);
		size.rect_size = 15;
		_data.type_list = align_by_importance(_data.type_list, get_importance_name(_importance));

		_view.view({
			data : _data,
			id : _id,
			size : size,
			size_set : listTextLength(_data),
			arranged : arranged,
			figure : _option
		});
	}
});