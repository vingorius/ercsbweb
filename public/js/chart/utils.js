define("utils", ["size"], function(_size)  {
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

	var frontElement = function(_child, _parent)	{
		if(_child.nextSibling)	{
			_parent.appendChild(_child);
		}
	}

	var behindElement = function(_child, _idx, _parent)	{
		_parent.insertBefore(_child, _parent.childNodes[_idx - 1]);
	}

	var ordinalScale = function(_domain, _start, _end) {
		return d3.scale.ordinal()
		.domain(_domain)
		.rangeBands([_start, _end]);
	}

	var linearScale = function(_d_start, _d_end, _r_start, _r_end) {
		return d3.scale.linear()
		.domain([_d_start, _d_end])
		.range([_r_start, _r_end]);
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
			return { alteration : "CNV", priority : precedence(_alteration) };
		}
		else if((/(EXPRESSION)/).test(_alteration))	{
			return { alteration : "mRNA Expression (log2FC)", priority : precedence(_alteration) };
		}
		else {
			return { alteration : "Somatic Mutaion", priority : precedence(_alteration) };
		}
	}

	var precedence = function(_value)		{
		return {
			"Amplification" : 12,
			"Homozygous_Deletion" : 11,
			"Nonsense_mutation" : 9,
			"Splice_Site" : 8,
			"Translation_Start_Site" : 7,
			"Missense_mutation" : 6,
			"Nonstop_mutation" : 5,
			"Frame_shift_indel" : 4,
			"In_frame_indel" : 3,
			"RNA" : 2,
			"Silent" : 1,
		}[_value];
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
		else if((/(FRAME_SHIFT)/i).test(_name)) { 
			return "Frame_shift_indel"; 
		}
		else if((/(IN_FRAME)/i).test(_name)) { 
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
			var main = $("#maincontent");
			var chart = $(".tooltip_chart")
			.css("position", "absolute")
			.css("background-color", _rgba)
			.html(_contents);

			if(Object.keys(_element).length > 2)	{
				var client = _element.getBoundingClientRect();
				var top = client.top + client.height, left = client.left + client.width;
				var margin_left = main.css("margin-left") ? getNum(main.css("margin-left")) : 0;

				if(client.left - margin_left + client.width + chart.width() > main.width())	{
					left = client.left - chart.width();
				}
				chart
				.css("left", left)
				.css("top", top)
				.show();
			}
			else {
				chart
				.css("left", _element.x)
				.css("top", _element.y)
				.show();
			}
		},
		hide : function(_is_interactive)	{
			 $(".tooltip_chart").hide();
		}
	}

	var calLog = function(_value)    {
		return Math.log(_value) / (Math.LN10 * -1);
	}

	var checkIE = function()	{
		var agent = navigator.userAgent.toLowerCase();

		return agent.indexOf("chrome") > -1 || agent.indexOf("safari") > -1 || agent.indexOf("firefox") > -1 ? false : true;
	}

	var download = function(_name, _url)	{
		var a = document.createElement("a");
		var create_event;

		create_event = document.createEvent("MouseEvents");
		create_event.initEvent("click", true, true);

		a.download = _name;
		a.href = _url;
		a.dispatchEvent(create_event);	
	}

	var downloadImage = function(_name, _type)	{
		var data = getImageURL(savePng);
	}

	var savePng = function(_obj)	{
		download("test.png", _obj.data);
	}

	var getImageURL = function(_callback)	{
		var svg = $("svg");
		var width = widthForDownCanvas(svg);
		var height = heightForDownCanvas(svg);
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id", "download_canvas_image")
		canvas.width = width.width;
		canvas.height = height.height;
		var init, pre, left = 0;
		var right_pos = 0;

		for(var i = 0, len = svg.length ; i < len ; i++)	{
			var item = svg[i];
			var loc = item.getBoundingClientRect();
			var source = new XMLSerializer().serializeToString(item);

			if(!init || loc.left === init)	{
				init = loc.left;
				left = init;
			}
			else {
				left = (pre ? pre.width : 0) + (pre ? pre.left + (loc.left > pre.right ? (loc.left - pre.right) : 0) : loc.left);
			}
			pre = loc;	

			if((/pq$/).test(item.id))	{
				right_pos = left;
			}
			else if((/pq_title$/).test(item.id))	{
				left = right_pos;
			}

			if(source.match(/xmlns\:NS\d+=\"\" NS(\d+|)\:/g))	{
				source = source.replace(/xmlns\:NS\d+=\"\" NS(\d+|)\:/g, "");
			}

			var url = "data:image/svg+xml;base64,"+ encodeURIComponent(btoa(source));
			/*
				FireFox : 적은 수의 svg 를 처리하는데는 문제가 없지만, 많은 수의 svg 를 처리하는데는 아직 오류가 있다.
				IE : canvas.toDataURL() 에서 SecurityError 발생. IE11 does not appear to support CORS for images in the canvas element use only SVG
			 */
			var img = new Image();
			img.posx = (left - width.margin);
			img.posy = (loc.top - height.margin);
			img.idx = i;
			img.crossOrigin = "";

			img.onload = function(_img)	{
				var ctx = canvas.getContext("2d");

				if(_img.target.idx === svg.length || _img.target.idx === svg.length - 1)	{
					if(!checkIE())	{
						ctx.drawImage(_img.target, _img.target.posx, _img.target.posy);
						_callback({
							canvas : canvas,
							data : canvas.toDataURL('image/png'),
						});
					}
				}
			}
			img.src = url;
		}
	}

	var widthForDownCanvas = function(_svg)	{
		var now = 0, old = 0, pre = 0;

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
		var array_index = 0, old = 0, margin = 0;

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
		var result = 0;

		for(var i = 0, len = _array.length ; i < len ; i++)	{
			if((/[pq]/).test(_key))	{
				result += calLog(_array[i][_key]);	
			}
			else {
				result += _array[i][_key];
			}
		}
		return result;
	}

	var loading = function(_name, _target)	{
		var loading_div = $(".loading");
		var chart_div = $(_target);
		var bcr = document.querySelector(_target).getBoundingClientRect();
		var default_width = 900;

		if(window.Promise)	{
			var chart_promise = new Promise(function(_resolve, _reject)	{
				chart_div.css('visibility', 'visible').hide().fadeIn();
			});
			var loading_promise = new Promise(function(_resolve, _reject)	{
				loading_div.fadeOut("slow");
			});
		}
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
				if(window.Promise)	{
					chart_promise
					.catch("Drawing chart error !")
					.then(loading_promise);
				}
				else {
					chart_div.css('visibility', 'visible').hide().fadeIn();
					loading_div.fadeOut();
				}
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
			name : _txt,
			width : width, 
			height : height 
		};
	}

	var translateXY = function(_element, _x_scale, _y_scale, _x_key, _y_key, _self_x, _self_y)	{
		_element
		.transition().duration(250)
		.attr("transform", function(_d, _i)	{
			var x = _x_scale === 0 || _x_key === 0 ? _self_x ? _d.x(_d[_x_key]) : 0.00001 : _x_scale(_d[_x_key]);
			var y = _y_scale === 0 || _y_key === 0 ? _self_y ? _d.y(_d[_y_key]) : 0 : _y_scale(_d[_y_key]);

			return "translate(" + x + ", " + y + ")";
		});
	}

	var attributeXY = function(_element, _type, _scale, _key, _self)		{
		_element
		.attr("class", function()	{
			if(d3.select(this).attr("class"))	{
				return _element.attr("class") + " preserve_events";
			}
			return;
		})
		.transition().duration(250)
		.attr(_type, function(_d)	{
			return _self ? _d[_type](_d[_key]) : _scale(_d[_key]);
		})
		.each("end", function()	{
			preserveInterrupt(_element, 1);
		});
	}

	var attributeSize = function(_element, _type, _scale, _divide)	{
		_element
		.transition().duration(250)
		.attr(_type, function(_d)	{
			return _scale.rangeBand();
			// return (_scale.rangeBand() / (_divide ? _divide : 1));
		});
	}

	var callAxis = function(_element, _scale, _way)	{
		_element
		.transition().duration(250)
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

	var orderGroup = function(_value)	{
		return {
			"Squamoid" : 0,
			"Magnoid" : 1,
			"Bronchioid" : 2,
			"Current reformed smoker for > 15 years" : 0,
			"Lifelong Non-smoker" : 1,
			"Current reformed smoker for < or = 15 years" : 2,
			"Current smoker" : 3,
			"Current Reformed Smoker, Duration Not Specified" : 4,
			"Acinar predominant Adc" : 0,
			"Adenocarcinoma, NOS" : 1,
			"Colloid adenoca" : 2,
			"Invasive mucinous" : 3,
			"Lepidic predominant Adc" : 4,
			"Micropapillary predom Adc" : 5,
			"Other see comment" : 6,
			"Papillary predominant Adc" : 7,
			"Solid predominant Adc" : 8,
			"NSCLC, favor Adeno" : 9,
			"0" : 100,
			"Stage IA" : 0,
			"Stage IB" : 1,
			"Stage IIA" : 2,
			"Stage IIB" : 3,
			"Stage IIIA" : 4,
			"Stage IV" : 5,
			"Stage I" : 6,
			"Stage IIIB" : 7,
			"FEMALE" : 0,
			"MALE" : 1,
			"NO" : 0,
			"YES" : 1,
			"LIVING" : 0,
			"DECEASED" : 1,
			"Lung Adenocarcinoma- Not Otherwise Specified (NOS)" : 0,
			"Lung Acinar Adenocarcinoma" : 1,
			"Lung Bronchioloalveolar Carcinoma Nonmucinous" : 2,
			"Lung Solid Pattern Predominant Adenocarcinoma" : 3,
			"Mucinous (Colloid) Carcinoma" : 4,
			"Lung Adenocarcinoma Mixed Subtype" : 5,
			"Lung Papillary Adenocarcinoma" : 6,
			"Lung Bronchioloalveolar Carcinoma Mucinous" : 7,
			"Lung Micropapillary Adenocarcinoma" : 8,
			"Lung Clear Cell Adenocarcinoma" : 9,
			"Lung Mucinous Adenocarcinoma" : 10,
			"ERCSB" : 0,
			"TCGA" : 1,
			"male" : 1,
			"female" : 0,
			"non-smoker" : 0,
			"smoker" : 1,
			"reformed" : 2,
			"asian" : 0,
			"white" : 1,
			"black or african ame" : 2,
			"american indian or alaska native" : 3,
			"NA" : 10000
		}[_value]
	}

	return {
		getNum : getNum,
		getObjectMax : getObjectMax,
		frontElement : frontElement,
		behindElement : behindElement,
		ordinalScale : ordinalScale,
		linearScale : linearScale,
		getObject : getObject,
		getObjectArray : getObjectArray,
		isArrayInObj : isArrayInObj,
		getArrayInObj : getArrayInObj,
		searchObjArray : searchObjArray,
		removeSvg : removeSvg,
		alterationPrecedence : alterationPrecedence,
		defMutName : defMutName,
		colour : colour,
		tooltip : tooltip,
		calLog : calLog,
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
		orderGroup : orderGroup,
		checkIE : checkIE
	};
});