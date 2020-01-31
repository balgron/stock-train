var cstrCycleDay = "day";
var cstrCycleWeek = "week";
var cstrCycleMonth = "month";
var cstrCycleYear = "year";

function CKPoint()
{
    this.m_iOpen = 0;
    this.m_iClose = 0;
    this.m_iHigh = 0;
    this.m_iLow = 0;
}

var EClickRect = {};
EClickRect.eClickReserve  = 0;
EClickRect.eClickTrade    = 1;

function CClickRect (){
    this.m_eType = EClickRect.eClickReserve;
    this.m_iTop = 0;
    this.m_iLeft = 0;
    this.m_iHeight = 0;
    this.m_iWidth = 0;

    this.Reset = function(){
        this.m_eType = EClickRect.eClickReserve;
        this.m_iTop = 0;
        this.m_iLeft = 0;
        this.m_iHeight = 0;
        this.m_iWidth = 0;
    }

    this.InRect = function(x, y){
        if ((x > this.m_iLeft) && (x < this.m_iLeft + this.m_iWidth) && (y > this.m_iTop) && (y < this.m_iTop + this.m_iHeight))
        {
            return true;
        }

        return false;
    }
}

var kline = kline || {};

kline.m_canvas = document.getElementById("linecanvas");
kline.m_cvtext = kline.m_canvas.getContext("2d");

kline.init = function () {
    console.log("kline.init");
    // ����
    //console.log(conf.m_def.kline);
    //conf.set("kline", conf.m_def.kline);
    kline.m_conf = conf.get('kline');
    kline.m_global = conf.get('global');
    kline.m_user = user.get();

    // view ����������
    kline.m_iPointTop = 0;
    kline.m_iPointLeft = 0;
    kline.m_iPointHeight = 0;
    kline.m_iPointWidth = 0;

    // view ��vol����
    kline.m_iVolTop = 0;
    //m_iVolLeft = 0;
    kline.m_iVolHeight = 0;
    //m_iVolWidth = 0;

    // view ��ʾ��Ϣ����
    kline.m_iInfoTop = 0;
    kline.m_iInfoLeft = 0;
    kline.m_iInfoHeight = 0;
    kline.m_iInfoWidth = 0;

    // ��ǰλ��
    kline.m_iMouseX = 0;
    kline.m_iMouseY = 0;
    kline.m_iCurrDataIdx = 0;

    kline.m_bCross = false;  // �Ƿ�ʮ����
    kline.m_bKeyValid = true; // �����Ƿ���Ч

    // ����������Ϣ
    kline.m_strCode = "";            // ��Ʊ����
    kline.m_strCycle = "";   // ���ڣ���������
    //m_iRecover  = 0;              // �Ƿ�Ȩ
    //m_iShowCnt  = 200;            // һ����ʾԪ������

    // Զ�̻�ȡ������
    kline.m_iKMax = 0;
    kline.m_iKMin = 0;
    kline.m_iVolMax = 0;
    kline.m_iVolMin = 0;
    kline.m_vecData = [];
    kline.m_iMaxInterval = 0;  // 0���������ݶ�û��ȫ���ص��ͻ��ˣ�1��������ݼ����ꣻ2���ұ����ݼ����ꣻ3���������ݶ�������

    // ���ߵ�������
    kline.m_idxBegin = 0; // ��ʾ������m_vecData�±귶Χ
    kline.m_idxEnd = 0;

    kline.m_iShowKMax = 0; // ��ʾ�������ֵ
    kline.m_iShowKMin = 0; // ��ʾ������Сֵ
    kline.m_iShowVolMax = 0;
    kline.m_iShowVolMin = 0;
    kline.m_dw = 0;
    kline.m_vecKPoint = [];
    kline.m_vecXPoint = [];
    kline.m_vecVolPoint = [];

    kline.m_vecInfoClick = [];

    /*
    m_ptrKLineTabView = ptrTabView;
	if (NULL == m_ptrKLineTabView)
	{
		strRetCode = CERRPARAM;
		ERRORLOG("NULL == m_ptrKLineTabView. strRetCode: "<<strRetCode);
		return 1;
	}

	m_pAvgLine = new CAvgLine;
	if (0 != m_pAvgLine->Init(this, strRetCode))
	{
		ERRORLOG("Call m_pAvgLine->Init(this, strRetCode) error. strRetCode: "<<strRetCode);
		return 1;
	}
    */

    if (false == kline.GetLineData(kline.m_conf.cycle, 0, 0, 0)) {
        console.log("Call kline.GetLineData error");
        return false;
    }

    if (false == kline.show()) {
        console.log("Call kline.show error");
        return false;
    }

    return true;
}

