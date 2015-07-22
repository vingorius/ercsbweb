var _2D = "pcaplot/pca2d/";

define(_2D + "event_pcaplot2d", ["utils", "size"], function(_utils, _size)	{
	var pca_mouseover = function(_d)	{
		var e = d3.event;
		
		_utils.tooltip(e
			, "<strong>sample : <span style='color:red'>"
			+ _d.SAMPLE
			+ "</span></br> type : <span style='color:red'>"
			+ _d.TYPE
			+ "</span></br> pc1 : <span style='color:red'>"
			+ Number(_d.PC1).toFixed(5)
			+ "</span></br> pc2 : <span style='color:red'>"
			+ Number(_d.PC2).toFixed(5)
			+ "</span></br> pc3 : <span style='color:red'>"
			+ Number(_d.PC3).toFixed(5)
			+ "</span>"
			, e.pageX, e.pageY - 40);
	}

	var pca_mouseout = function(_d)	{
		var e = d3.event;

		_utils.tooltip();
	}

	return {
		m_over : pca_mouseover,
		m_out : pca_mouseout
	}
});