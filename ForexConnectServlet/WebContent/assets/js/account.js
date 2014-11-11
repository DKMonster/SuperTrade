$(document).ready(function() {
	var body = $('body , html');
	body.niceScroll({
		horizrailenabled: false
	});


	var slider = $('#slider');
	var pic = slider.find('#user_pic');
	var name = slider.find('#user_name').find('.name');
	var balance = slider.find('#user_balance').find('.balance');
	var date = slider.find('#user_date').find('.date');

	$.ajax({
		async: true,
		url: "/assets/php/getAccount.php",
		type: "POST",
		dataType: "JSON",
		success: function (msg) {
			if (msg['msg'] == "success") {
				// 正確
				// console.log(msg);
				pic.attr('src','/assets/user/img/' + msg['user_picture']);
				name.html(msg['user_nickname']);
				balance.html("$500.00");
				date.html(msg['user_login_date']);
			} else if (msg['msg'] == "fail") {
				// 錯誤
				console.log("發生不知名錯誤!")
			}
		},
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(xhr.statusText);
			console.log(xhr.responseText);
			return false;
		}
	});
});