kline.GetLineData = function(strCycle, iDate, iBefore, iAfter)
{
    // ����
    kline.m_conf = conf.get('kline');
    kline.m_global = conf.get('global');
    kline.m_user = user.get();

    // �������
    kline.m_vecData = [];

    kline.m_idxBegin = 0;
    kline.m_idxEnd = 0;
    kline.m_iShowKMax = 0;
    kline.m_iShowKMin = 0;
    kline.m_iShowVolMax = 0;
    kline.m_iShowVolMin = 0;

    kline.m_vecXPoint = [];   // X�����꣬ȫ��ͳһ
    kline.m_vecKPoint = [];   // K�ߵ�Y������
    kline.m_vecVolPoint = []; // �ɽ���Y������

    // ����������Ϣ
    if ((0 == iDate) && (0 == iBefore) && (0 == iAfter))
    {
        iDate = kline.m_global.date;
        iBefore = kline.m_conf.kcount;
        iAfter = 0;
    }

    // �õ���Ʊ����
    idxdata.get();
    if ((0 <= idxdata.m_data.idx) && (idxdata.m_data.codes.length > idxdata.m_data.idx)){
        kline.m_strCode = idxdata.m_data.codes[idxdata.m_data.idx];
        console.log("kline.m_strCode" + kline.m_strCode + ", idx:" + idxdata.m_data.idx);
    }
    else {
        console.log("ERROR: idxdata.m_data.idx: " + " error. idxdata.m_data.codes.length: " + idxdata.m_data.codes.length);
        return false;
    }
    
    if (false == kline.GetCycleData(strCycle, iDate, iBefore, iAfter))
    {
        console.log("Call GetDayData error. iDate: " + iDate + ", iBefore: " + iBefore + ", iAfter: " + iAfter);
        return false;
    }
    kline.m_strCycle = strCycle;

    if (false == kline.GetShowMValue()) {  // �õ���ʾ������ֵ
        console.error("Call GetShowMValue.");
        return false;
    }

    /*iRet = m_pAvgLine->GetData(strRetCode);
    if (0 != iRet)
    {
        ERRORLOG("Call m_pAvgLine->GetData error. strRetCode: "<<strRetCode);
        return iRet;
    }

    if (true == CConfig::Instance()->m_objSingle.m_bTradePoint)
    {
        vector<string> vecCode;
        vecCode.push_back(m_strCode);
        if (NULL == CUserInfo::Instance()->m_pPoint)
        {
            CUserInfo::Instance()->m_pPoint = new CTradePoint;
        }
        iRet = CUserInfo::Instance()->m_pPoint->Search(CUserInfo::Instance()->m_ullUserID, vecCode, m_strCycle, 0, strRetCode);
        if (0 != iRet)
        {
            ERRORLOG("Call CUserInfo::Instance()->m_pPoint->Search error. strRetCode: " << strRetCode);
            return iRet;
        }
    }*/

    return true;
}


/*
�����ֶ��б�
�ֶ�����	ֵ����	��ע
method	�ַ���kline.line
code	�ַ���	��Ʊ����
cycle	�ַ���	day, week, month, year
recover	����	0������Ȩ��1����ǰ��Ȩ��2�����Ȩ
date	���ͻ��	�������ڣ�����20170121
before
after

��Ӧ�ֶ��б�
�ֶ�����	ֵ����	��ע
method	ͬ��	ͬ��
retcode	�ַ���	�����룬�ɹ�Ϊ0000
result	����{��kline��: [[],[],[]��], ��max��: xxx, ��min��: xxx, ��share��: [{��date��: xxx, ��vol��: xxx}, {��date��: xxx, ��vol��: xxx}, ��]}	��Ӧ�ֶ�ֵ������Ԫ��Ϊ

kline
�ֶ�����	ֵ����	��ע
date	int	����
open	int	����
close	int	����
high	int	���
low	int	���
amount	int	�ɽ���
vol	int	�ɽ���
daycount	int	����
*/
kline.GetCycleData = function (strCycle, iDate, iBefore, iAfter)
{
    var req = 
        {
            "method":"index.kline",
            "code": kline.m_strCode,
            "cycle": strCycle,
            "date": iDate,
            "before": iBefore,
            "after": iAfter
        };
    console.log('kline.req: ' + JSON.stringify(req));
    function remoteKline(objJson) {
        if (objJson.retcode != '0000') {
            console.log("ERROR: retcode[" + objJson.retcode + "] != 0000");
            return false;
        }
        kline.m_iKMax = objJson.result.kmax;
        kline.m_iKMin = objJson.result.kmin;
        kline.m_iVolMax = objJson.result.volmax;
        kline.m_iVolMin = objJson.result.volmin;
        kline.m_vecData = objJson.result.kline;

        return true;
    }
    idxdata.send(req, remoteKline);

	// ��ʾ��������
	kline.m_idxBegin = 0;
	kline.m_idxEnd = kline.m_vecData.length;

	// ��ʾ������ֵ
	kline.m_iShowKMax = kline.m_iKMax;
	kline.m_iShowKMin = kline.m_iKMin;
	kline.m_iShowVolMax = kline.m_iVolMax;
	kline.m_iShowVolMin = kline.m_iVolMin;

	return true;
}

