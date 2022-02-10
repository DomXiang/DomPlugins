/*
 * Author：Dom xiang
 * Contact：312922533@qq.com
 * Date：2019-03-29
 */
/*plugin list*/
$.fn.extend({

    /**
     * AJAX提交表单;
     */
    DomAjaxSubmit: function(callback) {
        let selector = this;
        let data = [];

        /**
         * 文本框;
         */
        let texts = $(selector).find('input[type="text"]').serializeArray();
        if (texts.length > 0) {
            texts.map(function(item, i) {
                data.push(item);
            });
        };


        /**
         * 复选框;
         * 将有相同name的CheckBox合并到一个数组中;
         */
        let checkboxs = $(selector).find('span.dp_checkbox input[type="hidden"][checked="checked"]').serializeArray();
        if (checkboxs.length > 0) {
            let checkboxobj = {};
            let valuearray = [];
            checkboxs.map(function(item, i) {
                checkboxobj.name = item.name;
                valuearray.push(item.value);
            });
            checkboxobj.value = valuearray;
            data.push(checkboxobj);
        };


        /**
         * 单选按钮;
         */
        let radios = $(selector).find('span.dp_radio input[type="hidden"][checked="checked"]').serializeArray();
        if (radios.length > 0) {
            radios.map(function(item, i) {
                data.push(item);
            });
        };


        /**
         * 下拉选择框;
         */
        let selects = $(selector).find('select').serializeArray();
        if (selects.length > 0) {
            selects.map(function(item, i) {
                data.push(item);
            });
        };

        /**
         * 文本域;
         */
        let textareas = $(selector).find('textarea').serializeArray();
        if (textareas.length > 0) {
            textareas.map(function(item, i) {
                data.push(item);
            });
        };

        /**
         * 提交参数;
         */
        let defaults = {
            "url": $(selector).attr('action'),
            "type": "post",
            "dataType": "json",
            "data": data,
        };
        if (defaults.url == undefined || defaults.url == '' || defaults.url == '#') {
            $.DomAlert('出错了！', 'acttion:' + $(selector).attr('action') + '有误！');
            return false;
        };
        $.ajax(defaults).done(function(response) {
            callback(response);
        }).fail(function(error) {
            console.log(error);
        });
    },

    /**
     * 折叠面板;
     * 用法：$(selector).DomCollapse(data,options);
     * @param {[type]} data    [数据]
     * @param {[type]} options [可设置风格，style:可选，accordion];
     */
    DomCollapse: function(options) {
        let selector = this;
        let defaults = {
            "data": undefined,
            "style": 'default',
        };
        $.extend(true, defaults, options);

        $(selector).addClass('dp_collapse');
        for (let i in defaults.data) {
            let dl = $('<dl></dl>');
            let icondown = $('<i class="right fa fa-angle-double-down"></i>');
            let dt = $('<dt>' + defaults.data[i][Object.keys(defaults.data[i])[0]] + '</dt>');
            let dd = $('<dd>' + defaults.data[i][Object.keys(defaults.data[i])[1]] + '</dd>');
            $(dt).append(icondown);
            $(dl).append(dt, dd);
            $(selector).append(dl);
        };

        /*展开|折叠*/
        if (defaults.style == 'accordion') {
            $(selector).find('dl:first-child dd').css("display", 'block');
            $(selector).find('dl:first-child dt i').removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
            $(selector).on("click", "dl dt i", function() {
                $(selector).find('dd').slideUp();
                $(selector).find('i').removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
                $(this).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
                $(this).parent('dt').siblings('dd').slideDown();
            });
        } else {
            $(selector).on("click", "dl dt i", function() {
                if ($(this).hasClass('fa-angle-double-down') == true) {
                    $(this).removeClass('fa-angle-double-down').addClass('fa-angle-double-up');
                } else {
                    $(this).removeClass('fa-angle-double-up').addClass('fa-angle-double-down');
                }
                $(this).parent('dt').siblings('dd').slideToggle();
            });
        };
    },

    /**
     * 绑定表单数据;
     * 用法：$(selector).DomSetForm(data);
     */
    DomSetForm: function(data) {
        let selector = this;
        let array = $(selector).serializeArray();
        let jsonvalue = function(field) {
            for (i in data) {
                return data[field];
            };
        };
        array.map(function(v, i) {
            let type = $('[name="' + v.name + '"]').prop("type");
            if (type == 'text' || type == 'number' || type == 'password') {
                $(selector).find('[name="' + array[i].name + '"]').val(jsonvalue(array[i].name));
            } else {
                switch (type) {
                    case 'textarea':
                        $(selector).find('[name="' + array[i].name + '"]').html(jsonvalue(array[i].name));
                        break;

                    case 'select-one':
                        $(selector).find('[name="' + array[i].name + '"]').find('option[value="' + jsonvalue(array[i].name) + '"]').attr('selected', true);
                        break;

                    case 'hidden':
                        let domclass = $(selector).find('[name="' + array[i].name + '"]').parent('span').attr('class');
                        if (domclass == 'dp_radio') {
                            $(selector).find('[name="' + array[i].name + '"][value="' + jsonvalue(array[i].name) + '"]').attr('checked', true);
                            $(selector).find('[name="' + array[i].name + '"][value="' + jsonvalue(array[i].name) + '"]').siblings('i').removeClass('fa-circle-o').addClass('fa-dot-circle-o');
                        };
                        if (domclass == 'dp_checkbox') {
                            var checkedlist = jsonvalue(array[i].name);
                            for (let n in checkedlist) {
                                $(selector).find('[name="' + array[i].name + '"][value="' + checkedlist[n] + '"]').attr('checked', true);
                                $(selector).find('[name="' + array[i].name + '"][value="' + checkedlist[n] + '"]').siblings('i').removeClass('fa-square-o').addClass('fa-check-square-o');
                            };
                        };
                        break;

                    default:
                        console.log('不能识别的表单控件类型:' + type);
                        break;
                };
            };
        });
    },

    /**
     * 绑定表单数据;
     * 用法：$(selector).DomSetForm(data);
     */
    DomSetForm: function(data) {
        let selector = this;
        let array = $(selector).serializeArray();
        let jsonvalue = function(field) {
            for (i in data) {
                return data[field];
            };
        };
        array.map(function(v, i) {
            let type = $('[name="' + v.name + '"]').prop("type");
            if (type == 'text' || type == 'number' || type == 'password') {
                $(selector).find('[name="' + array[i].name + '"]').val(jsonvalue(array[i].name));
            } else {
                switch (type) {
                    case 'textarea':
                        $(selector).find('[name="' + array[i].name + '"]').html(jsonvalue(array[i].name));
                        break;

                    case 'select-one':
                        $(selector).find('[name="' + array[i].name + '"]').find('option[value="' + jsonvalue(array[i].name) + '"]').attr('selected', true);
                        break;

                    case 'hidden':
                        let domclass = $(selector).find('[name="' + array[i].name + '"]').parent('span').attr('class');
                        if (domclass == 'dp_radio') {
                            $(selector).find('[name="' + array[i].name + '"][value="' + jsonvalue(array[i].name) + '"]').attr('checked', true);
                            $(selector).find('[name="' + array[i].name + '"][value="' + jsonvalue(array[i].name) + '"]').siblings('i').removeClass('fa-circle-o').addClass('fa-dot-circle-o');
                        };
                        if (domclass == 'dp_checkbox') {
                            var checkedlist = jsonvalue(array[i].name);
                            for (let n in checkedlist) {
                                $(selector).find('[name="' + array[i].name + '"][value="' + checkedlist[n] + '"]').attr('checked', true);
                                $(selector).find('[name="' + array[i].name + '"][value="' + checkedlist[n] + '"]').siblings('i').removeClass('fa-square-o').addClass('fa-check-square-o');
                            };
                        };
                        break;

                    default:
                        console.log('不能识别的表单控件类型:' + type);
                        break;
                };
            };
        });
    },

    /**
     * 动态表格;
     * 用法：$(selector).DomTable(options);
     */
    DomTable: function(options) {
        let selector = this;
        let defaults = {
            "data": {
                "source": undefined, //数据源;
                "columns": [], //显示的列,OBJ对像，格式为[{"feild":"字段名","name":"中文名","width":"td宽度"}];
            },
            "setting": {
                "checkbox": true, //是否需要复选框，默认开启;
                "total": true, //是否开启统计计数，默认开启;
                "ispages": true, //是否开启分页，默认开启;
                "pagesize": 5, //每页显示记录数;
                "toolbar": {
                    "search": true, //搜索框;
                    "export": true, //导出功能;
                    "print": true, //打印功能;
                    "diy": undefined //自定义按钮;
                },
                "endofbar": undefined, //是否自定义行末操作;
                "issn": true,
            }
        };
        $.extend(true, defaults, options);

        /*表格主体*/
        let table = $('<table class="dp_table"></table>');
        let thead = $('<thead><tr></tr></thead>');
        let tbody = $('<tbody></tbody>');

        /*全选*/
        let selectall = $('<td width="30"><span class="dp_checkbox"><i class="fa fa-square-o"></i></span></td>');
        $(selectall).on("click", function() {
            if ($(selectall).find('i').hasClass('fa-check-square-o') == true) {
                $(selector).find('tbody td span.dp_checkbox i').removeClass('fa-check-square-o').addClass('fa-square-o');
                $(selector).find('tbody tr').removeAttr('class');
            } else {
                $(selector).find('tbody td span.dp_checkbox i').removeClass('fa-square-o').addClass('fa-check-square-o');
                $(selector).find('tbody tr').addClass('active');
            };
        });

        /*单选*/
        let check_box = $('<td width="30"><span class="dp_checkbox"><i class="fa fa-square-o"></i></span></td>');

        /*工具栏*/
        let toolbar = $('<div class="dp_toolbar"></div>');
        let toolbar_btn = $('<div class="dp_toolbar_btn"></div>');

        /*导出按钮*/
        let exportbtn = $('<button class="dp_button"><i class="fa fa-download"></i><em>导出Excel</em></button>');
        $(exportbtn).on('click', function() {
            let export_table = $(selector).find('table.dp_table').html();
            if ($.DomIEversion() == -1) {
                $.DomExportNotIE(export_table);
            } else {
                $.DomExportForIE(export_table);
            };
        });
        /*打印按钮*/
        let printbtn = $('<button class="dp_button"><i class="fa fa-print"></i><em>打印</em></button>');
        /*搜索框*/
        let searchbar = $(
            '<div class="dp_toolbar_search">' +
            '<input type="text" value="" placeholder="请输入查询关键字">' +
            '<button class="dp_button active"><i class="fa fa-search"></i><em>查询</em></button>' +
            '</div>'
        );
        /*组合构建工具栏*/
        if (defaults.setting.toolbar.diy !== undefined) {
            $(toolbar_btn).append(defaults.setting.toolbar.diy);
        };
        if (defaults.setting.toolbar.export) {
            $(toolbar_btn).append(exportbtn);
        };
        if (defaults.setting.toolbar.print) {
            $(toolbar_btn).append(printbtn);
        };
        if (defaults.setting.toolbar.search) {
            $(toolbar).append(searchbar);
        };
        $(toolbar).append(toolbar_btn);
        $(selector).append(toolbar);

        /**
         * 是否有表头数据;
         * 构造表表头
         */
        if (defaults.data.columns == undefined) {
            $.DomAlert('出错了！', '请设置表头参数！');
            return false;
        } else {
            for (i in defaults.data.columns) {
                let head_td = $('<td width="' + defaults.data.columns[i].width + '">' + defaults.data.columns[i].name + '</td>');
                $(thead).find('tr').append(head_td);
            };
        };

        /*是否添加序号列*/
        if (defaults.setting.issn == true) {
            $(thead).find('tr').prepend('<td width="40">序号</td>');
        };

        /*是否添加单选按钮*/
        if (defaults.setting.checkbox == true) {
            $(thead).find('tr').prepend(selectall);
        };

        /*是否添加行末操作*/
        if (defaults.setting.endofbar !== undefined) {
            $(thead).find('tr').append('<td width="60"></td>');
        };

        /*设置表格行数据*/
        let settbody = function(begin, end) {
            $(tbody).empty();
            let getval = function(i, field) {
                let v;
                $.each(defaults.data.source[i], function(index, value) {
                    v = defaults.data.source[i][field];
                });
                return v;
            };
            for (let i = begin; i < end; i++) {
                let tr = $('<tr></tr>');
                if (defaults.setting.issn == true) {
                    let order = $('<td data-name="sn">' + (i + 1) + '</td>');
                    $(tr).append(order);
                };
                $.each(defaults.data.columns, function(n, m) {
                    let td = $('<td data-name="' + defaults.data.columns[n].field + '">' + getval(i, defaults.data.columns[n].field) + '</td>');
                    $(tr).append(td);
                });

                /*在TR上设置行行数据，为JSON字符串格式*/
                let collection = {};
                defaults.data.columns.map(function(item, index) {
                    collection[item.field] = getval(i, item.field);
                });
                $(tr).attr({
                    "data-collection": JSON.stringify(collection),
                });
                $(tbody).append(tr);
            };

            if (defaults.setting.checkbox == true) {
                let checked_data = []; /*选中行数据*/
                $(tbody).find('tr').prepend(check_box);
                $(selector).on('click', 'tbody tr td span.dp_checkbox', function() {
                    if ($(this).find('i').hasClass('fa-check-square-o') == true) {
                        $(this).parents('tr').removeAttr('class');
                    } else {
                        $(this).parents('tr').addClass('active');
                    };
                });
            } else {
                $(selector).on('click', 'table tbody tr td', function() {
                    $(selector).find('tr').removeAttr('class');
                    $(this).parent('tr').addClass('active');
                });
            };
            if (defaults.setting.endofbar !== undefined) {
                $(tbody).find('tr').append('<td class="dp_options">' + defaults.setting.endofbar + '</td>');
            };
        };
        $(table).append(thead, tbody);
        $(selector).append(table);

        /*计算分页*/
        if (defaults.setting.ispages == true) {
            defaults.setting.pagesize >= defaults.data.source.length ? page_num = 1 : page_num = Math.ceil(defaults.data.source.length / defaults.setting.pagesize);
            let pagebox = $('<div class="dp_page_box"></div>');
            let pages = $('<div class="left dp_table_pages"></div>');
            let countinfo = $('<div class="left dp_count_info">共&nbsp;' + defaults.data.source.length + '&nbsp;条记录，每页&nbsp;' + defaults.setting.pagesize + '&nbsp;条记录，共&nbsp;' + page_num + '&nbsp;页。</div>');
            let first = $('<span class="first">首页</span>'); /*首页*/
            let prev = $('<span>上一页</span>'); /*上一页*/
            let next = $('<span>下一页</span>'); /*下一页*/
            let last = $('<span class="last">末页</span>'); /*末页*/
            pagebox.append(countinfo);
            $(pagebox).find('span:first-child').addClass('active');
            $(selector).append(pagebox);
            if (page_num == 1) {
                settbody(0, defaults.data.source.length);
                return false;
            };
            settbody(0, defaults.setting.pagesize);
            let page = '';
            for (let i = 1; i <= page_num; i++) {
                page += '<span class="page">' + i + '</span>';
            };
            pages.append(first, prev, page, next, last);
            pagebox.prepend(pages);
            $(pagebox).find('span:nth-child(3)').addClass('active');
            $(first).on('click', function() {
                let activepage = parseInt($(pagebox).find('span.active').text());
                if (activepage == 1) {
                    $.DomAlert('啊哦，出错了！', '已经是第一页了！');
                    return false;
                };
                settbody(0, defaults.setting.pagesize);
                $(pagebox).find('span').removeClass('active');
                $(pagebox).find('span:nth-child(3)').addClass('active');
            });
            $(prev).on('click', function() {
                let activepage = parseInt($(pagebox).find('span.active').text());
                if (activepage == 1) {
                    $.DomAlert('啊哦，出错了！', '已经没有上一页了！');
                    return false;
                };
                let begin = (activepage - 1 - 1) * defaults.setting.pagesize;
                settbody(begin, begin + defaults.setting.pagesize);
                $(pagebox).find('span.active').removeClass('active').prev().addClass('active');
            });
            $(next).on('click', function() {
                let activepage = parseInt($(pagebox).find('span.active').text());
                if (activepage == page_num) {
                    $.DomAlert('啊哦，出错了！', '已经没有下一页了！');
                    return false;
                };
                let begin = (activepage) * defaults.setting.pagesize;
                begin + defaults.setting.pagesize >= defaults.data.source.length ? end = defaults.data.source.length : end = begin + defaults.setting.pagesize;
                settbody(begin, end);
                $(pagebox).find('span.active').removeClass('active').next().addClass('active');
            });
            $(last).on('click', function() {
                let activepage = parseInt($(pagebox).find('span.active').text());
                if (activepage == page_num) {
                    $.DomAlert('啊哦，出错了！', '已经是最末页了！');
                    return false;
                };
                let begin = (page_num - 1) * defaults.setting.pagesize;
                settbody(begin, defaults.data.source.length);
                $(pagebox).find('span.active').removeClass('active');
                $(pagebox).find('span.last').prev().prev().addClass('active');
            });
            $(pagebox).find('span.page').on('click', function() {
                let num = parseInt($(this).text());
                let begin = (num - 1) * defaults.setting.pagesize;
                $(pagebox).find('span').removeClass('active');
                $(this).addClass('active');
                begin + defaults.setting.pagesize >= defaults.data.source.length ? end = defaults.data.source.length : end = begin + defaults.setting.pagesize;
                settbody(begin, end);
            });
        };
    },

    /**
     * TAB选项卡;
     */
    DomTabs: function(data) {
        let selector = this;
        $(selector).addClass('dp_tabs');
        let tabs = $('<div class="dp_tabs_t"><ul></ul></div>');
        let items = $('<div class="dp_tabs_c"></div>');
        data.map(function(item, i) {
            let tab = $('<li>' + item.tab + '</li>');
            let tabitem = $('<div class="dp_tabs_item">' + item.item + '</div>');
            $(tabs).find('ul').append(tab);
            $(items).append(tabitem);
            $(tab).on('click', function() {
                $(selector).find('div.dp_tabs_t ul li').removeClass('active');
                $(tab).addClass('active');
                $(selector).find('div.dp_tabs_item').removeClass('active');
                $(tabitem).addClass('active');
            });
        });
        $(selector).append(tabs, items);
        $(selector).find('li:first-child').addClass('active');
        $(selector).find('div.dp_tabs_item:first-child').addClass('active');
    },

    /**
     * 选择穿梭
     * @param {[type]} options [description]
     */
    DomThrough: function(options) {
        const selector = this;
        const defaults = {
            "data": undefined,
            "keys": ['key', 'value']
        };
        $.extend(defaults, options);
        if (defaults.data == undefined) {
            $.DomAlert('出错了！', '未设置数据。');
            return false;
        };

        $(selector).addClass('dp_through');
        let list = $('<ul data-list="list"></ul>');
        let select = $('<ul data-select="select"></ul>');
        let throughbtn = $('<div class="dp_throughbtn"></div>');
        let to_right = $('<i class="fa fa-chevron-right"></i>');
        let to_left = $('<i class="fa fa-chevron-left"></i>');
        $(to_right).on('click', function() {
            $(select).append($(selector).find('li[class="selected"]'));
            $(select).find('li').removeAttr('class');
        });
        $(to_left).on('click', function() {
            $(list).append($(selector).find('li[class="selected"]'));
            $(list).find('li').removeAttr('class');
        });
        for (let i in defaults.data) {
            let option = $('<li data-value="' + defaults.data[i][defaults.keys[0]] + '">' + defaults.data[i][defaults.keys[1]] + '</li>');
            $(option).on('click', function() {
                $(this).toggleClass('selected');
            });
            $(list).append(option);
        };
        $(throughbtn).append(to_right, to_left);
        $(selector).empty().append(list, throughbtn, select);
    },

    /**
     * 时间轴;
     * 用法：$(selector).DomTL(options);
     * 参数说明： selector为容器;
     */
    DomTL: function(options) {
        const selector = this;
        const defaults = {
            "data": undefined,
            "max": 6,
            "dateformat": "yyyy年MM月dd日",
            "feilds": []
        };
        $.extend(defaults, options);
        if (defaults.feilds.length < 3) {
            $.DomAlert('出错了', '未定义内容字段！');
            return false;
        };
        let ul = $('<ul class="dp_timeline"></ul>');

        $.each(defaults.data, function(i, v) {
            let li = $(
                '<li id="' + defaults.data[i][defaults.feilds[0]] + '">' +
                '<h4>' +
                '<i class="fa fa-clock-o"></i>' +
                '<span>' + $.DomDateFormat(defaults.data[i][defaults.feilds[1]], defaults.dateformat) + '</span>' +
                '</h4>' +
                '<div class="txt">' + defaults.data[i][defaults.feilds[2]] + '</div>' +
                '</li>'
            );
            $(ul).append(li);
        });
        $(selector).append(ul);
        if (defaults.data.length > defaults.max) {
            $(selector).find('ul li').slice(defaults.max, defaults.data.length).addClass('timeover');
        };
        $(selector).on("click", " ul li h4 span", function() {
            $(this).parent('h4').siblings('.txt').slideToggle();
        });
    },


    /**
     * JSON树 DomTree
     * 用法：$(selector).DomTree(option);
     * @param {[type]} options [description]
     * Author：Dom xiang
     * Contact：312922533@qq.com
     * Date：2018-08-02
     */
    DomTree: function(options) {
        const selector = this;
        const defaults = {
            "data": undefined,
            "keys": [], //[记录ID,名称,父级ID]
            "ischeck": false,
            "isedit": false,
            "isdiy": undefined,
            "isbar": false,
        };
        $.extend(true, defaults, options);
        if (defaults.data == undefined) {
            $.DomAlert('啊哦，出错了！', '未设置JSON数据，不能生成DOM树！');
            return false;
        };
        if (defaults.keys.length == 0) {
            $.DomAlert('啊哦，出错了！', '为设置上下级关联主键！');
            return false;
        };
        let tree = '';
        let createTree = function(id, array) {
            let childArray = [];
            for (let i in array) {
                if (array[i][defaults.keys[2]] == id) {
                    childArray.push(array[i]);
                };
            };
            if (childArray.length > 0) {
                tree += '<ul class="dp_tree">';
                defaults.ischeck == true ? check_box = '<i class="fa fa-square-o"></i>' : check_box = '';
                for (let i in childArray) {
                    childArray[i].icon == undefined ? icon = 'fa-list-alt"' : icon = childArray[i].icon;
                    tree += '<li>' + check_box + '<span id="' + childArray[i][defaults.keys[0]] + '"><em class="fa ' + icon + '"></em>' + childArray[i][defaults.keys[1]] + '</span>';
                    if (defaults.isedit == true) {
                        tree += '<label>' + defaults.isdiy + '</label>';
                    };
                    createTree(childArray[i][defaults.keys[0]], array);
                    tree += '</li>';
                };
                tree += '</ul>';
            };
            return tree;
        };
        let objtree = $(createTree(0, defaults.data));
        $(selector).append(objtree);
        $(objtree).on('click', 'li span', function() {
            $(selector).find('span').removeAttr('class');
            $(this).addClass('active');
            $(this).siblings('ul').toggle('slow');
        });
        $(objtree).find('span,label').on('mouseover', function() {
            $(this).parent('li').addClass('active');
        });
        $(objtree).find('span,label').on('mouseout', function() {
            $(this).parent('li').removeAttr('class');
        });
        let select_array = [];
        $(objtree).on('click', 'li i.fa', function() {
            $(this).toggleClass('fa-square-o fa-check-square-o');
            let id = $(this).siblings('span').attr('id');
            if ($(this).hasClass('fa-square-o') == true) {
                select_array.pop(id);
            } else {
                select_array.push(id);
            };
        });
        if (defaults.isbar == true) {
            let submitbox = $('<p class="dp_submitbox"></p>');
            let submitbtn = $('<button class="dp_button submit active"><i class="fa fa-check-circle"></i><em>提交</em></button>');
            let resetbtn = $('<button class="dp_button" type="reset"><i class="fa fa-refresh"></i><em>重填</em></button>');
            $(submitbox).append(resetbtn, submitbtn);
            $(selector).append(submitbox);
        };
    },
});

