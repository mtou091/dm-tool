/**
 * 功能:该js文件中的代码实现了[输入自动搜索提示]功能,如百度、google搜索框中输入一些字符会以下拉列表形式给出一些提示，提高了用户体验
 * 使用说明:参见suggestions.txt文件
 * Author:sunfei(孙飞)		Date:2013.08.21
 */
var SugObj = new Object();

$(document).ready(function(){
	
	//文件加载完成后获取输入框属性信息,确保搜索提示数据和文本输入框中数据的显示效果保持一致
	//使用搜索提示功能输入框默认ID
	SugObj.keywords_input_id = "conBox";
	//搜索输入框高度
	SugObj.keywords_input_height = $("#"+SugObj.keywords_input_id+"").height()||60;
	//搜索输入框宽度
	SugObj.keywords_input_width = $("#"+SugObj.keywords_input_id+"").width()+10;
	//搜索输入框宽度字体颜色
	SugObj.keywords_input_color = $("#"+SugObj.keywords_input_id+"").css("color");
	//搜索输入框宽度字体大小
	SugObj.keywords_input_font_size = $("#"+SugObj.keywords_input_id+"").css("font-size");
	//用户输入的值
	SugObj.keywords_input_value = null;
	
	//设置显示搜索提示div的样式
	//显示提示信息的DIV的ID
	SugObj.suggestion_div_id = "sug_layer_div";
	//默认的提示信息DIV样式
	$("#"+SugObj.suggestion_div_id+"").addClass("sugLayerDiv");
	//根据输入框设置DIV宽度
	$("#"+SugObj.suggestion_div_id+"").css("width",SugObj.keywords_input_width);
	//$("#"+SugObj.suggestion_div_id+"").css("position","relative");
	//$("#"+SugObj.suggestion_div_id+"").css("overflow","hidden");//DIV 内容溢出时隐藏
	//$("#"+SugObj.suggestion_div_id+"").css("background","#fff");//DIV 背景颜色
	//$("#"+SugObj.suggestion_div_id+"").css("border","#c5dadb 1px solid");//DIV 边框样式
	//$("#"+SugObj.suggestion_div_id+"").css("display","none");//DIV 初始隐藏
	
	//提示结果默认显示提示数目
	SugObj.default_showItem_count = 20;
	//设定点击"more"所显示数目
	SugObj.more_showItem_count = 200;
	//标记上下键时所处位置
	SugObj.cursor_now_position = -1;
});


//性能考虑:如果用户每输入一个字母就立即往服务器传的的话，服务器的承载就会过大，
//于是考虑可以将每次请求延迟0.5s发送(待考虑)

