define("comutationnavigation/view_comutationnavigation", ["utils", "size", "comutationnavigation/event_comutationnavigation"], function(_utils, _size, _event)	{
	var make_div = function()	{
		var side = document.getElementById("comutationplot_scale");
		var prev_div = $("#comutation_scale_div");

		if(prev_div)	{
			prev_div.remove();
		}
		
		var div = document.createElement("div");
		div.setAttribute("class", "input-group-spinner");
		div.setAttribute("id", "comutation_scale_div");
		var input = document.createElement("input");
		input.setAttribute("type", "text");
		input.setAttribute("class", "form-control");
		input.setAttribute("id", "comutation_scale_input");
		input.setAttribute("value", "100%");
		var vertical_div = document.createElement("div");
		vertical_div.setAttribute("class", "input-group-btn-vertical");
		vertical_div.setAttribute("id", "comutation_vertical_div");
		var btn_up = document.createElement("button");
		btn_up.setAttribute("class", "btn btn-default");
		btn_up.setAttribute("id", "comutation_draw_up");
		btn_up.setAttribute("type", "button");
		var btn_down = document.createElement("button");
		btn_down.setAttribute("class", "btn btn-default");
		btn_down.setAttribute("id", "comutation_draw_down");
		btn_down.setAttribute("type", "button");
		var i_up = document.createElement("i");
		i_up.setAttribute("class", "fa fa-caret-up");
		i_up.setAttribute("id", "comutation_up_i");
		var i_down = document.createElement("i");
		i_down.setAttribute("class", "fa fa-caret-down");
		i_down.setAttribute("id", "comutation_down_i");

		btn_up.appendChild(i_up);
		btn_down.appendChild(i_down);

		vertical_div.appendChild(btn_up);
		vertical_div.appendChild(btn_down);

		div.appendChild(input);
		div.appendChild(vertical_div);

		side.appendChild(div);
	}

	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var e = _event(data) || null;
		
		make_div();

		$("#comutation_draw_up")
		.on("click", e.click)
		.tooltip({
			title : "확대",
			placement : "right"
		});

		$("#comutation_draw_down")
		.on("click", e.click)
		.tooltip({
			title : "축소",
			placement : "right"
		});
	}

	return {
		view : view
	}
});