/*
author: liulf

function:
    var __db_cpcj=vCpcj;
    var __db_cp=vCp;
    var vCp={"cppage":[
    {"cpdh":"A01000101","page":"1","ca":"1309-36-0","mc":"硫铁矿","ename":"Pyrite","bm":"黄铁矿"},
    {"cpdh":"A01000201","page":"1","ca":"1309-36-0","mc":"硫精砂","ename":"Pyrite concentrate;Sulfur concentrate","bm":""},
    {"cpdh":"A01000202","page":"1","ca":"1309-36-0","mc":"硫精矿粉","ename":"Powdered pyrite concentrate;Pyrites concentrate,powder;Sulfur concentrate,powder","bm":"硫精矿"},
    {"cpdh":"A02000101","page":"1","ca":"","mc":"磷矿石","ename":"Phosphorus ore","bm":""},
    {"cpdh":"A02000111","page":"2","ca":"","mc":"磷矿砂","ename":"Phosphorite grit","bm":""},
    {"cpdh":"A02000201","page":"2","ca":"","mc":"磷矿粉","ename":"Phosphate rock powder","bm":""},
    {"cpdh":"A03000101","page":"2","ca":"12447-04-0","mc":"硼矿石","ename":"Ascharite;Boric ore","bm":"硼镁矿"},
    {"cpdh":"A04000101","page":"2","ca":"","mc":"钾长石","ename":"Potash feldspar;Potassium feldspars","bm":""},
    {"cpdh":"A04000201","page":"2","ca":"12003-63-3","mc":"长石粉","ename":"Feldspar powder","bm":""},
    {"cpdh":"A04000301","page":"2","ca":"","mc":"光卤石","ename":"Carnallite","bm":""}
    ]} 
    
var vCpcj={"cjpage":[{"cjdh":"110634","cm":"拜耳光翌板材有限责任公司","pagen":"1701"},
{"cjdh":"110052","cm":"北京艾瑞斯水墨有限公司","pagen":"1701"},
{"cjdh":"110408","cm":"北京艾斯克医药技术开发有限公司","pagen":"1701"},
{"cjdh":"110010","cm":"北京爱德泰普膜制品厂","pagen":"1701"},
{"cjdh":"110165","cm":"北京安实创业科技发展有限公司","pagen":"1701"},
{"cjdh":"110134","cm":"北京安顺达装饰材料有限公司","pagen":"1701"},
{"cjdh":"110291","cm":"北京奥博星生物技术责任有限公司","pagen":"1701"},
{"cjdh":"110191","cm":"北京奥得赛化学有限公司","pagen":"1701"},
{"cjdh":"110454","cm":"北京奥克兰防水工程有限责任公司","pagen":"1701"},
{"cjdh":"110520","cm":"北京奥森特种润滑材料厂","pagen":"1701"}]}  

奥森特
*/
function ObjSearch()
{   
    this.kw = '';
    this.option = '';
    this.displayId = '';    
    this.search = function()
    { 
//        if(this.kw=='' || this.kw==null || this.kw.length<3)
//        {
//            alert('输入长度不能为小于3！');
//            return;
//        }     
//        switch(this.option)
//        {
//            //企业
//            case '0':            
//                this.searchCpcj();
//            break;
//            //产品
//            case '1':
//                this.searchCp();
//            break;
//        }
        OutputHtml(this);
    }
    this.searchCpcj= function()
    {   
        var jsonObj = new Array();
        var kw = this.kw;
//        $('#'+this.displayId).html('');
//        var displayId = this.displayId;
        $(vCpcj.cjpage).each(function(index,content){
//            var cjdhy = content.cjdh;
//            var cm = content.cm;
//            var pagen = content.pagen;       
            if(content.cm.indexOf(kw)!=-1)
            {                   
//                $('#'+displayId).append("<a href='#'>"+cm+" | "+pagen+"</a><br/>");                                
                  jsonObj.push({"cm":content.cm,"pagen":content.pagen});                  
            }
        });
        return jsonObj;
    }
    this.searchCp = function()
    {    
          var jsonObj = new Array();
          var kw = this.kw;
//          $('#'+this.displayId).html('');
//          var displayId = this.displayId;
          $.each(vCp.cppage,function(index,content){
//             var cpdh = content.cpdh;
//             var page = content.page;
//             var ca = content.ca;
//             var mc = content.mc;
//             var ename = content.ename;
//             var bm = content.bm;     
            if(content.mc.indexOf(kw)!=-1)
            {               
//              $('#'+displayId).append("<a href='#'>"+mc+" |  "+page+"</a><br/>");     
                jsonObj.push({"mc":content.mc,"page":content.page});                           
            }
         }); 
         return jsonObj; 
    }
}

 
<!--//
function __$$(id){return document.getElementById(id);} //定义获取ID的方法

