define("utils", [], function()  {
	var getNum = function(_str)	{
		var result = "";

		for(var i = 0, len = _str.length ; i < len ; i++)	{
			if((/\d/).test(_str[i]))	{
				result += _str[i];
			}
		}

		return Number(result);
	}

	var ordinalScale = function(domain, range_start, range_end) {
		return d3.scale.ordinal()
		.domain(domain)
		.rangeBands([range_start, range_end]);
	}

	var linearScale = function(domain_start, domain_end, range_start, range_end) {
		return d3.scale.linear()
		.domain([domain_start, domain_end])
		.range([range_start, range_end]);
	}

	var get_array_in_json = function(_json)   {
		var result = [];

		$.each(Object.keys(_json), function(_i, _d) {
			if(_json[_d].constructor === Array) {
				result.push(_json[_d]);
			}
		});

		return result;
	}

	var check_array_in_json  = function(_json)  {
		var result = false;

		$.each(Object.keys(_json), function(_i, _d) {
			if(_json[_d].constructor === Array) {
				result = true;
			}
		});

		return result;
	}

	var search_in_jsonarray = function(_value, _key, _jsonarray)    {
		var result;

		$.each(_jsonarray, function(_i, _d) {
			if(_d[_key] === _value) {
				result = _d;
			}
		});

		return result;
	}

	var get_json_in_array = function(_name, _array, _key)  {
		for(var _i in _array)   {
			if(_name === _array[_i][_key]) { return _array[_i]; }
		}

		return undefined;
	}

	var findObjectIndexInArray = function(_name, _array, _key)	{
		for(var i = 0, len = _array.length ; i < len ; i++)	{
			if(_array[i][_key] === _name)	{
				return i;
			}
		}
	}

	var get_json_array_in_array = function(_name, _array, _key) {
		var result = [];

		for(var _i in _array)   {
			if(_name === _array[_i][_key]) { result.push(_array[_i]); }
		}

		return result;
	}

	var remove_svg = function() {

		if(arguments.length < 1)    {
			return;
		}
		else if(!d3.selectAll("svg") || d3.selectAll("svg").length < 1)  {
			return;
		}

		for(var i = 0, len = arguments.length ; i < len ; i++)  {
			d3.selectAll(arguments[i]).remove();
		}
	}

	var define_mutation_name = function(_name)  {
		if((/MISSENSE/i).test(_name)) { 
			return "Missense"; 
		}
		else if((/NONSENSE/i).test(_name)) { 
			return "Nonsense"; 
		}
		else if((/(SPLICE_SITE)|(SPLICE_SITE_SNP)/i).test(_name)) { 
			return "Splice_Site"; 
		}
		else if((/(SYNONYMOUS)|(SILENT)/i).test(_name)) { 
			return "Synonymous"; 
		}
		else if((/(FRAME_SHIFT_INS)|(FRAME_SHIFT_DEL)/i).test(_name)) { 
			return "Frame_shift_indel"; 
		}
		else if((/(IN_FRAME_INS)|(IN_FRAME_DEL)/i).test(_name)) { 
			return "In_frame_indel"; 
		}
		else if((/(NONSTOP)/i).test(_name)) { 
			return "Nonstop"; 
		}
		else if((/AMPLIFICATION/i).test(_name)) { 
			return "Amplification"; 
		}
		else if((/HOMOZYGOUS_DELETION/i).test(_name)) { 
			return "Homozygous_Deletion"; 
		}
	}

	var defineMutType = function(_name)	{
		if((/(AMPLIFICATION) | (DELETION)/i).test(_name)) { 
			return "CNV"; 
		}
		// else if((/(INDEL) | (SPLICE_SITE)/i).test(_name)) { 
		// 	return "SNP"; 
		// }
		else { 
			return "MUT"; 
		}
	}

	var colour = function(_value)   {
		var value = _value || "";

		return {
			"Missense":"#3E87C2",
			"Nonsense":"#EA3B29",
			"In_frame_indel":"#F2EE7E",
			"Frame_shift_indel":"#F68D3B",
			"Splice_Site":"#583D5F",
			"Synonymous":"#5CB755",
			"Nonstop" : "#120193",
			"Amplification" : "#FFBDE0",
			"Homozygous_Deletion" : "#BDE0FF",
			"Other":"#B5612E",
			"pq":"#C2C4C9",
			"Primary Solid Tumor":"#F64747",
			"Solid Tissue Normal":"#446CB3",
			"si_log_p":"#ea3b29",
			"si_up_log_p":"#5cb755",
			"si_down_log_p":"#3e87c2"
		}[value];
	}

	var strcut = function(_string, _measure)  {
		var result = [];
		var empty = [];

		for(var i = 1, len = _string.length ; i <= len + 1 ; i++)    {
			if(_string[i - 1])		{
				empty.push(_string[i - 1]);
			}
			if(i % _measure === 0)  {
				result.push(empty);
				empty = [];
			}
		}

		return result;
	}

	var opposite_color = function(_rgb) {
		var r1, g2, b2, r2, g2, b2;
		var rgb_hex = strcut(_rgb, 2);

		r1 = parseInt("0x" + rgb_hex[0][0].concat(rgb_hex[0][1]));
		g1 = parseInt("0x" + rgb_hex[1][0].concat(rgb_hex[1][1]));
		b1 = parseInt("0x" + rgb_hex[2][0].concat(rgb_hex[2][1]));

		r2 = (255 - r1).toString(16);
		g2 = (255 - g1).toString(16);
		b2 = (255 - b1).toString(16);

		return "#" + r2 + g2 + b2;
	}

	var getElementPostion = function(_element)	{
		var position = $(_element).offset();

		return {
			left : position.left,
			top : position.top
		}
	}

	var tooltip = function(_event, _contents, _x, _y)   {
		var div = $('.tooltip_chart');
		var padding_left = getNum($("#wrapper").css("padding-left"));
		var padding_top = getNum($("#wrapper").css("padding-top"));
		var space = 5;

		if(arguments.length < 1) {
			div.empty();
			div.hide();
		}
		else   {
			div.css("position", "absolute");
			div.html(_contents);		// Html 태그를 포함한 문자열을 삽입 할 때에는 html() 함수를 사용하는 것이 낫다.
			div.css("top", _y - padding_top);
			div.css("left", _x - padding_left);
			div.css("font-size", 12)
			div.css("font-family", "trebuchet ms")
			div.css("font-weight", "bold")
			div.css("opacity", 0.8);
			div.show();
		}
	}

	var log = function(_value)    {
		return Math.log(_value) / (Math.LN10 * -1);
	}

	var download = function(_name, _url)	{
		var a = document.createElement("a");
		var html_event = document.createEvent("HTMLEvents");

		html_event.initEvent("click");

		a.download = _name;
		a.href = _url;
		a.dispatchEvent(html_event);		
	}

	var preserve_events = function(_event)	{
		var e = event || d3.event;

		e.stopPropagation();
		e.preventDefault();
	}

	var getClass = function(_name)	{
		for (var i = 0, len = document.getElementsByTagName("*").length ; i < len ; i++)	{
			if(document.getElementsByTagName("*")[i].className === _name)	{
				return document.getElementsByTagName("*")[i];
			}
		} 
	}

	var get_tag_by_identification = function(_text)	{
		return getClass(_text) || document.getElementById(_text);
	}

	var find_pathname = function(_pathname)	{
		return _pathname.substring(_pathname.lastIndexOf("/") + 1,
			_pathname.indexOf("plot"));
	}

	var define_prop = function(_obj, _value, _key)	{
		return Object.defineProperty(_obj, _key, {
			value : _value,
			writable : true,
			configurable : true,
			enumrable : false
		});
	}

	var get_list_sum = function(_array, _key)	{
		try {
			var result = 0;

			for(var i = 0, len = _array.length ; i < len ; i++)	{
				if((/[pq]/).test(_key))	{
					result += log(_array[i][_key]);	
				}
				else {
					result += _array[i][_key];
				}
			}
			return result;
		}
		finally {
			result = null;
		}
	}

	var loading = function(_name, _target)	{
		var loading_div = $(".loading").fadeIn();
		var chart_div = $(_target);
		var chart_width = chart_div.width();
		var chart_height = chart_div.height();
		var doc_width = document.documentElement.clientWidth;
		var doc_height = document.documentElement.clientHeight;

		$("#loading_text")
		.css("top", -50)
		.css("left", -25)
		.text("Loading  . . .");

		loading_div
		.css("top", (doc_height - chart_height / 2) / 3)
		.css("left", chart_width / 1.5);
	}

	var preserveEventInterrupt = function(_target)	{
		var target = $(_target);

		if(target.is(".preserve_events"))	{
			var classList = target.attr("class").split(" ");
			var className = "";

			for(var i = 0, len = classList.length ; i < len ; i++)	{
				if(classList[i] !== "preserve_events")	{
					if(i === classList.length)	{
						className += classList[i];
					}
					else {
						className += classList[i] + " ";
					}
				}
			}

			target.attr("class", className);
		}
		else {
			target.addClass("preserve_events");
		}		
	}
	/* bit operation 에서 >> 11 은 나누기 2048, >> 7 은 나누기 128
	즉 문자 하나의 유니코드 값을 구해서 2048 로 나눈 값이 존재하면  */
	var getByteLength = function(_str, _byte, _index, _char)	{
		for(_byte = _index = 0 ; _char = _str.charCodeAt(_index++) ; _byte += _char >> 11 ? 3 : _char >> 7 ? 2 : 1);
			
		return _byte;
	}

	var getTextSize = function(_txt, _font_size)	{
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d");
		ctx.font = _font_size + "px Arial";
		var width = ctx.measureText(_txt).width;
		var height = parseInt(ctx.font);

		return { 
			width : width, 
			height : height 
		};
	}

	return {
		getNum : getNum,
		ordinalScale : ordinalScale,
		linearScale : linearScale,
		get_array_in_json : get_array_in_json,
		check_array_in_json : check_array_in_json,
		search_in_jsonarray : search_in_jsonarray,
		get_json_in_array : get_json_in_array,
		findObjectIndexInArray : findObjectIndexInArray,
		get_json_array_in_array : get_json_array_in_array,
		remove_svg : remove_svg,
		define_mutation_name : define_mutation_name,
		defineMutType : defineMutType,
		colour : colour,
		strcut : strcut,
		opposite_color : opposite_color,
		tooltip : tooltip,
		log : log,
		download : download,
		getClass : getClass,
		getTag : get_tag_by_identification,
		find_pathname : find_pathname,
		preserve_events : preserve_events,
		defineProp : define_prop,
		get_list_sum : get_list_sum,
		loading : loading,
		getPosition : getElementPostion,
		preserveInterrupt : preserveEventInterrupt,
		getByteLength : getByteLength,
		getTextSize : getTextSize,
	};
});