kline.show = function () {
    //console.log("kline.show");

    //������ɫ
    kline.m_cvtext.clearRect(0, 0, kline.m_canvas.width, kline.m_canvas.height);
    kline.m_cvtext.beginPath();
    kline.m_cvtext.fillStyle = "#ffffff";
    kline.m_cvtext.font = "20px SimSun";

    // �����������
    kline.m_iPointTop = 2;
    kline.m_iPointLeft = 2;
    kline.m_iPointHeight = (kline.m_canvas.height - 35) * 5 / 6; // ��vol��4:1�ָ߶�;
    kline.m_iPointWidth = kline.m_canvas.width - 200;
    kline.m_iVolTop = kline.m_iPointTop + kline.m_iPointHeight;
    kline.m_iVolHeight = (kline.m_canvas.height - 35) / 6;

    // �Ҳ���Ϣ����
    kline.m_iInfoTop = 2;
    kline.m_iInfoLeft = kline.m_iPointLeft + kline.m_iPointWidth;
    kline.m_iInfoHeight = kline.m_iPointHeight + kline.m_iVolHeight;
    kline.m_iInfoWidth = kline.m_canvas.width - 2 - kline.m_iInfoLeft;

    //������K�ı߿�
    //-------------->
    //              |
    //<------------\|/
    kline.m_cvtext.lineWidth = 1.5;
    kline.m_cvtext.beginPath();
    kline.m_cvtext.strokeStyle = "#ff0000";
    kline.m_cvtext.moveTo(kline.m_iPointLeft, kline.m_iPointTop);
    kline.m_cvtext.lineTo(kline.m_iPointLeft + kline.m_iPointWidth, kline.m_iPointTop);
    kline.m_cvtext.lineTo(kline.m_iPointLeft + kline.m_iPointWidth, kline.m_iPointTop + kline.m_iPointHeight);
    kline.m_cvtext.lineTo(kline.m_iPointLeft, kline.m_iPointTop + kline.m_iPointHeight);
    kline.m_cvtext.lineTo(kline.m_iPointLeft, kline.m_iPointTop);
    kline.m_cvtext.stroke();

    //������vol�ı߿�
    kline.m_cvtext.lineWidth = 1.5;
    kline.m_cvtext.beginPath();
    kline.m_cvtext.strokeStyle = "#ff0000";
    kline.m_cvtext.moveTo(kline.m_iPointLeft, kline.m_iVolTop);
    kline.m_cvtext.lineTo(kline.m_iPointLeft + kline.m_iPointWidth, kline.m_iVolTop);
    kline.m_cvtext.lineTo(kline.m_iPointLeft + kline.m_iPointWidth, kline.m_iVolTop + kline.m_iVolHeight);
    kline.m_cvtext.lineTo(kline.m_iPointLeft, kline.m_iVolTop + kline.m_iVolHeight);
    kline.m_cvtext.lineTo(kline.m_iPointLeft, kline.m_iVolTop);
    kline.m_cvtext.stroke();

    //������ı߿�
    kline.m_cvtext.lineWidth = 1.5;
    kline.m_cvtext.beginPath();
    kline.m_cvtext.strokeStyle = "#ff0000";
    kline.m_cvtext.moveTo(kline.m_iInfoLeft, kline.m_iInfoTop);
    kline.m_cvtext.lineTo(kline.m_iInfoLeft + kline.m_iInfoWidth, kline.m_iInfoTop);
    kline.m_cvtext.lineTo(kline.m_iInfoLeft + kline.m_iInfoWidth, kline.m_iInfoTop + kline.m_iInfoHeight);
    kline.m_cvtext.lineTo(kline.m_iInfoLeft, kline.m_iInfoTop + kline.m_iInfoHeight);
    kline.m_cvtext.lineTo(kline.m_iInfoLeft, kline.m_iInfoTop);
    kline.m_cvtext.stroke();

    // ����������
    for (var y = kline.m_iPointHeight + kline.m_iPointTop - kline.m_iPointHeight / 9;
    y > kline.m_iPointTop + 10;y -= kline.m_iPointHeight / 9){
        kline.m_cvtext.lineWidth = 0.5;
        kline.m_cvtext.beginPath();
        kline.m_cvtext.strokeStyle = "#ff0000";
        kline.m_cvtext.moveTo(kline.m_iPointLeft, y);
        kline.m_cvtext.lineTo(kline.m_iPointLeft + kline.m_iPointWidth, y);
        kline.m_cvtext.stroke();
    }

    // �������ߵ���
    if (false == kline.GetPoint()){
        console.log("Call GetPoint error.");
        return false;
    }

    // �����k�߼��·��ɽ���
    if (false == kline.DrawKPoint()) {
        console.log("Call DrawPoint error.");
        return false;
    }

    // ��������ʾ��Ϣ
    if (false == kline.DrawSign()) {
        console.log("Call DrawSign error.");
        return false;
    }

    // ���Ҳ���ʾ��Ϣ
    if (false == kline.DrawInfo()) {
        console.log("Call DrawInfo error.");
        return false;
    }

    // ������
    /*iRet = m_pAvgLine->Draw(strRetCode);
    if (0 != iRet)
    {
        ERRORLOG("Call m_pAvgLine->Draw error. strRetCode: " << strRetCode);
        return iRet;
    }*/

    return true;
}

kline.GetPoint = function () {
	var dh = 0.0;   // ÿ����߶�
	var dvol = 0.0; // ÿ��vol��߶�

	kline.m_vecXPoint = [];
	kline.m_vecKPoint = [];
	kline.m_vecVolPoint = [];

	if (0 >= kline.m_idxEnd - kline.m_idxBegin)
	{
		return true;
	}

	// ����X������
	kline.m_dw = 1.0*kline.m_iPointWidth / (kline.m_idxEnd - kline.m_idxBegin);  // ÿ����Ŀ���
	for (var i = kline.m_idxBegin; (i < kline.m_idxEnd) && (i < kline.m_vecData.length); i++)  // ��������
	{
	    kline.m_vecXPoint.push(kline.m_iPointLeft + kline.m_iPointWidth - (i - kline.m_idxBegin)*kline.m_dw - 0.5*kline.m_dw); // X�������
	}

	// ����Y������, k�ߺ�vol
	dh = (kline.m_iShowKMax == kline.m_iShowKMin) ? 0 : (1.0*kline.m_iPointHeight / (kline.m_iShowKMax - kline.m_iShowKMin));
	dvol = (kline.m_iShowVolMax == kline.m_iShowVolMin) ? 0 : (1.0*kline.m_iVolHeight / (kline.m_iShowVolMax - kline.m_iShowVolMin));
	for (var i = kline.m_idxBegin; (i < kline.m_idxEnd) && (i < kline.m_vecData.length); i++)
	{
	    /*
        kline
        �ֶ�����	ֵ����	��ע
        date	int	����
        open	int	����
        close	int	����
        high	int	���
        low	int	���
        amount	int	�ɽ���
        vol	int	�ɽ���
        daycount	int	����
        */
	    var objKPoint = new CKPoint();
	    objKPoint.m_iClose = kline.m_iPointTop + kline.m_iPointHeight - (kline.m_vecData[i][2] - kline.m_iShowKMin)*dh;  // close
	    objKPoint.m_iHigh = kline.m_iPointTop + kline.m_iPointHeight - (kline.m_vecData[i][3] - kline.m_iShowKMin)*dh;  // high
	    objKPoint.m_iLow = kline.m_iPointTop + kline.m_iPointHeight - (kline.m_vecData[i][4] - kline.m_iShowKMin)*dh;  // low
	    objKPoint.m_iOpen = kline.m_iPointTop + kline.m_iPointHeight - (kline.m_vecData[i][1] - kline.m_iShowKMin)*dh;  // open
	    kline.m_vecKPoint.push(objKPoint); // k�ߵ���
	    kline.m_vecVolPoint.push(kline.m_iVolTop + kline.m_iVolHeight - (kline.m_vecData[i][6] - kline.m_iShowVolMin)*dvol); // vol����
	}

	/*iRet = m_pAvgLine->GetPoint(strRetCode);  // �õ����������
	if (0 != iRet)
	{
		ERRORLOG("Call m_pAvgLine->GetPoint error. strRetCode: "<<strRetCode);
		return iRet;
	}*/

	return true;
}