$(document).ready(function(){
	
	//输入框的id为keywords_input，这里监听输入框的keyup事件
	$("#"+SugObj.keywords_input_id+"").keyup(function(event){
		if((event.keyCode >= 48 && event.keyCode <=57) || (event.keyCode >= 96 && event.keyCode <= 105) || 
				(event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode == 8)) {
			//获取输入框的值ֵ
			var kw = $("#"+SugObj.keywords_input_id+"").val();
			//去掉输入字符串两端的空格
			kw = kw.replace(/(^\s*)|(\s*$)/g,"");	
			if (kw == "") {
				//清空DIV内容
				$("#"+SugObj.suggestion_div_id+"").empty();
				//隐藏DIV
				$("#"+SugObj.suggestion_div_id+"").css("display","none");
			} else {
				//将用户输入值保存到SugObj对象中
				SugObj.keywords_input_value = kw;
				//运行Ajax请求结果
				runSearchAjax(0);
			}
		}else if(event.keyCode == 38) {	//Up Arrow
			if (--SugObj.cursor_now_position == -1) {//判断自减一后是否已移到文本框
				$("#"+SugObj.keywords_input_id+"").val(SugObj.keywords_input_value);
				//去掉提示结果的样式 #fff-白色
				$("#showDataTable tr.line").css("background","#fff");		
			}else if(SugObj.cursor_now_position == -2) {//已在文本框后按Up-Arrow移到最后一行
				//搜索提示结果索引从0开始
				var index = $("#showDataTable tr.line").length - 1;
				//搜索提交结果为0,则返回
				if (index < 0) {											
					return;
				}
				//取最后一个提示结果
				$("#"+SugObj.keywords_input_id+"").val($($("#showDataTable tr.line")[index]).text());	
				$($("#showDataTable tr.line")[index]).siblings().css("background","#fff").end().css("background","#c0c0c0");
				SugObj.cursor_now_position = index;
			}else {
				$("#"+SugObj.keywords_input_id+"").val($($("#showDataTable tr.line")[SugObj.cursor_now_position]).text());
				$($("#showDataTable tr.line")[SugObj.cursor_now_position]).siblings().css("background","#fff").end().css("background","#c0c0c0");
			}
		}else if(event.keyCode == 40) {	//Down Arrow
			var trCount = $("#showDataTable tr.line").length;
			if (++SugObj.cursor_now_position == trCount) {//判断加一操作后cursor_now_position值是否超出列表数目界限
				//超出的话就将cursor_now_position值变为初始值
				SugObj.cursor_now_position = -1;
				//并将文本框中值设为用户用于搜索
				$("#"+SugObj.keywords_input_id+"").val(SugObj.keywords_input_value);
				//去掉提示结果的样式
				$("#showDataTable tr").css("background","#fff");
			}else {
				$("#"+SugObj.keywords_input_id+"").val($($("#showDataTable tr.line")[SugObj.cursor_now_position]).text());	//将当前结果显示在输入框中
				$($("#showDataTable tr.line")[SugObj.cursor_now_position]).siblings().css("background","#fff").end().css("background","#c0c0c0");
			}
		}//End if
	});
	
	//光标离开输入框时隐藏搜索提示
	$("#"+SugObj.keywords_input_id+"").blur(function(){
		
		var intId = window.setInterval(function(){
			$("#"+SugObj.suggestion_div_id+"").css("display","none");
			window.clearInterval(intId);
		},200);
		
		$("#"+SugObj.suggestion_div_id+" tr.line").click(function(){
			window.clearInterval(intId);
			$("#"+SugObj.keywords_input_id+"").val($(this).text());
			$("#"+SugObj.keywords_input_id+"").focus();
			SugObj.cursor_now_position = -1;
			runSearchAjax(0);
		});
		
		$("#"+SugObj.suggestion_div_id+" tr.moreline").click(function(){
			window.clearInterval(intId);
			$("#"+SugObj.keywords_input_id+"").focus();
			SugObj.cursor_now_position = -1;
			runSearchAjax(1);
		});
	});
	
});

