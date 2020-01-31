var list = list || {};

list.m_canvas = document.getElementById("linecanvas");
list.m_cvtext = list.m_canvas.getContext("2d");

list.req = function(page){
	/*var jsonData = '{"method": "list.show", "retcode": "0000", "result": [{"Code": "000002", "Name": "�� �ƣ�", "DayDate": "20180404", "DayClose": "32.80", "Revenue": "1171.00"}, {"Code": "000004", "Name": "��ũ�Ƽ�", "DayDate": "20180404", "DayClose": "22.67", "Revenue": "0.70"}]}';
	var objJson = JSON.parse(jsonData);
	
	if (objJson.retcode != '0000')
	{
		return;
	}
	list.m_data = objJson.result;*/
    var confGlobal = conf.get("global");
    list.m_items = ["Code", "Name", "Exchange", "Close", "Date"];
    //list.m_items = listconf.show.slice(0);

    idxdata.get();
    list.m_totalCodes = idxdata.m_data.codes.length;  // �����б�
    if (list.m_totalCodes < page * list.m_countPage) {
        console.log('ERROR: list.m_totalCodes: ' + list.m_totalCodes + ', page * list.m_countPage: ' + page * list.m_countPage);
        return false;
    }
    var codes = [];
    for (var i = page * list.m_countPage; (i < list.m_totalCodes) && (i < (page + 1) * list.m_countPage) ; i++) {
        codes.push(idxdata.m_data.codes[i]);
    }
    console.log('list.m_totalCodes: ' + list.m_totalCodes + ', codes' + codes);

    /*
    // ��ȡԶ����ʾ��Ϣ
    //{"date": 20190230, "method": "index.list"}
    //{"method": "index.list", "retcode": "0000", "result": [
    //{"Code": "000010", "Name": "��֤180", "Exchange": "sh", "Close": "817361", "Date": "20190228"}, 
    //{"Code": "000016", "Name": "��֤50", "Exchange": "sh", "Close": "274397", "Date": "20190228"}, 
    //{"Code": "000300", "Name": "����300", "Exchange": "sh", "Close": "366937", "Date": "20190228"}, 
    //{"Code": "000903", "Name": "��֤100", "Exchange": "sh", "Close": "386307", "Date": "20190228"}, 
    //{"Code": "000905", "Name": "��֤500", "Exchange": "sh", "Close": "502529", "Date": "20190228"}, 
    //{"Code": "399001", "Name": "��֤��ָ", "Exchange": "sz", "Close": "903193", "Date": "20190228"}, 
    //{"Code": "399004", "Name": "��֤100R", "Exchange": "sz", "Close": "483435", "Date": "20190228"}, 
    //{"Code": "399005", "Name": "��С��ָ", "Exchange": "sz", "Close": "589369", "Date": "20190228"}, 
    //{"Code": "399006", "Name": "��ҵ��ָ", "Exchange": "sz", "Close": "153568", "Date": "20190228"}, 
    //{"Code": "399106", "Name": "��֤��ָ", "Exchange": "sz", "Close": "154633", "Date": "20190228"}, 
    //{"Code": "999999", "Name": "��ָ֤��", "Exchange": "sh", "Close": "294095", "Date": "20190228"}
    //]}
    */
    var strDateType = "declare";
    if (1 == confGlobal.datetype) {
        strDateType = "report";
    }
    var req = { "code": codes, "method": "index.list", "item": list.m_items, "date": confGlobal.date, "datetype": strDateType };
    function remoteListshow(jsonRes) {
        console.log(jsonRes);
        if ('0000' != jsonRes.retcode) {
            console.log('ERROR: { "method": "index.list" } retcode error: ' + jsonRes.retcode);
            return false;
        }

        list.m_data = jsonRes.result;
        console.log('list.m_data: ');
        console.log(list.m_data);

        return true;
    }
    idxdata.send(req, remoteListshow);
    console.log('list.m_data: ');
    console.log(list.m_data);

    list.m_currPage = page;
    list.m_selectRow = 0;
    idxdata.m_data.idx = list.m_currPage * list.m_countPage + list.m_selectRow;
    idxdata.set();

    return true;
}

