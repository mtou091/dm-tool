 $j(document).ready(function(){	
	    input_effect();	
		$j('.search_input_logo').focus( function(){$j(this).val(""); } );
		$j('.search_input_logo').blur( function(){$j(this).val("全站搜索"); } );
 });
	
 function input_effect(){
	$j('.g_input_text').focus( function(){ $j(this).css('background','#FFF'); } );
	$j('.g_input_text').blur( function(){ $j(this).css('background','#fff9ee'); } ); 
 }