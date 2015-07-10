define("utils", [], function()  {

    var DataVo = (function() {
        var comutation = {};
        var needleplot = {};
        var xyplot = {};

        return {
            setComutation : function(_sample_list, _gene_list, _mutation_list)  {
                comutation = {
                    sample_list : _sample_list,
                    gene_list : _gene_list,
                    mutation_list : _mutation_list
                }
            },
            setNeedle : function(_data) {
                needleplot = {
                    data : _data
                };
            },
            getComutation : function()  { return comutation; },
            getNeedle : function() { return needleplot; }
        }
    }());

    return {
        DataVo : DataVo,

        /**
         * [함수의 실행 시간을 구하기 위한 함수]
         * @return {[String]} [밀리초]
         */
         getRuntime : function() {
            var date = new Date();
            var runtime = date.getTime();

            return runtime;
        },

        worker : function() {
            var winWorker = window.Worker;

            if(!winWorker)  {
                winWorker = undefined;
            }

            else {
                winWorker = new Worker("worker/worker.js");
            }

            return winWorker;
        },

        ordinalScale : function(domain, range_start, range_end) {
            return d3.scale.ordinal()
            .domain(domain)
            .rangeBands([range_start, range_end]);
        },

        linearScale : function(domain_start, domain_end, range_start, range_end) {
            return d3.scale.linear()
            .domain([domain_start, domain_end])
            .range([range_start, range_end]);
        },

        /**
         * [Json 객체 안에 Array 값을 반환하는 함수]
         * @param  {[Object]} _json [Json 객체]
         * @return {[Array]}       [Array 객체]
         */
         get_array_in_json : function(_json)   {
            var result = [];

            $.each(Object.keys(_json), function(_i, _d) {
                if(_json[_d].constructor === Array) {
                    result.push(_json[_d]);
                }
            });

            return result;
        },

        /**
         * [check_array_in_json description]
         * @param  {[type]} _json [description]
         * @return {[type]}       [description]
         */
         check_array_in_json  : function(_json)  {
            var result = false;

            $.each(Object.keys(_json), function(_i, _d) {
                if(_json[_d].constructor === Array) {
                    result = true;
                }
            });

            return result;
        },
        /**
         * [search_in_jsonarray description]
         * @param  {[type]} _value     [description]
         * @param  {[type]} _key       [description]
         * @param  {[type]} _jsonarray [description]
         * @return {[type]}            [description]
         */
         search_in_jsonarray : function(_value, _key, _jsonarray)    {
            var result;

            $.each(_jsonarray, function(_i, _d) {
                if(_d[_key] === _value) {
                    result = _d;
                }
            });

            return result;
        },
        /**
         * [get_json_in_array description]
         * @param  {[type]} _name  [description]
         * @param  {[type]} _array [description]
         * @param  {[type]} _key   [description]
         * @return {[type]}        [description]
         */
         get_json_in_array : function(_name, _array, _key)  {
            for(var _i in _array)   {
                if(_name === _array[_i][_key]) { return _array[_i]; }
            }

            return undefined;
        },
        get_json_array_in_array : function(_name, _array, _key) {
            var result = [];

            for(var _i in _array)   {
                if(_name === _array[_i][_key]) { result.push(_array[_i]); }
            }

            return result;
        },
        /**
         * [remove_svg description]
         * @return {[type]} [description]
         */
         remove_svg : function() {

            if(arguments.length < 1)    {
                return;
            }
            else if(!d3.selectAll("svg") || d3.selectAll("svg").length < 1)  {
                return;
            }

            for(var i = 0, len = arguments.length ; i < len ; i++)  {
                d3.selectAll("." + arguments[i]).remove();
            }
        },

        /**
         * [define_mutation_name description]
         * @param  {[type]} _name [description]
         * @return {[type]}       [description]
         */
         define_mutation_name : function(_name)  {
            if((/MISSENSE/i).test(_name)) { return "Missense"; }
            else if((/NONSENSE/i).test(_name)) { return "Nonsense"; }
            else if((/(SPLICE_SITE)|(SPLICE_SITE_SNP)/i).test(_name)) { return "Splice_Site"; }
            else if((/(SYNONYMOUS)|(SILENT)/i).test(_name)) { return "Synonymous"; }
            else if((/(FRAME_SHIFT_INS)|(FRAME_SHIFT_DEL)/i).test(_name)) { return "Frame_shift_indel"; }
            else if((/(IN_FRAME_INS)|(IN_FRAME_DEL)/i).test(_name)) { return "In_frame_indel"; }
        },
        /**
         * [colour description]
         * @param  {[type]} _value [description]
         * @return {[type]}        [description]
         */
         colour : function(_value)   {
            var value = _value || "";

            return {
                "Missense" : "#3E87C2",
                "Nonsense" : "#EA3B29",
                "In_frame_indel" : "#F2EE7E",
                "Frame_shift_indel" : "#F68D3B",
                "Splice_Site" : "#583D5F",
                "Synonymous" : "#5CB755",
                "Othre" : "#B5612E",
                "pq" : "#C2C4C9",
                "Primary Solid Tumor" : "#F64747",
                "Solid Tissue Normal" : "#446CB3",
                "si_log_p" : "#466627",
                "si_up_log_p" : "#6C1C1D",
                "si_down_log_p" : "#42536A"
            }[value];
        },
        tooltip : function(_event, _contents, _x, _y)   {
            var div = $('.tooltip');
            var e = _event || null, contents = _contents || "", x = _x || 0, y = _y || 0;

            if(arguments.length < 1) {
                div.empty();
                div.hide();
            }
            else   {
                div.css("position", "absolute");
                div.css("top", y);
                div.css("left", x);
                div.css("font-size", 14)
                div.css("font-weight", "bold")
                div.css("opacity", 0.7);
                div.append(contents);
                div.show();
            }
        },
        log : function(_value)    {
            var value = _value || 0;

            return Math.log(value) / (Math.LN10 * -1);
        }
    };
})
