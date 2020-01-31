var single = single || {};

single.m_canvas = document.getElementById("linecanvas");
single.m_cvtext = single.m_canvas.getContext("2d");

single.init = function () {
    // ����
    single.m_conf = conf.get('single');
    single.m_global = conf.get('global');

	// view ����������
	single.m_iPointTop      = 0;
	single.m_iPointLeft     = 0;
	single.m_iPointHeight   = 0;
	single.m_iPointWidth    = 0;

	// view ��ʾ��Ϣ����
	single.m_iInfoTop       = 0;
	single.m_iInfoLeft      = 0;
	single.m_iInfoHeight    = 0;
	single.m_iInfoWidth     = 0;

	single.m_iMouseX        = 0;
	single.m_iMouseY        = 0;
	single.m_iCurrDayIdx = 0;

	single.m_bCross = false;

	single.m_strCode = "";
	single.m_strName = "";

	single.m_iMax = 0;
	single.m_iMin = 0;
	single.m_vecDayXLine    = [];
	single.m_vecDayYLine    = [];

	// ���ߵ�������
	single.m_idxBegin = 0; // ��ʾ�����±귶Χ[m_idxBegin, m_idxEnd)
	single.m_idxEnd   = 0;

	single.m_iShowMax = 0;
	single.m_iShowMin = 0;
	single.m_bpTrend = {
		m_vecY:[],
		m_vecX:[]
	};
	
	if (false == single.req()) {
	    console.log("call single.req() error");
		return false;
	}
	
	if (false == single.show()) {
	    console.log("call single.show() error.");
		return false;
	}
	
	return true;
}

single.req = function() {
    /*single.m_strCode = "000002";
    single.m_strName = "���A";

	var response = '{"method": "single.line", "retcode": "0000", "result": {"max": 146388, "min": 0, "qyline": [{"type": "ROE", "max": 2375, "min": 0, "items": [1917, 827, 612, 196, 2153, 931, 691, 249, 2144, 927, 683, 260, 1982, 784, 653, 268, 1778, 839, 720, 293, 1536, 0, 761, 0, 1324, 0, 676, 0, 2375, 0, 1069, 0, 2189, 0, 1290, 0, 1869, 0, 1205, 0]}, {"type": "Revenue", "max": 146388, "min": 1885, "items": [146388, 63139, 40961, 9497, 135418, 63415, 41390, 13999, 103116, 46128, 30722, 10345, 71782, 29308, 19988, 7970, 50713, 22380, 16766, 7504, 48881, 29543, 21808, 8164, 40991, 22541, 17255, 6400, 35526, 14173, 11096, 4114, 17918, 8508, 6669, 2303, 10558, 5556, 4334, 1885]}], "qxline": [20141231, 20140930, 20140630, 20140331, 20131231, 20130930, 20130630, 20130331, 20121231, 20120930, 20120630, 20120331, 20111231, 20110930, 20110630, 20110331, 20101231, 20100930, 20100630, 20100331, 20091231, 20090930, 20090630, 20090331, 20081231, 20080930, 20080630, 20080331, 20071231, 20070930, 20070630, 20070331, 20061231, 20060930, 20060630, 20060331, 20051231, 20050930, 20050630, 20050331]}}';
    */

    /*
    �����ֶ��б�
    �ֶ�����	ֵ����	��ע
    method	�ַ���single.line	
    code	�ַ���	��Ʊ����
    item	����[]	��Ҫ���ص������б�
    date	���ͻ��	�������ڣ�����20170121
    before	����	��dateΪ��׼��ǰ�������ԲƱ�Ϊ׼����
    after	����	��dateΪ��׼����������ԲƱ�����Ϊ׼

    ��Ӧ�ֶ��б�
    �ֶ�����	ֵ����	��ע
    method	ͬ��	ͬ��
    retcode	�ַ���	�����룬�ɹ�Ϊ0000
    result	����[{},{},{}��]	��Ӧ�ֶ�ֵ������Ԫ��Ϊ{��cde��: xxx, ��item1��: xxx, ��}

    // Զ�̻�ȡ��������
    jRoot.clear();
    jRoot["method"] = "single.line";
    jRoot["code"] = m_strCode;
    for (iter = CConfig::Instance()->m_objSingle.m_mapShow.begin();
		iter != CConfig::Instance()->m_objSingle.m_mapShow.end(); iter++)
    {
        jRoot["item"].append(iter->second.m_strLine);
    }
    jRoot["date"] = CConfig::Instance()->m_iLastDate;
    jRoot["before"] = -1;
    jRoot["after"] = 0;*/
    if ((0 <= idxdata.m_data.idx) && (idxdata.m_data.codes.length > idxdata.m_data.idx)){
        single.m_strCode = idxdata.m_data.codes[idxdata.m_data.idx];
    }
    else {
        console.log("ERROR: idxdata.m_data.idx: " + " error. idxdata.m_data.codes.length: " + idxdata.m_data.codes.length);
        return false;
    }
    single.m_conf = conf.get('single');
    single.m_global = conf.get('global');
    var vecItems = [];
    var req =
        {
            "method": "index.single",
            "code": single.m_strCode,
            "date": single.m_global.date,
            "before": -1,
            "after": 0
        };
    console.log('single.req: ' + JSON.stringify(req));
    function remoteSingle(objJson) {
        if (objJson.retcode != '0000') {
            console.log("ERROR: retcode[" + objJson.retcode + "] != 0000");
            return false;
        }
        console.log("single res: " + JSON.stringify(objJson));
        //single.m_strCode = gdata.m_data.codes[]
        single.m_strName = objJson.result.name;
        single.m_iMax = objJson.result.max;
        single.m_iMin = objJson.result.min;
        single.m_vecDayYLine = {};
        single.m_vecDayXLine = [];

        if (undefined != objJson.result.dyline) {
            for (var i = 0; i < objJson.result.dyline.length; i++) {
                single.m_vecDayYLine = objJson.result.dyline;
                //console.log(objJson.result.dyline[i].type);
                //console.log(single.m_mapDayYLine[objJson.result.dyline[i].type]);
            }
        }
        if (undefined != objJson.result.dxline) {
            single.m_vecDayXLine = objJson.result.dxline;
        }
        //console.log(single.m_iMax);
        //console.log(single.m_iMin);
        //console.log(single.m_vecQuartXLine);
        //console.log(single.m_mapQuartYLine)
        return true;
    }
    idxdata.send(req, remoteSingle);

    // ��ʾ��������
	single.m_idxBegin = 0;
	single.m_idxEnd = single.m_vecDayXLine.length;

    // ��ʾ������ֵ
	single.m_iShowMax = single.m_iMax;
	single.m_iShowMin = single.m_iMin;

	return true;
}

