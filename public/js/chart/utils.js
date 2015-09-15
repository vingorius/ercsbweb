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
			"Amplification" : "#FFBDE0",					// CNV
			"Homozygous_Deletion" : "#BDE0FF",
			"Nonsense_mutation" : "#EA3B29",			// Somatic mutation
			"Splice_Site" : "#800080",
			"Translation_Start_Site" : "#aaa8aa",
			"Missense_mutation" : "#3E87C2",
			"Nonstop_mutation" : "#070078",
			"Frame_shift_indel" : "#F68D3B",
			"In_frame_indel" : "#F2EE7E",
			"RNA" : "#ffdf97",
			"Silent" : "#5CB755",
			"pq" : "#C2C4C9",								// P & Q value
			"Primary Solid Tumor" : "#F64747",			// Pca plot
			"Solid Tissue Normal" : "#446CB3",
			"si_log_p" : "#ea3b29",						// Deg plot
			"si_up_log_p" : "#5cb755",
			"si_down_log_p" : "#3e87c2"
		}[value];
	}

	var tooltip = {
		show : function(_element, _contents, _rgba)	{
			var client = _element.getBoundingClientRect();
			
			this.div
			.css("left", client.left + client.width)
			.css("top", client.top + client.height)
			.css("position", "absolute")
			.css("background-color", _rgba)
			.html(_contents)
			.show();
		},
		hide : function(_is_interactive)	{
			var that = this.div;

			if(!_is_interactive)	{
				if(!that)	{
					return;
				}
				else {
					that.hide();
				}
			}
			else {
				console.log("pathway", that)
				that = $(".tooltip_chart");

				var timeout = setTimeout(function()	{
					that.hide();
				}, 1500);

				that
				.on("mouseover", function()	{
					clearTimeout(timeout);
					that.show();
				})
				.on("mouseout", function()	{
					that.hide();
				});
			}
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

	var downloadImage = function(_name, _type)	{
		var data = getImageURL();

		switch(true)	{
			case (/png/i).test(_type) : 
				download(_name + ".png", data.data);
				break;
			case (/pdf/i).test(_type) : 
				var pdf = new jsPDF("l", "px", [ data.height, data.width ]);
				pdf.addImage(data.data, 0, 0, data.width, data.height);
				pdf.save(_name + ".pdf");
				break;
			default : 
				break; 
		}
	}

	var getImageURL = function()	{
		var svg = $("svg");
		var width = widthForDownCanvas(svg);
		var height = heightForDownCanvas(svg);
		var canvas = document.createElement("canvas");
		canvas.width = width.width;
		canvas.height = height.height;
		var init_left, pre_horizontal, left;

		for(var i = 0, len = svg.length ; i < len ; i++)	{
			var context = canvas.getContext("2d");
			var item = svg[i];
			var loc = item.getBoundingClientRect();
			var source = (new XMLSerializer).serializeToString(item);

			if(!init_left) {
				pre_horizontal = loc;
				init_left = loc.left;
				left = loc.left;
			}
			else {
				if(loc.left === init_left)	{
					left = init_left;	
				}
				else {
					left = pre_horizontal.width + pre_horizontal.left;
				}
				pre_horizontal = loc;	
			}

			if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
				source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
			}
			if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
				source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
			}
			source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

			var url = "data:image/svg+xml;base64,"+ encodeURIComponent(btoa(source));
			var img = new Image();
			img.src = url;

			context.drawImage(img, left - width.margin, loc.top - height.margin);
		}
		return {
			data : canvas.toDataURL('image/png'),
			width : canvas.width,
			height : canvas.height
		};
	}

	var widthForDownCanvas = function(_svg)	{
		var now = 0;
		var old = 0;
		var pre = 0;

		if(_svg.length < 2)	{
			var loc = _svg[0].getBoundingClientRect();
			return { width : loc.right, margin : loc.left };
		}

		for(var i = 0, len = _svg.length ; i < len ; i++)	{
			var item = _svg[i];
			var loc = item.getBoundingClientRect();

			if(old === 0)	{
				old = loc.left;
			}
			else {
				if(loc.left !== old)	{
					now += loc.width;
				}	
				else {
					now += loc.width;
					now > pre ? pre = now : pre = pre;
					now = 0;
				}
			}
		}
		return { width : pre, margin : old };
	}

	var heightForDownCanvas = function(_svg)	{
		var height_set = [];
		var array_index = 0;
		var old = 0;
		var margin = 0;

		if(_svg.length < 2)	{
			var loc = _svg[0].getBoundingClientRect();
			return { height : loc.bottom, margin : loc.top };
		}

		for(var i = 0, len = _svg.length ; i < len ; i++)	{
			var item = _svg[i];
			var loc = item.getBoundingClientRect();

			if(old === 0)	{
				margin = loc.top;
				old = loc.left;
				height_set[i - array_index] = loc.height;
			}
			else {
				if(loc.left !== old)	{
					if(!height_set[i - array_index])	{
						height_set[i - array_index] = 0;
					}
					height_set[i - array_index] += loc.height
				}	
				else {
					array_index = i;
					height_set[i - array_index] += loc.height
				}
			}
		}
		return { height : d3.max(height_set), margin : margin };
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
		var bcr = document.querySelector(_target).getBoundingClientRect();
		var default_width = 900;

		var chart_promise = new Promise(function(_resolve, _reject)	{
			chart_div.css('visibility', 'visible').hide().fadeIn();
		});

		var loading_promise = new Promise(function(_resolve, _reject)	{
			loading_div.fadeOut("fast");
		});

		return {
			start : function()	{
				loading_div.fadeIn();

				$("#loading_text")
				.css("top", -50)
				.css("left", -20)
				.text("Loading");

				loading_div
				.css("top", (bcr.top + (bcr.height > default_width ? default_width : bcr.height)) / 2)
				.css("left", (bcr.left > 500 ? bcr.width : bcr.right + bcr.left) / 2);				
			},
			end : function()	{
				chart_promise
				.catch("Drawing chart error !")
				.then(loading_promise);
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

	var translateXY = function(_element, _x_scale, _y_scale, _x_key, _y_key, _self_x, _self_y)	{
		_element
		.transition().duration(400).delay(function(_d, _i)	{
			return _i / 10;
		})
		.attr("transform", function(_d, _i)	{
			var x = _x_scale === 0 || _x_key === 0 ? _self_x ? _d.x(_d[_x_key]) : 0.1 : _x_scale(_d[_x_key]);
			var y = _y_scale === 0 || _y_key === 0 ? _self_y ? _d.y(_d[_y_key]) : 0 : _y_scale(_d[_y_key]);

			return "translate(" + x + ", " + y + ")";
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

	// var oppositeColor = function(_rgb) {
	// 	if((/#/i).test(_rgb))	{
	// 		_rgb = _rgb.substring(1, _rgb.length);
	// 	}

	// 	var r1, g2, b2, r2, g2, b2;
	// 	var rgb_hex = strCut(_rgb, 2);

	// 	r1 = parseInt("0x" + rgb_hex[0][0].concat(rgb_hex[0][1]));
	// 	g1 = parseInt("0x" + rgb_hex[1][0].concat(rgb_hex[1][1]));
	// 	b1 = parseInt("0x" + rgb_hex[2][0].concat(rgb_hex[2][1]));

	// 	r2 = (255 - r1).toString(16);
	// 	g2 = (255 - g1).toString(16);
	// 	b2 = (255 - b1).toString(16);

	// 	return "#" + r2 + g2 + b2;
	// }

	// var strCut = function(_string, _measure)  {
	// 	var result = [];
	// 	var empty = [];

	// 	for(var i = 1, len = _string.length ; i <= len + 1 ; i++)    {
	// 		if(_string[i - 1])		{
	// 			empty.push(_string[i - 1]);
	// 		}
	// 		if(i % _measure === 0)  {
	// 			result.push(empty);
	// 			empty = [];
	// 		}
	// 	}
	// 	return result;
	// }

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
		downloadImage : downloadImage,
		getSumList : getSumList,
		loading : loading,
		preserveInterrupt : preserveInterrupt,
		getTextSize : getTextSize,
		translateXY : translateXY,
		attributeXY : attributeXY,
		attributeSize : attributeSize,
		callAxis : callAxis,
		defineProp : defineProp,
		// oppositeColor : oppositeColor,
		// strCut : strCut
	};
});