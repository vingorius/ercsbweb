var SORT = "population/comutationplot/sort_comutationplot";
var VO = "population/comutationplot/vo_comutationplot";

define(SORT, ["utils", VO], function(_utils, _VO)	{
	var bySample = function(_by, _target)	{

	}

	var byGene = function(_by, _target)	{

	}

	var byQvalue = function(_by, _target)	{

	}

	var byGroup = function(_by, _target)	{
		var leached = leachedUnknown(_by, _target);
		return separatedOrdered(_by, leached);			
	}	

	var getType = function(_by)	{
		var types = [];

		for(var i = 0, len = _by.length ; i < len ; i++)	{
			var value = _by[i].value;

			if($.inArray(value, types) < 0)	{
				types.push(value);
			}
		}
		return types;
	}

	var separatedOrdered = function(_by, _leached)	{
		var types = getType(_by);
		types.sort(function(_a, _b)	{
			return _a >_b ? 1 : -1;
		});
		var result = [];

		for(var i = 0, len = types.length ; i < len ; i++)	{
			var type = types[i];
			var one_group = [];

			for(var j = 0, leng = _by.length ; j < leng ; j++)	{
				var _d = _by[j];
				if(type === _d.value)	{
					var _p = _utils.get_json_in_array(_d.sample, _leached.known, "sample");
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

	var leachedUnknown = function(_by, _target)	{
		var temp;
		var by_len = _by.length, taget_len = _target.length;

		for(var i = 0, len = _by.length ; i < len ; i++)	{
			var by = _by[i].sample;
			var index = _utils.findObjectIndexInArray(by, _target, "sample");
			if(index > 0)	{
				temp = _target[index];
				_target[index] = _target[i];
				_target[i] = temp;
			}
		}		
		return {
			known : _target.slice(0, by_len),
			unknown : _target.slice(by_len, taget_len)
		}
	}

	var exclusiveGroup = function(_groups, _length)	{
		var vo = _VO.VO;
		var result = [];

		if(_groups.length === _length)	{
			return sortByExclusive(_groups, vo.getGene(), vo.getMutation());
		}

		for(var i = 0, len = _groups.length ; i < len ; i++)	{
			var groups = _groups[i];
			var ex = sortByExclusive(groups, vo.getGene(), vo.getMutation());
			$.merge(result, ex);
		}
		return result;
	}

	var sortByExclusive = function(_groups, _genes, _mutations)	{
		_mutations.sort(function(_a, _b) { 
			return _a > _b ? -1 : 1; 
		})

		_groups.sort(function(_a, _b)	{
			// var a = makeSortStr(_a, _genes, _mutations);
			// var b = makeSortStr(_b, _genes, _mutations);
			var a = makeSortStr(_a.gene, _genes) + makeSortStr(_a.type, _mutations);
			var b = makeSortStr(_b.gene, _genes) + makeSortStr(_b.type, _mutations);			
			return a > b ? -1 : 1;
		});
		return _groups;
	}

	// var makeSortStr = function(_item, _genes, _mutations)	{
	// 	var index = "";

	// 	for(var i = 0, len = _item.gene.length ; i < len ; i++)	{
	// 		var gene_i = +(_genes.indexOf(_item.gene[i]) === -1 ? 
	// 					_genes.length + 1 : _genes.indexOf(_item.gene[i]));
	// 		var muts_i = +(_mutations.indexOf(_item.type[i]) === -1 ? 
	// 					_mutations.length + 1 : _mutations.indexOf(_item.type[i]));

	// 		index += "" + (Number(gene_i) + Number(muts_i));
	// 	}
	// 	console.log(index)
	// 	return index;
	// }

	var makeSortStr = function(_item, _target)	{
		var zero = makeZeroArray(_target);

		for(var i = 0, len = _item.length ; i < len ; i++)	{
			var _i = _item[i];
			var index = _target.indexOf(_i);
			zero[index] = "1";
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
		sample : bySample,
		gene : byGene,
		group : byGroup,
		qvalue : byQvalue,
		separate : separatedOrdered,
		exclusiveGroup : exclusiveGroup,
		exclusive : sortByExclusive
	}
});