kline.DrawKPoint = function () {
	for (var i = 0; i < kline.m_vecXPoint.length; i++)
	{
	    kline.m_cvtext.lineWidth = 1;
	    kline.m_cvtext.beginPath();
	    if (kline.m_vecKPoint[i].m_iClose <= kline.m_vecKPoint[i].m_iOpen) //���̼۴��ڿ��̼�Ϊ����
	    {
	        kline.m_cvtext.strokeStyle = "#FF0000";
	        kline.m_cvtext.fillStyle = "#FF0000";
	        //////////////////////begin: ��K��/////////////////////////
	        kline.m_cvtext.moveTo(kline.m_vecXPoint[i], kline.m_vecKPoint[i].m_iHigh); // ������һ�𻭸ߵ͵�
	        kline.m_cvtext.lineTo(kline.m_vecXPoint[i], kline.m_vecKPoint[i].m_iClose);
	        kline.m_cvtext.moveTo(kline.m_vecXPoint[i], kline.m_vecKPoint[i].m_iOpen); // ������һ�𻭸ߵ͵�
	        kline.m_cvtext.lineTo(kline.m_vecXPoint[i], kline.m_vecKPoint[i].m_iLow);
	        kline.m_cvtext.rect( // ���þ���
                kline.m_vecXPoint[i] - 0.5 * kline.m_dw,
                kline.m_vecKPoint[i].m_iOpen,
                kline.m_dw,
                kline.m_vecKPoint[i].m_iClose - kline.m_vecKPoint[i].m_iOpen
                );
	        //////////////////////end: ��K��/////////////////////////
	        /////////////////////begin: ��vol�ɽ���////////////////////
	        kline.m_cvtext.rect(  // ������
                kline.m_vecXPoint[i] - 0.5 * kline.m_dw,
                kline.m_vecVolPoint[i],
                kline.m_dw,
                kline.m_iVolTop + kline.m_iVolHeight - kline.m_vecVolPoint[i]
                );
	        /////////////////////end: ��vol�ɽ���////////////////////
	        kline.m_cvtext.stroke();//�������߼��߿�߿�
		}
		else
	    {
	        kline.m_cvtext.strokeStyle = "#00FFFF"; //"#40B0D0";
	        kline.m_cvtext.fillStyle = "#00FFFF"; //"#40B0D0";
	        //////////////////////begin: ��K��/////////////////////////
	        kline.m_cvtext.moveTo(kline.m_vecXPoint[i], kline.m_vecKPoint[i].m_iHigh); // ������һ�𻭸ߵ͵�
	        kline.m_cvtext.lineTo(kline.m_vecXPoint[i], kline.m_vecKPoint[i].m_iLow);
	        kline.m_cvtext.stroke();
	        kline.m_cvtext.fillRect(  // ������
                kline.m_vecXPoint[i] - 0.5 * kline.m_dw,
                kline.m_vecKPoint[i].m_iOpen,
                kline.m_dw,
                kline.m_vecKPoint[i].m_iClose - kline.m_vecKPoint[i].m_iOpen
                );
	        //////////////////////end: ��K��/////////////////////////
	        /////////////////////begin: ��vol�ɽ���////////////////////
	        kline.m_cvtext.fillRect(  // ������
                kline.m_vecXPoint[i] - 0.5 * kline.m_dw,
                kline.m_vecVolPoint[i],
                kline.m_dw,
                kline.m_iVolTop + kline.m_iVolHeight - kline.m_vecVolPoint[i]
                );
	        /////////////////////end: ��vol�ɽ���////////////////////
		}
	}
	return true;
}

kline.DrawSign = function () {
    if (false == kline.DrawSignNormal()){
        console.log("Call DrawSignNormal error.");
        return false;
    }

	return true;
}