list.show = function() {
	list.m_cvtext.clearRect(0,0,list.m_canvas.width,list.m_canvas.height);  
	
	list.m_cvtext.lineWidth = 1;
	list.m_cvtext.beginPath();
    list.m_cvtext.strokeStyle = "#ff0000";

    // �����˵�
    list.m_cvtext.moveTo(list.m_cvLeft-5, 0);
    list.m_cvtext.lineTo(list.m_cvLeft - 5, list.m_canvas.height);
    for (var i = 1; i < 4; i++) {
        list.m_cvtext.moveTo(0, list.m_canvas.height*i/4);
        list.m_cvtext.lineTo(list.m_cvLeft - 5, list.m_canvas.height * i / 4);
    }
    list.m_cvtext.stroke();

    list.m_cvtext.fillStyle = "#ff0000";
    list.m_cvtext.font = "20px SimSun";
    list.m_cvtext.fillText("��", 0, 20);
    list.m_cvtext.fillText("ֻ", 0, 40);
    list.m_cvtext.fillText("��", 0, 60);
    list.m_cvtext.fillText("��", 0, 80);
    list.m_cvtext.fillText("��", 0, 100);

    list.m_cvtext.fillText("��", 0, list.m_canvas.height / 4 + 20);
    list.m_cvtext.fillText("��", 0, list.m_canvas.height / 4 + 40);
    list.m_cvtext.fillText("��", 0, list.m_canvas.height / 4 + 60);
    list.m_cvtext.fillText("��", 0, list.m_canvas.height / 4 + 80);
    list.m_cvtext.fillText("��", 0, list.m_canvas.height / 4 + 100);

    list.m_cvtext.fillText("K",  0, list.m_canvas.height * 2 / 4 + 20);
    list.m_cvtext.fillText("��", 0, list.m_canvas.height * 2 / 4 + 40);

    list.m_cvtext.fillText("��", 0, list.m_canvas.height * 3 / 4 + 30);
    list.m_cvtext.fillText("��", 0, list.m_canvas.height * 3 / 4 + 60);
    list.m_cvtext.fillText(list.m_currPage + 1, 0, list.m_canvas.height * 3 / 4 + 90);
    list.m_cvtext.fillText(Math.ceil(list.m_totalCodes/list.m_countPage), 0, list.m_canvas.height * 3 / 4 + 120);

    // ������������
    list.m_cvtext.fillStyle = "#ffffff";
    list.m_cvtext.font = "20px SimSun";
    for (var i=0; i<list.m_items.length; i++){
    	list.m_cvtext.fillText(list.m_items[i], list.m_cvLeft + i*list.m_cellWidth, list.m_cvTop);
    }
	
    // ���б�����
	for (var i=0; i<list.m_data.length; i++){
	  list.m_cvtext.beginPath();
	  //console.log(list.m_items.length);
	  for (var j=0; j<list.m_items.length; j++){
	  	list.m_cvtext.fillText(list.m_data[i][list.m_items[j]], list.m_cvLeft + j*list.m_cellWidth, list.m_cvTop + list.m_cellHeight*(i+1));
	  }
	}
}

list.init = function(){
	list.m_cvLeft     = 30;
	list.m_cvTop      = 20;
	list.m_cellWidth  = 120; // ÿ����Ԫ��Ŀ�Ⱥ͸߶�
	list.m_cellHeight = 20; //

	list.m_countPage = 30; //30;
	list.m_totalCodes = 0;
	list.m_currPage = 0;
	list.m_selectRow  = 0;

    // �������
    list.m_bSortDesc = true;
    list.m_strSortItem = "";
    
	list.m_url = "";
	list.m_items = []; //["Code","Name","DayDate","DayClose","Revenue"];
	list.m_data = [];
	
	list.req(list.m_currPage);
	list.show();
	list.selectRow();
}

