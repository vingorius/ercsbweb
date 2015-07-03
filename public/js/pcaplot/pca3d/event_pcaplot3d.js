define("pcaplot3d/event_pcaplot3d", ["utils", "size"], function(_utils, _size)	{
	return function(_renderer, _camera, _scene, _object3d)	{
		var check_click = false;
		var ex = 0;
		var ey = 0;

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

		return {
			win_m_down : win_mousedown,
			win_m_up : win_mouseup,
			win_m_move : win_mousemove
		}
	}	
});