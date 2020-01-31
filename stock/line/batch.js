var batch = batch || {};

batch.m_canvas = document.getElementById("linecanvas");
batch.m_cvtext = batch.m_canvas.getContext("2d");

/*function CBatchYVal(){
    this.m_strCode  = '';
    this.m_strName  = '';
    this.m_iMax     = 0;
    this.m_iMin     = 0;
    this.m_vecItems = [];
}*/

function CBatchInfoVal(){
    this.m_strCode = "";
    this.m_iVal = 0;
}

batch.init = function () {
    console.log("batch.init");

    // ����
    batch.m_conf = conf.get('batch');
    batch.m_global = conf.get('global');

    // view ����������
    batch.m_iPointTop    = 0;
    batch.m_iPointLeft   = 0;
    batch.m_iPointHeight = 0;
    batch.m_iPointWidth  = 0;

    // view ��ʾ��Ϣ����
    batch.m_iInfoTop     = 0;
    batch.m_iInfoLeft    = 0;
    batch.m_iInfoHeight  = 0;
    batch.m_iInfoWidth   = 0;

    // ��ǰλ��
    batch.m_iMouseX      = 0;
    batch.m_iMouseY      = 0;
    batch.m_iCurrIdx     = 0;

    batch.m_bCross       = false;  // �Ƿ�ʮ����

    batch.m_mapBaseInfo = {}; // code, name

    // Զ����������
    batch.m_mapBatchYVal = {};  // ���CBatchYVal
    batch.m_vecXVal = [];
    batch.m_iMaxYVal = 0;
    batch.m_iMinYVal = 0;
    batch.m_strType  = '';

    // ���ߵ�������
    batch.m_idxBegin = 0; // ��ʾ�����±귶Χ[m_idxBegin, m_idxEnd)
    batch.m_idxEnd   = 0;

    batch.m_bpBatch = {
        m_mvY: {},
        m_vecX: []
    };

    if (false == batch.req()) {
        console.log("call batch.req() error");
        return false;
    }

    if (false == batch.show()) {
        console.log("call batch.show() error.");
        return false;
    }

    return true;
}

batch.req = function () {
    console.log("batch.req");
    /*
	�����ֶ��б�
	�ֶ�����	ֵ����	��ע
	method	�ַ���batch.line	
	code	����[]	��Ʊ����
	item	�ַ���	��Ҫ���ص�����
	date	���ͻ��	�������ڣ�����20170121
	before	����	��dateΪ��׼��ǰ�������ԲƱ�Ϊ׼����
	after	����	��dateΪ��׼����������ԲƱ�����Ϊ׼

	��Ӧ�ֶ��б�
	�ֶ�����	ֵ����	��ע
	method	ͬ��	ͬ��
	retcode	�ַ���	�����룬�ɹ�Ϊ0000
	result	����[{},{},{}��]	��Ӧ�ֶ�ֵ������Ԫ��Ϊ{��cde��: xxx, ��item1��: xxx, ��}

	result
	�ֶ�����	ֵ����	��ע
	item	�ַ���	��������
	max	float	���ֵ
	min	float	��Сֵ
	yline	{{type, mval, []}, {type, mval, []}, ��}	
	xline	[]	
	*/
    // Զ�̻�ȡ������Ϣ
    gdata.get();
    batch.m_conf = conf.get('batch');
    batch.m_global = conf.get('global');

    var vecCodes = [];
    if (0 == batch.m_conf.count){
        gdata.m_data.idx = 0;
        gdata.set();
        for (var i = 0; i < gdata.m_data.codes.length; i++){
            vecCodes.push(gdata.m_data.codes[i]);
        }
    }
    else
    {
        for (var i= gdata.m_data.idx; i<gdata.m_data.codes.length; i++){
            vecCodes.push(gdata.m_data.codes[i]);
            if (vecCodes.length >= batch.m_conf.count){
                break;
            }
        }
    }

    var req = 
        {
            "method": "batch.line",
            "code": vecCodes,
            "item": batch.m_conf.show,
            "date": batch.m_global.date,
            "before": -1,
            "after": 0
        };

    function remoteBatch(objJson){
        if (objJson.retcode != '0000') {
            console.log("ERROR: retcode[" + objJson.retcode + "] != 0000");
            return false;
        }

        /*
        Response: {"method": "batch.line", "retcode": "0000", "result": 
        {"item": "Revenue", "max": 0, "min": 0, "yline": [{"code": "000002", "name": "�� �ƣ�", "max": 123422, "min": 8894, 
        "items": [47290, 51221, 18589, 123422, 42259, 60183, 14611, 115952, 29329, 41372, 8894]}, 
        {"code": "000004", "name": "��ũ�Ƽ�", "max": 115, "min": 10, "items": [41, 18, 10, 70, 115, 88, 13, 31, 29, 38, 20]}], 
        "xline": [20170930, 20170630, 20170331, 20161231, 20160930, 20160630, 20160331, 20151231, 20150930, 20150630, 20150331]}}
        */
        batch.m_strType = objJson.result.item;
        batch.m_iMaxYVal = objJson.result.max;
        batch.m_iMinYVal = objJson.result.min;

        if (undefined != objJson.result.xline) {
            batch.m_vecXVal = objJson.result.xline;
        }

        if (undefined != objJson.result.yline) {
            for (var i = 0; i < objJson.result.yline.length; i++) {
                batch.m_mapBatchYVal[objJson.result.yline[i].code] = objJson.result.yline[i];
            }
            //var item = new CBatchYVal;
        }

        // ��ʾ��������
        batch.m_idxBegin = 0;
        batch.m_idxEnd = batch.m_vecXVal.length;

        return true;
    }
	gdata.send(req, remoteBatch);
	
	if (false == batch.GetShowMValue()){   // �õ���ʾ������ֵ
		console.error("Call GetShowMValue.");
		return false;
	}

    return true;
}

