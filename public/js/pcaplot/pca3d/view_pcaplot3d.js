define("pcaplot3d/view_pcaplot3d", ["utils", "size", "pcaplot3d/event_pcaplot3d"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var v = data.vector;

		var renderer = new THREE.WebGLRenderer({
			antialias : true,
			alpha : true
		});

		var camera = new THREE.OrthographicCamera(
			(size.rwidth / -2), (size.rwidth / 2),
			(size.rheight / 2), (size.rheight / -2), 1, 10000);

		var scene = new THREE.Scene();
		var object3d = new THREE.Object3D();
		var e = _event(renderer, camera, scene, object3d) || null;

		renderer.setSize(size.rwidth, size.rheight);
		renderer.setClearColor(0xFFFFFF);

		data.div.appendChild(renderer.domElement);

		camera.position.z = size.width;

		object3d.rotation.y = 0;

		scene.add(object3d);

		var border_geometry = new THREE.Geometry();

		border_geometry.vertices.push(
			v(data.x(data.min.x), data.y(data.min.y), data.z(data.min.z)),
			v(data.x(data.max.x), data.y(data.min.y), data.z(data.min.z)),
			v(data.x(data.max.x), data.y(data.max.y), data.z(data.min.z)),
			v(data.x(data.min.x), data.y(data.max.y), data.z(data.min.z)),
			v(data.x(data.min.x), data.y(data.min.y), data.z(data.min.z)),

			v(data.x(data.min.x), data.y(data.min.y), data.z(data.max.z)),
			v(data.x(data.min.x), data.y(data.max.y), data.z(data.max.z)),
			v(data.x(data.min.x), data.y(data.max.y), data.z(data.min.z)),

			v(data.x(data.min.x), data.y(data.max.y), data.z(data.max.z)),
			v(data.x(data.max.x), data.y(data.max.y), data.z(data.max.z)),
			v(data.x(data.max.x), data.y(data.max.y), data.z(data.min.z)),

			v(data.x(data.max.x), data.y(data.max.y), data.z(data.max.z)),
			v(data.x(data.max.x), data.y(data.min.y), data.z(data.max.z)),
			v(data.x(data.max.x), data.y(data.min.y), data.z(data.min.z)),

			v(data.x(data.max.x), data.y(data.min.y), data.z(data.max.z)),
			v(data.x(data.max.x), data.y(data.max.y), data.z(data.max.z)),
			v(data.x(data.min.x), data.y(data.max.y), data.z(data.max.z)),
			v(data.x(data.min.x), data.y(data.min.y), data.z(data.max.z)),

			v(data.x(data.max.x), data.y(data.min.y), data.z(data.max.z)),
			v(data.x(data.min.x), data.y(data.min.y), data.z(data.max.z)),
			v(data.x(data.min.x), data.y(data.min.y), data.z(data.min.z)));

		var border_material = new THREE.LineBasicMaterial({
			color : 0x515151,
			lineWidth : 1
		});

		var border = new THREE.Line(border_geometry, border_material);
		
		border.type = THREE.Lines;

		object3d.add(border);

		for (var i = 0, len = data.data.sample_list.length; i < len; i ++) {
			var posX = data.x(Number(data.data.sample_list[i].PC1));
			var posY = data.y(Number(data.data.sample_list[i].PC2));
			var posZ = data.z(Number(data.data.sample_list[i].PC3));

			var figure = data.figure(data.data.sample_list[i].TYPE);

			figure.position.set(posX, posY, posZ);

			object3d.add( figure );
		}

		var label_x = data.text("PC1");
		label_x.position.x = (data.square.x.end - data.square.x.start) / 2;
		label_x.position.y = (data.square.y.start - (size.margin.top + size.margin.bottom));
		label_x.position.z = (data.square.z.start);

		object3d.add(label_x);

		var label_y = data.text("PC2");
		label_y.position.x = (data.square.x.start - (size.margin.left + size.margin.right));
		label_y.position.y = (data.square.y.end - data.square.y.start) / 2;
		label_y.position.z = (data.square.z.start);

		object3d.add(label_y);

		var label_z = data.text("PC3");
		label_z.position.x = (data.square.x.start - (size.margin.left + size.margin.right));
		label_z.position.y = (data.square.y.start - (size.margin.top + size.margin.bottom));
		label_z.position.z = (data.square.z.end - data.square.z.start) / 2;

		object3d.add(label_z);

		var xAxis = data.scale(Math.floor(data.min.x), Math.floor(data.max.x), 5);
		var yAxis = data.scale(Math.floor(data.min.y), Math.floor(data.max.y), 5);
		var zAxis = data.scale(Math.floor(data.min.z), Math.floor(data.max.z), 5);

		data.axis(object3d, xAxis, {
			x : data.x,
			y : (data.square.y.start - size.margin.top),
			z : (data.square.z.start)
		});

		data.axis(object3d, yAxis, {
			x : (data.square.x.start - size.margin.left),
			y : data.y,
			z : (data.square.z.start)
		});

		data.axis(object3d, zAxis, {
			x : (data.square.x.start - size.margin.left),
			y : (data.square.y.start - size.margin.top),
			z : data.z
		});

		renderer.render(scene, camera);

		window.onmousedown = e.win_m_down;
		window.onmouseup = e.win_m_up;
		window.onmousemove = e.win_m_move;
	}

	return {
		view : view
	}
});