single.show = function() {
    //console.log("single.show");

    single.m_cvtext.clearRect(0, 0, single.m_canvas.width, single.m_canvas.height);

    single.m_cvtext.beginPath();
    single.m_cvtext.fillStyle = "#ffffff";
    single.m_cvtext.font = "20px SimSun";

    // �����������
    single.m_iPointTop = 2;
    single.m_iPointLeft = 2;
    single.m_iPointHeight = single.m_canvas.height - 35;
    single.m_iPointWidth = single.m_canvas.width - 200;

    // �Ҳ���Ϣ����
    single.m_iInfoTop = 2;
    single.m_iInfoLeft = single.m_iPointLeft + single.m_iPointWidth;
    single.m_iInfoHeight = single.m_iPointHeight;
    single.m_iInfoWidth = single.m_canvas.width - 2 - single.m_iInfoLeft;
	
    //������ı߿�
    //-------------->
    //              |
    //<------------\|/
    single.m_cvtext.lineWidth = 1.5;
    single.m_cvtext.beginPath();
    single.m_cvtext.strokeStyle = "#ff0000";
    single.m_cvtext.moveTo(single.m_iPointLeft, single.m_iPointTop);
    single.m_cvtext.lineTo(single.m_iPointLeft + single.m_iPointWidth, single.m_iPointTop);
    single.m_cvtext.lineTo(single.m_iPointLeft + single.m_iPointWidth, single.m_iPointTop + single.m_iPointHeight);
    single.m_cvtext.lineTo(single.m_iPointLeft, single.m_iPointTop + single.m_iPointHeight);
    single.m_cvtext.lineTo(single.m_iPointLeft, single.m_iPointTop);
    single.m_cvtext.stroke();

    // ������ı߿�
    single.m_cvtext.lineWidth = 1.5;
    single.m_cvtext.beginPath();
    single.m_cvtext.strokeStyle = "#ff0000";
    single.m_cvtext.moveTo(single.m_iInfoLeft, single.m_iInfoTop);
    single.m_cvtext.lineTo(single.m_iInfoLeft + single.m_iInfoWidth, single.m_iInfoTop);
    single.m_cvtext.lineTo(single.m_iInfoLeft + single.m_iInfoWidth, single.m_iInfoTop + single.m_iInfoHeight);
    single.m_cvtext.lineTo(single.m_iInfoLeft, single.m_iInfoTop + single.m_iInfoHeight);
    single.m_cvtext.lineTo(single.m_iInfoLeft, single.m_iInfoTop);
    single.m_cvtext.stroke();

    // ����������
    //ctx.lineWidth = 1;
    for (var y = single.m_iPointHeight + single.m_iPointTop - single.m_iPointHeight / 9;
        y > single.m_iPointTop + 10;y -= single.m_iPointHeight / 9){
        single.m_cvtext.lineWidth = 0.5;
        single.m_cvtext.beginPath();
        single.m_cvtext.strokeStyle = "#ff0000";
        single.m_cvtext.moveTo(single.m_iPointLeft, y);
        single.m_cvtext.lineTo(single.m_iPointLeft + single.m_iPointWidth, y);
        single.m_cvtext.stroke();
    }

    // ���������
    if (false == single.DrawPoint()) {
        console.log("Call single.DrawPoint error");
        return false;
    }

    // �������Ϣ
    if (false == single.DrawSign()) {
        console.log("Call single.DrawSign error");
        return false;
    }

    // ���Ҳ���ʾ��Ϣ
    if (false == single.DrawInfo()) {
        console.log("Call single.DrawInfo error");
        return false;
    }
	
	return true;
}

