/*
 * Author:yanfeng.huang
 * Create:2013/5/22 
 */

MOP.MS.getSubjectList = function(pageName,tagId,pageNo){
	$.post("/happy/getSubjectList.do",{"pageName":pageName,"tagId":tagId,"type":$("#majorType").val(),"pageNo":pageNo},function(data){
		$("#subjects").html(data);
	});
};

/*********帖子翻页***********/
MOP.MS.preSubjectPage = function(currentPage){
	var prePage = currentPage - 1;
	if(prePage >= 1){
		MOP.MS.getSubjectList($("#pageName").val(),$("#tagId").val(),prePage);
	}
};

MOP.MS.nextSubjectPage = function(currentPage,maxPage){
	var nextPage = currentPage + 1;
	if(nextPage <= maxPage){
		MOP.MS.getSubjectList($("#pageName").val(),$("#tagId").val(),nextPage);
	}
};

MOP.MS.toCurrentSubjectPage = function(pageNo){
	MOP.MS.getSubjectList($("#pageName").val(),$("#tagId").val(),pageNo);
};
/**********帖子翻页处理结束**********/

/*****评论翻页*********/
MOP.MS.toCurrentCommentPage = function(subjectId,pageNo){
	MOP.MS.getCommentList(subjectId,pageNo);
};

MOP.MS.preCommentPage = function(subjectId,currentPage){
	var prePage = currentPage - 1;
	if(prePage >= 1){
		MOP.MS.getCommentList(subjectId,prePage);
	}
};
MOP.MS.nextCommentPage = function(subjectId,currentPage,maxPage){
	var nextPage = currentPage + 1;
	if(nextPage <= maxPage){
		MOP.MS.getCommentList(subjectId,nextPage);
	}
};
/*****评论翻页结束******/

MOP.MS.focusCommentInput = function(login,subjectId){
	if(login=="0"){
		$("#logined_"+subjectId).hide();
		$("#notlogin_"+subjectId).show();
	}
};

MOP.MS.getCommentList = function(subjectId,pageNo){
	$.post("/happy/getCommentList.do",{"subjectId":subjectId,"pageNo":pageNo},function(data){
	    $("#comments_"+subjectId).html(data);
	    MOP.MS.getCommentCount(subjectId);
	});
};
MOP.MS.hideComments = function(target,subjectId){
	$(target).hide().siblings().show();
	$("#comments_"+subjectId).hide();
};
MOP.MS.showComments = function(target,subjectId){
	$(target).hide().siblings().show();
	if(!$("#comments_"+subjectId).find("div").length){
		MOP.MS.getCommentList(subjectId,1);
	}
	$("#comments_"+subjectId).show();
};

MOP.MS.addTop = function(userId,subjectId){	
	if(userId==0){
		alert("您尚未登录，不能进行该操作");
		return;
	}
	
	$.post("/happy/addTop.do",{"subjectId":subjectId,"userId":userId},function(data){
		if(data == "operated"){
			alert("您已经顶过或踩过该帖子");
			return;
		}
		if(data == "success"){
			$("#top_"+subjectId).html($("#top_"+subjectId).html()*1+1);
			$("#user_top_"+userId).html($("#user_top_"+userId).html()*1+1);
			$("#add_top_"+subjectId).fadeIn();
			setTimeout(function(){
				$("#add_top_"+subjectId).fadeOut();
			},1000);
		}else{
			alert("操作失败，请稍候重试");
		}		
	});
};

MOP.MS.addStamp = function(userId,subjectId){
	if(userId==0){
		alert("您尚未登录，不能进行该操作");
		return;
	}
	
	$.post("/happy/addStamp.do",{"subjectId":subjectId,"userId":userId},function(data){
		if(data == "operated"){
			alert("您已经顶过或踩过该帖子");
			return;
		}
		if(data == "success"){
			$("#stamp_"+subjectId).html($("#stamp_"+subjectId).html()*1+1);
			$("#add_stamp_"+subjectId).fadeIn();
			setTimeout(function(){
				$("#add_stamp_"+subjectId).fadeOut();
			},1000);
		}else{
			alert("操作失败，请稍候重试");
		}
	});
};
MOP.MS.addCollect = function(userId,subjectId){
	if(userId==0){
		alert("您尚未登录，不能进行该操作");
		return;
	}
	
	$.post("/happy/addCollect.do",{"subjectId":subjectId,"userId":userId},function(data){
		if(data == "operated"){
			alert("您已经收藏该帖子");
			return;
		}
		if(data == "success"){
			$("#collect_"+subjectId).html($("#collect_"+subjectId).html()*1+1);
			$("#user_collect_"+userId).html($("#user_collect_"+userId).html()*1+1);
			$("#add_collect_"+subjectId).fadeIn();
			setTimeout(function(){
				$("#add_collect_"+subjectId).fadeOut();
			},1000);
		}else{
			alert("操作失败，请稍候重试");
		}		
	});
};

