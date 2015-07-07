define("degplot/view_degplot", ["utils", "size"], function(_utils, _size)	{
	var create_row = function(_tbody)	{
		return _tbody.insertRow(-1);
	}

	var create_cell = function(_data, _row)	{

		for (var i = 0, len = Object.keys(_data).length ; i < len ; i++)	{
			var cell_data = _data[Object.keys(_data)[i]];

			_row.insertCell(i).innerHTML = cell_data;
		}
	}

	var rowspan = function(_tbody)	{
		var rows = _tbody.rows;

		for (var i = 0, len = rows[0].cells.length ; i < len ; i++)	{
			var cells = [];
			for (var j = 0, leng = rows.length ; j < leng ; j++)	{
				if(isNaN(Number(rows[j].cells[i].innerHTML)))	{
					cells.push(rows[j].cells[i]);
				}
				else {
					rows[j].cells[i].style.backgroundColor = "red";
				}
			}
			rowspan_cell(cells);
		}
	}

	var rowspan_cell = function(_cells)		{
		var merge = 1;
		var row = "";

		for (var i = 0, len = _cells.length ; i < len ; i++)	{
			if(i > 0)	{
				if(_cells[i].innerHTML === _cells[i - 1].innerHTML)	{
					row = (row === "") ? _cells[i - 1].parentNode : row;
					merge++;
				}
				else {
					if(merge !== 1)	{
						console.log(i, merge, _cells[i].cellIndex, row)
						merge = 1;
						row = "";
					}
				}
			}
		}
	}

	var merge_cell = function(_index, _count, _cell_index, _row)	{

		for (var i = (_index - _count), len = _index - 1 ; i < len ; i++)	{

		}
	}

	var view = function(_data, _tbody)	{
		var data = _data || [];
		var tbody = _tbody || null;

		//console.log(data, tbody, create_row(tbody))

		for(var i = 0, len = data.length ; i < len ; i++)	{
			create_cell(data[i], create_row(tbody));
		}

		rowspan(tbody);
	}

	return {
		view : view
	}
});	