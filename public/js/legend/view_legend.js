define("legend/view_legend", ["utils", "size"], function(_utils, _size)    {
    var view = function(_data)  {
        var data = _data || {};
        var size = data.size;

        var svg = d3.select("#" + data.id)
        .append("svg")
        .attr("class", data.id)
        .attr("width", size.width)
        .attr("height", size.height)
        .append("g")
        .attr("transform", "translate(0, 0)");

        var legendGroup = svg.selectAll(".legendGroup")
        .data(data.data.type_list)
        .enter().append("g")
        .attr("class", "legendGroup")
        .attr("transform", function(_d) {
            return "translate(" + size.margin.left + ", " + size.margin.top + ")";
        });

        var rect = legendGroup.append("rect")
        .attr("x", function(_d) { return data.location(_d).rx; })
        .attr("y", function(_d) { return data.location(_d).ry; })
        .attr("width", size.rect_size)
        .attr("height", size.rect_size)
        .style("fill", function(_d) { return _utils.colour(_d);});

        var text = legendGroup.append("text")
        .attr("x", function(_d) { return data.location(_d).tx; })
        .attr("y", function(_d) { return data.location(_d).ty; })
        .text(function(_d) { return _d; });
    }

    return {
        view : view
    }
});