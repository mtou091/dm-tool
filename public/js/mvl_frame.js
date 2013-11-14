var $j = jQuery.noConflict();
 $j(document).ready(function(){	
	    InitFrame();	
 });

function InitFrame(){
	 if(($j.browser.msie && $j.browser.version == 6)) {
			//FollowDiv.follow();
		}
	return ;
}

FollowDiv = {
	follow : function(){
		$j('#logo_frame').css('position','absolute');
		$j('#nav_frame').css('position','absolute');
		$j(window).scroll(function(){

			var f_top = $j(window).scrollTop();
			$j('#logo_frame').css( 'top' , f_top );
			
			 var f_top_ex = $j(window).scrollTop() + $j(window).height() - $j("#nav_frame").height();
			$j('#nav_frame').css( 'top' , f_top_ex );
	
			
			
		});
	}
}

function ClearEdge(obj,whichedge) {
	var edgeoffset = (whichedge == "rightedge") ? parseInt("9px")*-1 : parseInt("0")*-1;
	if (whichedge == "rightedge") {
		var windowedge = document.body.scrollLeft + document.body.clientWidth - 30;
		tipobj.contentmeasure = tipobj.offsetWidth;
		if (windowedge - tipobj.x < tipobj.contentmeasure)
			edgeoffset = tipobj.contentmeasure + obj.offsetWidth + parseInt("9px");
	} else {
		var windowedge = document.body.scrollTop + document.body.clientHeight - 15;
		tipobj.contentmeasure = tipobj.offsetHeight;
		if (windowedge - tipobj.y < tipobj.contentmeasure)
			edgeoffset = tipobj.contentmeasure - obj.offsetHeight;
	}
	return edgeoffset;
}

function ShowTip(text,pos,tipwidth) {
	var divblock = document.createElement("div");
	divblock.setAttribute("id", "TipBox");
	document.body.appendChild(divblock);
	tipobj = document.getElementById("TipBox");
	if (document.getElementById("TipBox")) {
		tipobj = document.getElementById("TipBox")
		if (tipwidth != "") {
			tipobj.widthobj			= tipobj.style;
			tipobj.widthobj.width	= tipwidth;
		}
		var FinalLeft	= pos.offsetLeft;
		var FinalTop	= pos.offsetTop;
		var parentEl	= pos.offsetParent;
		
		while (parentEl != null) {
			FinalLeft	= FinalLeft + parentEl.offsetLeft;
			FinalTop	= FinalTop	+ parentEl.offsetTop;
			parentEl	= parentEl.offsetParent;
		}
		tipobj.x				= FinalLeft;
		tipobj.y				= FinalTop;
		tipobj.style.left		= tipobj.x - ClearEdge(pos, "rightedge") + pos.offsetWidth + "px";
		tipobj.style.top		= tipobj.y - ClearEdge(pos, "bottomedge") + "px";
		tipobj.style.visibility	= "Visible";
		iframeStr = "<iframe id='iframebox' frameBorder='0' style='filter:alpha(opacity=0);'></iframe>";
		tipobj.innerHTML = iframeStr + text;
		iframeObj = document.getElementById("iframebox");
		iframeObj.style.visibility	= "inherit";
		iframeObj.style.position	= "absolute";
		iframeObj.style.top			= "0px";
		iframeObj.style.left		= "0px";
		iframeObj.style.marginLeft	= "-1px";
		iframeObj.style.width		= tipobj.clientWidth + 4 + "px";
		iframeObj.style.height		= tipobj.clientHeight + 2 + "px";
		iframeObj.style.zIndex		= "-1";
		pos.onmouseout = function() {
			if (document.getElementById("TipBox")) {
				document.body.removeChild(document.getElementById("TipBox"));
			}
		}
	}
}