/////////////begin: httpPost///////////////////
function httpPost(url, jsonreq, func, sync) {  // 以post方式格式json格式数据
    sync = sync || false;
    var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
    //httpRequest.open('POST', 'http://39.96.2.239/Stock', sync); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */ false同步请求，true异步请求
    //httpRequest.open('POST', 'http://192.168.72.131/Stock', sync); //第二步：打开连接/***发送json格式文件必须设置请求头 ；如下 - */ false同步请求，true异步请求
    httpRequest.open('POST', 'http://192.168.72.139/Stock', sync);
    //httpRequest.setRequestHeader("Content-type", "application/json");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）var obj = { name: 'zhansgan', age: 18 };
    httpRequest.send(JSON.stringify(jsonreq));//发送请求 将json写入send中
    /**
     * 获取数据后的处理程序
     */
    if (true == sync) {
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var jsonStr = httpRequest.responseText;//获取到服务端返回的数据
                func(JSON.parse(jsonStr));
            }
        };
    }
    else {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
            var jsonStr = httpRequest.responseText;//获取到服务端返回的数据
            func(JSON.parse(jsonStr));
        }
    }
}
/*
function resDeal(json){
    console.log(json);
}

httpPost('http://192.168.72.128/Stock', { "method": "outinfo.all" }, resDeal);
*/
/////////////end: httpPost///////////////////

/////begin: conf///////
var conf = conf || {};

conf.m_def = {
    "global": {
        "date": 0,
        "isreportdate": 0,
    },
    "list": {
        "exist": [
            "Code",
            "Revenue",
            "DayPR",
            "DayPR2",
            "NetAssertRate",
            "ClosingDate",
            "DeclarationDate",
            "DayDate",
            "SubIndustry",
            "NetProfit"
        ],
        "show": [
            "Code",
            "Name",
            "DayDate", 
            "DayClose", 
            "Revenue"
        ]
    },
    "single": {
        "exist":[
            "ROE",
            "Revenue"
        ],
        "show": {
            "ROE":{
                "color": "#ff0000",
                "type": "ROE"
            },
            "Revenue":{
                        "color": "#00ff00",
                "type": "Revenue"
            }
        },
        "absolute": false,
        "tradepoint": true
    },
    "batch": {
        "exist":[
            "ROE",
            "Revenue"
        ],
        "show": "Revenue",
        "absolute": 1,
        "color": [
            "#ff0000",
            "#00ff00",
            "#0000ff"
        ],
        "count": 6,
        "tradepoint": true
    },
    "kline": {
        "kcount": 200,
        "recover": 0,
        "cycle": "day",
        "tradepoint": true,
    },
    "cond":{
        "exist": [
            "ROE",
            "PR"
        ],
        "show": [
            {
                "name": "ROE",
                "type": 1, // filter, compare
                "traverse": 5,
                "match": 4,
                "direct": 0, // >=, <=
                "value": 15,
                "select": false
            }
        ]
    },
    "kind": {
        "existsub": [
            {"name":"计算机","count": 15},
            { "name": "银行", "count": 6 },
            { "name": "保险", "count": 5 },
            { "name": "建筑", "count": 8 }
        ],
        "existopt": [
            {"name":"leader","count":10},
            { "name": "5pointweek", "count": 6 },
            { "name": "buypoint", "count": 9 },
            { "name": "salepoint", "count": 8 }
        ],
        "status": 0,  // 0:预留；1：Code；2：Sub；3：Option；4：All
        "selection" : ""
    },
    "train": {
        "rand": 0,
        "begindate": 0,
        "enddate": 0,
        "hidecode": false,
        "hidename": false,
        "hidesub": false,
        "hidedate":false
    },
    "indexline": {
        "show": false,
        "code": "999999"
    }
}

