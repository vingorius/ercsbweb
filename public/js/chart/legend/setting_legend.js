define("chart/legend/setting_legend", ["utils", "size", "chart/legend/view_legend"], function(_utils, _size, _view)   {
	var checkBox = function(_size)	{
		var horizontal = (_size.rect_size * 3);

		if(horizontal > _size.rwidth)	{
		 	return true; 
		 }	
		else {
		 	return false; 
		 }						
	}

	var arranged = function(_data, _type, _size_set, _size)	{
		var align = checkBox(_size);
		var maximum_text =  d3.max(_size_set, function(_d)	{ 
			return _d.width; 
		});
		var space = 50;
		var accumulated = space;
		var result = {};
		var y_index = (_type === "text") ? 1 : 0.1;

		for(var i = 0, len = _size_set.length ; i < len ; i++)	{
			if((accumulated + maximum_text) > _size.rwidth)	{
				accumulated = space;
				y_index += (align) ? i * 1.5 : 1 + 0.5;

			}
			if(_data === _size_set[i].name)	{
				result.x = (_type === "text") ? accumulated : accumulated - (_size.rect_size * 2);
				result.y = (_size_set[i].height * y_index);
			}
			accumulated += maximum_text + space;
		}
		return result;
	}

	var getSizeOfFont = function(_data, _font_size, _font_family)	{
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d");
		ctx.font = _font_size + "px " + _font_family;
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
			var item = _data.type_list[i].name;
			size_set.push(getSizeOfFont(item, "14", "Arial"));
		}
		return size_set;
	}

	var alignByPrecedence = function(_type_list)	{
		var cnv = [];
		var exp = [];
		var mut = [];
		var result = [];

		for(var i = 0, len = _type_list.length ; i < len ; i++)	{
			var type = _type_list[i];
			var alteration = _utils.alterationPrecedence(type);
			
			if(alteration.alteration === "CNV")	{
				alteration.name = type;
				cnv.push(alteration);
			}
			else if(alteration.alteration === "mRNA Expression (log2FC)")	{
				alteration.name = type;
				exp.push(alteration);
			}
			else {
				alteration.name = type;
				mut.push(alteration);
			}
		}
		$.merge(result, alignByAlteration(cnv));
		$.merge(result, alignByAlteration(exp));
		$.merge(result, alignByAlteration(mut));

		return result;
	}

	var alignByAlteration = function(_alteration_array)	{
		return _alteration_array.sort(function(_a, _b) {
			return _a.priority > _b.priority ? -1 : 1;
		});
	}

	var alignByPca = function(_type_list)	{
		return _type_list;
	}

	return function(_opt)	{
		var type = _opt.type;
		var size = _size.definitionSize(_opt.view_id, 10, 0, 0, 0);
		size.rect_size = 15;

		switch(type)	{
			case "generic mutation" : 
				_opt.data.type_list = alignByPrecedence(_opt.data.type_list);
				break;
			case "pca mutation" : 
				_opt.data.type_list = alignByPca(_opt.data.type_list);
			default : 
				break;
		}
		_view.view({
			data : _opt.data,
			type : _opt.type,
			chart : _opt.chart,
			id : _opt.view_id,
			size : size,
			size_set : listTextLength(_opt.data),
			arranged : arranged
		});
	}
});