list.selectRow = function (ev) {
    if (typeof ev == "undefined") {  // û�е���¼���ֱ����ʾ�Ѿ�ѡ�е���
        list.m_cvtext.fillStyle = 'rgba(255, 0, 255, 0.5)';
        list.m_cvtext.fillRect(
			list.m_cvLeft,
			list.m_cvTop + list.m_cellHeight * list.m_selectRow + 3,
			list.m_canvas.width - list.m_cvLeft,
			list.m_cellHeight);
        return LineStatus.list;
    }

    if (ev.clientX <= list.m_cvLeft) {  // ѡ����������������
        var status = parseInt((ev.clientY - list.m_canvas.offsetTop) * 4 / list.m_canvas.height) + 1;
        if (4 == status) {
            var pageHeight = ev.clientY - list.m_canvas.offsetTop - (list.m_canvas.height - list.m_canvas.offsetTop) / 4 * 3;
            if (pageHeight < 30) {
                status = LineStatus.pageUp;
            }
            else if (pageHeight < 60) {
                status = LineStatus.pageDn;
            }
            else if (pageHeight < 90) {
                status = LineStatus.pageMd;
            }
        }
        return status;
    }
    else {  // �ı�ѡ����
        /*if ((ev.clientY - list.m_canvas.offsetTop - list.m_cvTop < 0)
            || (ev.clientY - list.m_canvas.offsetTop - list.m_cvTop >= list.m_cellHeight * list.m_data.length)
            || (0 > list.m_selectRow) || (list.m_data.length <= list.m_selectRow)) {
            return LineStatus.list;
        }*/

        if ((ev.clientY - list.m_canvas.offsetTop < 0)  // ������Χ
            || (ev.clientY - list.m_canvas.offsetTop - list.m_cvTop >= list.m_cellHeight * list.m_data.length)
            || (0 > list.m_selectRow) || (list.m_data.length <= list.m_selectRow)) {
            return LineStatus.list;
        }

        if ((ev.clientY - list.m_canvas.offsetTop < list.m_cvTop)) {// ����ı�����
            var index = (ev.clientX - list.m_cvLeft)/list.m_cellWidth;
            index = Math.floor(index);
            if (index >= list.m_items.length){
                return LineStatus.list;
            }

            if (false == list.sort(list.m_items[index])){
                console.log("Call list.sort error. list.m_items[index]: " + list.m_items[index]);
                return LineStatus.error;
            }
        }

        if ((0 <= list.m_selectRow) && (list.m_data.length > list.m_selectRow)) {
            list.m_cvtext.clearRect(
                list.m_cvLeft,
                list.m_cvTop + list.m_cellHeight * list.m_selectRow + 3,
                list.m_canvas.width - list.m_cvLeft,
                list.m_cellHeight);

            list.m_cvtext.beginPath();
            list.m_cvtext.fillStyle = "#ffffff";
            list.m_cvtext.font = "20px SimSun";
            for (var j = 0; j < list.m_items.length; j++) {
                list.m_cvtext.fillText(list.m_data[list.m_selectRow][list.m_items[j]], list.m_cvLeft + j * list.m_cellWidth, list.m_cvTop + list.m_cellHeight * (list.m_selectRow + 1));
            }
        }

        list.m_selectRow = (ev.clientY - list.m_canvas.offsetTop - list.m_cvTop) / list.m_cellHeight;
        list.m_selectRow = parseInt(list.m_selectRow);

        list.m_cvtext.fillStyle = 'rgba(255, 0, 255, 0.5)';
        list.m_cvtext.fillRect(
			list.m_cvLeft,
			list.m_cvTop + list.m_cellHeight * list.m_selectRow + 3,
			list.m_canvas.width - list.m_cvLeft,
			list.m_cellHeight);

        idxdata.m_data.idx = list.m_currPage * list.m_countPage + list.m_selectRow;
        idxdata.set();
        console.log("idxdata.m_data.idx: " + idxdata.m_data.idx + ", list.m_selectRow: " + list.m_selectRow);

        return LineStatus.list;
    }
}