conf.init = function () {
    if (!window.localStorage) {
        return;
    }

    var localStorage = window.localStorage;
    if (null == localStorage.getItem('global')) {
        conf.set('global', conf.m_def.global);
    }
    if (null == localStorage.getItem('list')) {
        conf.set('list', conf.m_def.list);
    }
    if (null == localStorage.getItem('single')) {
        conf.set('single', conf.m_def.single);
    }
    if (null == localStorage.getItem('batch')) {
        conf.set('batch', conf.m_def.batch);
    }
    if (null == localStorage.getItem('cond')) {
        conf.set('cond', conf.m_def.cond);
    }
    if (null == localStorage.getItem('kind')) {
        conf.set('kind', conf.m_def.kind);
    }
    if (null == localStorage.getItem('train')) {
        conf.set('train', conf.m_def.train);
    }
    if (null == localStorage.getItem('kline')) {
        conf.set('kline', conf.m_def.kline);
    }
    console.log("Call conf.init");

    ///////////begin: outinfo.all//////////////////////
    var req = {"method":"outinfo.all"};
    function remoteOutinfo(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: {"method":"outinfo.all"} retcode error: ' + jsonRes.retcode);
            return false;
        }

        var jsonConf = conf.get('list');
        jsonConf.exist = [];
        jsonConf.exist = jsonRes.result.item.slice(0);
        //console.log(jsonList.exist);
        conf.set('list', jsonConf);

        jsonConf = conf.get('single');
        jsonConf.exist = [];
        jsonConf.exist = jsonRes.result.single.slice(0);
        conf.set('single', jsonConf);

        jsonConf = conf.get('batch');
        jsonConf.exist = [];
        jsonConf.exist = jsonRes.result.batch.slice(0);
        conf.set('batch', jsonConf);

        jsonConf = conf.get('cond');
        jsonConf.exist = [];
        jsonConf.exist = jsonRes.result.cond.slice(0);
        conf.set('cond', jsonConf);

        return true;
    }
    gdata.send(req, remoteOutinfo);
    ///////////end: outinfo.all//////////////////////

    ///////////begin: industry.sub///////////////////////
    req = { "method": "industry.sub" };
    function remoteSub(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: { "method": "industry.sub" } retcode error: ' + jsonRes.retcode);
            return false;
        }

        var jsonConf = conf.get('kind');
        jsonConf.existsub = [];
        jsonConf.existsub = jsonRes.result.slice(0);
        conf.set('kind', jsonConf);

        return true;
    }
    gdata.send(req, remoteSub);
    ///////////end: industry.sub///////////////////////

    ///////////////begin: opt.tab/////////////////////////
    req = { "method": "opt.tab" };
    function remoteOpttab(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: { "method": "industry.sub" } retcode error: ' + jsonRes.retcode);
            return false;
        }

        var jsonConf = conf.get('kind');
        jsonConf.existopt = [];
        for (var i = 0; i < jsonRes.result.length; i++) {
            var item = {};
            item.name = jsonRes.result[i];
            item.count = 0;
            jsonConf.existopt.push(item);
        }
        conf.set('kind', jsonConf);
        console.log(jsonConf);

        return true;
    }
    gdata.send(req, remoteOpttab);
    ///////////////end: opt.tab/////////////////////////

    return;
}

conf.get = function (key) {
    if (window.localStorage) {
        var localStorage = window.localStorage;
        if (null == localStorage.getItem(key)) {
            var str_jsonData = JSON.stringify(conf.m_def[key]);
            localStorage.setItem(key, str_jsonData);
       }
        var getLocalData = localStorage.getItem(key);
        return JSON.parse(getLocalData);
    }
    else {
        return conf.m_def[key];
    }
}

conf.set = function (key, value) {
    if (window.localStorage) {
        var str_jsonData = JSON.stringify(value);
        localStorage.setItem(key, str_jsonData); // 存储字符串数据到本地
    }
}
/////end: conf///////

var ViewTab = ViewTab || {};
ViewTab.line = 0;
ViewTab.cond = 1;
ViewTab.quota = 2;
ViewTab.train = 3;
ViewTab.trade = 4;

