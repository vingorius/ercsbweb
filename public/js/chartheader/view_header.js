define("header/view_header", ["utils", "header/event_header"], function(_utils, _e)	{
	var get_ul = function()	{
		var uls = document.getElementById("chart_div_ul");

		return uls;
	}

	var  create_a = function(_id)	{
		var a = document.createElement("a");
		a.setAttribute("id", _id + "_a");
		a.appendChild(document.createTextNode(_id));
		a.onclick = _e.a_click;

		return a;
	}

	var create_list = function(_contents)	{
		var ul = get_ul();

		for(var i = 0, len = _contents.length ; i < len ; i++)	{
			var li = document.createElement("li");
			li.setAttribute("id", _contents[i] + "_li");
			li.appendChild(create_a(_contents[i]));
			ul.appendChild(li);
		}
	}

	var downImg_view = function(_data)	{
		var data = _data || {};
		var down_png = document.getElementById("png_download_button");

		create_list(data.data.contents);

		down_png.onclick = _e.img_click;
	}

	return {
		img : downImg_view
	}
})