MOP.MS.removeCollect = function(userId,subjectId){
	if(userId <= 0)return;
	if(subjectId <= 0)return;
	$.post("/happy/removeCollect.do",{"userId":userId,"subjectId":subjectId},function(data){
		if(data == "success"){
			//$("#collect_"+subjectId).html($("#collect_"+subjectId).html()*1-1);
			//$("#user_collect_"+userId).html($("#user_collect_"+userId).html()*1-1);
			//location.href = "/happy/collected/user/"+userId+"/1.html";
			location.reload();
		}
	});
	//location.reload();
};

MOP.MS.removeSubject = function(userId,subjectId){
    if(userId <= 0)return;
    if(subjectId <= 0)return;
    $.post("/happy/removeSubject.do",{"userId":userId,"subjectId":subjectId},function(data){
        if(data == "success"){
            location.reload();
        }
    });
    //location.reload();
};

MOP.MS.addComment = function(userId,subjectId){
	var $value = null;
	var $userName = null;
	var $password = null;
    var isLogin=true;
    var cookieValue=MOP.MS.getCookie("mop_logon");
    if(cookieValue==null||cookieValue==""){
       isLogin=false;
    }
	if(userId==0){
		$value = $("#comment_input_hide_"+subjectId).val();
		if($value == "" || $value == null){
			alert("评论内容不能为空");
			return;
		}
		
		$userName = $("#userName_"+subjectId).val();
		$password = $("#password_"+subjectId).val();
		if($userName == null || $userName==""){
			alert("用户名为空，请输入您的猫扑账号");
			return;
		}
		if($password == null || $password==""){
			alert("密码为空，请输入您的密码");
			return;
		}
	}else{
		$value = $("#comment_input_show_"+subjectId).val();
	}
	
	if($value == "" || $value == null){
		alert("评论内容不能为空");
		return;
	}
	
	var pattern = /[^x00-xff]/g;
	var length = $value.replace(pattern,"aa").length;
	if(length >140*2){
		alert("回复内容长度不能超过140个汉字");
		return;
	}
	
	$.post("/happy/addComment.do",{"subjectId":subjectId,"userId":userId,"userName":$userName,"password":$password,"content":$value},function(data){
		if(data == "failed"){
			alert("回复失败，请稍候重试");
			return;
		}
		//刷新用户评论的帖子数目
		$("#user_comment_"+userId).html(data);
		//加载该帖子第一页的回复
		MOP.MS.getCommentList(subjectId,1);
		//显示第一页回复
        MOP.MS.showComments($("#J-show_"+subjectId),subjectId);   
		$("#comment_input_hide_"+subjectId).val("");
		$("#comment_input_show_"+subjectId).val("");
		MOP.MS.getCommentCount(subjectId);
        if(!isLogin){
            //处理下面的登录框
            $("#rUserName").text("hi,"+$userName);
            $(".dlq").css("display","none");
            $(".dlh").css("display","block");
            //处理用户信息
            MOP.MS.initAfterLoginBind();
            //登录成功后重新加载页面
            location.reload();
        }

		alert("回复成功");
	});	
};
MOP.MS.getCommentCount = function(subjectId){
	$.post("/happy/getCommentCount.do",{"subjectId":subjectId},function(data){
		if(data != "-1"){
			$("#comment_show_"+subjectId).html(data);
			$("#comment_hide_"+subjectId).html(data);			
		}	
	});
};

MOP.MS.deleteSubject=function(userId,subjectId){
    if (confirm("是否确认"))  {
        MOP.MS.removeSubject(userId,subjectId);
    }
};

//查看图片大图
MOP.MS.viewOriginalImg = function(shortImgUrl){	
	if(shortImgUrl != null && "" != shortImgUrl){		
		var size = /_[0-9]+_[0-9]+/;
		var originalUrl = shortImgUrl.replace(size,"");
		var newWin = window.open("about:blank");
		newWin.location.href=originalUrl;
	}
};

/*******************以下为分享功能js代码**********************/
$(function(){
	$(".twC").each(function(index){
		var $title = $(this).find(".cap").html();
		var $content = $.trim($(this).find(".wz02").text());
		var $subjectId = $(this).find(".text>input:hidden").val();
		var $pics = $(this).find(".xcpic a img").attr("src");
		var $movie = $(this).find("embed").attr("src");
		$content = $content + $movie;
		bShare.addEntry({
			title:$title,
			summary:$content,
			url:"http://le.mop.com/special/"+$subjectId+".html"
			//pic:$pics[0]
		});
	});
});
/******************* 分享功能js代码结束 *********************/
