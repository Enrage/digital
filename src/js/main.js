$(function(){
	$('.bxslider').bxSlider({
		minSlides: 2,
		maxSlides: 4,
		speed: 1000,
		captions: true,
		auto: true,
		adaptiveHeight: true,
	  autoControls: true,
	  controls: true,
	  pager: false
	});

	$('.social').on('click', function(e) {
		e.preventDefault();
		$('.social_media ul').slideToggle(500);
	});

	$('.toggle_menu').on('click', function(e) {
		e.preventDefault();
		$('.top_menu ul').slideToggle(500);
	});
});