list.ModifyPage = function (status) {
    var page = list.m_currPage;
    if (LineStatus.pageUp == status) {
        page--;
    }
    else if (LineStatus.pageDn == status) {
        page++;
    }
    else {
        /*
        window.prompt()
        ����һ������򣬿�����������
        */
        var messageStr = "������ת����ҳ��";
        //���ȡ�� ����null
        //���ʲô����д �� ���ȷ���Ļ�������һ�����ַ���
        page = parseInt(window.prompt(messageStr, page + 1));
        page--;
    }
    if ((0 > page) || (Math.ceil(list.m_totalCodes / list.m_countPage) <= page)) {
        page = list.m_currPage;
        return true;
    }

    if (false == list.req(page)) {
        console.error("Call list.req(page) error. page: " + page);
        return false;
    }

    if (false == list.show()) {
        console.error("Call list.show() error");
        return false;
    }

    return true;
}

list.sort = function(item) {

    if (list.m_strSortItem == item){
        list.m_bSortDesc = list.m_bSortDesc ? false : true;
        gdata.get();
        gdata.m_data.codes.reverse();
        gdata.set();
    }
    else{
        list.m_strSortItem = item;
        list.m_bSortDesc = true;
        if (false == gdata.sort(list.m_strSortItem, list.m_bSortDesc)){
            console.log("Call gdata.sort error. list.m_strSortItem: " + list.m_strSortItem
                + ", list.m_bSortDesc: " + list.m_bSortDesc);
            return false;
        }
    }

    if (false == list.req(0)) {
        console.error("Call list.req(0) error. page: 0");
        return false;
    }

    if (false == list.show()) {
        console.error("Call list.show() error");
        return false;
    }

    return true;
}

