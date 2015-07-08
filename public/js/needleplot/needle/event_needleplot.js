define("needleplot/event_needleplot", ["utils", "size"], function(_utils, _size)    {
    var get_mouseover = function(_d)   {
        $(this)[0].parentNode.parentNode.parentNode.appendChild($(this)[0].parentNode.parentNode)

        d3.select(this).transition().duration(100).style("stroke-width", 3);

        _utils.tooltip(d3.event
            , "<strong>type : <span style='color:red'>"
            + _d.type
            + "</span></br> value : <span style='color:red'>"
            + _d.count
            + "</span>"
            , d3.event.pageX, d3.event.pageY - 40);
    }

    var get_mouseout = function(_d)    {
        d3.select(this).transition().duration(100).style("stroke-width", 1);

        _utils.tooltip();
    }

    var show_front_circle = function()  {
        var svg_g = $(".needleplot_view_needleplot g");
        var paths = d3.selectAll(".marker_figures_path");

        paths.forEach(function(_d, _i) {
            _d.sort(function(_a, _b)    {
                var a = d3.select(_a).datum();
                var b = d3.select(_b).datum();

                var result = (a.count + a.y < a.count + b.y) ? 
                1 : -1;

                return result;
            });

            append_parent(_d);
        });
    }

    var append_parent = function(_childs)    {
        _childs.forEach(function(_d)    {
            _d.parentNode.parentNode.parentNode.appendChild(_d.parentNode.parentNode)
        });
    }

    return {
        m_over : get_mouseover,
        m_out : get_mouseout,
        front : show_front_circle
    }
})