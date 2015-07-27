var _3D = "pcaplot/pca3d/";

define(_3D + "view_pcaplot3d", ["utils", "size", _3D + "event_pcaplot3d"], function(_utils, _size, _event)	{
	var view = function(_data)	{
		var data = _data || {};
		var size = data.size;
		var v = data.vector;
		var default_axis = { x : 0.5, y : -0.5, z : 0 };
		var event_targets = [];

		var renderer = new THREE.WebGLRenderer({
			antialias : true, alpha : true
		});

		var camera = new THREE.OrthographicCamera(
			(size.rwidth / -2), (size.rwidth / 2),
			(size.rheight / 2), (size.rheight / -2), -5000, 10000);

		var scene = new THREE.Scene();
		var object3d = new THREE.Object3D();
		var raycaster = new THREE.Raycaster();
		var ray_mouse = new THREE.Vector3();

		renderer.setSize(size.rwidth, size.rheight);
		renderer.setClearColor(0xFFFFFF);

		data.div.appendChild(renderer.domElement);

		object3d.rotation.x = default_axis.x;
		object3d.rotation.y = default_axis.y;
		object3d.rotation.z = default_axis.z;

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
			v(data.x(data.min.x), data.y(data.min.y), data.z(data.min.z))
			);

		var border_material = new THREE.LineBasicMaterial({
			color : 0x515151, lineWidth : 1
		});

		var border = new THREE.Line(border_geometry, border_material);
		border.type = THREE.Lines;

		object3d.add(border);

		for (var i = 0, len = data.data.sample_list.length; i < len; i ++) {
			var posX = data.x(Number(data.data.sample_list[i].PC1));
			var posY = data.y(Number(data.data.sample_list[i].PC2));
			var posZ = data.z(Number(data.data.sample_list[i].PC3));

			var figure = data.figure(data.data.sample_list[i].TYPE);

			d3.select(figure).datum({
				sample : data.data.sample_list[i].SAMPLE,
				type : data.data.sample_list[i].TYPE,
				pc1 : Number(data.data.sample_list[i].PC1),
				pc2 : Number(data.data.sample_list[i].PC2),
				pc3 : Number(data.data.sample_list[i].PC3)
			});

			figure.position.set(posX, posY, posZ);

			event_targets.push(figure);
			object3d.add( figure );
		}

		var label_x = data.text("PC1(X-axis)");
		label_x.position.x = (data.square.x.end - data.square.x.start) / 2;
		label_x.position.y = (data.square.y.start - (size.margin.top + size.margin.bottom));
		label_x.position.z = (data.square.z.start);

		object3d.add(label_x);

		var label_y = data.text("PC2(Y-axis)");
		label_y.position.x = (data.square.x.start - (size.margin.left + size.margin.right));
		label_y.position.y = (data.square.y.end - data.square.y.start) / 2;
		label_y.position.z = (data.square.z.start);

		object3d.add(label_y);

		var label_z = data.text("PC3(Z-axis)");
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

		var stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		data.div.appendChild( stats.domElement );

		var e = _event(renderer, camera, scene, object3d, raycaster, ray_mouse, event_targets, stats, data) || null;
		window.onmousedown = e.win_m_down;
		window.onmouseup = e.win_m_up;
		window.onmousemove = e.win_m_move;

		$("#pcaplot_view_3d canvas").on("mousemove", e.ray_mouse_move)

		renderer.render(scene, camera);

		e.ray_render();
		e.animate();
	}

	return {
		view : view
	}
});