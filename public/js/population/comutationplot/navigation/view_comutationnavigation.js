var COMUTS_NAVI = "population/comutationplot/navigation/";

define(COMUTS_NAVI + "view_comutationnavigation", ["utils", "size", COMUTS_NAVI + "event_comutationnavigation"], function(_utils, _size, _event)	{
	var makeNavigation = function()	{
		var side = document.querySelector("#comutationplot_scale");
		var prev_div = $("#comutationplot_scale_div");

		if(prev_div)	{
			prev_div.remove();
		}
		
		var div = document.createElement("div");
		div.setAttribute("class", "input-group input-group-xs spinner");
		div.setAttribute("id", "comutationplot_scale_div");
		var input = document.createElement("input");
		input.setAttribute("type", "text");
		input.setAttribute("class", "form-control input-sm");
		input.setAttribute("id", "comutationplot_scale_input");
		input.setAttribute("value", "100%");
		input.setAttribute("disabled", true);
		var vertical_div = document.createElement("div");
		vertical_div.setAttribute("class", "input-group-btn-vertical");
		vertical_div.setAttribute("id", "comutationplot_vertical_div");
		var btn_up = document.createElement("button");
		btn_up.setAttribute("class", "btn btn-xs btn-default");
		btn_up.setAttribute("id", "comutationplot_draw_up");
		btn_up.setAttribute("type", "button");
		var btn_down = document.createElement("button");
		btn_down.setAttribute("class", "btn btn-xs btn-default");
		btn_down.setAttribute("id", "comutationplot_draw_down");
		btn_down.setAttribute("type", "button");
		var i_up = document.createElement("i");
		i_up.setAttribute("class", "fa fa-caret-up fa-xs");
		i_up.setAttribute("id", "comutationplot_up_i");
		var i_down = document.createElement("i");
		i_down.setAttribute("class", "fa fa-caret-down fa-xs");
		i_down.setAttribute("id", "comutationplot_down_i");
		var div_init = document.createElement("div");
		div_init.setAttribute("class", "input-btn");
		var btn_init = document.createElement("button");
		btn_init.setAttribute("class", "btn btn-xs btn-default");
		btn_init.setAttribute("id", "comutationplot_initial_button");
		var i_init = document.createElement("i");
		i_init.setAttribute("class", "glyphicon glyphicon-refresh");

		btn_up.appendChild(i_up);
		btn_down.appendChild(i_down);
		btn_init.appendChild(i_init);
		vertical_div.appendChild(btn_up);
		vertical_div.appendChild(btn_down);
		div_init.appendChild(btn_init);
		div.appendChild(input);
		div.appendChild(vertical_div);
		side.appendChild(div);
		side.appendChild(div_init);
	}

	var view = function(_data)	{
		var e = _event(_data) || null;
		
		makeNavigation();

		var draw_up = d3.select("#comutationplot_draw_up")
		.on("click", e.click)
		.on("mouseover", e.upover)
		.on("mouseout", e.out);
		var draw_down = d3.select("#comutationplot_draw_down")
		.on("click", e.click)
		.on("mouseover", e.downover)
		.on("mouseout", e.out);
		var initial_button = d3.select("#comutationplot_initial_button")
		.on("click", e.init)
		.on("mouseover", e.initover)
		.on("mouseout", e.out);
	}
	
	return {
		view : view
	}
});