batch.show = function () {
    console.log("batch.show");

    //������ɫ
    batch.m_cvtext.clearRect(0, 0, batch.m_canvas.width, batch.m_canvas.height);
    batch.m_cvtext.beginPath();
    batch.m_cvtext.fillStyle = "#ffffff";
    batch.m_cvtext.font = "20px SimSun";

    // �����������
    batch.m_iPointTop = 2;
    batch.m_iPointLeft = 2;
    batch.m_iPointHeight = batch.m_canvas.height - 35;
    batch.m_iPointWidth = batch.m_canvas.width - 200;

    // �Ҳ���Ϣ����
    batch.m_iInfoTop = 2;
    batch.m_iInfoLeft = batch.m_iPointLeft + batch.m_iPointWidth;
    batch.m_iInfoHeight = batch.m_iPointHeight;
    batch.m_iInfoWidth = batch.m_canvas.width - 2 - batch.m_iInfoLeft;

    //������ı߿�
    //-------------->
    //              |
    //<------------\|/
    batch.m_cvtext.lineWidth = 1.5;
    batch.m_cvtext.beginPath();
    batch.m_cvtext.strokeStyle = "#ff0000";
    batch.m_cvtext.moveTo(batch.m_iPointLeft, batch.m_iPointTop);
    batch.m_cvtext.lineTo(batch.m_iPointLeft + batch.m_iPointWidth, batch.m_iPointTop);
    batch.m_cvtext.lineTo(batch.m_iPointLeft + batch.m_iPointWidth, batch.m_iPointTop + batch.m_iPointHeight);
    batch.m_cvtext.lineTo(batch.m_iPointLeft, batch.m_iPointTop + batch.m_iPointHeight);
    batch.m_cvtext.lineTo(batch.m_iPointLeft, batch.m_iPointTop);
    batch.m_cvtext.stroke();

    // ������ı߿�
    batch.m_cvtext.lineWidth = 1.5;
    batch.m_cvtext.beginPath();
    batch.m_cvtext.strokeStyle = "#ff0000";
    batch.m_cvtext.moveTo(batch.m_iInfoLeft, batch.m_iInfoTop);
    batch.m_cvtext.lineTo(batch.m_iInfoLeft + batch.m_iInfoWidth, batch.m_iInfoTop);
    batch.m_cvtext.lineTo(batch.m_iInfoLeft + batch.m_iInfoWidth, batch.m_iInfoTop + batch.m_iInfoHeight);
    batch.m_cvtext.lineTo(batch.m_iInfoLeft, batch.m_iInfoTop + batch.m_iInfoHeight);
    batch.m_cvtext.lineTo(batch.m_iInfoLeft, batch.m_iInfoTop);
    batch.m_cvtext.stroke();

    // ����������
    //ctx.lineWidth = 1;
    for (var y = batch.m_iPointHeight + batch.m_iPointTop - batch.m_iPointHeight / 9;
        y > batch.m_iPointTop + 10;y -= batch.m_iPointHeight / 9){
        batch.m_cvtext.lineWidth = 0.5;
        batch.m_cvtext.beginPath();
        batch.m_cvtext.strokeStyle = "#ff0000";
        batch.m_cvtext.moveTo(batch.m_iPointLeft, y);
        batch.m_cvtext.lineTo(batch.m_iPointLeft + batch.m_iPointWidth, y);
        batch.m_cvtext.stroke();
    }

    // ���������
    if (false == batch.DrawPoint()) {
        console.log("Call batch.DrawPoint error.");
        return false;
    }

    // ��һЩ��־����Ϣ
    if (false == batch.DrawSign())
    {
        console.log("Call batch.DrawSign error.");
        return false;
    }

    // ���Ҳ���ʾ��Ϣ
    if (false == batch.DrawInfo())
    {
        console.log("Call batch.DrawInfo error.");
        return false;
    }

    return true;
}

