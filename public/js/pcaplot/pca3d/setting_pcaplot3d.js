var _3D = "pcaplot/pca3d/";

define(_3D + "setting_pcaplot3d", ["utils", "size", _3D + "view_pcaplot3d"], function(_utils, _size, _view)	{
	return function(_data, _min_max)	{
		var data = _data || [];
		var min_max = _min_max || new Function();
		var size = _size.define_size("pcaplot_view_3d", 30, 30, 30, 30);
		var div = document.getElementById("pcaplot_view_3d");

		var x_minmax = min_max(data, "PC1");
		var y_minmax = min_max(data, "PC2");
		var z_minmax = min_max(data, "PC3");

		var square_size = {
			x : { start : -170, end : 170 },
			y : { start : -170, end : 170 },
			z : { start : -170, end : 170 },
		}

		var x = _utils.linearScale(x_minmax.min, x_minmax.max,
			square_size.x.start, square_size.x.end);
		var y = _utils.linearScale(y_minmax.min, y_minmax.max, 
			square_size.y.start, square_size.y.end);
		var z = _utils.linearScale(z_minmax.min, z_minmax.max, 
			square_size.z.start, square_size.z.end);

		var calculate_vector = function(_x, _y, _z)	{
			return new THREE.Vector3(_x, _y, _z);
		}

		var createFigureCanvas = function()	{
			var canvas = document.createElement("canvas");
			
			var canvas_width = 10;
			var canvas_height = 10;

			canvas.width = canvas_width;
			canvas.height = canvas_height;

			return canvas;
		}

		var drawRect = function(_color)		{
			var canvas = createFigureCanvas();
			var context = canvas.getContext("2d");

			context.fillStyle = _color;
			context.fillRect(0,0,10,10);

			return canvas;
		}
		var drawCircle = function(_color)	{
			var radius = 5;
			var canvas = createFigureCanvas();
			var context = canvas.getContext("2d");

			context.beginPath();
			context.arc(5, 5, radius, 0, 2 * Math.PI, false);
			context.fillStyle = _color;
			context.fill();

			return canvas;
		}
		var drawTriangle = function(_color)	{
			var canvas = createFigureCanvas();
			var context = canvas.getContext("2d");
			var path = new Path2D();

			path.moveTo(0, 5);
			path.lineTo(5, 10);
			path.lineTo(5, 0);
			path.closePath();

			context.fillStyle = _color;
			context.fill(path);

			return canvas;
		}

		var pca_figure = function(_type)	{
			return {
				"Primary Solid Tumor" : drawCircle(_utils.colour(_type)),
				"Solid Tissue Normal" : drawRect(_utils.colour(_type))
			}[_type];
		}

		var createTextCanvas = function(_text)	{
			var font_size = (_text.constructor === String) ? 15 : 12;
			var font_style = (_text.constructor === String) ? "Arial" : "Arial";
			var font_weight = (_text.constructor === String) ? "bold" : "none";
			var font_color = (_text.constructor === String) ? "black" : 0xFF0000;

			var canvas = document.createElement("canvas");
			var canvasText = canvas.getContext('2d');
			var font_definition = font_weight + " " + font_size + "px " + font_style;

			canvasText.font = font_definition;

			var canvasTextWidth = canvasText.measureText(_text).width;
			var canvasTextHeight = Math.ceil(font_size);

			canvas.width = canvasTextWidth;
			canvas.height = canvasTextHeight;

			canvasText.font = font_definition;
			canvasText.fillStyle = font_color;
			canvasText.fillText(_text, 0, font_size);

			return canvas;
		}

		var createCanvas = function(_canvas)	{
			var canvas = _canvas;

			var plane = new THREE.PlaneBufferGeometry(canvas.width, canvas.height);
			var texture = new THREE.Texture(canvas);

			texture.needsUpdate = true;
			texture.minFilter = THREE.LinearFilter;

			var spriteMaterial = new THREE.SpriteMaterial({ map : texture });

			var sprite = new THREE.Sprite(spriteMaterial);
			sprite.scale.set(canvas.width, canvas.height, 1)

			return sprite;
		}

		var createFigure = function(_figure)	{
			var canvas = pca_figure(_figure);

			return createCanvas(canvas);
		}

		var createText = function(_text)	{
			var canvas = createTextCanvas(_text);

			return createCanvas(canvas);
		}

		var reform_value = function(_json, _value)	{
			return (_json.constructor === Function) ?
			_json(_value) : _json;
		}

		var create_axis = function(_scene, _axis_list, _position)	{
			var result;

			for(var i = 0, len = _axis_list.length ; i < len ; i++)	{
				result = createText(_axis_list[i]);
				result.position.x = reform_value(_position.x, _axis_list[i]);
				result.position.y = reform_value(_position.y, _axis_list[i]);
				result.position.z = reform_value(_position.z, _axis_list[i]);

				_scene.add(result);
			}
		}

		var cal_axis_list = function(_period, _min, _max)	{
			var result = [];

			for(var i = _min, len = _max ; i < len ; i++)	{
				if(i % _period === 0)	{ result.push(i); }
			}
			return result;
		}

		var set_axis_list = function(_min, _max, _count)	{
			var number_cal = Math.floor((_max - _min) / _count);
			var number_format = number_cal * .1;
			var number_period = 0;
			var number_multi= 10;

			if(number_format % 2 === 0)	{
				number_period = Math.ceil(number_format + 0.1) * number_multi;
			}
			else {
				number_period = Math.ceil(number_format) * number_multi;	 		
			}
			return cal_axis_list(number_period, _min, _max);
		}

		_view.view({
			data : data,
			size : size,
			square : square_size,
			div : div,
			max : {
				x : x_minmax.max,
				y : y_minmax.max,
				z : z_minmax.max
			},
			min : {
				x : x_minmax.min,
				y : y_minmax.min,
				z : z_minmax.min
			},
			x : x,
			y : y,
			z : z,
			vector : calculate_vector,
			figure : createFigure,
			text : createText,
			scale : set_axis_list,
			axis : create_axis
		});

	}
});