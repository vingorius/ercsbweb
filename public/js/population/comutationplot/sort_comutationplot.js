var SORT = "population/comutationplot/sort_comutationplot";

define(SORT, ["utils"], function(_utils)	{
	var bySample = function(_by, _target)	{

	}

	var byGene = function(_by, _target)	{

	}

	var byGroup = function(_by, _target)	{
		var ordered = _by.sort(-1);													// sort by number that is 1 or -1
		var leached = leachedUnknown(_by, _target);								// get only unknown list of sample
		var separated = separatedOredered(ordered, leached.known);			// already ordered and leached what is only knowned sample is separate by group value
		// console.log("group_list : ", _by, ", samples : ", _target, ", ordered : ", ordered);
	}	

	var byQvalue = function(_by, _target)	{

	}

	var orderedList = function(_ordered, _target)	{
	}
	
	var separatedOredered = function(_ordered, _target)	{
		var separate_index_list = [];
		var value = "";

		for(var i = 0, len = _ordered.length ; i < len ; i++)	{
			var order = _ordered[i].value;
			if(order !== value)	{
				separate_index_list.push(i);
				value = order;
			}
		}
		console.log(separate_index_list)
	}

	var leachedUnknown = function(_by, _target)	{
		var temp;
		var by_len = _by.length, taget_len = _target.length;

		for(var i = 0, len = _by.length ; i < len ; i++)	{
			var by = _by[i].sample;
			var index = $.inArray(by, _target);
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

	var sortByExclusive = function(_list)	{

	}

	return {
		sample : bySample,
		gene : byGene,
		group : byGroup,
		qvalue : byQvalue,
		separate : separatedOredered,
		exclusive : sortByExclusive
	}
});