// ���������
batch.DrawPoint = function () {
    if (false == batch.GetPointInfo()){
        console.log("Call batch.GetPointInfo error");
        return false;
    }
    console.log("m_iPointTop: " + batch.m_iPointTop + ", m_iPointHeight: " + batch.m_iPointHeight 
        + ", m_iPointLeft: " + batch.m_iPointLeft + ", m_iPointWidth: " + batch.m_iPointWidth);

    var i = 0;
    for (var iter in batch.m_bpBatch.m_mvY) // �Ʊ�����
    {
        // ѡ�񻭱���ɫ
        batch.m_cvtext.lineWidth = 1;
        batch.m_cvtext.beginPath();
        batch.m_cvtext.strokeStyle = "#ff0000";
        if (0 < batch.m_conf.color.length) {
            batch.m_cvtext.strokeStyle = batch.m_conf.color[i%batch.m_conf.color.length];
            i++;
            //console.log('draw color. type: ' + iter + ', color: ' + single.m_cvtext.strokeStyle);
        }

        //console.log(batch.m_bpBatch.m_mvY[iter]);
        var ptrVecY = batch.m_bpBatch.m_mvY[iter];
        console.log("ptrVecY.length: " + ptrVecY.length);
        for (var j = 1; j < ptrVecY.length; j++)
        {
            if ((0 == ptrVecY[j - 1]) || (0 == ptrVecY)[j])
            {
                continue;
            }
            batch.m_cvtext.moveTo(batch.m_bpBatch.m_vecX[j], ptrVecY[j]);
            batch.m_cvtext.lineTo(batch.m_bpBatch.m_vecX[j - 1], ptrVecY[j - 1]);
            //DEBUGLOG("m_bpReport.m_vecX[j]: "<< m_bpBatch.m_vecX[j]<<", (*ptrVecY)[j]: "<< (*ptrVecY)[j]
            //	<<", date: "<< m_vecXVal[j]);
        }
        batch.m_cvtext.stroke();
    }

    return true;
}

