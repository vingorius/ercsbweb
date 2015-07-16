define("header/event_header", ["utils"], function(_utils)	{
	var a_click = function(_d)	{
		var area_button = document.getElementById("select_area_button");
		var li = $("#chart_div_ul li a");

		(this.text === "selelct area") ? 
		area_button.value = "" : area_button.value = this.text;

		for(var i = 0, len = li.length ; i < len ; i++)	{
			if(li[i].text !== "select area")	{
				if(li[i].text === area_button.value)	{
					_utils.getTag(li[i].text).style.border = "1px solid red";
				}
				else {
					_utils.getTag(li[i].text).style.border = null;
				}
			}
		}
	}

	var img_click = function(_d)	{
		var area_button = document.getElementById("select_area_button");
		var png_name = _utils.find_pathname(window.location.pathname);

		if(area_button.value === "")	{
			return;
		}

		var target = _utils.getTag(area_button.value);
		target.style.border = null;

		_utils.toPng(target, png_name);		
	}

	return {
		a_click : a_click,
		img_click : img_click
	}
})