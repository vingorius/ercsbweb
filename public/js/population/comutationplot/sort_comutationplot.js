var SORT = "population/comutationplot/sort_comutationplot";
var VO = "population/comutationplot/vo_comutationplot";

define(SORT, ["utils", VO], function(_utils, _VO)	{
	var bySample = function(_by, _target)	{

	}

	var byGene = function(_by, _target)	{

	}

	var byQvalue = function(_by, _target)	{

	}

	var byGroup = function(_source, _target, _samples)	{
		var find_out = findOutSample(_source, _target, _samples);
		var target = _source.length === _target.length ? _target : find_out.target;
		var sample = _source.length === _target.length ? _samples : find_out.sample;
		var leached = leachedUnknown(target, sample);

		return separatedOrdered(target, leached);			
	}	

	var findOutSample = function(_source, _target, _samples)	{
		var targets = [];
		var samples = [];

		for(var i = 0, len = _source.length ; i < len ; i++)	{
			var source = _source[i];
			var is_target = _utils.get_json_in_array(source.sample, _target, "sample");
			var is_sample = _utils.get_json_in_array(source.sample, _samples, "sample");

			targets.push(is_target);
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
		types.sort(function(_a, _b)	{
			return _a >_b ? 1 : -1;
		});
		var result = [];

		for(var i = 0, len = types.length ; i < len ; i++)	{
			var type = types[i];
			var one_group = [];

			for(var j = 0, leng = _target.length ; j < leng ; j++)	{
				var _d = _target[j];
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
			var a = makeSortStr(_a.gene, _genes) + makeSortStr(_a.type, _mutations);
			var b = makeSortStr(_b.gene, _genes) + makeSortStr(_b.type, _mutations);			
			return a > b ? -1 : 1;
		});
		return _groups;
	}

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

	var spliceAndUnshiftExclusive = function(_sample_list)	{
		var vo = _VO.VO;

		for(var i = 0, len = vo.getPatient().length ; i < len ; i++)	{
			var patient = vo.getPatient()[i].sample;
			var patient_index = _sample_list.indexOf(patient);
			_sample_list.splice(patient_index, 1);	
			_sample_list.unshift(patient);
		}
		return _sample_list;
	}

	return {
		sample : bySample,
		gene : byGene,
		group : byGroup,
		qvalue : byQvalue,
		separate : separatedOrdered,
		exclusiveGroup : exclusiveGroup,
		exclusive : sortByExclusive,
		spliceAndUnshiftExclusive : spliceAndUnshiftExclusive
	}
});