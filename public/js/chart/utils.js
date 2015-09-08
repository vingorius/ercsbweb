define("utils", [], function()  {
	var getNum = function(_str)	{
		var result = "";

		for(var i = 0, len = _str.length ; i < len ; i++)	{
			if((/(\d)|(\D)/).test(_str[i]))	{
				result += _str[i];
			}
		}
		return parseFloat(result);
	}

	var getObjectMax = function(_list, _key)	{
		return d3.max(_list.map(function(_d)	{
			return _d[_key];
		}));
	}

	var frontElement = function(_target, _source)	{
		if(_target.nextSibling)	{
			_source.appendChild(_target);
		}
	}

	var behindElement = function(_target, _index, _source)	{
		_source.insertBefore(_target, _source.childNodes[_index - 1]);
	}

	var ordinalScale = function(_domain, _start, _end) {
		return d3.scale.ordinal()
		.domain(_domain)
		.rangeBands([_start, _end]);
	}

	var linearScale = function(_d_start, _d_end, _r_start, _end) {
		return d3.scale.linear()
		.domain([_d_start, _d_end])
		.range([_r_start, _end]);
	}

	var getObject = function(_name, _array, _key)  {
		for(var i = 0, len = _array.length ; i < len ; i++) 	{
			var obj = _array[i];

			if(obj[_key] === _name)	{
				return obj;
			}
		}
		return undefined;
	}

	var getObjectIndex = function(_name, _array, _key)	{
		for(var i = 0, len = _array.length ; i < len ; i++)	{
			var obj = _array[i][_key];

			if(obj === _name)	{
				return i;
			}
		}
	}

	var getObjectArray = function(_name, _array, _key) {
		var result = [];

		for(var i = 0, len = _array.length ; i < len ; i++)	{
			var obj = _array[i];

			if(obj[_key] === _name)	{
				result.push(obj);
			}
		}
		return result;
	}

	var isArrayInObj  = function(_json)  {
		var result = false;

		for(var i = 0, len = Object.keys(_json).length ; i < len ; i++)		{
			var construct = _json[Object.keys(_json)[i]].constructor;

			if(construct === Array)	{
				result = true;
			}
		}
		return result;
	}

	var getArrayInObj = function(_json)   {
		var result = [];

		for(var i = 0, len = Object.keys(_json).length ; i < len ; i++)		{
			var obj = _json[Object.keys(_json)[i]];

			if(obj.constructor == Array)	{
				result.push(obj);
			}
		}
		return result;
	}

	var searchObjArray = function(_value, _key, _jsonarray)    {
		var result;

		for(var i = 0, len = _jsonarray.length ; i < len ; i++)	{
			var value = _jsonarray[i];

			if(value[_key] === _value)	{
				result = value;
			}
		}
		return result;
	}

	var removeSvg = function() {
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

	var alterationPrecedence = function(_alteration)	{
		if((/(AMPLIFICATION)|(HOMOZYGOUS_DELETION)/i).test(_alteration))	{
			return { alteration : "CNV", priority : cnvPrecedence(_alteration) };
		}
		else if((/(EXPRESSION)/).test(_alteration))	{
			return { alteration : "mRNA Expression (log2FC)", priority : expPrecedence(_alteration) };
		}
		else {
			return { alteration : "Somatic Mutaion", priority : mutationPrecedence(_alteration) };
		}
	}

	var mutationPrecedence = function(_mutation)	{
		return {
			"Nonsense_mutation" : 9,
			"Splice_Site" : 8,
			"Translation_Start_Site" : 7,
			"Missense_mutation" : 6,
			"Nonstop_mutation" : 5,
			"Frame_shift_indel" : 4,
			"In_frame_indel" : 3,
			"RNA" : 2,
			"Silent" : 1,
		}[_mutation];
	}

	var cnvPrecedence = function(_cnv)	{
		return {
			"Amplification" : 12,
			"Homozygous_Deletion" : 11
		}[_cnv];
	}

	var expPrecedence = function(_exp)	{
		return {
			
		}[_exp];
	}

	var defMutName = function(_name)  {
		if((/MISSENSE/i).test(_name)) { 
			return "Missense_mutation"; 
		}
		else if((/NONSENSE/i).test(_name)) { 
			return "Nonsense_mutation"; 
		}
		else if((/(SPLICE_SITE)|(SPLICE_SITE_SNP)/i).test(_name)) { 
			return "Splice_Site"; 
		}
		else if((/(SILENT)/i).test(_name)) { 
			return "Silent"; 
		}
		else if((/(TRANSLATION)/i).test(_name))	{
			return "Translation_Start_Site";
		}
		else if((/(RNA)/i).test(_name))	{
			return "RNA";
		}
		else if((/(FRAME_SHIFT_)/i).test(_name)) { 
			return "Frame_shift_indel"; 
		}
		else if((/(IN_FRAME_)/i).test(_name)) { 
			return "In_frame_indel"; 
		}
		else if((/(NONSTOP)/i).test(_name)) { 
			return "Nonstop_mutation"; 
		}
		else if((/AMPLIFICATION/i).test(_name)) { 
			return "Amplification"; 
		}
		else if((/HOMOZYGOUS_DELETION/i).test(_name)) { 
			return "Homozygous_Deletion"; 
		}
	}

	var colour = function(_value)   {
		var value = _value || "";

		return {
			// CNV
			"Amplification" : "#FFBDE0",
			"Homozygous_Deletion" : "#BDE0FF",
			// Somatic mutation
			"Nonsense_mutation" : "#EA3B29",
			"Splice_Site" : "#800080",
			"Translation_Start_Site" : "#aaa8aa",
			"Missense_mutation" : "#3E87C2",
			"Nonstop_mutation" : "#070078",
			"Frame_shift_indel" : "#F68D3B",
			"In_frame_indel" : "#F2EE7E",
			"RNA" : "#ffdf97",
			"Silent" : "#5CB755",
			// P & Q value
			"pq" : "#C2C4C9",
			// Pca plot
			"Primary Solid Tumor" : "#F64747",
			"Solid Tissue Normal" : "#446CB3",
			// Deg plot
			"si_log_p" : "#ea3b29",
			"si_up_log_p" : "#5cb755",
			"si_down_log_p" : "#3e87c2"
		}[value];
	}

	var tooltip = function(_element, _contents, _rgba)   {
		var div = $('.tooltip_chart');

		if(arguments.length < 1) {
			div.empty();
			div.hide();
			return;
		}
		else   {
			if(!_element.tagName)	{
				div.css("left", _element.x);
				div.css("top", _element.y);
			}
			else {
				var client = _element.getBoundingClientRect();
				div.css("left", client.left + client.width);
				div.css("top", client.top + client.height);
			}
			div.html(_contents);		
			div.css("position", "absolute");
			div.css("background-color", _rgba);
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

	var getSumList = function(_array, _key)	{
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
		var loading_div = $(".loading");
		var chart_div = $(_target);
		var bcr = document.querySelector(".chart_container").getBoundingClientRect();
		var default_width = 900;

		return {
			start : function()	{
				chart_div.fadeOut();
				loading_div.fadeIn();

				$("#loading_text")
				.css("top", -50)
				.css("left", -20)
				.text("Loading");

				loading_div
				.css("top", (bcr.top + (bcr.height > default_width ? default_width : bcr.height)) / 2)
				.css("left", (bcr.left > 500 ? bcr.width : bcr.right) / 2);				
			},
			end : function()	{
				chart_div.fadeIn();
				loading_div.fadeOut();
			}
		}
	}

	var preserveInterrupt = function(_target, _type)	{
		var target = _type === 0 ? d3.select(_target) : _target;

		if((/preserve_events/i).test(target.attr("class")))	{
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

	var groupOrder = function(_value)	{
		return {
			"male" : 0,
			"female" : 1,
			"lung mucinous adenocarcinoma" : 4,
			"lung bronchioloalveolar carcinoma mucinous" : 7,
			"lung solid pattern predominant adenocarcinoma" : 9,
			"lung papillary adenocarcinoma" : 2,
			"lung micropapillary adenocarcinoma" : 5,
			"lung adenocarcinoma- not otherwise specified (nos)" : 10,
			"lung bronchioloalveolar carcinoma nonmucinous" : 8,
			"mucinous (colloid) carcinoma" : 1,
			"lung acinar adenocarcinoma" : 0,
			"lung adenocarcinoma mixed subtype" : 6,
			"lung clear cell adenocarcinoma" : 3,
			"ERCSB" : 0,
			"TCGA" : 1,
			"non-smoker" : 0,
			"smoker" : 1,
			"reformed" : 2
		}[_value]
	}

	var translateXY = function(_element, _x_scale, _y_scale, _x_key, _y_key, _self_x, _self_y)	{
		_element
		.transition().duration(400)
		.attr("transform", function(_d, _i)	{
			// 파이어폭스에서 translate(0, 0) 의 값을 가졌을 때, 정상적인 값이 return 되지 않고 빈값이 반환되어 그림이 사라진다.
			// 대처방안으로 0이 아닌 0 이상의 값을 초기값으로 주었을 때, 정상적으로 작동한다.
			// 0일때, 왜 안되는지는 아직 잘 모르겠다.
			var x = _x_scale === 0 || _x_key === 0 ? _self_x ? _d.x(_d[_x_key]) : 0 : _x_scale(_d[_x_key]);
			var y = _y_scale === 0 || _y_key === 0 ? _self_y ? _d.y(_d[_y_key]) : 0 : _y_scale(_d[_y_key]);

			return  "translate(" + x +  ", " + y  +  ")";
		});
	}

	var attributeXY = function(_element, _type, _scale, _key, _self)		{
		_element
		.attr("class", _element.attr("class") + " preserve_events");

		_element
		.transition().duration(400)
		.attr(_type, function(_d)	{
			var pos = _self ? _d[_type](_d[_key]) : _scale(_d[_key]);

			return pos;
		})
		.each("end", function()	{
			preserveInterrupt(_element, 1);
		});
	}

	var attributeSize = function(_element, _type, _scale, _divide)	{
		_element
		.transition().duration(400)
		.attr(_type, function(_d)	{
			var size = _scale.rangeBand() / _divide;

			return size;
		});
	}

	var callAxis = function(_element, _scale, _way)	{
		_element
		.transition().duration(400)
		.call(d3.svg.axis().scale(_scale).orient(_way));
	}

	var defineProp = function(_obj, _value, _key)	{
		return Object.defineProperty(_obj, _key, {
			value : _value,
			writable : true,
			configurable : true,
			enumrable : false
		});
	}

	var oppositeColor = function(_rgb) {
		if((/#/i).test(_rgb))	{
			_rgb = _rgb.substring(1, _rgb.length);
		}

		var r1, g2, b2, r2, g2, b2;
		var rgb_hex = strCut(_rgb, 2);

		r1 = parseInt("0x" + rgb_hex[0][0].concat(rgb_hex[0][1]));
		g1 = parseInt("0x" + rgb_hex[1][0].concat(rgb_hex[1][1]));
		b1 = parseInt("0x" + rgb_hex[2][0].concat(rgb_hex[2][1]));

		r2 = (255 - r1).toString(16);
		g2 = (255 - g1).toString(16);
		b2 = (255 - b1).toString(16);

		return "#" + r2 + g2 + b2;
	}

	var strCut = function(_string, _measure)  {
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

	return {
		getNum : getNum,
		getObjectMax : getObjectMax,
		frontElement : frontElement,
		behindElement : behindElement,
		ordinalScale : ordinalScale,
		linearScale : linearScale,
		getObject : getObject,
		getObjectIndex : getObjectIndex,
		getObjectArray : getObjectArray,
		isArrayInObj : isArrayInObj,
		getArrayInObj : getArrayInObj,
		searchObjArray : searchObjArray,
		removeSvg : removeSvg,
		alterationPrecedence : alterationPrecedence,
		cnvPrecedence : cnvPrecedence,
		expPrecedence : expPrecedence,
		mutationPrecedence : mutationPrecedence,
		defMutName : defMutName,
		colour : colour,
		tooltip : tooltip,
		log : log,
		download : download,
		getSumList : getSumList,
		loading : loading,
		preserveInterrupt : preserveInterrupt,
		getTextSize : getTextSize,
		groupOrder : groupOrder,
		translateXY : translateXY,
		attributeXY : attributeXY,
		attributeSize : attributeSize,
		callAxis : callAxis,
		defineProp : defineProp,
		oppositeColor : oppositeColor,
		strCut : strCut
	};
});