// �õ����ߵ�������
batch.GetPointInfo = function () {
    var dw = 0.0;
	var dh = 0.0;
	var vecYPoint = [];

	batch.m_bpBatch.m_mvY = {};
	batch.m_bpBatch.m_vecX = [];
	dw = (batch.m_iPointWidth*1.0) / (1 + batch.m_idxEnd - batch.m_idxBegin); // �ø�������С���
	for (var i = batch.m_idxBegin; (i < batch.m_idxEnd) && (i < batch.m_vecXVal.length); i++) // �Ʊ�X������
	{
	    batch.m_bpBatch.m_vecX.push(batch.m_iPointLeft + batch.m_iPointWidth - dw - (i - batch.m_idxBegin)*dw); // �������󻭣��ұ߿ճ�1���Ŀռ�
	}
	console.log('batch.m_bpBatch.m_vecX:');
	console.log(batch.m_bpBatch.m_vecX);

	var iMax = 0;
	var iMin = 0;
	for (var iter in batch.m_mapBatchYVal) // �Ʊ�Y������
	{
	    vecYPoint = [];
	    switch (batch.m_conf.absolute)
		{
		case 0:  // �������
		    iMax = batch.m_mapBatchYVal[iter].max;
		    iMin = batch.m_mapBatchYVal[iter].min;
		    if (false == batch.GetPointY(iMax, iMin, batch.m_mapBatchYVal[iter].items, vecYPoint))
			{
				console.log("GetPointY error. iMax: " + iMax + ", iMin: " + iMin);
				return false;
			}
			break;
		case 1:  // ��������
			iMax = batch.m_iMaxYVal;
			iMin = batch.m_iMinYVal;
			if (false == batch.GetPointY(iMax, iMin, batch.m_mapBatchYVal[iter].items, vecYPoint))
			{
				console.log("GetPointY error. iMax: " + iMax + ", iMin: " + iMin);
				return false;
			}
			break;
		case 2:  // ��������
		{
			//iMax = m_mapBatchYVal[strCode].m_iMax;
			//iMin = m_mapBatchYVal[strCode].m_iMin;
			iMax = batch.m_iMaxYVal;
			iMin = batch.m_iMinYVal;
			if (0 < iMax)
			{
			    iMax = parseInt(10000*Math.log2(1.0*iMax));
			}
			else
			{
				iMax = 0;
			}
			if (0 < iMin)
			{
			    iMin = parseInt(10000*Math.log2(1.0*iMin));
			}
			else
			{
				iMin = 0;
			}
			var vecValue = [];
			for (var i = 0; i < batch.m_mapBatchYVal[iter].items.length; i++)
			{
			    if (0 < batch.m_mapBatchYVal[iter].items[i])
				{
			        vecValue.push(parseInt(10000 * Math.log2(1.0 * batch.m_mapBatchYVal[iter].items[i])));
				}
				else
				{
					vecValue.push(0);
				}
				//DEBUGLOG("vecValue["<<vecValue.size()-1<<"]: "<<vecValue[vecValue.size()-1]
				//	<<", origin: "<< m_mapBatchYVal[strCode].m_vecItems[i]);
			}
			
			if (false == batch.GetPointY(iMax, iMin, vecValue, vecYPoint))
			{
				console.log("GetPointY error. iMax: " + iMax + ", iMin: " + iMin);
				return false;
			}
			break;
		}
		default:
			//strRetCode = CERROUTRANGE;
		    console.log("ERROR: batch.m_conf.absolute[" + batch.m_conf.absolute + "] value is out of range.");
			return false;
	    }
	    //console.log('vecYPoint:');
	    //console.log(vecYPoint);
	    batch.m_bpBatch.m_mvY[iter] = vecYPoint.slice(0);
	    console.log(batch.m_bpBatch.m_mvY[iter]);
	}

	return true;
}

batch.GetPointY = function (nMax, nMin, vecValue, vecPoint){
	var dh = 0.0;
	//vecPoint = [];
	// ����dh
	if (nMax == nMin)
	{
		dh = 0;
	}
	else
	{
		dh = 1.0*batch.m_iPointHeight / (nMax - nMin);
	}
	// ����Y������
	for (var j = batch.m_idxBegin; (j < batch.m_idxEnd) && (j < vecValue.length); j++)
	{
		if (0 == dh)
		{
		    vecPoint.push(batch.m_iPointTop + batch.m_iPointHeight / 2);
		}
		else
		{
			//vecPoint.push_back(m_iPointTop + m_iPointHeight - (vecValue[j] - nMin)*dh);
			if (nMin <= vecValue[j])
			{
			    vecPoint.push(batch.m_iPointTop + batch.m_iPointHeight - (vecValue[j] - nMin)*dh);
			}
			else
			{
				vecPoint.push(batch.m_iPointTop + batch.m_iPointHeight);
			}
		}
	}
	//console.log('GetPointY vecPoint:');
	//console.log(vecPoint);
	return true;
}

// ��һЩ��־����Ϣ
batch.DrawSign = function () {
	//if (NULL == CUserInfo::Instance()->m_pInfo)
	{
		return batch.DrawSignNormal();
	}
	//else
	//{
	//	return DrawSignTrain(strRetCode);
	//}

	return true;
}