function GotoPage(num){ //跳转页
	Page = num;
	OutputHtml(os);
} 

var PageSize = 20; //每页个数
var Page = 1; //当前页码

function OutputHtml(){
    //选择的企业还是产品
    var vobj = arguments[0];
	var vtmp1=vobj.option;	
	var siteList = '';
	switch(vtmp1)
	{
	    //企业
	    case '0':	      
	        siteList = os.searchCpcj();
	        var obj = eval(siteList);  //获取JSON
	        //var sites = obj.cjpage;
	        var sites = obj;
	    break;
	    //产品
	    case '1':	       
	        siteList = os.searchCp();
	        var obj = eval(siteList);  //获取JSON
//	        var sites = obj.cppage;
	        var sites = obj;
	    break;
	}	 
	//获取分页总数
	var Pages = Math.floor((sites.length - 1) / PageSize) + 1; 
	
	if(Page < 1)Page = 1;  //如果当前页码小于1
	if(Page > Pages)Page = Pages; //如果当前页码大于总数
	var Temp = "";
	
	var BeginNO = (Page - 1) * PageSize + 1; //开始编号
	var EndNO = Page * PageSize; //结束编号
	if(EndNO > sites.length) EndNO = sites.length;
	if(EndNO == 0) BeginNO = 0;
	
	if(!(Page <= Pages)) Page = Pages;
	__$$("total").innerHTML = "总页数:<strong class='f90'>" + sites.length + "</strong>&nbsp;&nbsp;显示:<strong class='f90'>" + BeginNO + "-" + EndNO + "</strong>"; 
	
	//分页
	if(Page > 1 && Page !== 1){Temp ="<a href='javascript:void(0)' onclick='GotoPage(1)'>&lt;&lt;第一页</a> <a href='javascript:void(0)' onclick='GotoPage(" + (Page - 1) + ")'>上一页</a>&nbsp;"}else{Temp = "&lt;&lt;第一页 上一页&nbsp;"};
	
	//完美的翻页列表
	var PageFrontSum = 3; //当页前显示个数
	var PageBackSum = 3; //当页后显示个数
	
	var PageFront = PageFrontSum - (Page - 1);
	var PageBack = PageBackSum - (Pages - Page);
	if(PageFront > 0 && PageBack < 0)PageBackSum += PageFront; //前少后多，前剩余空位给后
	if(PageBack > 0 && PageFront < 0)PageFrontSum += PageBack; //后少前多，后剩余空位给前
	var PageFrontBegin = Page - PageFrontSum;
	if(PageFrontBegin < 1)PageFrontBegin = 1;
	var PageFrontEnd = Page + PageBackSum;
	if(PageFrontEnd > Pages)PageFrontEnd = Pages;
	
	if(PageFrontBegin != 1) Temp += '<a href="javascript:void(0)" onclick="GotoPage(' + (Page - 10) + ')" title="前10页">..</a>';
	for(var i = PageFrontBegin;i < Page;i ++){
		Temp += " <a href='javascript:void(0)' onclick='GotoPage(" + i + ")'>" + i + "</a>";
	}
	Temp += " <strong class='f90'>" + Page + "</strong>";
	for(var i = Page + 1;i <= PageFrontEnd;i ++){
		Temp += " <a href='javascript:void(0)' onclick='GotoPage(" + i + ")'>" + i + "</a>";
	}
	if(PageFrontEnd != Pages) Temp += " <a href='javascript:void(0)' onclick='GotoPage(" + (Page + 10) + ")' title='后10页'>..</a>";
	
	if(Page != Pages){Temp += "&nbsp;&nbsp;<a href='javascript:void(0)' onclick='GotoPage(" + (Page + 1) + ");'>下一页</a> <a href='javascript:void(0)' onclick='GotoPage(" + Pages + ")'>最末页&gt;&gt;</a>"}else{Temp += "&nbsp;&nbsp;下一页 最末页&gt;&gt;"}
	
	__$$("pagelist").innerHTML = Temp;
	
	//输出数据
	
	if(EndNO == 0){ //如果为空
	    __$$("pagelist").innerHTML='';
		__$$("content").innerHTML = "<h1>没有数据</h1>";
		return;
	}
	var html = "";
		
	for(var i = BeginNO - 1;i < EndNO;i ++){
        switch(vtmp1)
        {
            //企业
            case "0":   
                html += "<a href='#' rel='bookmark' title=" +sites[i].cm+ ">";		     
		        html += "<p class='url'><span>" +sites[i].cm+ " |  "+sites[i].pagen +"</span></p></a>";		        
            break;
            //产品
            case "1":
//                if(sites[i].mc.indexOf(vobj.kw)==-1) continue;                    
                html += "<a href='#' rel='bookmark' title=" +sites[i].mc+ ">";		     
		        html += "<p class='url'><span>" +sites[i].mc+ " |  "+sites[i].page +"</span></p></a>";		        
            break;
            
        }
        
	}
	__$$("content").innerHTML = html;
	clickShow(); //调用鼠标点击事件
	
	//键盘左右键翻页
	document.onkeydown=function(e){
		var theEvent = window.event || e;
		var code = theEvent.keyCode || theEvent.which;
		if(code==37){
			if(Page > 1 && Page !== 1){
				GotoPage(Page - 1);
				
			}
		}
		if(code==39){
			if(Page != Pages){
				GotoPage(Page + 1);
			}
		}
	} 
	
	//鼠标滚轮翻页
function handle(delta){
	if (delta > 0){
		if(Page > 1 && Page !== 1){
			GotoPage(Page - 1);
		}		
	}
	else{
		if(Page != Pages){
			GotoPage(Page + 1);
		} 
	}
}

function wheel(event){
	var delta = 0;
	if (!event) /* For IE. */
		event = window.event;
	if (event.wheelDelta) { /* IE或者Opera. */
		delta = event.wheelDelta / 120;
		/** 在Opera9中，事件处理不同于IE
		*/
	if (window.opera)
		delta = -delta;
	} else if (event.detail) { /** 兼容Mozilla. */
	/** In Mozilla, sign of delta is different than in IE.
	* Also, delta is multiple of 3.
	*/
	delta = -event.detail / 3;
	}
	/** 如果 增量不等于0则触发
	* 主要功能为测试滚轮向上滚或者是向下
	*/
	if (delta)
		handle(delta);
}

/** 初始化 */
if (window.addEventListener)
	/** Mozilla的基于DOM的滚轮事件 **/
	window.addEventListener("DOMMouseScroll", wheel, false);
	/** IE/Opera. */
	window.onmousewheel = document.onmousewheel = wheel;
	
	
}

//获取链接地址和网站名称
function showLink(source){
	var siteUrl = __$$("siteurl");
	var siteName = __$$("sitename");
	var description = __$$("description");
	
	if(source.getAttribute("rel") == "bookmark"){
		var url = source.getAttribute("href");
		var title = source.getAttribute("title");
		siteUrl.innerHTML = "<a href='" + url + "' target='_blank'>"+ url +"</a>";
		siteName.innerHTML = title;
	}
	
}

//鼠标点击事件
function clickShow(){
	var links = __$$("content").getElementsByTagName("a");
	for(var i=0; i<links.length; i++){
		var url = links[i].getAttribute("href");	
		var title = links[i].getAttribute("title");
		links[i].onclick = function(){
//			showLink(this);
			return false;
		}
	}
}
//-->
