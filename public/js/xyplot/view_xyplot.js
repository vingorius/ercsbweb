var XY = "xyplot/";

define(XY + "view_xyplot", ["utils", "size", XY + "event_xyplot"], function(_utils, _size, _event)   {
    var view = function(_data)    {       
        var data = _data || [];
        var size = data.size;
        var e = _event || null;

        var svg = d3.select("#xyplot_view")
        .append("svg")
        .attr("class", "xyplot_view")
        .attr("width", size.width)
        .attr("height", size.height)
        .append("g")
        .attr("transform", "translate(0, 0)");

        var xAxis = d3.svg.axis()
        .scale(data.x)
        .orient("bottom")
        .ticks(5);

        var yAxis = d3.svg.axis()
        .scale(data.y)
        .orient("left")
        .ticks(5);

        svg.append("g")
        .attr("class", "xyplot_xaxis")
        .attr("transform", "translate(0, " + size.rheight + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "xyplot_yaxis")
        .attr("transform", "translate(" + (size.margin.left + size.margin.right) + ", 0)")
        .call(yAxis);

        svg.append("g")
        .append("line")
        .attr("class", "xyplot_fdrlevelline")
        .attr("x1", (size.margin.left + size.margin.right))
        .attr("y1", data.y(0.05))
        .attr("x2", size.rwidth)
        .attr("y2", data.y(0.05));

        svg.append("g")
        .append("text")
        .attr("class", "xyplot_fdrleveltext")
        .attr("x", size.rwidth - (size.margin.left * 4))
        .attr("y", data.y(1))
        .text("FDR Level = 0.05");

        var plot = svg.selectAll("circle")
        .data(data.data.data.plot_list)
        .enter().append("circle")
        .attr("class", "xyplot_circles")
        .on("mouseover", e.m_over)
        .on("mouseout", e.m_out)
        .transition().delay(function(_d, _i) { return _i * (1 / 3); })
        .attr("cx", function(_d) { return data.x(_d.x); })
        .attr("cy", function(_d) { return data.y(_d.y); })
        .attr("r", data.radius);

        var text = svg.selectAll("text")
        .data(data.data.data.plot_list)
        .enter().append("text")
        .attr("class", "xyplot_circles_text")
        .transition().delay(function(_d, _i) { return _i * (1 / 3); })
        .attr("x", function(_d) { return data.x(_d.x) + 5; })
        .attr("y", function(_d) { return data.y(_d.y); })
        .text(function(_d) { if(_d.y > 20) return _d.title; });
    }    

    return {
        view : view
    };
});