// ���������
single.DrawPoint = function () {

    if (false == single.GetPoint()){
        console.log("Call single.GetPoint error");
        return false;
    }
    //console.log("line rect: " + single.m_iPointTop + ", " + single.m_iPointHeight 
    //    + ", " + single.m_iPointLeft + ", " + single.m_iPointWidth);

    console.log('DrawPoint conf: ');
    console.log(single.m_conf.show);

    // ѡ�񻭱���ɫ
    single.m_cvtext.lineWidth = 1;
    single.m_cvtext.beginPath();
    single.m_cvtext.strokeStyle = "#ff0000";

    //DEBUGLOG("(*ptrVecY).size(): " << (*ptrVecY).size()<<", m_bpTrend.m_vecX.size(): "<< m_bpTrend.m_vecX.size());
    for (var j = 1; j < single.m_bpTrend.m_vecY.length; j++){
        if ((0 == single.m_bpTrend.m_vecY[j - 1]) || (0 == single.m_bpTrend.m_vecY[j])){
            continue;
        }
        single.m_cvtext.moveTo(single.m_bpTrend.m_vecX[j], single.m_bpTrend.m_vecY[j]);
        single.m_cvtext.lineTo(single.m_bpTrend.m_vecX[j - 1], single.m_bpTrend.m_vecY[j - 1]);
        //DEBUGLOG("m_bpTrend.m_vecX[j]: " << m_bpTrend.m_vecX[j] << ", (*ptrVecY)[j]: " << (*ptrVecY)[j]);
    }
    //DEBUGLOG("Draw Line OK");
    single.m_cvtext.stroke();

    return true;
}

// �õ����ߵ�������
single.GetPoint = function () {
    var dw  = 0.0;
    var dh  = 0.0;

    single.m_bpTrend.m_vecY = [];
    single.m_bpTrend.m_vecX = [];

    dw = (single.m_iPointWidth*1.0) / (1 + single.m_idxEnd - single.m_idxBegin); // �ø�������С���
    for (var i = single.m_idxBegin; (i < single.m_idxEnd) && (i < single.m_vecDayXLine.length) ; i++) {    // �Ʊ�X������
        single.m_bpTrend.m_vecX.push(single.m_iPointLeft + single.m_iPointWidth - dw - (i - single.m_idxBegin) * dw); // �������󻭣��ұ߿ճ�1���Ŀռ�
    }

    // ����dh
    if (single.m_iShowMax == single.m_iShowMin){
        dh = 0;
    }
    else {
        dh = 1.0*single.m_iPointHeight / (single.m_iShowMax - single.m_iShowMin);
    }
    // ����Y������
    for (var j = single.m_idxBegin; (j < single.m_idxEnd) && (j < single.m_vecDayYLine.length); j++){
        if (0 == dh){
            single.m_bpTrend.m_vecY.push(single.m_iPointTop + single.m_iPointHeight/2);
        }
        else{
            single.m_bpTrend.m_vecY.push(single.m_iPointTop + single.m_iPointHeight - (single.m_vecDayYLine[j] - single.m_iShowMin) * dh);
        }
    }

    return true;
}

