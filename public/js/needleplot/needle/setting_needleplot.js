define("needleplot/setting_needleplot", ["utils", "size", "needleplot/view_needleplot", "legend/setting_legend", "needleplotnavigation/setting_needlenavigation"], function(_utils, _size, _view, _setting_legend, _setting_navigation)   {
    return function(_data)  {
        var data = _data || [];
        var size = _size.define_size("needleplot_view", 20, 20, 10, 10);
        size.graph_width = 20;

        var get_same_position_list = function(_sample_list)    {
            var sample_list = _sample_list || [];
            var result = [];

            sample_list.map(function(_d)    {
                if($.inArray(_d.position, result) < 0) {
                    result.push(_d.position);
                }
            });
            return result;
        }

        var get_yaxis_max = function() {
            var sample_list = get_same_position_list(data.data.sample_list);
            var plus_num = 1;
            var result = 0;

            sample_list.map(function(_d)    {
                (result > _utils.get_json_array_in_array(_d, data.data.sample_list, "position").length) 
                ? result = result : result = _utils.get_json_array_in_array(_d, data.data.sample_list, "position").length;
            });

            return result + plus_num;
        }

        var reform_needle_data = function()    {
            var samePosition = get_same_position_list(data.data.sample_list);
            var result = [];

            samePosition.map(function(_d)   {
                var subResult = [];
                _utils.get_json_array_in_array(_d, data.data.sample_list, "position").map(function(_e)   {
                    subResult = reform_needle_json(_e, subResult);
                });

                result.push({ position : _d, sample_list : subResult, });
            });

            return stacked_markers(result);
        }

        var reform_needle_json = function(_e, _result)   {
            var emptyJson = new Object();
            var result = _result || [];
            var alreadyTypeData = _utils.get_json_in_array(_e.type, result, "type");

            if(!alreadyTypeData) {
                result.push({ id : [_e.id], type : _e.type, aachange : [_e.aachange], count : 1 });
            }
            else {
                alreadyTypeData.count += 1;
                alreadyTypeData.id.push(_e.id);
                alreadyTypeData.aachange.push(_e.aachange);
            }

            return result;
        }

        var stacked_markers = function(_array)  {
            var array = _array || [];

            array.forEach(function(_d, _i)  {
                _d.sample_list.forEach(function(_e, _j) {
                    if(_j ===0) { _e.y = 0; }
                    else {  _e.y = _d.sample_list[_j - 1].count - _d.sample_list[_j - 1].y;  }
                });
            });

            return array;
        }

        var get_mutation_name = function() {
            var result = [];

            data.data.sample_list.forEach(function(_d)   {
                if($.inArray(_utils.define_mutation_name(_d.type), result) < 0)  {
                    result.push(_utils.define_mutation_name(_d.type));
                }
            });

            return { type_list : result };
        } 

        var set_radius = function(_count) {
            var count = _count || 0;
            return Math.sqrt(count) * 5;
        } 

        var ymax = get_yaxis_max();
        var stacked = reform_needle_data();
        var mutations = get_mutation_name();

        var x = _utils.linearScale(0, data.data.graph[0].length,
            (size.margin.left * 2), size.rwidth).clamp(true);
        var y = _utils.linearScale(ymax, 0, size.margin.top,
         (size.rheight - size.graph_width)).clamp(true);

        _utils.remove_svg("needleplot_view_yaxis");
        _utils.remove_svg("needleplot_view");

        _setting_legend(mutations, "needleplot_legend");

        _view.view({
            data : data,
            stacked : stacked,
            size : size,
            x : x,
            y : y,
            ymax : ymax,
            radius : set_radius
        });

        _setting_navigation(data, stacked, ymax);
    }
});