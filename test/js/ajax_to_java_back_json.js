$(document).ready(function() {
	var obj_account = new Object();
	var text_userId = $('#user_id');
	var text_pwd = $('#password');
	var text_url = $('#url');
	var text_con = $('#connection');
	var btn_getInfo = $('#btn_getAccount');


	btn_getInfo.on('click' , function(){
		obj_account.userId = text_userId.val();
		obj_account.pwd = text_pwd.val();
		obj_account.url = text_url.val();
		obj_account.con = text_con.val();
		ajaxGetAccount(obj_account);
	});

	function ajaxGetAccount(obj_account){
		console.log(JSON.stringify(obj_account));
		$.ajax({
			url: "../AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				console.log(data);
				console.log(data['userId']);
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