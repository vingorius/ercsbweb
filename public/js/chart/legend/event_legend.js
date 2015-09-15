var LEGEND = "chart/legend/";

define(LEGEND + "event_legend", ["utils"], function(_utils)	{
	var mouseover = function(_d)	{
		// console.log("legend text mouseover ", _d);
	}

	var mouseout = function(_d)	{
		// console.log("legend text mouseout ", _d);
	}

	return {
		mouseover : mouseover,
		mouseout : mouseout
	}
})