batch.DrawSignNormal = function () {
    // ������������
    var fontSize = 15;
    batch.m_cvtext.beginPath();
    batch.m_cvtext.fillStyle = "#ff0000";
    batch.m_cvtext.font = fontSize + "px arial";
    batch.m_cvtext.lineWidth = 0.2;
    batch.m_cvtext.strokeStyle = "#ff0000";

	var nInterval = Math.round((batch.m_idxEnd - batch.m_idxBegin + 1) / 10);
	console.log("nInterval: " + nInterval);
	if (10 > nInterval)
	{
		for (var i = batch.m_idxBegin; (i < batch.m_idxEnd) && (i < batch.m_vecXVal.length); i++)
		{
			if ((12 == Math.round(batch.m_vecXVal[i] % 10000 / 100)) || (1 == Math.round(batch.m_vecXVal[i] % 10000 / 100)))
			{
			    //console.log("batch.m_vecXVal[i]:" + batch.m_vecXVal[i]);
				batch.m_cvtext.moveTo(batch.m_bpBatch.m_vecX[i - batch.m_idxBegin], batch.m_iPointTop);
				batch.m_cvtext.lineTo(batch.m_bpBatch.m_vecX[i - batch.m_idxBegin], batch.m_iPointTop + batch.m_iPointHeight);
				batch.m_cvtext.fillText(batch.m_vecXVal[i] + '', 
                    batch.m_bpBatch.m_vecX[i - batch.m_idxBegin] - 30, 
                    batch.m_iPointTop + batch.m_iPointHeight + 16);
			}
		}
	}
	else
	{
		for (var i = batch.m_idxBegin; (i < batch.m_idxEnd) && (i < batch.m_vecXVal.length); i = i + nInterval)
		{
			batch.m_cvtext.moveTo(batch.m_bpBatch.m_vecX[i - batch.m_idxBegin], batch.m_iPointTop);
			batch.m_cvtext.lineTo(batch.m_bpBatch.m_vecX[i - batch.m_idxBegin], batch.m_iPointTop + batch.m_iPointHeight);
			batch.m_cvtext.fillText(batch.m_vecXVal[i] + '', 
                batch.m_bpBatch.m_vecX[i - batch.m_idxBegin] - 30, 
                batch.m_iPointTop + batch.m_iPointHeight + 16);
		}
	}
	batch.m_cvtext.stroke();
	
    // ��һЩ��־�Ե�Y��ҵ����ֵ
	fontSize = 12;
	batch.m_cvtext.font = fontSize + "px arial";
	if (1 == batch.m_conf.absolute)
	{
		// ֻ������עһ��
	    var KM = batch.m_iMaxYVal - batch.m_iMinYVal;
		for (var t = 0; t < 9; t++)
		{
			batch.m_cvtext.fillText(Math.round(batch.m_iMaxYVal - (KM / 9.0)*t) / 100 + '', 
                batch.m_iPointLeft + 1, batch.m_iPointTop + 1 + fontSize + t * (batch.m_iPointHeight / 9.0));
		}
		batch.m_cvtext.fillText(Math.round(batch.m_iMaxYVal - (KM / 9.0) * 9) / 100 + '', 
            batch.m_iPointLeft + 1, batch.m_iPointTop + 1 + batch.m_iPointHeight);
	}
	else if (2 == batch.m_conf.absolute)
	{
		// ֻ������עһ��
		var dMin = Math.log2(0.01*m_iMinYVal);
		var dMax = Math.log2(0.01*m_iMaxYVal);
		var KM = dMax - dMin;
		for (var t = 0; t < 9; t++)
		{
			batch.m_cvtext.fillText(Math.round((dMax - (KM / 9.0) * t)*100) / 100 + '',
                batch.m_iPointLeft + 1, batch.m_iPointTop + 1 + fontSize + t * (batch.m_iPointHeight / 9.0));
		}
		batch.m_cvtext.fillText(Math.round((dMax - (KM / 9.0) * 9) * 100) / 100 + '',
            batch.m_iPointLeft + 1, batch.m_iPointTop + 1 + t * (batch.m_iPointHeight / 9.0));
	}

	return true;
}

// ���Ҳ���ʾ��Ϣ
batch.DrawInfo = function () {
    //if (NULL == CUserInfo::Instance()->m_pInfo)
	{
		return batch.DrawInfoNormal();
	}
	//else
	//{
	//	return DrawInfoTrain(strRetCode);
    //}

	return true;
}

