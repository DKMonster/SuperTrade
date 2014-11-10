$(document).ready(function() {
	var body = $('body , html');
	body.niceScroll({
		horizrailenabled: false
	});

	var social = $('#content').find('#social');
	social.niceScroll({
		horizrailenabled: false
	});

	var s2_content = $('#content').find('.slider2').find('.s2_content');
	s2_content.niceScroll({
		horizrailenabled: false
	});
});