kline.DrawSignNormal = function () {
    var fontSize = 15;
    kline.m_cvtext.beginPath();
    kline.m_cvtext.fillStyle = "#ff0000";
    kline.m_cvtext.font = fontSize + "px arial";
    kline.m_cvtext.lineWidth = 0.2;
    kline.m_cvtext.strokeStyle = "#ff0000";

    // ��һЩ��־�Ե�Y��ҵ����ֵ��ֻ������עһ��
    var KM = kline.m_iShowKMax - kline.m_iShowKMin;
	for (var t = 0; t < 9; t++)
	{
	    kline.m_cvtext.fillText(
            Math.round(kline.m_iShowKMax - (KM / 9.0)*t) / 100 + '', 
            kline.m_iPointLeft + 1, 
            kline.m_iPointTop + 1 + fontSize + t * (kline.m_iPointHeight / 9.0)
            );
	}
	kline.m_cvtext.fillText(
        Math.round(kline.m_iShowKMax - (KM / 9.0) * 9) / 100 + '', 
        kline.m_iPointLeft + 1, 
        kline.m_iPointTop + 1 + kline.m_iPointHeight
        );

    // ����������
    /*
    kline
    �ֶ�����	ֵ����	��ע
    date	int	����
    open	int	����
    close	int	����
    high	int	���
    low	int	���
    amount	int	�ɽ���
    vol	int	�ɽ���
    daycount	int	����
    */
	if (kline.m_idxEnd - kline.m_idxBegin < 10)
	{
	    if ((kline.m_idxBegin >= 0) && (kline.m_idxBegin < kline.m_vecData.length))
	    {
	        kline.m_cvtext.fillText(
                kline.m_vecData[m_idxBegin][0] + '', 
                kline.m_iPointLeft + kline.m_iPointWidth, 
                kline.m_iVolTop + kline.m_iVolHeight + 16
                );
		}
	}
	else
	{
		var idx = 0;
		for (var t = 0; t < 10; t++)
		{
		    idx = kline.m_idxBegin + Math.round((kline.m_idxEnd - kline.m_idxBegin)*t / 10);
		    if ((idx >= 0) && (idx < kline.m_vecData.length))
		    {
		        kline.m_cvtext.fillText(
                    kline.m_vecData[idx][0] + '', 
                    kline.m_iPointLeft + kline.m_iPointWidth - kline.m_iPointWidth*t / 10, 
                    kline.m_iVolTop + kline.m_iVolHeight + 16
                    );
			}
		}
	}
	if ((kline.m_idxEnd >= 1) && (kline.m_idxEnd <= kline.m_vecData.length))
	{
	    kline.m_cvtext.fillText(
            kline.m_vecData[kline.m_idxEnd - 1][0] + '', 
            kline.m_iPointLeft + 1, 
            kline.m_iVolTop + kline.m_iVolHeight + 16
            );
	}

	return true;
}

kline.DrawInfo = function () {
    kline.m_vecInfoClick = [];
	return kline.DrawInfoNormal();
}

kline.DrawInfoNormal = function () {
    kline.m_cvtext.beginPath();
    kline.m_cvtext.fillStyle = "#ff0000";
    kline.m_cvtext.font = "15px arial";
    kline.m_cvtext.clearRect(kline.m_iInfoLeft, kline.m_iInfoTop, kline.m_iInfoWidth, kline.m_iInfoHeight);

    var i = 1;
    kline.m_cvtext.fillText(kline.m_strCode, kline.m_iInfoLeft + 20, kline.m_iInfoTop + i++*20);
    if ((0 > kline.m_iCurrDataIdx) || (kline.m_vecData.length == 0) || (kline.m_iCurrDataIdx >= kline.m_vecData.length))
    {
        return true;
    }
    /*
    kline
    �ֶ�����	ֵ����	��ע
    date	int	����
    open	int	����
    close	int	����
    high	int	���
    low	int	���
    amount	int	�ɽ���
    vol	int	�ɽ���
    daycount	int	����
    */
    kline.m_cvtext.fillText("Date: " + kline.m_vecData[kline.m_iCurrDataIdx][0], kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++*20);  // date
    kline.m_cvtext.fillText("Open: " + kline.m_vecData[kline.m_iCurrDataIdx][1] / 100.0, kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++*20);  // open
    kline.m_cvtext.fillText("Close: " + kline.m_vecData[kline.m_iCurrDataIdx][2] / 100.0, kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++*20);  // close
    kline.m_cvtext.fillText("High: " + kline.m_vecData[kline.m_iCurrDataIdx][3] / 100.0, kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++*20);  // high
    kline.m_cvtext.fillText("Low: " + kline.m_vecData[kline.m_iCurrDataIdx][4] / 100.0, kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++*20);  // low
    kline.m_cvtext.fillText("Amount: " + kline.m_vecData[kline.m_iCurrDataIdx][5], kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++*20);  // amount
    kline.m_cvtext.fillText("vol: " + kline.m_vecData[kline.m_iCurrDataIdx][6], kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++*20);  // vol
    if ((kline.m_iCurrDataIdx + 1 < kline.m_vecData.length) && (kline.m_vecData[kline.m_iCurrDataIdx + 1][2] != 0))
    {
        kline.m_cvtext.fillText(
            "Chg: " + Math.round(10000 *
            (kline.m_vecData[kline.m_iCurrDataIdx][2] - kline.m_vecData[kline.m_iCurrDataIdx + 1][2])
            / kline.m_vecData[kline.m_iCurrDataIdx + 1][2]) / 100 + "%",
            kline.m_iInfoLeft + 10,
            kline.m_iInfoTop + i++ * 20);
    }
    else
    {
        kline.m_cvtext.fillText("Chg: 0", kline.m_iInfoLeft + 10, kline.m_iInfoTop + i++ * 20);

    }

    /*if (NULL != m_pAvgLine)
    {
        int j = 0;
        map<int, vector<int> >::iterator iter;
        for (iter = m_pAvgLine->m_mapData.begin(); iter != m_pAvgLine->m_mapData.end(); iter++)
        {
            if (m_iCurrDataIdx >= iter->second.size())
            {
                continue;
            }
            j++;
            sprintf(temp, "avg: %d, value %.2f", iter->first, (iter->second)[m_iCurrDataIdx] / 100.0);
            dc.TextOut(m_iInfoLeft + 10, m_iInfoTop + 2 + 7 * 20 + j * 20, temp, strlen(temp));
        }
    }*/

    return true;
}