batch.DrawInfoNormal = function () {
    var i = 1;
    var strTemp = "";
    var vecValue = [];
    batch.m_cvtext.beginPath();
    batch.m_cvtext.fillStyle = "#ff0000";
    batch.m_cvtext.font = "15px arial";

    strTemp =  "���ͣ�" + batch.m_strType;
    batch.m_cvtext.fillText(strTemp, batch.m_iInfoLeft + 20, batch.m_iInfoTop + i++*20);
    strTemp = "Date: " + batch.m_vecXVal[batch.m_iCurrIdx];
    batch.m_cvtext.fillText(strTemp, batch.m_iInfoLeft + 20, batch.m_iInfoTop + i++ * 20);
    i++;

    for (var iter in batch.m_mapBatchYVal)
    {
        var objValue = new CBatchInfoVal;
        objValue.m_strCode = iter;
        objValue.m_iVal = batch.m_mapBatchYVal[iter].items[batch.m_iCurrIdx];
        vecValue.push(objValue);
    }
    for (var j = 1; j < vecValue.length;j++)  // ��������
    {
        var objValue = vecValue[j];
        var t = j - 1;
        for (; t >= 0; t--)
        {
            if (vecValue[t].m_iVal < objValue.m_iVal)
            {
                vecValue[t + 1] = vecValue[t];
            }
            else
            {
                vecValue[t + 1] = objValue;
                break;
            }
        }
        if (t < 0)
            vecValue[0] = objValue;
    }
    for (var j = 0; j < vecValue.length; j++)
    {
        strTemp = vecValue[j].m_strCode + ": " + (vecValue[j].m_iVal / 100);
        batch.m_cvtext.fillText(strTemp, batch.m_iInfoLeft + 20, batch.m_iInfoTop + i++ * 20);
    }

    return true;
}

batch.mousedown = function () {
    console.log("batch.mousedown");
    batch.m_bCross = batch.m_bCross ? false : true;
    return true;
}

batch.mousemove = function (ev) {
    console.log("batch.mousemove");
    if (false == batch.m_bCross) {
        return true;
    }

    if (ev.clientX <= batch.m_iPointLeft || ev.clientX >= batch.m_iPointWidth
        || ev.clientY <= batch.m_iPointTop || ev.clientY >= batch.m_iPointHeight) {
        batch.show();
        return true;
    }

    if (false == batch.SetCurrPoint(ev)) {    // ���õ�ǰλ�ö�Ӧ����������
        console.log("Error: Call single.SetCurrPoint error.");
        return false;
    }

    if (false == batch.show()) {  // ˢ��
        console.log("Error: Call single.show error.");
        return false;
    }

    // ��ʮ����
    batch.m_cvtext.lineWidth = 0.5;
    batch.m_cvtext.beginPath();
    batch.m_cvtext.strokeStyle = "#ffffff";
    batch.m_cvtext.moveTo(ev.clientX, batch.m_iPointTop);
    batch.m_cvtext.lineTo(ev.clientX, batch.m_iPointHeight);
    batch.m_cvtext.moveTo(batch.m_iPointLeft, ev.clientY);
    batch.m_cvtext.lineTo(batch.m_iPointWidth, ev.clientY);
    //single.m_cvtext.setLineDash([5, 20]);
    //ogc.lineTo(ev.clientX-oc.offsetLeft,ev.clientY-oc.offsetTop);
    batch.m_cvtext.stroke();

    return true;
}

batch.SetCurrPoint = function(ev){
	var dw = 0.0;
	var dRightX = 0.0;

	m_iMouseX = ev.clientX;
	m_iMouseY = ev.clientY;

	dw = batch.m_iPointWidth * 1.0 / (1 + batch.m_idxEnd - batch.m_idxBegin);
	dRightX = batch.m_iPointWidth - ev.clientX + batch.m_iPointLeft; // x����ұ߽�ľ���
	batch.m_iCurrIdx = Math.floor((dRightX - 0.5 * dw) / dw) + batch.m_idxBegin;
	console.debug("m_iCurrIdx: " + batch.m_iCurrIdx + ", m_vecXVal.size(): " + batch.m_vecXVal.length + ", m_idxBegin: " + batch.m_idxBegin);
	if (0 > batch.m_iCurrIdx)
	{
	    batch.m_iCurrIdx = 0;
	}

	if (batch.m_iCurrIdx >= batch.m_vecXVal.length)
	{
	    batch.m_iCurrIdx = 0;
		return false;
	}

	return true;
}


