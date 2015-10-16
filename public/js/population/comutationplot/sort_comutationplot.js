define("population/comutationplot/sort_comutationplot", ["utils", "population/comutationplot/vo_comutationplot"], function(_utils, _VO)	{
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

	var loopingGroup = function(_separate)	{
		var result = [];

		for(var i = 0, len = _separate.length ; i < len ; i++)	{
			var separate = _separate[i];
			var ex = exclusiveGroup(separate, separate.length);

			$.merge(result, ex);
		}
		return result;
	}

	var makeSortStr = function(_item, _target, _type)	{
		var zero = makeZeroArray(_target);
		var result = 0;

		for(var i = 0, len = _item.length ; i < len ; i++)	{
			var _i = _item[i];
			var index = _target.indexOf(_i); 
			var type = _utils.alterationPrecedence(_utils.defMutName(_type[i])).priority;
			
			zero[index] = ((type < 10 ? "0" + type : type)  || 0).toString();
		}
		return zero.join("");
	}

	var makeZeroArray = function(_list)	{
		var result = [];

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			result[i] = "0";
		}
		return result;
	}
	
	var countOrder = function(_data, _name, _compare)	{
		var item_list = [];

		if(_compare)	{
			for(var j = 0, leng = _compare.length ; j < leng ; j++)	{
				var compare = _compare[j];

				if(!_utils.getObject(compare, _data, _name))	{
					item_list.push({
						name : compare,
						types : [{
							name : compare,
							type : "",
							count : 0,
						}],
						counts : 0
					});
				}
			}
		}

		for(var i = 0, len = _data.length ; i < len ; i++)	{
			var item = _data[i];
			var type = _utils.defMutName(item.type);
			var is_item = _utils.getObject(item[_name], item_list, "name");

			if(!is_item)	{
				item_list.push({
					name : item[_name],
					types : [{
						name : item[_name],
						type : type,
						count : 1
					}],
					counts : 1
				});
			}
			else {
				var is_type = _utils.getObject(type, is_item.types, "type");

				if(!is_type)	{
					is_item.types.push({
						name : item[_name],
						type : type,
						count : 1
					});
				}
				else {
					is_type.count += 1;
				}
				is_item.counts += 1;
			}
		}
		return stacked(item_list);
	}

	var stacked = function(_list)	{
		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var stack = _list[i];
			stack.types = sortMutation(stack.types);

			for(var j = 0, leng = stack.types.length ; j < leng ; j++)	{
				var type = stack.types[j];

				if(j === 0)	{
					type.start = 0;
				}
				else {
					var pre_type = stack.types[j - 1];
					type.start = pre_type.count + pre_type.start;
				}
			}
		}
		return _list;
	}

	var sortMutation = function(_types)	{
		return _types.sort(function(_a, _b)	{
			var a = _utils.alterationPrecedence(_utils.defMutName(_a.type));
			var b = _utils.alterationPrecedence(_utils.defMutName(_b.type));
			var a_priority = a.alteration === "CNV" ? a.priority + 20 : a.priority;
			var b_priority = b.alteration === "CNV" ? b.priority + 20 : b.priority;

			return (a_priority < b_priority) ? 1 : -1;
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
			else {
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
				var idx = _d.value === "NA" ? (_size - 1) : _utils.orderGroup(_d.value);
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

	var groupSorted = function(_group)	{
		return _group.sort(function(_a, _b)	{
			return _utils.orderGroup(_a.value) < _utils.orderGroup(_b.value) ? -1 : 1;
		});			
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