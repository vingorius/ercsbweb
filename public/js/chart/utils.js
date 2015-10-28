define("utils", ["size"], function(_size)  {
	var stacked = function(_list, _key, _sort)	{
		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var item = _list[i];

			if(_sort)	{
				item[_key] = _sort(item[_key]);
			}

			for(var j = 0, leng = item[_key].length ; j < leng ; j++)	{
				var jtem = item[_key][j];

				if(j === 0)	{
					jtem.start = 0;
				}
				else {
					var pre = item[_key][j - 1];
					
					jtem.start = pre.count + pre.start;
				}
			}
		}
		return _list;
	}

	var fillArray = function(_size, _value)	{
		var result = [];

		for(var i = 0, len = _size ; i < len ; i++)	{
			result[i] = _value;
		}
		return result;
	}

	var getNum = function(_str)	{
		return parseFloat(_str.replace((/([a-z]|\W)/ig), ""));
	}

	var getOnlyDataObjArray = function(_list, _key)	{
		var result = [];

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			result[i] = _list[i][_key];
		}
		return result;
	}

	var getNotExistDataInObjArray = function(_list, _obj_key)		{
		var result = [];
		var arr_idx = 0;

		for(var i = 0, len = _list.length ; i < len ; i++)	{
			var item = arguments[2] && typeof arguments[2] === "function" ? 
				arguments[2](_list[i][_obj_key]) : _list[i][_obj_key];

			if($.inArray(item, result) < 0)		{
				result[arr_idx] = item;
				arr_idx++;
			}
		}
		return result;
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

	var getObject = function(_name, _array, _key, _isarr)  {
		var result = _isarr ? [] : null;

		for(var i = 0, len = _array.length ; i < len ; i++) 	{
			var obj = _array[i];

			if(obj[_key] === _name)	{
				_isarr ? result.push(obj) : result = obj;
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
			return { alteration : "Somatic Mutation", priority : precedence(_alteration) };
		}
	}

	var precedence = function(_value)	{
		switch(_value)	{
			case "Amplification" : return { idx : 3, order : 12 }; break;
			case "Homozygous_Deletion" : return { idx : 3, order : 11}; break;
			case "Nonsense_mutation" : return { idx : 1, order : 9 }; break;
			case "Splice_Site" : return { idx : 1, order : 8 }; break;
			case "Translation_Start_Site" : return { idx : 1, order : 7 }; break;
			case "Missense_mutation" : return { idx : 1, order : 6 }; break;
			case "Nonstop_mutation" : return { idx : 1, order : 5 }; break;
			case "Frame_shift_indel" : return { idx : 1, order : 4 }; break;
			case "In_frame_indel" : return { idx : 1, order : 3 }; break;
			case "RNA" : return { idx : 1, order : 2 }; break;
			case "Silent" : return { idx : 1, order : 1 }; break;
		}
	}

	var defMutName = function(_name)  {
		switch(true)	{
			case (/MISSENSE/i).test(_name) : return "Missense_mutation"; break;
			case (/NONSENSE/i).test(_name) : return "Nonsense_mutation"; break;
			case (/(SPLICE_SITE)|(SPLICE_SITE_SNP)/i).test(_name) : return "Splice_Site"; break;
			case (/SILENT/i).test(_name) : return "Silent"; break;
			case (/TRANSLATION/i).test(_name) : return "Translation_Start_Site"; break;
			case (/RNA/i).test(_name) : return "RNA"; break;
			case (/FRAME_SHIFT/i).test(_name) : return "Frame_shift_indel"; break;
			case (/IN_FRAME/i).test(_name) : return "In_frame_indel"; break;
			case (/NONSTOP/i).test(_name) : return "Nonstop_mutation"; break;
			case (/AMPLIFICATION/i).test(_name) : return "Amplification"; break;
			case (/HOMOZYGOUS_DELETION/i).test(_name) : return "Homozygous_Deletion"; break;
		}
	}

	var colour = function(_value)   {
		switch(_value)	{
			case "Amplification" : return "#FFBDE0"; break;
			case "Homozygous_Deletion" : return "#BDE0FF"; break;
			case "Nonsense_mutation" : return "#EA3B29"; break;
			case "Splice_Site" : return "#800080"; break;
			case "Translation_Start_Site" : return "#aaa8aa"; break;
			case "Missense_mutation" : return "#3E87C2"; break;
			case "Nonstop_mutation" : return "#070078"; break;
			case "Frame_shift_indel" : return "#F68D3B"; break;
			case "In_frame_indel" : return "#F2EE7E"; break;
			case "RNA" : return "#ffdf97"; break; 
			case "Silent" : return "#5CB755"; break;
			case "pq" : return "#C2C4C9"; break;
			case "Primary Solid Tumor" : return "#F64747"; break;
			case "Solid Tissue Normal" : return "#446CB3"; break;
			case "si_log_p" : return "#ea3b29"; break;
			case "si_up_log_p" : return "#5cb755"; break;
			case "si_down_log_p" : return "#3e87c2"; break;
		}
	}

	var tooltip = {
		show : function(_element, _contents, _rgba)	{
			var main = $("#maincontent");
			var chart = $(".tooltip_chart");
			var posx, posy;

			if(Object.keys(_element).length > 2)	{
				var client = _element.getBoundingClientRect();
				var top = client.top + client.height, left = client.left + client.width;
				var margin_left = main.css("margin-left") ? getNum(main.css("margin-left")) : 0;

				if((client.left - margin_left + client.width + chart.width()) > main.width())	{
					left = client.left - chart.width();
				}
				posx = left;
				posy = top;
			}
			else {
				posx = _element.x;
				posy = _element.y;
			}
			chart
			.css("position", "absolute")
			.css("background-color", _rgba)
			.css("left", posx)
			.css("top", posy)
			.html(_contents)
			.show();
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

			img.onload = function(_img)	{
				var ctx = canvas.getContext("2d");

				if(_img.target.idx === svg.length || _img.target.idx === svg.length - 1)	{

					window.postMessage({
						url : canvas.toDataURL('image/png'),
						posx : _img.target.posx,
						posy : _img.target.posy, 
					}, window.location.href);

					function receiveMessage(_e)	{
						getFunc(ctx, canvas, _e.data);
						// if(!checkIE())	{
							// ctx.drawImage(_img.target, _e.data.posx, _e.data.posy);
							// _callback({
							// 	canvas : canvas,
							// 	data : _e.data.url,
							// });
						// }
					}

					var getFunc = function(_ctx, _canvas, _e)	{
						console.log($(img))
						// ctx.drawImage(img, img.posx, img.posy);
						_callback({
							canvas : canvas,
							data : _e.url,
						})
					}

					window.addEventListener("message", receiveMessage, false);

					// if(!checkIE())	{
						ctx.drawImage(_img.target, _img.target.posx, _img.target.posy);
						// _callback({
						// 	canvas : canvas,
						// 	data : canvas.toDataURL('image/png'),
						// });
					// }
				}
			}
			img.crossOrigin = "Anonymous";
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
			result += (/[pq]/).test(_key) ? calLog(_array[i][_key]) : _array[i][_key];
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

		return { 
			name : _txt,
			width : ctx.measureText(_txt).width, 
			height : parseInt(ctx.font), 
		};
	}

	var translateXY = function(_element, _x_scale, _y_scale, _x_key, _y_key, _self_x, _self_y)	{
		_element
		.transition().duration(400)
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
		})
		.transition().duration(400)
		.attr(_type, function(_d)	{
			return _self ? _d[_type](_d[_key]) : _scale(_d[_key]);
		})
		.each("end", function()	{
			preserveInterrupt(_element, 1);
		});
	}

	var attributeSize = function(_element, _type, _scale)	{
		_element
		.transition().duration(400)
		.attr(_type, _scale.rangeBand());
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

	var defGroup = function(_value)	{
		switch(_value)	{
			case "Squamoid" : return { value : 0, color : "#05146b" }; break;
			case "Magnoid" : return { value : 1, color : "#2fcbff" }; break;
			case "Bronchioid" : return { value : 2, color : "#ff809f" }; break;
			case "Current reformed smoker for > 15 years" : return { value : 0, color : "#FEC39C" }; break;
			case "Lifelong Non-smoker" : return { value : 1, color : "#93FE2F" }; break;
			case "Current reformed smoker for < or = 15 years" : return { value : 2, color : "#F1FE86" }; break;
			case "Current smoker" : return { value : 3, color : "#980713" }; break;
			case "Current Reformed Smoker, Duration Not Specified" : return { value : 4, color : "#FD0D21" }; break;
			case "Acinar predominant Adc" : return { value : 0, color : "#664A1F" }; break;
			case "Adenocarcinoma, NOS" : return { value : 1, color : "#815540" }; break;
			case "Colloid adenoca" : return { value : 2, color : "#73324F" }; break;
			case "Invasive mucinous" : return { value : 3, color : "#BD9011" }; break;
			case "Lepidic predominant Adc" : return { value : 4, color : "#2F5930" }; break;
			case "Micropapillary predom Adc" : return { value : 5, color : "#445D44" }; break;
			case "Other see comment" : return { value : 6, color : "#0B8782" }; break;
			case "Papillary predominant Adc" : return { value : 7, color : "#EB4F8A" }; break;
			case "Solid predominant Adc" : return { value : 8, color : "#EE9DAD" }; break;
			case "NSCLC, favor Adeno" : return { value : 9, color : "#8F6B99" }; break;
			case "0" : return { value : 100, color : "#fff" }; break;
			case "Stage IA" : return { value : 0, color : "#660033" }; break;
			case "Stage IB" : return { value : 1, color : "#CC9900" }; break;
			case "Stage IIA" : return { value : 2, color : "#EE0088" }; break;
			case "Stage IIB" : return { value : 3, color : "#99AA00" }; break;
			case "Stage IIIA" : return { value : 4, color : "#006600" }; break;
			case "Stage IV" : return { value : 5, color : "#CCFF66" }; break;
			case "Stage I" : return { value : 6, color : "#660066" }; break;
			case "Stage IIIB" : return { value : 7, color : "#008888" }; break;
			case "FEMALE" : return { value : 0, color : "#ff00db" }; break;
			case "MALE" : return { value : 1, color : "#0024ff" }; break;
			case "NO" : return { value : 0, color : "#ef4a59" }; break;
			case "YES" : return { value : 1, color : "#06b200" }; break;
			case "LIVING" : return { value : 0, color : "#00FF2B" }; break;
			case "DECEASED" : return { value : 1, color : "#FF001A" }; break;
			case "Lung Adenocarcinoma- Not Otherwise Specified (NOS)" : return { value : 0, color : "#E2D7B1" }; break;
			case "Lung Acinar Adenocarcinoma" : return { value : 1, color : "#A7E8EF" }; break;
			case "Lung Bronchioloalveolar Carcinoma Nonmucinous" : return { value : 2, color : "#C49E66" }; break;
			case "Lung Solid Pattern Predominant Adenocarcinoma" : return { value : 3, color : "#2D2D25" }; break;
			case "Mucinous (Colloid) Carcinoma" : return { value : 4, color : "#EEEFC6" }; break;
			case "Lung Adenocarcinoma Mixed Subtype" : return { value : 5, color : "#8DD3C9" }; break;
			case "Lung Papillary Adenocarcinoma" : return { value : 6, color : "#56075B" }; break;
			case "Lung Bronchioloalveolar Carcinoma Mucinous" : return { value : 7, color : "#ABB742" }; break;
			case "Lung Micropapillary Adenocarcinoma" : return { value : 8, color : "#93938F" }; break;
			case "Lung Clear Cell Adenocarcinoma" : return { value : 9, color : "#CC5045" }; break;
			case "Lung Mucinous Adenocarcinoma" : return { value : 10, color : "#90C0ED" }; break;
			case "ERCSB" : return { value : 0, color : "#59d0f4" }; break;
			case "TCGA" : return { value : 1, color : "#849093" }; break;
			case "male" : return { value : 1, color : "#0024ff" }; break;
			case "female" : return { value : 0, color : "#ff00db" }; break;
			case "non-smoker" : return { value : 0, color : "#5cb755" }; break;
			case "smoker" : return { value : 1, color : "#ea3b29" }; break;
			case "reformed" : return { value : 2, color : "#ff9000" }; break;
			case "asian" : return { value : 0, color : "#f5a43f" }; break;
			case "white" : return { value : 1, color : "#f1ec85" }; break;
			case "black or african ame" : return { value : 2, color : "#5B5B5B" }; break;
			case "american indian or alaska native" : return { value : 3, color : "#4af380" }; break;
			case "NA" : return { value : 10000, color : "#d5dddd" }; break;
		}
	}

	return {
		stacked : stacked,
		fillArray : fillArray,
		getNum : getNum,
		getOnlyDataObjArray : getOnlyDataObjArray,
		getNotExistDataInObjArray : getNotExistDataInObjArray,
		getObjectMax : getObjectMax,
		frontElement : frontElement,
		behindElement : behindElement,
		ordinalScale : ordinalScale,
		linearScale : linearScale,
		getObject : getObject,
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
		defGroup : defGroup,
		checkIE : checkIE
	};
});