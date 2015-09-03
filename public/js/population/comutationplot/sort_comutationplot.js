var SORT = "population/comutationplot/sort_comutationplot";
var VO = "population/comutationplot/vo_comutationplot";

define(SORT, ["utils", VO], function(_utils, _VO)	{
	var byGroup = function(_source, _target, _samples, _order)	{
		var find_out = findOutSample(_source, _target, _samples);
		var target = find_out.target;
		var sample = _source.length === _target.length ? _samples : find_out.sample;
		var leached = leachedUnknown(target, sample);
		var order = _order;

		return separatedOrdered(target, leached, order);			
	}

	var grouping = function(_group_list, _samples)	{
		var grouped = [];

		for(var i = 0, len = _group_list.length ; i < len ; i++)	{
			var group = _group_list[i];
			grouped.push(mergeGroup(byGroup(group.data, group.data, _samples)));
		}
		return grouped;
	}

	var mergeGroup = function(_grouping)	{
		var result = [];

		for(var i = 0, len = _grouping.length ; i < len ; i++)	{
			$.merge(result, _grouping[i]);
		}
		return result;
	}

	var findOutSample = function(_source, _target, _samples)	{
		var targets = [];
		var samples = [];

		for(var i = 0, len = _source.length ; i < len ; i++)	{
			var source = _source[i];
			var is_target = _utils.getObjInArray(source.sample, _target, "sample");
			var is_sample = _utils.getObjInArray(source.sample, _samples, "sample");

			if(is_target.value !== "NA")	{
				targets.push(is_target);
			}
			samples.push(is_sample);
		}
		return {
			target : targets,
			sample : samples
		};
	}

	var leachedUnknown = function(_target, _samples)	{
		var temp;
		var by_len = _target.length, taget_len = _samples.length;

		for(var i = 0, len = _target.length ; i < len ; i++)	{
			var by = _target[i].sample;
			var index = _utils.findObjectIndexInArray(by, _samples, "sample");
			if(index > 0)	{
				temp = _samples[index];
				_samples[index] = _samples[i];
				_samples[i] = temp;
			}
		}	
		return {
			known : _samples.slice(0, by_len),
			unknown : _samples.slice(by_len, taget_len)
		}
	}

	var separatedOrdered = function(_target, _leached)	{
		var types = getType(_target);
		var result = [];

		types.sort(function(_a, _b)	{
			var a = _utils.orderGroup(_a);
			var b = _utils.orderGroup(_b);

			return a > b ? 1 : -1;
		});

		for(var i = 0, len = types.length ; i < len ; i++)	{
			var type = types[i];
			var one_group = [];

			for(var j = 0, leng = _target.length ; j < leng ; j++)	{
				var _d = _target[j];
				if(type === _d.value)	{
					var _p = _utils.getObjInArray(_d.sample, _leached.known, "sample");
					_d.gene = _p.gene;
					_d.type = _p.type;
					one_group.push(_d);
				}			
			}
			result.push(one_group);
		}
		result.push(_leached.unknown);
		return result;
	}

	var getType = function(_target)	{
		var types = [];

		for(var i = 0, len = _target.length ; i < len ; i++)	{
			var value = _target[i].value;

			if($.inArray(value, types) < 0)	{
				types.push(value);
			}
		}
		return types;
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
		_mutations.sort(function(_a, _b) { 
			return _a > _b ? -1 : 1; 
		});

		_groups.sort(function(_a, _b)	{
			var a = makeSortStr(_a.gene, _genes, _a.type);
			var b = makeSortStr(_b.gene, _genes, _b.type);		

			return a > b ? -1 : 1;
		});
		return _groups;
	}

	var loopingMultiSort = function(_sort_order, _group, _order)	{
		var result = [];

		for(var i = 0, len = _sort_order.length ; i < len ; i++)	{
			var sort_order = _sort_order[i];
			var separate = byGroup(sort_order, _group, _VO.VO.getFormatedData().sample, _order);
			
			$.merge(result, separate);
		}
		return result;
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
			var type = _utils.alterationPrecedence(_utils.definitionMutationName(_type[i])).priority;
			
			zero[index] = "" + (((type < 10) ? "0" + type : type)  || 0);
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

	return {
		group : byGroup,
		grouping : grouping,
		separate : separatedOrdered,
		exclusiveGroup : exclusiveGroup,
		exclusive : sortByExclusive,
		loopingMultiSort : loopingMultiSort,
		loopingGroup : loopingGroup
	}
});