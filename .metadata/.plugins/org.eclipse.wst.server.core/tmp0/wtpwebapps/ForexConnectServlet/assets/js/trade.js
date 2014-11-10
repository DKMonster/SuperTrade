$(document).ready(function() {
	var body = $('body , html');
	body.niceScroll({
		horizrailenabled: false
	});


	var obj_account = new Object();
	obj_account.loadType = "getTrade";
	obj_account.userId = "D172574180001";
	obj_account.pwd = "7384";
	obj_account.url = "http://www.fxcorporate.com/Hosts.jsp";
	obj_account.con = "Demo";

	$.ajax({
		url: "AjaxServlet",
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
});