/*var Singleton = {
    instance: null,
    GData: function () {
        var self = this;
        self.m_strUrl = "http://192.168.72.128/Stock";
        ////begin: m_data in localStorage/////
        self.m_data = self.m_data || {};
        self.m_data.codes = [];
        self.m_data.idx = 0;
        self.m_data.tab = 0;
        self.m_data.tabStatus = 0;
        self.m_data.dataType = 0;
        self.m_data.typeInfo = "";

        self.getAllCodes = function () {
            // {"method": "list.all", "item": ["Code", "Name", "DayDate", "DayClose"], "date":20170105}
            // {"method": "list.all", "retcode" : "0000", "result" : [{"Code": "000002", "Name" : "万 科Ａ", 
            // "DayDate" : "20170105", "DayClose" : "20.93"}, { "Code": "000004", "Name" : "国农科技", 
            // "DayDate" : "20170105", "DayClose" : "44.44" }, { "Code": "000006", "Name" : "深振业Ａ", 
            // "DayDate" : "20170105", "DayClose" : "9.82" }]}
            ///////////////begin: list.all/////////////////////////
            var global = conf.get("global");
            req = { "method": "list.all", "item": ["Code"], "date": global.date };
            function remoteListall(jsonRes) {
                console.log(jsonRes);
                if ('0000' != jsonRes.retcode) {
                    console.log('ERROR: { "method": "list.all" } retcode error: ' + jsonRes.retcode);
                    return false;
                }

                self.m_data.codes = [];
                self.m_data.idx = 0;
                for (var i = 0; i < jsonRes.result.length; i++) {
                    self.m_data.codes.push(jsonRes.result[i].Code);
                }

                return true;
            }
            self.send(req, remoteListall);
            ///////////////end: list.all/////////////////////////


            return true;
        }
        self.getSubCodes = function (subIndustry) {
            // {"method": "list.sub", "sub": "\\u5168\\u56fd\\u5730\\u4ea7", "item": 
            // ["Code", "Name", "DayDate", "DayClose", "Revenue", "ClosingDate"], "date": 20180208}

            // {"method": "list.sub", "retcode": "0000", "result": [{"Code": "000002", "Name": 
            // "\xe4\xb8\x87 \xe7\xa7\x91\xef\xbc\xa1", "DayDate": "20180208", "DayClose": "32.75", 
            // "Revenue": "1171.01", "ClosingDate": "2017-09-30"}]}
            ///////////////begin: list.sub/////////////////////////
            var global = conf.get("global");
            req = { "method": "list.sub", "sub": subIndustry, "item": ["Code"], "date": global.date };
            function remoteListsub(jsonRes) {
                console.log(jsonRes);
                if ('0000' != jsonRes.retcode) {
                    console.log('ERROR: { "method": "list.sub" } retcode error: ' + jsonRes.retcode);
                    return false;
                }

                self.m_data.codes = [];
                self.m_data.idx = 0;
                for (var i = 0; i < jsonRes.result.length; i++) {
                    self.m_data.codes.push(jsonRes.result[i].Code);
                }

                return true;
            }
            self.send(req, remoteListsub);
            ///////////////end: list.sub/////////////////////////
            return true;
        }
        self.getOptCodes = function (optionKind) {
            //jRoot["method"] = "opt.item";
            //jRoot["tab"] = strOptTab;
            //jRoot["item"].append("code");
            //jRoot["date"] = CConfig::Instance()->m_iLastDate;
            ///////////////begin: list.sub/////////////////////////
            var global = conf.get("global");
            req = { "method": "opt.item", "tab": optionKind, "item": ["Code"], "date": global.date };
            function remoteOptitem(jsonRes) {
                console.log(jsonRes);
                if ('0000' != jsonRes.retcode) {
                    console.log('ERROR: { "method": "opt.item" } retcode error: ' + jsonRes.retcode);
                    return false;
                }

                self.m_data.codes = [];
                self.m_data.idx = 0;
                for (var i = 0; i < jsonRes.result.length; i++) {
                    self.m_data.codes.push(jsonRes.result[i].Code);
                }

                return true;
            }
            self.send(req, remoteOptitem);
            ///////////////end: opt.item/////////////////////////
            return true;
        }
        self.getSingleCode = function (code) {
            self.m_data.codes = [];
            self.m_data.idx = 0;
            self.m_data.codes.push(code);
        }
        ////end: m_data in localStorage/////

        self.set = function () {
            if (window.localStorage) {
                var str_jsonData = JSON.stringify(self.m_data);
                localStorage.setItem('data', str_jsonData); // 存储字符串数据到本地
            }
        }

        self.get = function () {
            if (window.localStorage) {
                var localStorage = window.localStorage;
                //if (null == localStorage.getItem('data')) {
                var str_jsonData = JSON.stringify(self.m_data);
                localStorage.setItem('data', str_jsonData);
                // }
                var getLocalData = localStorage.getItem('data');
                return JSON.parse(getLocalData);
            }
            else {
                return self.m_data;
            }
        }

        self.init = function () {
            self.set();
            if (0 >= self.m_data.codes.length) {
                self.getAllCodes();
                console.log("Call gdata.getAllCodes()");
            }
            console.log("Call gdata.init");
            self.set();
            return true;
        }

        self.send = function (jsonreq, func) {
            httpPost(self.m_strUrl, jsonreq, func);
        }
    },
    getInstance: function () {
        if (this.instance == null) {
            this.instance = new Singleton.GData();
        }
        return this.instance;
    }
}
var gdata = Singleton.getInstance();*/