kline.mousedown = function (ev) {
    //console.log("kline.mousedown");
    kline.m_bCross = kline.m_bCross ? false : true;

    //kline.m_objTrain.m_objClickRect
    //console.log("ev.clientX: " + ev.clientX);
    //console.log("ev.clientY: " + ev.clientY);
    //console.log("m_iPointLeft: " + kline.m_objTrain.m_objClickRect.m_iLeft);
    //console.log("m_iPointWidth: " + kline.m_objTrain.m_objClickRect.m_iWidth);
    if ((null != kline.m_objTrain) && (null != kline.m_objTrain.m_objClickRect)) {
        if (ev.clientX >= kline.m_objTrain.m_objClickRect.m_iLeft
            && ev.clientX <= kline.m_objTrain.m_objClickRect.m_iLeft + kline.m_objTrain.m_objClickRect.m_iWidth
            && ev.clientY >= kline.m_objTrain.m_objClickRect.m_iTop
            && ev.clientY <= kline.m_objTrain.m_objClickRect.m_iTop + kline.m_objTrain.m_objClickRect.m_iHeight) {
            kline.TrainTrade();
            //console.log("kline.TrainTrade occur.");
            return true;
        }
    }
    return true;
}

kline.mousemove = function (ev) {
    //console.log("kline.mousemove");

    if (false == kline.m_bCross) {
        return true;
    }

    if (ev.clientX <= kline.m_iPointLeft || ev.clientX >= kline.m_iPointWidth || ev.clientY <= kline.m_iPointTop
        || ev.clientY >= kline.m_iPointHeight + kline.m_iVolHeight) {  // �Ҳ�͵ײ������˳ߴ�Ƚ�С��left��top
        kline.show();
        kline.m_bCross = false;
        return true;
    }

    if (false == kline.SetCurrPoint(ev)) {    // ���õ�ǰλ�ö�Ӧ����������
        console.log("Error: Call single.SetCurrPoint error.");
        return false;
    }

    if (false == kline.show()) {  // ˢ��
        console.log("Error: Call single.show error.");
        return false;
    }

    // ��ʮ����
    kline.m_cvtext.lineWidth = 1;
    kline.m_cvtext.beginPath();
    kline.m_cvtext.strokeStyle = "#FFFFFF";
    kline.m_cvtext.moveTo(ev.clientX, kline.m_iPointTop);
    kline.m_cvtext.lineTo(ev.clientX, kline.m_iPointHeight + kline.m_iVolHeight);
    kline.m_cvtext.moveTo(kline.m_iPointLeft, ev.clientY);
    kline.m_cvtext.lineTo(kline.m_iPointWidth, ev.clientY);
    //single.m_cvtext.setLineDash([5, 20]);
    //ogc.lineTo(ev.clientX-oc.offsetLeft,ev.clientY-oc.offsetTop);
    kline.m_cvtext.stroke();

    return true;
}

kline.SetCurrPoint = function(ev){
	var dw          = 0.0;
	var dRightX     = 0.0;

	kline.m_iMouseX = ev.clientX;
	kline.m_iMouseY = ev.clientY;

	dw = kline.m_iPointWidth * 1.0 / (kline.m_idxEnd - kline.m_idxBegin);
	dRightX = kline.m_iPointWidth - kline.m_iMouseX + kline.m_iPointLeft; // x����ұ߽�ľ���
	kline.m_iCurrDataIdx = Math.floor(dRightX / dw) + kline.m_idxBegin;
	if (0 > kline.m_iCurrDataIdx)
	{
	    kline.m_iCurrDataIdx = 0;
	}

	if (kline.m_iCurrDataIdx >= kline.m_vecData.length)
	{
	    kline.m_iCurrDataIdx = 0;
	}

	return true;
}

