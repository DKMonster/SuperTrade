$(document).ready(function() {
	var email , pwd;

	var btnLogin =  $('#login-form').find('#login');
	var keypressEmail = $('#login-form').find('#email');
	var keypressPwd = $('#login-form').find('#pwd');
	var txtTitle = $('#login-form').find('#title');

	btnLogin.on('click' , function(){

		email = $('#login-form').find('#email').val();
		pwd = $('#login-form').find('#pwd').val();

		if(email != "" && pwd != ""){
			login(email , pwd);
		}else{
			if(email == ""){
				fail_login("email_null");
			}else if(pwd == ""){
				fail_login("pwd_null");
			}
		}
	});

	keypressEmail.keypress(function(event){
		$(this).css({'border-color':'#333'});
		if(event.keyCode == 13){
			btnLogin.click();
		}
	});

	keypressPwd.keypress(function(event){
		$(this).css({'border-color':'#333'});
		if(event.keyCode == 13){
			btnLogin.click();
		}
	});

	// cookie & session
	function login(email , pwd) {
		txtTitle.css({'background':'#222'});
		$.ajax({
			async: true,
			url: "/assets/php/login.php",
			type: "POST",
			// dataType: "JSON",
			data: {
				"email": email,
				"pwd": pwd
			},
			success: function (msg) {
				if (msg == "success") {
					// 正確
					// console.log("success");
					window.location.href = 'account.html';
				} else if (msg == "fail") {
					// 錯誤
					fail_login("email_pwd_error");
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

	// error fail login
	function fail_login(fail){
		if(fail == "email_null"){
			txtTitle.css({'background':'#ff8779'});
			keypressEmail.css({'border-color':'#ff8779'}).focus();
		}else if(fail == "pwd_null"){
			txtTitle.css({'background':'#ff8779'});
			keypressPwd.css({'border-color':'#ff8779'}).focus();
		}else if(fail == "email_pwd_error"){
			txtTitle.css({'background':'#ff8779'});
			keypressEmail.css({'border-color':'#ff8779'}).focus();
			keypressPwd.css({'border-color':'#ff8779'});
		}
	}
});