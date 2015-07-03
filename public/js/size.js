define("size", [], function()   {
    /**
     * [DIV 태그를 만들어주는 함수]
     * @param  {[Object]} _order [속성 및 모양을 정의한 파라미터]
     * @return {[Object]}        [만들어진 DIV 태그를 반환]
     */
    var make_a_division = function(_order)    {
        var order = _order || {}, div;
        
        div = document.createElement("div");

        Object.keys(order).map(function(_d)  {

            if(_d === "attribute")  { 
                set_a_division_attr(div, order[_d]); 
            }
            else if(_d === "style") { 
                set_a_division_css(div, order[_d]); 
            }

        });

        return div;
    }

    /**
     * [DIV 태그의 속성을 설정해주는 함수]
     * @param {[Object]} _div   [DIV 태그]
     * @param {[Object]} _order [DIV 태그의 속성 목록]
     */
    var set_a_division_attr = function(_div, _order)    {
        var div = _div || null, order = _order || {};

        Object.keys(order).map(function(_d) {

            div.setAttribute(_d, order[_d]);

        });
    }

    /**
     * [DIV 태그의 모양을 설정해주는 함수]
     * @param {[Object]} _div   [DIV 태그]
     * @param {[Object]} _order [DIV 태그의 모양 목록]
     */
    var set_a_division_css = function(_div, _order)   {
        var div = _div || null, order = _order || {};

        Object.keys(order).map(function(_d) {

            div.style[_d] = order[_d];

        });
    }

    /**
     * [가장 바깥 쪽의 DIV 태그를 정의하고 반환하는 함수]
     * @return {[Object]} [DIV(MainArea) 태그]
     */
    var get_mainarea = function()   {
        var mainarea = $(".mainArea");

        mainarea
        .css("margin", 20)
        .css("padding", 20)
        .css("width", 1800)
        .css("height", 700);

        return mainarea;
    }

    /**
     * [부트스트랩에 쓰이는 'tab-content' 태그를 만들어주는 함수]
     * @return {[Object]} [DIV(tab-content) 태그]
     */
    var make_a_division_of_contents_region = function()    {

        return make_a_division({
            attribute : {
                "class" : "tab-content",
                "id" : "view_region"
            },
            style : {
                "padding" : 0,
                "margin" : "10px 0px",
                "width" : get_mainarea().width(),
                "height" : get_mainarea().height()
            }
        });
    }

    /**
     * [ToolTip DIV 태그를 생성하는 함수]
     * @return {[Object]} [DIV(Tooltip) 태그]
     */
    var make_a_division_of_tooltip = function() {

        return make_a_division({
            attribute : {
                "class" : "tooltip"
            }
        });
    }

    /**
     * [tab-panel 을 만들어주는 함수]
     * @param  {[Object]} _order [id, class, role 등이 포함된 객체]
     * @return {[Object]}        [DIV(tabpanel) 태그]
     */
    var make_a_division_of_tabpanel_region = function(_order)   {
        var order = _order || {};
        var json_of_tabpanel = {};

        Object.keys(order).map(function(_d) {

            json_of_tabpanel = make_a_division_of_tabpanel_region_json(json_of_tabpanel, _d, order);

        });

        return json_of_tabpanel;
    }

    /**
     * [요청한 사항을 DIV (tabpanel) 에 적용하는 함수]
     * @param  {[Object]} _json  [ID 별로 객체를 만들기 위한 객체 파라미터]
     * @param  {[String]} _d     [ID]
     * @param  {[Object]} _order [요청 목록]
     * @return {[Object]}        [DIV(tabpanel) 태그]
     */
    var make_a_division_of_tabpanel_region_json = function(_json, _d, _order)  {
        var d = _d || null, order = _order || null;
        var json_of_tabpanel = _json || new Object();

        json_of_tabpanel[d] = make_a_division({
            attribute : {
                "role" : "tabpanel",
                "class" : "tab-pane fade" + order[d],
                "id" : "container_" + d
            }
        });

        return json_of_tabpanel;
    }

    /**
     * ['row' 태그를 만드는 함수]
     * @return {[Object]} [DIV(row) 태그]
     */
    var make_a_division_of_row = function() {

        return make_a_division({
            attribute : {
                "class" : "row"
            }
        });
    }

    /**
     * [D3 차트를 그려줄 svg 영역 정의 함수]
     * @return {[Object]} [svg 영역이 정의된 객체]
     */
    var define_size = function()  {

        if(arguments.length < 1 || arguments.length !== 5)    {
            return undefined;
        }

        var width = get_original_size(arguments[0]).width;
        var height = get_original_size(arguments[0]).height;

        return {
            width : width,
            height : height,
            rwidth : width - arguments[3] - arguments[4],
            rheight : height - arguments[1] - arguments[2],
            margin : {
                top : arguments[1],
                bottom : arguments[2],
                left : arguments[3],
                right : arguments[4]
            }            
        }
    }

    /**
     * [get_original_size description]
     * @param  {[type]} _id [description]
     * @return {[type]}     [description]
     */
    var get_original_size = function(_id)   {

        return {
            width : $("#" + _id).width(),
            height : $("#" + _id).height()
        }
    }

    return {
        define_size : define_size,
        get_original_size : get_original_size
    };
});