kline.Zoom = function (iScale) {
	var iTempBegin = 0;
	var iTempEnd = 0;
	var bDataExtraAlter = false;  // GetLineData����֮������m_vecData�仯

	switch (iScale)
	{
	case ZoomType.add:// ��������
	    iTempBegin = kline.m_idxBegin + Math.floor((kline.m_iCurrDataIdx - kline.m_idxBegin) / 2);
	    iTempEnd = kline.m_idxEnd - Math.floor((kline.m_idxEnd - kline.m_iCurrDataIdx) / 2);
		if (0 > iTempBegin)
		{
			iTempBegin = 0;
		}
		if ((0 < kline.m_vecData.length) && (kline.m_vecData.length <= iTempEnd))
		{
		    iTempEnd = kline.m_vecData.length - 1;
		}
		if (iTempEnd < iTempBegin)
		{
		    iTempBegin = kline.m_idxBegin;
		    iTempEnd = kline.m_idxEnd;
		}
		kline.m_idxBegin = iTempBegin;
		kline.m_idxEnd = iTempEnd;
		break;
	case ZoomType.sub:// ������С
	    if ((kline.m_iCurrDataIdx < 0) || (0 == kline.m_vecData.length) || (kline.m_iCurrDataIdx >= kline.m_vecData.length))
		{
			break;
		}
	    if ((0 == kline.m_global.date) || (kline.m_vecData[kline.m_idxBegin][0] < kline.m_global.date))
		{
	        iTempBegin = kline.m_idxBegin - (kline.m_iCurrDataIdx - kline.m_idxBegin);
		}
		else
		{
	        iTempBegin = kline.m_idxBegin;
		}
		
	    iTempEnd = kline.m_idxEnd + (kline.m_idxEnd - kline.m_iCurrDataIdx);
	    if ((0 > iTempBegin) || (kline.m_vecData.length <= iTempEnd))
		{
	        if (3 == kline.m_iMaxInterval) // ����k�������Ѿ�����
			{
			    kline.m_idxBegin = (iTempBegin < 0) ? 0 : iTempBegin;
			    kline.m_idxEnd = (kline.m_vecData.length <= iTempEnd) ? (kline.m_vecData.length - 1) : iTempEnd;
				return true;
			}

	        var iBefore = iTempEnd - kline.m_iCurrDataIdx;
	        var iAfter = kline.m_iCurrDataIdx - iTempBegin;
	        var iDate = kline.m_vecData[kline.m_iCurrDataIdx][0];
	        var lOldSize = kline.m_vecData.length;
	        if (false == kline.GetLineData(kline.m_strCycle, iDate, iBefore, iAfter))
			{
	            console.error("ERROR: Call GetLineData error. iDate: " + iDate<<", iBefore: " + iBefore + ", iAfter: " + iAfter);
				break;
	        }
	        if (lOldSize == kline.m_vecData.length) {
	            kline.m_iMaxInterval = 3;
	        }
			if (kline.m_global.date != 0)
			{
			    for (; kline.m_idxBegin < kline.m_vecData.length; kline.m_idxBegin++)
				{
			        if (kline.m_vecData[kline.m_idxBegin][0] <= kline.m_global.date)
					{
						break;
					}
				}
			}
			kline.m_iCurrDataIdx = Math.floor((kline.m_idxEnd + kline.m_idxBegin) / 2);
		}
		else
		{
			if (iTempEnd < iTempBegin)
			{
			    iTempBegin = kline.m_idxBegin;
			    iTempEnd = kline.m_idxEnd;
			}
			kline.m_idxBegin = iTempBegin;
			kline.m_idxEnd = iTempEnd;
		}
		break;
	case ZoomType.left:// ��������
	    kline.m_idxEnd++;
	    kline.m_idxBegin++;
	    kline.m_iCurrDataIdx = kline.m_idxEnd;
	    if (kline.m_idxEnd >= kline.m_vecData.length)
		{
	        kline.m_idxBegin--;
	        kline.m_idxEnd--;
	        kline.m_iCurrDataIdx = kline.m_idxEnd;
	        if ((3 == kline.m_iMaxInterval) || (1 == kline.m_iMaxInterval)) { // ��������Ѿ�������
	            return true;
	        }
	        var iInterval = kline.m_idxEnd - kline.m_idxBegin;
	        var iOldSize = kline.m_vecData.length;
	        if (false == kline.GetLineData(kline.m_strCycle, kline.m_vecData[kline.m_idxEnd-1][0], 100, iOldSize-1)) // �����ˣ�һ��ȡ100������
			{
	            console.error("Call GetLineData error. date: " + kline.m_vecData[kline.m_idxEnd - 1][0]);
				return false;
	        }
	        if (iOldSize == kline.m_vecData.length) { // ��������Ѿ�������
	            kline.m_iMaxInterval = 1;
	            return true;
	        }
			bDataExtraAlter = true;
			kline.m_idxEnd = iOldSize + 1;
			kline.m_idxBegin = kline.m_idxEnd - iInterval;
			kline.m_iCurrDataIdx = kline.m_idxEnd;

            console.debug("m_vecData.size: " + kline.m_vecData.length + ", oldsize: " + iOldSize
                + ", kline.m_idxEnd: " + kline.m_idxEnd + "idxbegin: " + kline.m_idxBegin);
        }
        else{
            console.debug("!kline.m_idxEnd >= kline.m_vecData.length. m_vecData.size: " + kline.m_vecData.length 
                + ", kline.m_idxEnd: " + kline.m_idxEnd + "idxbegin: " + kline.m_idxBegin);
        }
		break;
	case ZoomType.right:// ��������
	    console.log("idxbegin: " + kline.m_idxBegin + ", idxEnd: " + kline.m_idxEnd);
	    kline.m_idxBegin--;
	    kline.m_idxEnd--;
	    console.log("idxbegin: " + kline.m_idxBegin + ", idxEnd: " + kline.m_idxEnd);
	    kline.m_iCurrDataIdx = kline.m_idxBegin;
	    if (kline.m_idxBegin < 0)
	    {
	        kline.m_idxBegin++;
	        kline.m_idxEnd++;
	        kline.m_iCurrDataIdx = kline.m_idxBegin;
	        if ((3 == kline.m_iMaxInterval) || (2 == kline.m_iMaxInterval)) { // �Ҳ������Ѿ�������
	            return true;
	        }
	        var iInterval = kline.m_idxEnd - kline.m_idxBegin;
	        var iOldSize = kline.m_vecData.length;
	        if (false == kline.GetLineData(kline.m_strCycle, kline.m_vecData[0][0], iOldSize-1, 100)) // �����ˣ�һ��ȡ100������
			{
	            console.error("Call GetLineData error. date: " << kline.m_vecData[m_idxEnd - 1][0]);
				return false;
	        }
	        console.log("iOldSize: " + iOldSize + ", kline.m_vecData.length: " + kline.m_vecData.length);
	        if (iOldSize == kline.m_vecData.length) { // �Ҳ������Ѿ�������
	            kline.m_iMaxInterval = 2;
	            return true;
	        }
			bDataExtraAlter = true;
			kline.m_idxBegin = kline.m_vecData.length - iOldSize;
			kline.m_idxEnd = kline.m_idxBegin + iInterval;
			kline.m_iCurrDataIdx = kline.m_idxBegin;

			console.debug("m_vecData.size: " + kline.m_vecData.length + ", oldsize: " + iOldSize);
	    }
	    //console.log("kline.m_global.date: " + kline.m_global.date);
	    if (0 != kline.m_global.date)
		{
	        while (kline.m_vecData[kline.m_idxBegin][0] > kline.m_global.date)
			{
	            kline.m_idxBegin++;
	            kline.m_idxEnd++;
			}
		}
		break;
	default:
		break;
	}

	if (false == kline.GetShowMValue()) {  // �õ���ʾ������ֵ
		console.error("Call GetShowMValue.");
		return false;
	}

	/*if (true == bDataExtraAlter) // ָ����������������
	{
		iRet = m_pAvgLine->GetData(strRetCode);  // ��������
		if (0 != iRet)
		{
			ERRORLOG("Call m_pAvgLine->GetData error. strRetCode: "<<strRetCode);
			return iRet;
		}
	}*/

	if (false == kline.show()) {  // ˢ��
	    console.error("Error: Call kline.show error.");
	    return false;
	}

	return true;
}

