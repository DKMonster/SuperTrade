$(document).ready(function() {

	/* nice scroll */
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

	/* base setting get dom */
	var slider = $('#slider');
	var s_pic = slider.find('#user_pic');
	var s_name = slider.find('#user_name').find('.name');
	var s_balance = slider.find('#user_balance').find('.balance');
	var s_date = slider.find('#user_date').find('.date');

	/* get account */
	$.ajax({
		async: true,
		url: "/assets/php/getAccount.php",
		type: "POST",
		dataType: "JSON",
		success: function (msg) {
			if (msg['msg'] == "success") {
				// 正確
				data_loading(msg);
			} else if (msg['msg'] == "fail") {
				// 錯誤
				console.log("發生不知名錯誤!");
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(xhr.statusText);
			console.log(xhr.responseText);
			return false;
		}
	});

	function data_loading(msg){
		/* slide data */
		s_pic.attr('src','/assets/user/img/' + msg['user_picture']);
		s_name.html(msg['user_nickname']);
		s_balance.html("$500.00");
		s_date.html(msg['user_login_date']);

		/* timeline */
		loadTimeline(msg['user_id']);
	}

	function loadTimeline(id){
		$.ajax({
			async: true,
			url: "/assets/php/getTimeline.php",
			type: "POST",
			dataType: "JSON",
			success: function (msg) {
				if (msg['msg'] == "success") {
					// 正確

				} else if (msg['msg'] == "fail") {
					// 錯誤
					console.log("發生不知名錯誤!");
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
				console.log(xhr.statusText);
				console.log(xhr.responseText);
				return false;
			}
		});
	}
});