var gdata = gdata || {};
//gdata.m_strUrl = "http://192.168.72.128/Stock";
////begin: m_data in localStorage/////
gdata.m_data = gdata.m_data || {};
gdata.m_data.codes = [];
gdata.m_data.idx = 0;
gdata.m_data.tab = 0;
gdata.m_data.tabStatus = 0;
gdata.m_data.dataType = 0;
gdata.m_data.typeInfo = "";

gdata.getAllCodes = function () {
    // {"method": "list.all", "item": ["Code", "Name", "DayDate", "DayClose"], "date":20170105}
    // {"method": "list.all", "retcode" : "0000", "result" : [{"Code": "000002", "Name" : "万 科Ａ", 
    // "DayDate" : "20170105", "DayClose" : "20.93"}, { "Code": "000004", "Name" : "国农科技", 
    // "DayDate" : "20170105", "DayClose" : "44.44" }, { "Code": "000006", "Name" : "深振业Ａ", 
    // "DayDate" : "20170105", "DayClose" : "9.82" }]}
    ///////////////begin: list.all/////////////////////////
    gdata.get();
    var global =conf.get("global");
    var req = { "method": "list.all", "item": ["Code"], "date": global.date };
    function remoteListall(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: { "method": "list.all" } retcode error: ' + jsonRes.retcode);
            return false;
        }

        gdata.m_data.codes = [];
        gdata.m_data.idx = 0;
        for (var i = 0; i < jsonRes.result.length; i++) {
            gdata.m_data.codes.push(jsonRes.result[i].Code);
        }
        console.log('remoteListall: ' + gdata.m_data.codes);
        gdata.set();
        gdata.get();
        return true;
    }
    gdata.send(req, remoteListall);
    ///////////////end: list.all/////////////////////////
    gdata.set();
    gdata.get();

    return true;
}
gdata.getSubCodes = function (subIndustry) {
    // {"method": "list.sub", "sub": "\\u5168\\u56fd\\u5730\\u4ea7", "item": 
    // ["Code", "Name", "DayDate", "DayClose", "Revenue", "ClosingDate"], "date": 20180208}

    // {"method": "list.sub", "retcode": "0000", "result": [{"Code": "000002", "Name": 
    // "\xe4\xb8\x87 \xe7\xa7\x91\xef\xbc\xa1", "DayDate": "20180208", "DayClose": "32.75", 
    // "Revenue": "1171.01", "ClosingDate": "2017-09-30"}]}
    ///////////////begin: list.sub/////////////////////////
    var global = conf.get("global");
    var req = { "method": "list.sub", "sub": subIndustry, "item": ["Code"], "date": global.date };
    function remoteListsub(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: { "method": "list.sub" } retcode error: ' + jsonRes.retcode);
            return false;
        }

        gdata.m_data.codes = [];
        gdata.m_data.idx = 0;
        for (var i = 0; i < jsonRes.result.length; i++) {
            gdata.m_data.codes.push(jsonRes.result[i].Code);
        }

        return true;
    }
    gdata.send(req, remoteListsub);
    ///////////////end: list.sub/////////////////////////
    gdata.set();
    gdata.get();

    return true;
}
gdata.getOptCodes = function (optionKind) {
    //jRoot["method"] = "opt.item";
    //jRoot["tab"] = strOptTab;
    //jRoot["item"].append("code");
    //jRoot["date"] = CConfig::Instance()->m_iLastDate;
    ///////////////begin: list.sub/////////////////////////
    var global = conf.get("global");
    user.get();
    if (0 == user.m_data.sessionid || "" == user.m_data.sessionid){
        alert("请登录系统，再操作");
        return true;
    }
    var req = { "method": "opt.item", "session":user.m_data.sessionid, "tab": optionKind, "item": ["Code"], "date": global.date };
    function remoteOptitem(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: { "method": "opt.item" } retcode error: ' + jsonRes.retcode);
            return false;
        }

        gdata.m_data.codes = [];
        gdata.m_data.idx = 0;
        for (var i = 0; i < jsonRes.result.length; i++) {
            gdata.m_data.codes.push(jsonRes.result[i].Code);
        }

        return true;
    }
    gdata.send(req, remoteOptitem);
    ///////////////end: opt.item/////////////////////////
    gdata.set();
    gdata.get();

    return true;
}
gdata.getSingleCode = function (code) {
    gdata.m_data.codes = [];
    gdata.m_data.idx = 0;
    gdata.m_data.codes.push(code);
    gdata.set();
    gdata.get();
}
gdata.getSelectedCode = function (selectedTab) {
    user.get();
    if (0 == user.m_data.sessionid || "" == user.m_data.sessionid){
        alert("请登录系统，再操作");
        return true;
    }

    var req = {
        "method": "selected.getitem", 
        "session": user.m_data.sessionid, 
        "tab":selectedTab
    };
    function remoteGetitem(objJson){
        if (objJson.retcode != '0000') {
            console.log("ERROR: retcode[" + objJson.retcode + "] != 0000");
            return false;
        }
        gdata.m_data.codes = [];
        gdata.m_data.idx = 0;
        gdata.m_data.codes = objJson.result.slice(0);

        return true;
    }
    gdata.send(req, remoteGetitem);

    gdata.set();
    gdata.get();
}
gdata.sort = function (strSortItem, bSortDesc) {
	// {"code": ["000002", "000004", "000006"], "method": "list.sort", "sorttype": "desc", "sortitem": "Revenue", 
	// "item": ["Code", "Name", "DayDate", "DayClose", "Revenue"]}'

	// {"method": "list.sort", "retcode": "0000", "result": [{"Code": "000002", "Name": "万 科Ａ", "DayDate": "20180404", 
	// "DayClose": "32.80", "Revenue": "1171.01"}, {"Code": "000006", "Name": "深振业Ａ", "DayDate": "20180404", 
	// "DayClose": "7.15", "Revenue": "23.19"}, {"Code": "000004", "Name": "国农科技", "DayDate": "20180404", 
	// "DayClose": "22.67", "Revenue": "0.71"}]}
    ///////////////begin: list.sub/////////////////////////
    var strSortType = "asc";
    var global = conf.get("global");

    if (true == bSortDesc){
        strSortType = "desc";
    }
    var req = { 
            "method": "list.sort", 
            "code": gdata.m_data.codes, 
            "sortitem": strSortItem, 
            "sorttype": strSortType, 
            "item": ["Code"], 
            "date": global.date 
        };
    if (global.isreportdate){
        req["datetype"] = "report";
    }
    function remoteSort(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: { "method": "list.sub" } retcode error: ' + jsonRes.retcode);
            return false;
        }

        gdata.m_data.codes = [];
        gdata.m_data.idx = 0;
        for (var i = 0; i < jsonRes.result.length; i++) {
            gdata.m_data.codes.push(jsonRes.result[i].Code);
        }

        return true;
    }
    gdata.send(req, remoteSort);
    ///////////////end: list.sub/////////////////////////
    gdata.set();
    gdata.get();

    return true;
}
////end: m_data in localStorage/////