/*extend list*/
$.extend({

    test: function() {
        console.log('$.extend is ready!!!');
    },

    /**
     * [DomToLatlng 度分秒转Latlng]
     * @param {[string]} val [要转换的字符]
     */
    DomToLatlng: function(val) {
        let f = parseFloat(val.minute) + parseFloat(val.second / 60);
        let latlng = parseFloat(f / 60) + parseFloat(val.degree);
        return latlng;
    },


    /**
     * [DomToDFM Latlng TO 度分秒]
     * @param {[string]} val [要转换的字符]
     */
    DomToDFM: function(val) {
        var str1 = val.split(".");
        var degree = str1[0];
        var tp = "0." + str1[1]
        var tp = String(tp * 60);
        var str2 = tp.split(".");
        var minute = str2[0];
        tp = "0." + str2[1];
        tp = tp * 60;
        var second = tp;
        var data = degree + "°" + minute + "'" + second + "\"";
        return data;
    },

    /*是否为email*/
    isEmail: function(val) {
        var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*length 长度*/
    isLen: function(val, len) {
        if (val.length < len) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为中文汉字*/
    isCN: function(val) {
        var reg = /^[\u4E00-\u9FA5]/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为英文*/
    isEN: function(val) {
        var reg = /^[A-Za-z]+$/;;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为数字*/
    isNumber: function(val) {
        var reg = /^[0-9]+$/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否为手机号*/
    isMobile: function(val) {
        var reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        if (reg.test(val)) {
            return true;
        } else {
            return false;
        };
    },

    /*是否存在于数组中*/
    isinArray: function(val, array) {
        var n = array.indexOf(val);
        if (n > -1) {
            return true;
        } else {
            return false;
        };

        /*for (var i in array) {
            if (array[i] == val) {
                return true;
            } else {
                return false;
            };
        };*/
    },



    /**
     * 取得DomTree的check的ID;
     * 输出为：array;
     */
    GetDomTreeCheck: function(selector) {
        var array = [];
        var num = $(selector + ' ul li').find('i.fa-check-square-o').length;
        for (i = 0; i < num; i++) {
            var id = $(selector + ' ul li').find('i.fa-check-square-o:eq(' + i + ')').siblings('span').attr('id');
            array.push(id);
        };
        return array;
    },


    /*取得IE版本;*/
    DomIEversion: function() {
        var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; // 判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; // 判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if (fIEVersion == 7) {
                return 7;
            } else if (fIEVersion == 8) {
                return 8;
            } else if (fIEVersion == 9) {
                return 9;
            } else if (fIEVersion == 10) {
                return 10;
            } else {
                return 6; // IE版本<=7
            }
        } else if (isEdge) {
            return 'edge'; // edge
        } else if (isIE11) {
            return 11; // IE11
        } else {
            return -1; // 不是ie浏览器
        }
    },


    /**
     * IE浏览器导出EXCEL;
     */
    DomExportForIE: function(table) {
        var idTmr;
        var oXL = new ActiveXObject("Excel.Application"); // 创建AX对象excel;
        var oWB = oXL.Workbooks.Add(); // 获取workbook对象 ;
        var xlsheet = oWB.Worksheets(1); // 激活当前sheet;
        var sel = document.body.createTextRange();
        sel.moveToElementText(table); // 把表格中的内容移到TextRange中;
        sel.select; // 全选TextRange中内容;
        sel.execCommand("Copy"); // 复制TextRange中内容;
        xlsheet.Paste(); // 粘贴到活动的EXCEL中;
        oXL.Visible = true; // 设置excel可见属性;
        try {
            var fname = oXL.Application.GetSaveAsFilename("Excel.xls", "Excel Spreadsheets (*.xls), *.xls");
        } catch (e) {
            print("Nested catch caught " + e);
        } finally {
            oWB.SaveAs(fname);
            oWB.Close(savechanges = false);
            oXL.Quit();
            oXL = null;
            idTmr = window.setInterval(window.clearInterval(idTmr), 1);
        };
    },



    /**
     * 其它浏览器导出EXCEL;
     */
    DomExportNotIE: function(table) {
        var uri = 'data:application/vnd.ms-excel;base64,';
        var template = '<html><head><meta charset="UTF-8"></head><body><table border="1">{table}</table></body></html>';
        var base64 = function(s) {
            return window.btoa(unescape(encodeURIComponent(s)));
        };
        var format = function(s, c) {
            return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; });
        };
        var ctx = {
            worksheet: name || 'Worksheet',
            table: table
        };
        window.location.href = uri + base64(format(template, ctx));
    },



    /**
     * ajax封装;
     * 用法：$.DomAjax(options);
     * url 发送请求的地址;
     * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(),"state": 1};
     * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text;
     * success 成功回调函数;
     */
    DomAjax: function(options) {
        let defaults = {
            "url": undefined,
            "type": "get",
            "data": {
                "fresh": new Date().getTime(),
            },
            "issuccess": function(response) {
                console.log(response);
            },
            "iserror": function(error) {
                console.log(error);
            }
        };
        $.extend(true, defaults, options);
        if (defaults.url == undefined) {
            $.DomAlert('出错了！', '未定义URL！请定义正确URL后重试！');
            return false;
        };
        $.ajax({
            url: defaults.url,
            type: defaults.type,
            data: defaults.data,
        }).done(function(response) {
            defaults.issuccess(response);
        }).fail(function(error) {
            defaults.iserror(error);
        });
    },

    /**
     * 添加遮罩层;
     */
    DomMask: function() {
        let mask = $('<div class="dp_mask"></div>');
        if ($('body').find('.dp_mask').length <= 0) {
            $('body').append(mask);
        };
    },

    /**
     * 移除遮罩层;
     */
    DomRemoverMask: function() {
        $('body').find('.dp_mask').remove();
    },

    /**
     * 加载中;
     */
    DomLoading: function() {
        let loading = $('<div class="dp_loading"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></div>');
        if ($('body').find('.dp_loading').length <= 0) {
            $.DomMask();
            $('body').append(loading);
        }
    },

    /**
     * 移除加载中;
     */
    DomRemoverLoading: function() {
        $('body').find('.dp_loading').remove();
        $.DomRemoverMask();
    },

    /**
     * 创建并加载alert对话框;
     * 用法：$.DomAlert(tips,content);
     * 参数说明：title 标题栏文字，info内容文字;
     */
    DomAlert: function(tips, content) {
        /*添加遮罩;*/
        $.DomMask();
        let alert = $('<div class="dp_alert"></div>');
        let alert_t = $('<h4><i class="fa fa-exclamation-circle"></i>' + tips + '</h4>');
        let alert_p = $('<p>' + content + '</p>');
        let alert_b = $('<h2></h2>');
        let btn_close = $('<button class="dp_button close active"><i class="fa fa-check-circle"></i><em>确定</em></button>');
        $(alert_b).append(btn_close);
        $(alert).append(alert_t, alert_p, alert_b);
        $('body').append(alert);

        /*绑定点击关闭事件*/
        $(btn_close).on("click", function() {
            $.DomRemoverMask();
            $(alert).remove();
        });
    },



    /**
     * [Dragtable 拖动表格];
     * @param {[type]} id [DIV的ID];
     */
    DomDragPanel: function(id) {
        let $ = function(flag) {
            return document.getElementById(flag);
        }
        $(id).onmousedown = function(e) {
            let d = document;
            let that = this;
            let page = {
                event: function(evt) {
                    let ev = evt || window.event;
                    return ev;
                },
                pageX: function(evt) {
                    let e = this.event(evt);
                    return e.pageX || (e.clientX + document.body.scrollLeft - document.body.clientLeft);
                },
                pageY: function(evt) {
                    let e = this.event(evt);
                    return e.pageY || (e.clientY + document.body.scrollTop - document.body.clientTop);

                },
                layerX: function(evt) {
                    let e = this.event(evt);
                    return e.layerX || e.offsetX;
                },
                layerY: function(evt) {
                    let e = this.event(evt);
                    return e.layerY || e.offsetY;
                }
            }
            let x = page.layerX(e);
            let y = page.layerY(e);
            if (that.setCapture) {
                that.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }
            d.onmousemove = function(e) {
                let tx = page.pageX(e) - x;
                let ty = page.pageY(e) - y;
                that.style.left = tx + "px";
                that.style.top = ty + "px";
            }
            d.onmouseup = function() {
                if (that.releaseCapture) {
                    that.releaseCapture();
                } else if (window.releaseEvents) {
                    window.releaseEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }
                d.onmousemove = null;
                d.onmouseup = null;
            }
        };
    },



    /**
     * 弹出框;
     * 用法：$.DomDialog(options);
     * 参数说明：默认大小为800x600;
     */
    DomDialog: function(options) {

        /*遮罩层*/
        $.DomMask();

        /*默认参数*/
        let defaults = {
            "title": "默认窗口",
            "content": "",
            "setting": {
                "isdrag": false,
                "isscroll": false
            },
        };

        /*合并参数*/
        $.extend(true, defaults, options);
        let selector = this.selector;

        /*构造dialog窗口*/
        let dialog = $('<div class="dp_dialog"></div>');
        let style = '';
        if ($.isEmptyObject(defaults.setting) == false) {
            if (defaults.setting.hasOwnProperty('width')) {
                style += 'width:' + defaults.setting.width + 'px;margin-left:-' + (defaults.setting.width / 2) + 'px;';
            };
            if (defaults.setting.hasOwnProperty('height')) {
                style += 'height:' + defaults.setting.height + 'px;margin-top:-' + (defaults.setting.height / 2) + 'px;';
            };
            $(dialog).attr("style", style);
        };

        /*标题栏*/
        let dialog_t = $('<div class="dp_dlg_t"></div>');
        let dialog_title = $('<span class="left title_text">' + defaults.title + '</span>');
        let dialog_window = $('<span class="right"></span>');
        let dialog_min = $('<i class="fa fa-minus"></i>');
        let dialog_max = $('<i class="fa fa-window-maximize"></i>');
        let dialog_close = $('<i class="fa fa-times"></i>');

        /*按钮组*/
        $(dialog_window).append(dialog_max, dialog_close);
        $(dialog_t).append(dialog_title, dialog_window);

        /*最大化-恢复*/
        $(dialog_max).on('click', function() {
            if (dialog.hasClass('max') == false) {
                $(this).removeClass('fa-window-maximize').addClass('fa-window-restore');
                $(dialog).addClass('max').removeAttr('style');
            } else {
                $(this).removeClass('fa-window-restore').addClass('fa-window-maximize');
                $(dialog).removeClass('max').attr("style", style);
            };
        });

        /*关闭*/
        $(dialog_close).on('click', function() {
            $(dialog).remove();
            $.DomRemoverMask();
        });

        /*内容部分是否开启滚动条*/
        let dialog_c = $('<div class="dp_dlg_c">' + defaults.content + '</div>');
        if (defaults.setting.isscroll == true) {
            $(dialog_c).addClass('scroll');
        };

        /*组合对话框*/
        let dlg = $(dialog).append(dialog_t, dialog_c);

        /*添加到DOM*/
        $('body').append(dlg);

        /*是否开启可拖动移动位置*/
        if (defaults.setting.isdrag == true) {
            $(dialog).on('mouseover', function() {
                this.style.cursor = 'move';
            });
            $(dialog).mousedown(function(e) {
                let isMove = true;
                $(dialog).css({
                    opacity: 0.5,
                });
                $(document).mousemove(function(e) {
                    document.body.onselectstart = function() { return false; }
                    if (isMove) {
                        $(dialog).css({ "left": e.pageX, "top": e.pageY });
                    }
                }).mouseup(function() {
                    isMove = false;
                    $(dialog).css({
                        opacity: 1,
                    });
                });
            });
        };
    },



    /**
     * 冒泡提醒; 
     * 用法：$.DomBubble(obj,options);
     */
    DomBubble: function(obj, options) {
        let defaults = {
            "color": undefined,
            "content": "默认气泡",
            "timeout": 2000
        };
        let bubble;
        $.extend(true, defaults, options);
        if (defaults.color !== undefined) {
            bubble = $(
                '<div class="dp_bubble">' +
                '<dl>' +
                '<dd style="background:' + defaults.color + '">' + defaults.content + '</dd>' +
                '<dt style="border-top: 5px solid ' + defaults.color + '"></dt>' +
                '</dl>' +
                '</div>'
            );
        } else {
            bubble = $('<div class="dp_bubble"><dl><dd>' + defaults.content + '</dd><dt></dt></dl></div>');
        };
        $(obj).prepend(bubble);
        setTimeout(function() {
            bubble.remove();
        }, defaults.timeout);
    },


    /**
     * 自定义日期格式化;
     * 用法：$.DomDateFormat(format);
     */
    DomDateFormat: function(date, format) {
        if (typeof(date) == 'string' || typeof(date) == 'number') {
            date = new Date(date);
        };
        let o = {
            "M+": date.getMonth() + 1, // 月份
            "d+": date.getDate(), // 日
            "h+": date.getHours(), // 小时
            "m+": date.getMinutes(), // 分
            "s+": date.getSeconds(), // 秒
            "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
            "S": date.getMilliseconds() // 毫秒
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        };
        return format;
    },


    /**
     * [DomLeadBack 选择带回]
     */
    DomLeadBack: function(id, pageurl, fileds) {
        $('body').off('click', '#leadbackbtn');
        let leadbacktable = $('<div class="dp_leadbacktable"></div>');
        let leadbackbar = $(
            '<div class="dp_submitbar">' +
            '<button id="leadbackbtn" class="dp_button">' +
            '<i class="fa fa-check-square-o"></i><em>选择带回</em>' +
            '</button>' +
            '</div>'
        );
        $.DomAjax({
            "url": pageurl,
            "issuccess": function(response) {
                $(leadbacktable).html(response);
                $.DomDialog({
                    "title": "选择带回",
                    "content": leadbacktable[0].outerHTML + leadbackbar[0].outerHTML,
                });
                if ($('body').find('.dp_leadbacktable').height() >= 460) {
                    $('body').find('.dp_leadbacktable').css({ "overflow-y": "scroll" });
                };
            },
        });

        /*带回操作*/
        $('body').on('click', '#leadbackbtn', function() {
            let dataCollection = [];
            let selectedArray = $('.dp_leadbacktable').find('table.dp_table tbody tr.active');
            for (let i = 0; i < selectedArray.length; i++) {
                dataCollection.push(JSON.parse(selectedArray[i].dataset.collection));
            };
            console.log(dataCollection, dataCollection.length);
            let inputvaule = '';
            dataCollection.map(function(item, i) {
                inputvaule += item[fileds] + ',';
            });
            $('#' + id).val(inputvaule);
            $(this).parents('.dp_dialog').remove();
            $.DomRemoverMask();
        });


    },
});

jQuery(document).ready(function() {
    /* 复选按钮组checkhox[选中|不选]*/
    $('body').on("click", "span.dp_checkbox", function() {
        if ($(this).children('i.fa').hasClass('fa-square-o') == true) {
            $(this).children('input').attr('checked', true);
            $(this).children('i.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
        } else {
            $(this).children('input').attr('checked', false);
            $(this).children('i.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
        };
    });

    /* 单选按钮组radio[选中|不选] */
    $("body").on("click", "span.dp_radio", function() {
        var name = $(this).children('input').attr('name');
        $('input[name="' + name + '"]').attr('checked', false).siblings('i.fa').removeClass('fa-dot-circle-o').addClass('fa-circle-o');
        $(this).children('input').attr('checked', true);
        $(this).children('i.fa').removeClass('fa-circle-o').addClass('fa-dot-circle-o');
    });
});