//isMore为1:多于二十条则只显示二十条,少于二十条,则有多少显示多少
//isMore为0:多于十条则只显示十条,少于十条,则有多少显示多少
function runSearchAjax(isMore) {
	console.log("开始请求！"+$("#"+SugObj.keywords_input_id+"").attr("searchURL"));
	$.ajax({
		type:"GET",
		dataType:"json",
		url:$("#"+SugObj.keywords_input_id+"").attr("searchURL"),
		data:{
			"keywords_input":escape($("#"+SugObj.keywords_input_id+"").val())
			},
		success:function(data,status) {
			if (data.sugList == null || data.sugList == undefined || data.sugList.length == 0) {
				$("#"+SugObj.suggestion_div_id+"").empty();
				$("#"+SugObj.suggestion_div_id+"").css("display","none");
			} else {
				//var result = $.parseJSON(data.sugList);
				var result = data.sugList;
				var dataArray = [];
				$.each(result,function(i,value){
					dataArray.push(value);
				});
				//获取记录的个数
				var dataItemLength = dataArray.length;
				if (dataItemLength <= 0) {
					return;	//搜索提交结果为0,则返回
				}
				
				var layerLabel = [];
				layerLabel.push(" <table id='showDataTable' width='100%' style='z-index:200'> ");//创建一个table
				if (isMore == 0) {
					if (dataItemLength <= SugObj.default_showItem_count) {
						for (var i = 0; i < dataItemLength; ++i) {
							layerLabel.push(" <tr style='cursor:pointer;color:"+SugObj.keywords_input_color+";font-size:"+SugObj.keywords_input_font_size+"' ");
							layerLabel.push(" class='line' ><td>"+dataArray[i]+"</td></tr> ");
						}
					}else{
						for (var i = 0; i < SugObj.default_showItem_count; ++i) {
							layerLabel.push(" <tr style='cursor:pointer;color:"+SugObj.keywords_input_color+";font-size:"+SugObj.keywords_input_font_size+"' ");
							layerLabel.push(" class='line' ><td>"+dataArray[i]+"</td></tr>");
						}
						layerLabel.push(" <tr style='cursor:pointer;color:"+SugObj.keywords_input_color+";font-size:"+SugObj.keywords_input_font_size+"' ");
						layerLabel.push(" class='moreline'><td style='padding-left:"+(SugObj.keywords_input_width-56)+"px'> ");
						layerLabel.push(" <span style='cursor:pointer;'>more...</span></td></tr> ");
					}
				}else if (isMore == 1) {
					if (dataItemLength <= SugObj.more_showItem_count) {
						for (var i = 0; i < dataItemLength; ++i) {
							layerLabel.push(" <tr style='cursor:pointer;color:"+SugObj.keywords_input_color+";font-size:"+SugObj.keywords_input_font_size+"' ");
							layerLabel.push(" class='line' ><td>"+dataArray[i]+"</td></tr> ");
						}
					}else{
						for (var i = 0; i < SugObj.more_showItem_count; ++i) {
							layerLabel.push(" <tr style='cursor:pointer;color:"+SugObj.keywords_input_color+";font-size:"+SugObj.keywords_input_font_size+"' ");
							layerLabel.push(" class='line' ><td>"+dataArray[i]+"</td></tr> ");
						}
					}
				}else{
					for (var i = 0; i < dataItemLength; ++i) {
						layerLabel.push(" <tr style='cursor:pointer;color:"+SugObj.keywords_input_color+";font-size:"+SugObj.keywords_input_font_size+"' ");
						layerLabel.push(" class='line' ><td>"+dataArray[i]+"</td></tr> ");
					}
				}
				layerLabel.push("</table>");
				var layer = layerLabel.join("");
				//显示DIV
				$("#"+SugObj.suggestion_div_id+"").css("display","block");
				//先清空#searchResult下的所有子元素
				$("#"+SugObj.suggestion_div_id+"").empty();
				//将刚创建的table插入到#searchResult内
			    $("#"+SugObj.suggestion_div_id+"").append(layer);
			    $("#showDataTable tr").css("color",SugObj.keywords_input_color);
			    $("#showDataTable tr").css("font-size",SugObj.keywords_input_font_size);
			    //监听提示框的鼠标悬停事件
			    $("tr.line").hover(function(){
			    	$("tr.line").css("background","#fff");
			    	$(this).css("background","#c0c0c0");
			    },function(){
			    	$(this).css("background","#fff");
			    });
			}
		}
	});
}

//输入框的坐标发生变化
function ChangeCoords() {
	//获取距离最左端的距离，像素，整型
	var left = $("#"+SugObj.keywords_input_id+"").offsetLeft;
	//获取距离最顶端的距离，像素，整型
	var top = $("#"+SugObj.keywords_input_id+"").offsetTop+keywords_input_height;
	//重新定义CSS属性
	$("#"+SugObj.suggestion_div_id+"").css("left",left+"px");						
	$("#"+SugObj.suggestion_div_id+"").css("top",top+"px");
}

//监听搜索提示结果的鼠标单击事件
function hoverAction(data) {
	//隐藏搜索提示DIV
	$("#"+SugObj.suggestion_div_id+"").css("display","none");
	//将点击数据加入到搜索提示输入框中
	$("#"+SugObj.suggestion_div_id+"").val(data);
	//将光标聚焦在搜索提示输入框中
	$("#"+SugObj.suggestion_div_id+"").focus();
	//将cursor_now_position值变为初始值
	cursor_now_position = -1;
	//运行Ajax方法,向服务器发送请求
	runSearchAjax(0);											
}

//窗体的大小改变会触发resize()事件，只需在该事件内调用ChangeCoords()方法即可
$(window).resize(ChangeCoords);