gdata.set = function () {
    if (window.localStorage) {
        var str_jsonData = JSON.stringify(gdata.m_data);
        localStorage.setItem('data', str_jsonData); // 存储字符串数据到本地
    }
}

gdata.get = function () {
    if (window.localStorage) {
        var localStorage = window.localStorage;
        if (null == localStorage.getItem('data')) {
            var str_jsonData = JSON.stringify(gdata.m_data);
            localStorage.setItem('data', str_jsonData);
        }
        var getLocalData = localStorage.getItem('data');
        var data = JSON.parse(getLocalData);
        gdata.m_data.codes = data.codes;
        gdata.m_data.idx = data.idx;
        gdata.m_data.tab = data.tab;
        gdata.m_data.tabStatus = data.tabStatus;
        gdata.m_data.dataType = data.dataType;
        gdata.m_data.typeInfo = data.typeInfo;
        console.log('gdata get: ');
        console.log(gdata.m_data);
        return data;
    }
    else {
        return gdata.m_data;
    }
}

gdata.init = function () {
    gdata.set();
    if (0 >= gdata.m_data.codes.length) {
        gdata.getAllCodes();
        console.log("Call gdata.getAllCodes()");
    }
    console.log("Call gdata.init");
    gdata.get();

    return true;
}

gdata.send = function (jsonreq, func) {
    httpPost(gdata.m_strUrl, jsonreq, func);
}

