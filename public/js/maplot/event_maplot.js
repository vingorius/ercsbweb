define("maplot/event_maplot", ["utils", "size"], function(_utils, _size)  {
	return function(_data)	{
		var data = _data || {};
		var selected_circles = [];
		var stacked_circles = [];
		var stacked_paths = [];
		var all_circles = data.all_circles;
		var save_paths = [];

		var undo = function(_d)	{

		}

		var redo = function(_d)		{

		}

		var save_all_paths = function()	{
			var reform_paths = [];
			var index = 0;

			console.log(save_paths.length)

			for(var i = 0, len = save_paths.length ; i < len ; i++)	{
				reform_paths[index] = save_paths[i];
				for(var j = 0, leng = save_paths[i].length ; j < leng ; j++)	{
					console.log(save_paths[i][j])
					if(save_paths[i][j].id)	{
						console.log(save_paths[i][j].id)
						//console.log(reform_paths[index])
						index++;
					}
				}	
			}
		}

		var arrow_btn_click = function(_d)	{
			var type = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);

			(type === "up")	?
			$('.spinner input').val((parseFloat($('.spinner input').val()) + 0.01).toFixed(2))
			: $('.spinner input').val((parseFloat($('.spinner input').val()) - 0.01).toFixed(2));
		}

		var get_mouseover = function(_d)	{
			var e = d3.event;

			_utils.tooltip(e
				, "<strong>Title : <span style='color:red'>" + _d.title
				+ "</span></br> X : <span style='color:red'>" + _d.x
				+ "</span></br> Y : <span style='color:red'>" + _d.y
				+ "</span></br> P : <span style='color:red'>"
				+ Number(_d.value).toExponential(5)
				, e.pageX, e.pageY);
		}

		var get_mouseout = function(_d)	{
			var e = d3.event;

			_utils.tooltip();
		}

		var click_redraw = function()  {
			var value = $('.spinner input').val();
			var circles = d3.selectAll(".maplot_circles");

			circles
			.style("fill", function(_d) { return data.color(_d, value); })
		}

		var  downloadFile = function(_filename, _data){
			var a = document.createElement('a');
			var e = document.createEvent("HTMLEvents");
			e.initEvent("click");
			a.download = _filename;
			a.href = _data ;
			a.dispatchEvent(e);
		}

		var click_download = function()  {
			var download_data = 'GENE, X, Y, P';

			selected_circles.forEach(function(_d, _i)   {
				download_data += "\n"
				+ _d.datum().title
				+ "," + _d.datum().x
				+ "," + _d.datum().y
				+ "," + Number(_d.datum().value).toExponential(5);
			});

			downloadFile('maplot.csv','data:text/csv;charset=UTF-8,'
				+ encodeURIComponent(download_data));
		}

		var delete_table_item = function(_table)	{
			var table_size = _table.rows.length;

			for(var i = 0 ; i < table_size ; i++)    {
				_table.deleteRow(0);
			}
		}

		var click_reset = function()	{
			var table = document.getElementById("result_body");
			var paths_g = d3.selectAll("#maplot_select_path path");

			delete_table_item(table);
			paths_g.remove();

			selected_circles = [];
		}

		var row_mouseevent = function(_circle, _radius)	{
			(this.event.type === "mouseover") ?
			_circle.transition().duration(250).attr("r", _radius * 2) :
			_circle.transition().duration(250).attr("r", _radius);
		}

		var make_rowcell = function(_index, _circle, _table)	{
			var radius = _circle.attr("r");
			var row = _table.insertRow(-1);
			row.insertCell(0).innerHTML = "<strong>" + (_index + 1);

			var title = row.insertCell(1);
			title.style.color = _circle.datum().color;
			title.innerHTML = _circle.datum().title;

			row.insertCell(2).innerHTML = Number(_circle.datum().x).toFixed(4);
			row.insertCell(3).innerHTML = Number(_circle.datum().y).toFixed(4);
			row.insertCell(4).innerHTML = Number(_circle.datum().value).toExponential(5);

			row.onmouseover = function()  { row_mouseevent(_circle, radius); }
			row.onmouseout = function()  { row_mouseevent(_circle, radius); }
		}

		var draw_table = function() {
			var table = document.getElementById("result_body");

			delete_table_item(table);

			selected_circles.forEach(function(_d, _i)   {
				make_rowcell(_i, _d, table);
			});
		}

		var ray_tracing = function (point, vs) {
			var xi, xj, i, intersect;
			var x = point[0];
			var y = point[1];
			var inside = false;

			for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
				xi = vs[i][0],
				yi = vs[i][1],
				xj = vs[j][0],
				yj = vs[j][1],

				intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

				if (intersect) { inside = !inside };
			}

			return inside;
		}

		var dragStart = function() {
			var paths = d3.selectAll("#maplot_select_path");
			coords = [];
		}

		var drawPath = function(terminator) {
			var line = d3.svg.line();
			var gs = d3.selectAll("#maplot_select_path");

			gs.append("path").attr({ d: line(coords) });

			if (terminator) {
				if(coords.length < 1)	{ return; }

				gs.append("path").attr({
					id: "terminator",
					d: line([coords[0], coords[coords.length-1]])
				});
			}
		}

		var dragMove = function() {
			coords.push(d3.mouse(this));

			drawPath();
		}

		var get_min_max_coords = function(_value) {
			var value = _value || [];

			return {
				xMin : d3.min(value.map(function(_d) { return _d[0]; })),
				xMax : d3.max(value.map(function(_d) { return _d[0]; })),
				yMin : d3.min(value.map(function(_d) { return _d[1]; })),
				yMax : d3.max(value.map(function(_d) { return _d[1]; }))
			}
		}

		var find_intersection = function(_selected_circles, _end_selected_circles)		{
			for(var i = 0, len = _end_selected_circles.length ; i < len ; i++)	{
				var check_title = false;

				for (var j = 0, leng = _selected_circles.length ; j < leng ; j++)	{
					if(_end_selected_circles[i].datum().title === _selected_circles[j].datum().title)	{
						check_title = true;
					}
				}
				if(!check_title)	{
					_selected_circles.push(_end_selected_circles[i]);
				}
			}
		}

		var dragEnd = function() {
			var end_selected_circles = [];
			var area = get_min_max_coords(coords);

			all_circles.each(function(d, i) {
				var x =d3.select(this).attr("cx"), y = d3.select(this).attr("cy");

				point = [x, y];

				if(area.xMin < x && area.xMax > x
					&& area.yMin < y && area.yMax > y)  {
					if (ray_tracing(point, coords)) {
						end_selected_circles.push(d3.select(this))
					}
				}
			});

			end_selected_circles.sort(function(_a, _b)  {
				return (_a.datum().value > _b.datum().value) ? 1 : -1;
			});

			find_intersection(selected_circles, end_selected_circles)

			drawPath(true);
			draw_table();

			save_paths.push(d3.selectAll("#maplot_select_path path")[0]);
			save_all_paths();
		}

		var drag = d3.behavior.drag()
		.on("dragstart", dragStart)
		.on("drag", dragMove)
		.on("dragend", dragEnd);

		return {
			data : data,
			drag : drag,
			arrow : arrow_btn_click,
			m_over : get_mouseover,
			m_out : get_mouseout,
			redraw : click_redraw,
			download : click_download,
			reset : click_reset,
			undo : undo,
			redo : redo
		}
	}
});
