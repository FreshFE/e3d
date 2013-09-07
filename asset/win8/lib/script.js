/**
 * 定位#place的高度
 */
$(document).ready(function() {

	var windowWidth = $(window).width();
	var windowHeight = $(window).height();

	var left = Math.floor((windowWidth - 975) / 2);
	var top = Math.floor((windowHeight - 480) / 2) - 80;
	
	$('#place').css({'left': left, 'top': top});
});