var user = user || {};
// session, tradepoint, train, option
user.m_data = user.m_data || {};
user.m_data.sessionid = "";
user.m_data.username = "";

user.check = function () {
    var req =
        {
            "method": "user.search",
            "session": user.m_data.sessionid
        };
    console.log('user.req: ' + JSON.stringify(req));
    function remoteCheck(objJson) {
        if (objJson.retcode != '0000') {
            console.log("ERROR: retcode[" + objJson.retcode + "] != 0000");
            user.m_data.sessionid = 0;
            user.m_data.username = "";
            user.set();
            return false;
        }

        user.m_data.username = objJson.result.name;
        user.set();

        return true;
    }
    gdata.send(req, remoteCheck);

    return true;
}

user.set = function () {
    if (window.localStorage) {
        var str_jsonData = JSON.stringify(user.m_data);
        localStorage.setItem('user', str_jsonData); // 存储字符串数据到本地
    }
}

user.get = function () {
    if (window.localStorage) {
        var localStorage = window.localStorage;
        if (null == localStorage.getItem('user')) {
            var str_jsonData = JSON.stringify(user.m_data);
            localStorage.setItem('user', str_jsonData);
        }
        var getLocalData = localStorage.getItem('user');
        var data = JSON.parse(getLocalData);
        user.m_data.sessionid = data.sessionid;
        user.m_data.username = data.username;
        console.log('user get: ');
        console.log(user.m_data);
    }

    if ("" != user.m_data.sessionid) {
        user.check();
    }

    return user.m_data;
}
