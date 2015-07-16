define("header/setting_header", ["utils", "header/view_header"], function(_utils, _view)	{
	var search_children = function(_childrens)		{
		var result = [];

		for(var i = 0, len = _childrens.length ; i < len ; i++)	{
			if(i !== 0)	{
				result.push(_childrens[i]);
			}
		}
		return result;
	}

	var get_identification_by_tag = function(_tag)	{
		return _tag.className || _tag.id;
	}	

	return function(_div)	{
		var div = _div || null;

		var childs = search_children(div.children());
		var childs_id = [ get_identification_by_tag(div[0]) ];

		for(var i = 0, len = childs.length ; i < len ; i++)	{
			childs_id.push(get_identification_by_tag(childs[i]));
		}

		_view.img({
			data : {
				contents : childs_id
			}
		})
		// console.log(_utils.toPng(div));
	}
})