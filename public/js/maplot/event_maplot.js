var MA = "maplot/";

define(MA + "event_maplot", ["utils", "size"], function(_utils, _size)  {
	return function(_data)	{
		var data = _data || {};
		var all_circles = data.all_circles;
		var selected_circles = [];
		var stacked_circles = [];
		var stacked_paths = [];
		var save_paths = [];
		var save_circles = [];
		var paths_stack = [];

		var undo = function(_d)	{
			if(paths_stack.length === 1 || save_circles.length === 1)	{
				return;
			}
			undoPath(paths_stack[paths_stack.length - 1]);
			undoTable(save_circles[save_circles.length - 1]);
			undoSelectedCells(save_circles[save_circles.length - 1]);

			save_paths.pop();
			paths_stack.pop();
			save_circles.pop();
		}

		var undoSelectedCells = function(_target)	{
			for (var i = 0, len = selected_circles.length ; i < len ; i++)	{
				for(var j = 0, leng = _target.length ; j < leng ; j++)	{
					if(_target[j] === selected_circles[i])	{
						selected_circles.splice(i, 1);
					}
				}				
			}
		}

		var undoPath = function(_target)	{
			d3.selectAll(_target).remove();
		}

		var undoTable = function(_target)		{
			var tbody = document.querySelector("#result_body");

			for (var i = tbody.rows.length - 1, len = 0 ; i >= len ; i--)	{
				var row = tbody.rows[i];

				for(var j = 0, leng = _target.length ; j < leng ; j++)	{
					if(_target[j].datum().title === row.cells[1].innerHTML)	{
						tbody.deleteRow(i);
					}
				}
			}
		}

		var savedAllPaths = function()	{
			var reform_paths = [];
			var index = 0;

			for(var i = 0, len = save_paths.length ; i < len ; i++)	{
				var empty_paths = [];

				for(var j = (i === 0) ? 0 : save_paths[i - 1].length, leng = save_paths[i].length ; j < leng ; j++)	{
					empty_paths.push(save_paths[i][j]);
					if(save_paths[i][j].id)	{
						reform_paths[index] = empty_paths;
						index++;
					}
				}	
			}
			paths_stack = reform_paths;
		}

		var arrowClick = function(_d)	{
			var type = this.id.substring(this.id.lastIndexOf("_") + 1, this.id.length);

			(type === "up")	?
			$('.spinner input').val((parseFloat($('.spinner input').val()) + 0.01).toFixed(2))
			: $('.spinner input').val((parseFloat($('.spinner input').val()) - 0.01).toFixed(2));
		}

		var mouseover = function(_d)	{
			_utils.tooltip(this
				, "title : " + _d.title + "</br> x : " 
				+ Number(_d.x).toFixed(5) + "</br> y : " 
				+ Number(_d.y).toFixed(5) + "</br> p : "
				+ Number(_d.value).toExponential(5)
				, "rgba(15, 15, 15, 0.6)");
		}

		var mouseout = function(_d)	{
			_utils.tooltip();
		}

		var redraw = function()  {
			var value = $('.spinner input').val();

			d3.selectAll(".maplot_circles")
			.style("fill", function(_d) { 
				return data.color(_d, value); 
			});
		}

		var download = function()  {
			var download_data = 'GENE, X, Y, P';

			selected_circles.forEach(function(_d, _i)   {
				download_data += "\n"
				+ _d.datum().title + "," + _d.datum().x
				+ "," + _d.datum().y + "," + Number(_d.datum().value).toExponential(5);
			});

			_utils.download('maplot.csv','data:text/csv;charset=UTF-8,'
				+ encodeURIComponent(download_data));
		}

		var delTableItems = function(_table)	{
			for(var i = 0, len = _table.rows.length ; i < len ; i++)    {
				_table.deleteRow(0);
			}
		}

		var reset = function()	{
			var table = document.querySelector("#result_body");

			delTableItems(table);
			d3.selectAll("#maplot_select_path path")
			.remove();

			selected_circles = [];
		}

		var rowMouseEvent = function(_circle, _radius)	{
			(this.event.type === "mouseover") ?
			_circle.transition().duration(250).attr("r", _radius * 2) :
			_circle.transition().duration(250).attr("r", _radius);
		}

		var makeRowCells = function(_index, _circle, _table)	{
			var radius = _circle.attr("r");
			var row = _table.insertRow(-1);
			row.insertCell(0).innerHTML = "<strong>" + (_index + 1);

			var title = row.insertCell(1);
			title.style.color = _circle.datum().color;
			title.innerHTML = _circle.datum().title;

			row.insertCell(2).innerHTML = Number(_circle.datum().x).toFixed(4);
			row.insertCell(3).innerHTML = Number(_circle.datum().y).toFixed(4);
			row.insertCell(4).innerHTML = Number(_circle.datum().value).toExponential(5);

			row.onmouseover = function()  { rowMouseEvent(_circle, radius); }
			row.onmouseout = function()  { rowMouseEvent(_circle, radius); }
		}

		var drawTable = function() {
			var table = document.querySelector("#result_body");

			delTableItems(table);

			selected_circles.forEach(function(_d, _i)   {
				makeRowCells(_i, _d, table);
			});
		}

		var rayTracing = function (point, vs) {
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
			coords = [];
		}

		var drawPath = function(terminator) {
			var line = d3.svg.line();
			var gs = d3.selectAll("#maplot_select_path");

			gs.append("path")
			.attr({ 
				d: line(coords) 
			});

			if (terminator) {
				if(coords.length < 1)	{ 
					return; 
				}
				gs.append("path")
				.attr({
					id: "terminator",
					d: line([coords[0], coords[coords.length-1]])
				});
			}
		}

		var dragMove = function() {
			coords.push(d3.mouse(this));

			drawPath();
		}

		var getCoords = function(_value) {
			return {
				xMin : d3.min(_value.map(function(_d) { 
					return _d[0]; 
				})),
				xMax : d3.max(_value.map(function(_d) { 
					return _d[0]; 
				})),
				yMin : d3.min(_value.map(function(_d) { 
					return _d[1]; 
				})),
				yMax : d3.max(_value.map(function(_d) { 
					return _d[1]; 
				}))
			}
		}

		var findIntersection = function(_selected_circles, _end_selected_circles)		{
			var empty_circles = [];

			for(var i = 0, len = _end_selected_circles.length ; i < len ; i++)	{
				var check_title = false;

				for (var j = 0, leng = _selected_circles.length ; j < leng ; j++)	{
					if(_end_selected_circles[i].datum().title === _selected_circles[j].datum().title)	{
						check_title = true;
					}
				}
				if(!check_title)	{
					empty_circles.push(_end_selected_circles[i]);
					_selected_circles.push(_end_selected_circles[i]);
				}
			}
			save_circles.push(empty_circles);
		}

		var dragEnd = function() {
			var end_selected_circles = [];
			var area = getCoords(coords);

			all_circles.each(function(d, i) {
				var x =d3.select(this).attr("cx");
				var y = d3.select(this).attr("cy");

				point = [x, y];

				if(area.xMin < x && area.xMax > x && area.yMin < y && area.yMax > y)  {
					if (rayTracing(point, coords)) {
						end_selected_circles.push(d3.select(this))
					}
				}
			});

			end_selected_circles.sort(function(_a, _b)  {
				return (_a.datum().value > _b.datum().value) ? 1 : -1;
			});
			findIntersection(selected_circles, end_selected_circles)

			drawPath(true);
			drawTable();

			save_paths.push(d3.selectAll("#maplot_select_path path")[0]);
			savedAllPaths();
		}

		var drag = d3.behavior.drag()
		.on("dragstart", dragStart)
		.on("drag", dragMove)
		.on("dragend", dragEnd);

		return {
			data : data,
			drag : drag,
			arrow : arrowClick,
			m_over : mouseover,
			m_out : mouseout,
			redraw : redraw,
			download : download,
			reset : reset,
			undo : undo
		}
	}
});