kline.NextK = function(){
	var bDataExtraAlter = false;

	kline.m_idxBegin--;
	kline.m_idxEnd--;
	kline.m_iCurrDataIdx = kline.m_idxBegin;
	if (kline.m_idxBegin < 0)
	{
	    kline.m_idxBegin++;
	    kline.m_idxEnd++;
	    kline.m_iCurrDataIdx = kline.m_idxBegin;
	    if ((3 == kline.m_iMaxInterval) || (2 == kline.m_iMaxInterval)) { // �Ҳ������Ѿ�������
	        return true;
	    }
	    var iInterval = kline.m_idxEnd - kline.m_idxBegin;
	    var iOldSize = kline.m_vecData.length;
		//iOldSize = (iOldSize == 0) ? iOldSize : iOldSize - 1;
	    if (false == kline.GetLineData(kline.m_strCycle, kline.m_vecData[0][0], iOldSize - 1, 100)) // �����ˣ�һ��ȡ100������
		{
	        console.error("Call GetLineData error. date: " + kline.m_vecData[kline.m_idxEnd - 1][0]);
			return false;
	    }
	    if (iOldSize == kline.m_vecData.length) { // �Ҳ������Ѿ�������
	        kline.m_iMaxInterval = 2;
	        return true;
	    }
		bDataExtraAlter = true;
		kline.m_idxBegin = kline.m_vecData.length - iOldSize;
		kline.m_idxEnd = kline.m_idxBegin + iInterval;
		kline.m_iCurrDataIdx = kline.m_idxBegin;

		if (kline.m_idxBegin > 0)
		{
		    kline.m_idxBegin--;
		    kline.m_idxEnd--;
		    kline.m_iCurrDataIdx = kline.m_idxBegin;
		}

		console.debug("m_vecData.size: " + kline.m_vecData.length + ", oldsize: " + iOldSize);
	}

	if ((0 != kline.m_global.date) && (kline.m_global.date < kline.m_vecData[kline.m_idxBegin][0]))
	{
	    kline.m_global.date = kline.m_vecData[kline.m_idxBegin][0];
	    conf.set('global', kline.m_global);
	}

	if (false == kline.GetShowMValue()){  // �õ���ʾ������ֵ
		console.error("Call GetShowMValue.");
		return false;
	}

	if (false == kline.show()) {  // ˢ��
	    console.error("Error: Call kline.show error.");
	    return false;
	}

	return true;
}

/*
kline
�ֶ�����	ֵ����	��ע
date	int	����
open	int	����
close	int	����
high	int	���
low	int	���
amount	int	�ɽ���
vol	int	�ɽ���
daycount	int	����
*/
kline.GetShowMValue = function () {
    if ((kline.m_vecData.length == 0) || (kline.m_idxBegin < 0) || (kline.m_idxBegin >= kline.m_vecData.length))
	{
		return true;
	}
    kline.m_iShowKMax = kline.m_vecData[kline.m_idxBegin][3];
    kline.m_iShowKMin = kline.m_vecData[kline.m_idxBegin][4];
    kline.m_iShowVolMax = kline.m_iShowVolMin = kline.m_vecData[kline.m_idxBegin][6];
    for (var i = kline.m_idxBegin; (i < kline.m_idxEnd) && (i < kline.m_vecData.length) ; i++)
	{
        kline.m_iShowKMax = (kline.m_iShowKMax > kline.m_vecData[i][3]) ? kline.m_iShowKMax : kline.m_vecData[i][3];
        kline.m_iShowKMin = (kline.m_iShowKMin < kline.m_vecData[i][4]) ? kline.m_iShowKMin : kline.m_vecData[i][4];
        kline.m_iShowVolMax = (kline.m_iShowVolMax > kline.m_vecData[i][6]) ? kline.m_iShowVolMax : kline.m_vecData[i][6];
        kline.m_iShowVolMin = (kline.m_iShowVolMin < kline.m_vecData[i][6]) ? kline.m_iShowVolMin : kline.m_vecData[i][6];
	}

	return true;
}

kline.rightMenu = function (e) {
    console.log("not support right menu");
    return false;
}