list.rightMenu = function (e) {
    //��ȡ�����Զ�����Ҽ��˵�
    var menu = document.querySelector("#rightmenu");

    menu.innerHTML =
'<div class="rightmenu" id="selfselected">�����ѡ</div>\
<div class="rightmenu" id="other">����</div>';

    //�����¼��������������λ�ã����ж�λ
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';

    //�ı��Զ���˵��Ŀ�������ʾ����
    menu.style.width = '125px';
    menu.style.height = '130px';

    document.getElementById('selfselected').onclick = function () {
        user.get();
        if (0 == user.m_data.sessionid || "" == user.m_data.sessionid){
            alert("û�е�¼�����ܲ���");
            return true;
        }

        var req = {
            "method":"selected.gettab",
            "session":user.m_data.sessionid
        };
        var arrTabs = [];
        function remoteGettab(objJson){
            if (objJson.retcode != '0000') {
                console.log("ERROR: retcode[" + objJson.retcode + "] != 0000");
                return false;
            }
            arrTabs = objJson.result.slice(0);
        }
        gdata.send(req, remoteGettab);
        console.log(arrTabs);
        var htmlTabs = "";
        for(var i=0; i<arrTabs.length; i++) {
            htmlTabs = htmlTabs + '<option value ="' + arrTabs[i] + '">' + arrTabs[i] + '</option>';
        }

        var light = document.getElementById('light');
        light.innerHTML =
'<p>��ѡ��</p>\
<label>����</label><input type="text" id="selectedcode" value="' + gdata.m_data.codes[gdata.m_data.idx] 
+ '" readonly="readonly"><br>\
<label>�����ѡ</label><select id="selectedtype"><option value ="1">��ֻ</option><option value ="2">����</option></select><br>\
<label>����</label><select id="selectednum">' + htmlTabs + '</select><br>\
<button id="selectedadd">���</button>\
<button id="selecteddel">ɾ��</button>\
<button id="selectedcancel">ȡ��</button>';

        light.style.display = 'block';
        light.style.width = '300px';
        light.style.height = '140px';
        //document.getElementById('fade').style.display = 'block'
        //console.log(light.innerHTML);

        document.getElementById('selectedadd').onclick = function () {
            var code = document.getElementById('selectedcode').value;
            var objtype = document.getElementById('selectedtype');
            var type = objtype.options[objtype.selectedIndex].value;
            var objnum = document.getElementById('selectednum');
            var selectedtab = objnum.options[objnum.selectedIndex].value;
            console.log('add code: ' + code + ', type: ' + type + ', selectedtab: ' + selectedtab);

            var req = {};
            if ("1" == type){
                //console.log("��ӵ�����ѡ, tab: " + selectedtab + ", code: " + code);
                req = {
                    "method": "selected.additem", 
                    "session": user.m_data.sessionid, 
                    "tab":selectedtab, 
                    "item":[code]
                };
            }
            else {
                //console.log("���������ѡ, tab: " + selectedtab + ", code: " + gdata.m_data.codes);
                req = {
                    "method": "selected.additem", 
                    "session": user.m_data.sessionid, 
                    "tab":selectedtab, 
                    "item":gdata.m_data.codes
                };
            }
            console.log(req);
            function remoteAdditem(objJson) {
                if (objJson.retcode != '0000') {
                    console.log("ERROR: retcode[" + objJson.retcode + "] != 0000");
                    return false;
                }
            }
            gdata.send(req, remoteAdditem);

            document.getElementById('light').style.display = 'none';
            //document.getElementById('fade').style.display = 'none';

           /* kline.m_user = user.get();
            if ("" == kline.m_user.sessionid){
                alert("û�е�¼�����ܲ���");
                return true;
            }
            if (null == kline.m_objTrade){
                kline.m_objTrade = new CTradePoint();
                if (false == kline.m_objTrade.Search(kline.m_user.sessionid, [kline.m_strCode], kline.m_strCycle, kline.m_global.date)) {
                    console.log("call kline.m_objTrade.Search error. sessionid: " + kline.m_user.sessionid + ", code: " + kline.m_strCode
                        + ", strCycle: " + kline.m_strCycle + ", iDate: " + kline.m_global.date);
                    return false;
                }
            }

            if (false == kline.m_objTrade.Insert(kline.m_user.sessionid, kline.m_strCode, type, date)){
                console.log("call kline.m_objTrade.Insert error. sessionid: " + kline.m_user.sessionid + ", code: " + kline.m_strCode
                    + ", type: " + type + ", date: " + date);
                return false;
            }*/

            return true;
        }

        document.getElementById('selecteddel').onclick = function () {
            var code = document.getElementById('selectedcode').value;
            var objtype = document.getElementById('selectedtype');
            var type = objtype.options[objtype.selectedIndex].value;
            var num = document.getElementById('selectednum').value;
            type = parseInt(type)*100 + parseInt(num);

            document.getElementById('light').style.display = 'none';
            //document.getElementById('fade').style.display = 'none';

            console.log('del code: ' + code + ', type: ' + type + ', num: ' + num);

            /*kline.m_user = user.get();
            if ("" == kline.m_user.sessionid){
                alert("û�е�¼�����ܲ���");
                return true;
            }
            if (null == kline.m_objTrade){
                alert("û�����������ɾ��");
                return true;
            }

            if (false == kline.m_objTrade.Delete(kline.m_user.sessionid, kline.m_strCode, type, date)){
                console.log("call kline.m_objTrade.Delete error. sessionid: " + kline.m_user.sessionid + ", code: " + kline.m_strCode
                    + ", type: " + type + ", date: " + date);
                return false;
            }*/

            return true;
        }

        document.getElementById('selectedcancel').onclick = function () {
            var code = document.getElementById('selectedcode').value;
            var objtype = document.getElementById('selectedtype');
            var type = objtype.options[objtype.selectedIndex].value;
            var num = document.getElementById('selectednum').value;
            console.log('cancel code: ' + code + ', type: ' + type + ', num: ' + num);

            document.getElementById('light').style.display = 'none';
            //document.getElementById('fade').style.display = 'none';
        }
    };
}