function ObjSearch(){   
    this.kw = '';
    this.option = "all";
    this.displayId = '';
    this.data = []; 
    //this.flag = false;  
    this.baseUrl ="http://www.sanford.com:3000/"; 
    this.search = function(){ 


        var surl = this.baseUrl+"getWork?feed="+this.option+"&search="+encodeURIComponent(this.kw)+"&callback=callfeed";
        request(surl);
        /*
        var info = setInterval(function () {
           if (this.flag) {

              OutputHtml(this);
              this.flag = false;
              clearInterval(info);            
            }
        }, 10);   
        */   
    }
}


function GotoPage(num){ //跳转页
	Page = num;
	OutputHtml(os);
} 

var PageSize = 20; //每页个数
var Page = 1; //当前页码

function OutputHtml(){

    var vobj = arguments[0];	
	var feedList = vobj.data ,len = feedList.length;
    console.log(feedList);	 
	//获取分页总数
	var Pages = Math.floor((len - 1) / PageSize) + 1; 
	
	if(Page < 1)Page = 1;  //如果当前页码小于1
	if(Page > Pages)Page = Pages; //如果当前页码大于总数

	var Temp = "<ul class='pagin pagin-dark text-center'>";
	
	var BeginNO = (Page - 1) * PageSize + 1; //开始编号
	var EndNO = Page * PageSize; //结束编号
	if(EndNO > len) EndNO = len;
	if(EndNO == 0) BeginNO = 0;
	
	if(!(Page <= Pages)) Page = Pages;
      Temp +="<li><a class='switch-label-on' >总条数:&nbsp;<strong>"+len+"</strong>&nbsp;&nbsp;|&nbsp;&nbsp;显示：&nbsp;<strong>"+BeginNO+"&nbsp;-&nbsp;"+EndNO+"</strong></a></li>";
	
	//分页
	if(Page > 1 && Page !== 1){

	   Temp +="<li><a href='javascript:void(0)' onclick='GotoPage(1)'>第一页</a></li><li> <a href='javascript:void(0)' onclick='GotoPage(" + (Page - 1) + ")'>上一页</a></li>";

	}else{

	 //  Temp += "<li>第一页 上一页</li>";

	};
	
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
	
	if(PageFrontBegin != 1){

	   Temp += '<li><a href="javascript:void(0)" onclick="GotoPage(' + (Page - 10) + ')" title="前10页" class="more"><<</a></li>';
	}

	for(var i = PageFrontBegin;i < Page;i ++){
		Temp += "<li><a href='javascript:void(0)' onclick='GotoPage(" + i + ")'>" + i + "</a></li>";
	}

	Temp += "<li><a class='active'>" + Page + "</a></li>";

	for(var i = Page + 1;i <= PageFrontEnd;i ++){

		Temp += "<li><a href='javascript:void(0)' onclick='GotoPage(" + i + ")'>" + i + "</a></li>";
	}

	if(PageFrontEnd != Pages){

	   Temp += "<li><a href='javascript:void(0)' onclick='GotoPage(" + (Page + 10) + ")' title='后10页' class='more' >>></a></li>";

	}
	
	if(Page != Pages){

	   Temp += "<li><a href='javascript:void(0)' onclick='GotoPage(" + (Page + 1) + ");'>下一页</a></li><li> <a href='javascript:void(0)' onclick='GotoPage(" + Pages + ")'>最末页</a></li>";

	 }else{

	   //Temp += "<li>下一页 最末页</li>";
	 }
	
	document.getElementById("pagelist").innerHTML = Temp;
	
	//输出数据
	
	if(EndNO == 0){ //如果为空
	    document.getElementById("pagelist").innerHTML='';
		document.getElementById("siteDv").innerHTML = "<h1>没有数据</h1>";
		return;
	}

	var inhtml = "<table><tr><th>序</th><th class='text-center'>日期</th><th>需求方</th><th>产品</th><th>需求内容</th></tr>";
    var len2 = 0;
		
	for(var i = BeginNO - 1,j=0;i < EndNO;i++,j++){

      inhtml+="<tr class='"+(j%2==0?'even':'')+"'><td class='text-center'>"+(j+1)+"</td>";
      for(var v in feedList[i]){
         len2 = feedList[i][v].length; 
         for (var k= 0 ;k< len2; k++) {
           if(k==2){
            var t;
            switch(feedList[i][v][k]){
              case "a" : t ="广告"  ;break;
              case "b" : t = "bShare" ;break;
              case "w" : t = "微积分" ;break;
              case "l" : t = "乐知" ;break;
            }
            inhtml+="<td class='text-center'>"+t+"</td>";
           }else{
            inhtml+="<td class='text-center'>"+feedList[i][v][k]+"</td>";
           }
           
        };   
     }
     inhtml+="</tr>";
          
   }
   inhtml += "</table>"; 

  document.getElementById("siteDv").innerHTML = inhtml;

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

function callfeed(data){

	os.data = data.feeds.reverse();
	OutputHtml(os);
	//os.flag = true;
	//console.log(os.data);
}


//发送ajax请求
function request(url) {
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.charset = "utf-8";
        js.src = url;
       document.getElementsByTagName("head")[0].appendChild(js);

       js.onload = js.onreadystatechange = function() {
               if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') { 

               // callback在此处执行
                
                js.onload = js.onreadystatechange = null;

                 } 
            };
    }