batch.Zoom = function (iScale) {
	var iTempBegin = 0;
	var iTempEnd = 0;

	if (ZoomType.add == iScale) // ��������
	{
		console.debug("ciZoomAdd == iScale");
		iTempBegin = batch.m_idxBegin + Math.floor((batch.m_iCurrIdx - batch.m_idxBegin) / 2);
		iTempEnd = batch.m_idxEnd - Math.floor((batch.m_idxEnd - batch.m_iCurrIdx) / 2);
		if (0 > iTempBegin)
		{
			iTempBegin = 0;
		}
		if ((0 < batch.m_vecXVal.length) && (batch.m_vecXVal.length <= iTempEnd))
		{
		    iTempEnd = batch.m_vecXVal.length - 1;
		}
		if ((0 < batch.m_bpBatch.m_vecX.length) && (batch.m_bpBatch.m_vecX.length <= iTempEnd))
		{
		    iTempEnd = batch.m_bpBatch.m_vecX.length - 1;
		}
		if (iTempEnd < iTempBegin)
		{
		    iTempBegin = batch.m_idxBegin;
		    iTempEnd = batch.m_idxEnd;
		}
	}

	if (ZoomType.sub == iScale) // ������С
	{
	    console.debug("ciZoomSub == iScale. m_idxBegin: " + batch.m_idxBegin + ", m_idxEnd: " + batch.m_idxEnd + ", m_iCurrIdx: " + batch.m_iCurrIdx
			+ ", m_vecXVal.size(): " + batch.m_vecXVal.length + ", m_bpBatch.m_vecX.size(): " + batch.m_bpBatch.m_vecX.length);
	    iTempBegin = batch.m_idxBegin - (batch.m_iCurrIdx - batch.m_idxBegin);
	    iTempEnd = batch.m_idxEnd + (batch.m_idxEnd - batch.m_iCurrIdx);
		if (0 > iTempBegin)
		{
			iTempBegin = 0;
		}
		if ((0 < batch.m_vecXVal.length) && (batch.m_vecXVal.length <= iTempEnd))
		{
		    iTempEnd = batch.m_vecXVal.length - 1;
		}
		/*if ((0 < m_bpBatch.m_vecX.size()) && (m_bpBatch.m_vecX.size() <= iTempEnd))
		{
			iTempEnd = m_bpBatch.m_vecX.size() - 1;
		}*/
		if (iTempEnd < iTempBegin)
		{
		    iTempBegin = batch.m_idxBegin;
		    iTempEnd = batch.m_idxEnd;
		}
	}

	if (ZoomType.left == iScale) // ��������
	{
	    return true;
	}

	if (ZoomType.right == iScale) // ��������
	{
	    return true;
	}

	if (ZoomType.begin == iScale)
	{
	    iTempBegin = batch.m_idxBegin;
	    iTempEnd = batch.m_iCurrIdx;
		if (0 > iTempBegin)
		{
			iTempBegin = 0;
		}
		if ((0 < batch.m_vecXVal.length) && (batch.m_vecXVal.length <= iTempEnd))
		{
		    iTempEnd = batch.m_vecXVal.length - 1;
		}
		/*if ((0 < m_bpBatch.m_vecX.size()) && (m_bpBatch.m_vecX.size() <= iTempEnd))
		{
		iTempEnd = m_bpBatch.m_vecX.size() - 1;
		}*/
		if (iTempEnd < iTempBegin)
		{
		    iTempBegin = batch.m_idxBegin;
		    iTempEnd = batch.m_idxEnd;
		}
	}

	if (ZoomType.end == iScale)
	{
	    iTempBegin = batch.m_iCurrIdx;
	    iTempEnd = batch.m_idxEnd;
		if (0 > iTempBegin)
		{
			iTempBegin = 0;
		}
		if ((0 < batch.m_vecXVal.length) && (batch.m_vecXVal.length <= iTempEnd))
		{
		    iTempEnd = batch.m_vecXVal.length - 1;
		}
		/*if ((0 < m_bpBatch.m_vecX.size()) && (m_bpBatch.m_vecX.size() <= iTempEnd))
		{
		iTempEnd = m_bpBatch.m_vecX.size() - 1;
		}*/
		if (iTempEnd < iTempBegin)
		{
		    iTempBegin = batch.m_idxBegin;
		    iTempEnd = batch.m_idxEnd;
		}
	}

	batch.m_idxBegin = iTempBegin;
	batch.m_idxEnd = iTempEnd;

	if (false == batch.GetShowMValue()){   // �õ���ʾ������ֵ
		console.error("Call GetShowMValue.");
		return false;
	}

	if (false == batch.show()) {
	    console.error("call batch.show() error.");
	    return false;
	}

	return true;
}

batch.GetShowMValue = function(){
	return true;
}