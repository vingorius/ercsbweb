var _3D = "pcaplot/pca3d/";

define(_3D + "event_pcaplot3d", ["utils", "size"], function(_utils, _size)	{
	return function(_renderer, _camera, _scene, _object3d, _raycaster, _ray_mouse, _event_targets, _stats, _data)	{
		var check_click = false;
		var ex = 0;
		var ey = 0;
		var raycaster = _raycaster;
		var ray_mouse = _ray_mouse, INTERSECTED;
		var entries = _event_targets;
		var size = _data.size;
		var tooltip_x = 0, tooltip_y = 0;

		var win_mousedown =  function(_event)	{ 
			check_click = true;
			ex = _event.clientX;
			ey = _event.clientY;
		}

		var win_mouseup = function(_event)	{ 
			check_click = false;
		}

		var win_mousemove = function(_event)	{
			var cx, cy;

			if(check_click)	{
				cx = _event.clientX - ex;
				cy = _event.clientY - ey;

				_object3d.rotation.y += cx * 0.01;
				_object3d.rotation.x += cy * 0.01;

				ex = (ex + cx);
				ey = (ey + cy);

				_renderer.render(_scene, _camera);
			}
		}

		var ray_mouse_move = function(_event)	{
			_event.preventDefault();

			ray_mouse.x = (_event.clientX / size.rwidth) * 2 - 1;
			ray_mouse.y = -(_event.offsetY / size.rheight) * 2 + 1;
			ray_mouse.z = 0.5;

			tooltip_x = _event.clientX;
			tooltip_y = _event.clientY;
		}

		var animate = function()	{
			requestAnimationFrame(animate);
			render_raycaster();
			_stats.update();
		}

		var render_raycaster = function()	{
			raycaster.setFromCamera(ray_mouse, _camera);
			var intersects = raycaster.intersectObjects(entries, false);

			if(intersects.length > 0)	{
				for(var i = 0, len = entries.length ; i < len ; i++)	{
					if(entries[i].uuid === intersects[0].object.uuid)	{
						var data = intersects[0].object.__data__;
						_utils.tooltip("ray_event", 
							"<strong>sample : <span style='color:red'>"
							+ data.sample
							+ "</span></br> type : <span style='color:red'>"
							+ data.type
							+ "</span></br> pc1 : <span style='color:red'>"
							+ Number(data.pc1).toFixed(5)
							+ "</span></br> pc2 : <span style='color:red'>"
							+ Number(data.pc2).toFixed(5)
							+ "</span></br> pc3 : <span style='color:red'>"
							+ Number(data.pc3).toFixed(5)
							+ "</span>"
							, tooltip_x, tooltip_y)
					}
				}
			}
			else { _utils.tooltip(); }
			_renderer.render(_scene, _camera);
		}

		return {
			win_m_down : win_mousedown,
			win_m_up : win_mouseup,
			win_m_move : win_mousemove,
			ray_mouse_move : ray_mouse_move,
			ray_render : render_raycaster,
			animate : animate
		}
	}	
});