// �������Ϣ
single.DrawSign = function () {
    //if (NULL == CUserInfo::Instance()->m_pInfo)
    {
        return single.DrawSignNormal();
    }
   // else
   // {
	//	    return DrawSignTrain(strRetCode);
   // }
}

single.DrawSignNormal = function () {
    // ������������
    var fontSize = 15;
    single.m_cvtext.beginPath();
    single.m_cvtext.fillStyle = "#ff0000";
    single.m_cvtext.font = fontSize + "px arial";
    single.m_cvtext.lineWidth = 0.2;
    single.m_cvtext.strokeStyle = "#ff0000";

    var idxPointDay = 0;
    for (var i = single.m_idxBegin; (i < single.m_idxEnd) && (i < single.m_vecDayXLine.length); i++){
        idxPointDay = i - single.m_idxBegin;
        if ((12 == single.m_vecDayXLine[i] % 10000 / 100) || (1 == single.m_vecDayXLine[i] % 10000 / 100)){
            single.m_cvtext.moveTo(single.m_bpTrend.m_vecX[idxPointDay], single.m_iPointTop);
            single.m_cvtext.lineTo(single.m_bpTrend.m_vecX[idxPointDay], single.m_iPointTop + single.m_iPointHeight);
            //single.m_cvtext.stroke();
            single.m_cvtext.fillText(single.m_vecDayXLine[i] + '', 
                single.m_bpTrend.m_vecX[idxPointDay] - 30, 
                single.m_iPointTop + single.m_iPointHeight + fontSize);
        }
    }
    single.m_cvtext.stroke();

    // ��һЩ��־�Ե�Y��ҵ����ֵ
    fontSize = 12;
    single.m_cvtext.font = fontSize + "px arial";
    var KM = single.m_iShowMax - single.m_iShowMin;
    for (var t = 0; t < 9; t++){
        single.m_cvtext.fillText(Math.round(single.m_iShowMax - (KM / 9.0)*t) / 100 + '', 
            single.m_iPointLeft + 1, single.m_iPointTop + 1 + fontSize + t * (single.m_iPointHeight / 9.0));
    }
    single.m_cvtext.fillText(Math.round(single.m_iShowMax - (KM / 9.0) * 9) / 100 + '', 
        single.m_iPointLeft + 1, single.m_iPointTop + 1 + single.m_iPointHeight);

    return true;
}

// ���Ҳ���Ϣ
single.DrawInfo = function () {
   // if (NULL == CUserInfo::Instance()->m_pInfo)
    {
        return single.DrawInfoNormal();
    }
  //  else
  //  {
	//	return DrawInfoTrain(strRetCode);
  //  }

}

single.DrawInfoNormal = function () {
    var i = 1;
    var temp = "";

    single.m_cvtext.beginPath();
    single.m_cvtext.fillStyle = "#ff0000";
    single.m_cvtext.font = "15px arial";
    single.m_cvtext.fillText(single.m_strCode + "  " + single.m_strName, single.m_iInfoLeft + 20, single.m_iInfoTop + i++*20);
    if ((0 < single.m_vecDayXLine.length) && (single.m_iCurrDayIdx < single.m_vecDayXLine.length))
    {
        temp = "Date: " + single.m_vecDayXLine[single.m_iCurrDayIdx];
    }
    single.m_cvtext.fillText(temp, single.m_iInfoLeft + 10, single.m_iInfoTop + i++*20);

    if ((0 > single.m_iCurrDayIdx) || (single.m_vecDayYLine.length <= single.m_iCurrDayIdx))
    {
        return true;
    }
    temp = "Close: " + single.m_vecDayYLine[single.m_iCurrDayIdx]/100.0;
    single.m_cvtext.fillText(temp, single.m_iInfoLeft + 10, single.m_iInfoTop + i++*20);

    return true;
}

single.MouseDown = function (ev) {
    single.m_bCross = single.m_bCross ? false : true;
}

