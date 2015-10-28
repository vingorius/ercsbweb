define("population/comutationplot/sort_comutationplot", ["utils", "population/comutationplot/vo_comutationplot"], function(_utils, _VO)	{
	var loopingGroup = function(_separate)	{
		var result = [];

		for(var i = 0, len = _separate.length ; i < len ; i++)	{
			var separate = _separate[i];

			$.merge(result, exclusiveGroup(separate, separate.length));
		}
		return result;
	}

	var exclusiveGroup = function(_groups, _length)	{
		var result = [];

		if(_groups.length === _length)	{
			return sortByExclusive(_groups, _VO.VO.getGene(), _VO.VO.getMutation());
		}

		for(var i = 0, len = _groups.length ; i < len ; i++)	{
			var groups = _groups[i];
			var ex = sortByExclusive(groups, _VO.VO.getGene(), _VO.VO.getMutation());

			$.merge(result, ex);
		}
		return result;
	}

	var sortByExclusive = function(_groups, _genes, _mutations)	{
		_groups.sort(function(_a, _b)	{
			var sample_a = _utils.getObject(_a.sample, _VO.VO.getFormatedData().sample, "sample");
			var sample_b = _utils.getObject(_b.sample, _VO.VO.getFormatedData().sample, "sample");
			var a = makeSortStr(sample_a.gene, _genes, sample_a.type);
			var b = makeSortStr(sample_b.gene, _genes, sample_b.type);		

			return a > b ? -1 : 1;
		});
		return _groups;
	}

	var makeSortStr = function(_item, _target, _type)	{
		var arr_order = _utils.fillArray(_target.length, "000");
		var arr_alter = _utils.fillArray(_target.length, "");
		var genes_order = _VO.VO.getInitGene();

		for(var i = 0, len = _item.length ; i < len ; i++)	{
			var _i = _item[i];
			var index = genes_order.indexOf(_i); 
			var alteration = _utils.alterationPrecedence(_utils.defMutName(_type[i]));
			var gene_idx = genes_order.length - genes_order.indexOf(_i);
			var order = gene_idx + alteration.priority.idx + alteration.priority.order;

			if(arr_order[index] !== "000")	{
				if(arr_alter[index] === alteration.alteration)	{
					arr_order[index] = canSection(order);
				}
				else {					
					arr_order[index] = canSection((+order + +arr_order[index]));
					arr_alter[index] = alteration.alteration;
				}
			}
			else {
				arr_order[index] = canSection(order);
				arr_alter[index] = alteration.alteration;
			}
		}
		return arr_order.join("");
	}

	var canSection = function(_d)	{
		return _d < 100 && _d > 10 ? "0" + _d : _d < 10 ? "00" + _d : _d.toString();
	}
	
	var countOrder = function(_data, _name, _compare)	{
		var item_list = [];

		if(_compare)	{
			for(var j = 0, leng = _compare.length ; j < leng ; j++)	{
				var compare = _compare[j];

				if(!_utils.getObject(compare, _data, _name))	{
					item_list.push(setCountData(compare, "", 0, 0));
				}
			}
		}

		for(var i = 0, len = _data.length ; i < len ; i++)	{
			var item = _data[i];
			var type = _utils.defMutName(item.type);
			var is_item = _utils.getObject(item[_name], item_list, "name");

			if(!is_item)	{
				item_list.push(setCountData(item[_name], type, 1, 1));
			}
			else {
				var is_type = _utils.getObject(type, is_item.types, "type");

				if(!is_type)	{
					is_item.types.push(setCountData(item[_name], type, 1));
				}
				else {
					is_type.count += 1;
				}
				is_item.counts += 1;
			}
		}
		return _utils.stacked(item_list, "types", sortMutation);
	}

	var setCountData = function()	{
		return {
			name : arguments[0],
			type : arguments[1],
			count : arguments[2],
			types : [{
				name : arguments[0],
				type : arguments[1],
				count : arguments[2],
			}],
			counts : arguments[3],
		};
	}

	var sortMutation = function(_types)	{
		return _types.sort(function(_a, _b)	{
			var a = _utils.alterationPrecedence(_utils.defMutName(_a.type)).priority;
			var b = _utils.alterationPrecedence(_utils.defMutName(_b.type)).priority;

			return (a.order > b.order) ? 1 : -1;
		});
	}

	var grouped = function(_group_list, _sample_list)		{
		var pre_separate = null;
		var merge_group = [];

		for(var i = 0, len = _group_list.length ; i < len ; i++)		{
			var group = _group_list[i];
			var size =  setGroupLength(group.data);
			var data = null;

			if(group.length !== _sample_list.length)	{
				data = group.data;
			}
			pre_separate = pre_separate === null ? separated(data, size) : separated(data, size, pre_separate);
			merge_group.push(merged(pre_separate));
		}
		return {
			merge : merge_group,
			spread : pre_separate,
		};
	}

	var separated = function(_group, _size, _pre_separate)	{
		var result = [];
		
		if(arguments[2])	{
			_pre_separate.filter(function(_d)	{
				var group = _group.filter(function(_e)	{
					return true && _utils.getObject(_e.sample, _d, "sample");
				});
				var sub_result = separated.apply(null, [group, _size]).filter(function(_f)	{
					return _f;
				});
				$.merge(result, sub_result);
			});
		}
		else {
			_group.filter(function(_d)	{
				var idx = _d.value === "NA" ? (_size - 1) : _utils.defGroup(_d.value).value;
				!result[idx] ? result[idx] = [_d] : result[idx].push(_d);
			});
		}	
		return result.filter(function(_d) { return _d; });
	}

	var setGroupLength = function(_group)	{
		var value_obj = {};

		for(var i = 0, len = _group.length ; i < len ; i++)		{
			var value = _group[i].value;

			if(!value_obj[value])	{
				value_obj[value] = 1;
			}
		}
		return Object.keys(value_obj).length;
	}

	var merged = function(_separeted)	{
		var result = [];

		for(var i = 0, len = _separeted.length ; i < len ; i++)	{
			$.merge(result, _separeted[i]);
		}
		return result;
	}
	return {
		grouped : grouped,
		separated : separated,
		itemCount : setGroupLength,
		exclusiveGroup : exclusiveGroup,
		exclusive : sortByExclusive,
		loopingGroup : loopingGroup,
		countOrder : countOrder
	}
});