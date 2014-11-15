$(document).ready(function() {
	var body = $('body , html');
	body.niceScroll({
		horizrailenabled: false
	});


	var slider = $('#slider');
	var s_pic = slider.find('#user_pic');
	var s_name = slider.find('#user_name').find('.name');
	var s_balance = slider.find('#user_balance').find('.balance');
	var s_date = slider.find('#user_date').find('.date');

	var user_info = $('#user_info');
	var user_pic = user_info.find('#user_pic');
	var user_nickname = user_info.find('#user_nickname');
	var user_email = user_info.find('#user_email');
	var user_pwd = user_info.find('#user_pwd');
	var user_pwd2 = user_info.find('#user_pwd2');

	var user_security = $('#user_security');
	var security_login_date = user_security.find('#date');
	var security_login_time = user_security.find('#time');
	var security_login_ip = user_security.find('#ip');
	var security_acp_on = user_security.find('#acp_on');
	var security_acp_off = user_security.find('#acp_off');
	var security_pep_on = user_security.find('#pep_on');
	var security_pep_off = user_security.find('#pep_off');

	var history = $('#user_history');
	var h_content = history.find('.content');

	h_content.niceScroll({
		horizrailenabled: false
	});

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

	function data_loading(msg){
		console.log(msg);
		/* slide data */
		s_pic.attr('src','/assets/user/img/' + msg['user_picture']);
		s_name.html(msg['user_nickname']);
		s_balance.html("$500.00");
		s_date.html(msg['user_login_date']);

		/* edit data */
		user_pic.attr('src','/assets/user/img/' + msg['user_picture']);
		user_nickname.val(msg['user_nickname']);
		user_email.val(msg['user_email']);

		security_login_date.html(msg['user_login_date']);
		security_login_time.html(msg['user_login_time']);
		security_login_ip.html(msg['user_login_ip']);

		if(msg['user_account_public'] == "0"){
			security_acp_off.addClass('btn-danger');
			security_acp_on.removeClass('btn-success');
		}else{
			security_acp_off.removeClass('btn-danger');
			security_acp_on.addClass('btn-success');
		}

		if(msg['user_performance_public'] == "0"){
			security_pep_off.addClass('btn-danger');
			security_pep_on.removeClass('btn-success');
		}else{
			security_pep_off.removeClass('btn-danger');
			security_pep_on.addClass('btn-success');
		}

	}

	test();

	function test(){
		var obj_account = new Object();
		obj_account.loadType = "getAccount";
		obj_account.userId = "D172574180001";
		obj_account.pwd = "7384";
		obj_account.url = "http://www.fxcorporate.com/Hosts.jsp";
		obj_account.con = "Demo";

		$.ajax({
			url: "http://localhost:8080/ForexConnectAPI/AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				console.log(data);
			},
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
				console.log(xhr.statusText);
				console.log(xhr.responseText);
				console.log(ajaxOptions);
				console.log(thrownError);
				return false;
			}
		});
	}
});