single.MouseMove = function (ev) {
    if (false == single.m_bCross) {
        return true;
    }
    
    if (ev.clientX <= single.m_iPointLeft || ev.clientX >= single.m_iPointWidth
        || ev.clientY <= single.m_iPointTop || ev.clientY >= single.m_iPointHeight) {
        single.show();
        return true;
    }

    if (false == single.SetCurrPoint(ev)) {    // ���õ�ǰλ�ö�Ӧ����������
        console.log("Error: Call single.SetCurrPoint error.");
        return false;
    }

    if (false == single.show()) {  // ˢ��
        console.log("Error: Call single.show error.");
        return false;
    }

    // ��ʮ����
    single.m_cvtext.lineWidth = 0.5;
    single.m_cvtext.beginPath();
    single.m_cvtext.strokeStyle = "#ffffff";
    single.m_cvtext.moveTo(ev.clientX, single.m_iPointTop);
    single.m_cvtext.lineTo(ev.clientX, single.m_iPointHeight);
    single.m_cvtext.moveTo(single.m_iPointLeft, ev.clientY);
    single.m_cvtext.lineTo(single.m_iPointWidth, ev.clientY);
    //single.m_cvtext.setLineDash([5, 20]);
    //ogc.lineTo(ev.clientX-oc.offsetLeft,ev.clientY-oc.offsetTop);
    single.m_cvtext.stroke();

    return true;
}

single.SetCurrPoint = function (ev) {
    var dw = 0.0;
    var dRightX = 0.0;

    single.m_iMouseX = ev.clientX;
    single.m_iMouseY = ev.clientY;

    dw = single.m_iPointWidth * 1.0 / (1 + single.m_idxEnd - single.m_idxBegin);
    dRightX = single.m_iPointWidth - single.m_iMouseX + single.m_iPointLeft; // x����ұ߽�ľ���
    single.m_iCurrDayIdx = Math.round((dRightX - dw) / dw) + single.m_idxBegin;
    if (0 > single.m_iCurrDayIdx)
    {
        single.m_iCurrDayIdx = 0;
    }

    if (single.m_iCurrDayIdx >= single.m_vecDayXLine.length)
    {
        single.m_iCurrDayIdx = 0;
        return false;
    }

    return true;
}

single.Zoom = function (iScale) {
	var iTempBegin  = 0;
	var iTempEnd    = 0;

	if (ZoomType.add == iScale) // ��������
	{
	    iTempBegin = single.m_idxBegin + Math.floor((single.m_iCurrDayIdx - single.m_idxBegin)/2);
	    iTempEnd = single.m_idxEnd - Math.floor((single.m_idxEnd - single.m_iCurrDayIdx)/2);
		if (0 > iTempBegin)
		{
			iTempBegin = 0;
		}
		if ((0 < single.m_vecDayXLine.length) && (single.m_vecDayXLine.length <= iTempEnd))
		{
		    iTempEnd = single.m_vecDayXLine.length - 1;
		}
		if (iTempEnd < iTempBegin)
		{
		    iTempBegin = single.m_idxBegin;
		    iTempEnd = single.m_idxEnd;
		}
	}

	if (ZoomType.sub == iScale) // ������С
	{
	    iTempBegin = single.m_idxBegin - (single.m_iCurrDayIdx - single.m_idxBegin);
	    iTempEnd = single.m_idxEnd + (single.m_idxEnd - single.m_iCurrDayIdx);
		if (0 > iTempBegin)
		{
			iTempBegin = 0;
		}
		if ((0 < single.m_vecDayXLine.length) && (single.m_vecDayXLine.length <= iTempEnd))
		{
		    iTempEnd = single.m_vecDayXLine.length - 1;
		}
		if (iTempEnd < iTempBegin)
		{
		    iTempBegin = single.m_idxBegin;
		    iTempEnd = single.m_idxEnd;
		}
	}

	if (ZoomType.left == iScale) // ��������
	{

	}

	if (ZoomType.right == iScale) // ��������
	{

	}

	single.m_idxBegin = iTempBegin;
	single.m_idxEnd = iTempEnd;

	if (false == single.GetShowMValue()){  // �õ���ʾ������ֵ
		console.log("Call GetShowMValue.");
		return false;
	}

	if (false == single.show()) {
	    console.log("call single.show() error.");
	    return false;
	}

	return true;
}

single.GetShowMValue = function(){
    single.m_iShowMax = single.m_iShowMin = 0;
    if (0 < single.m_vecDayYLine.length)
    {
        single.m_iShowMax = single.m_iShowMin = single.m_vecDayYLine[0];
    }
    for (var i = single.m_idxBegin; (i < single.m_idxEnd) && (i < single.m_vecDayYLine.length); i++)
    {
        single.m_iShowMax = single.m_vecDayYLine[i] > single.m_iShowMax ? single.m_vecDayYLine[i] : single.m_iShowMax;
        single.m_iShowMin = single.m_vecDayYLine[i] < single.m_iShowMin ? single.m_vecDayYLine[i] : single.m_iShowMin;
    }
	return true;
}
