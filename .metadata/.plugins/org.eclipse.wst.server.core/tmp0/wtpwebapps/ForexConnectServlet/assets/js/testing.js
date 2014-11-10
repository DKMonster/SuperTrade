$(document).ready(function() {
	var html = $('#wrapper');

	var obj_account = new Object();

	var text_instrument = $('#instrument');
	var text_userId = $('#user_id');
	var text_pwd = $('#password');
	var text_url = $('#url');
	var text_con = $('#connection');

	var btn_getAccount = $('#btn_getAccount');
	var btn_getInfo = $('#btn_getInfo');
	var btn_getOffers = $('#btn_getOffers');
	var btn_clear = $('#btn_clear');
	var btn_login = $('#btn_login');
	var btn_logout = $('#btn_logout');

	var tableTbody = html.find('tbody');

	var divAccount = html.find('#account > table');
	var divUserInfo = html.find('#user_info > table');
	var divOffers = html.find('#offers > table');

	var arrAccount = [
			'userId','pwd','url','con'
			];
	var arrUserInfo = [
			'AccountID','AccountName','Balance',
			'NonTradeEquity','M2MEquity','UsedMargin',
			'UsedMargin3','AccountKind','MarginCallFlag',
			'LastMarginCallDate','MaintenanceType','AmountLimit',
			'BaseUnitSize','MaintenanceFlag','ManagerAccountID',
			'LeverageProfileID'
			];

	var arrOffers = [
			'OfferID','Instrument','QuoteID','Bid',
			'Ask','BidTradable','AskTradable','High',
			'Low','BuyInterest','SellInterest','Volume',
			'ContractCurrency','Digits','PointSize',
			'SubscriptionStatus','TradingStatus',
			'InstrumentType','ContractMultiplier',
			'ValueDate','Time'
			];

	btn_login.on('click' , function(){
		obj_account.loadType = "getAccount";
		obj_account.userId = text_userId.val();
		obj_account.pwd = text_pwd.val();
		obj_account.url = text_url.val();
		obj_account.con = text_con.val();
		$.ajax({
			url: "AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				console.log("登入成功");
				btn_login.attr("disabled","disabled");
				btn_logout.removeAttr("disabled");
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

	btn_logout.on('click' , function(){
		obj_account.loadType = "getAccount";
		obj_account.userId = text_userId.val();
		obj_account.pwd = text_pwd.val();
		obj_account.url = text_url.val();
		obj_account.con = text_con.val();
		$.ajax({
			url: "AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				console.log("登出成功");
				btn_login.removeAttr("disabled");
				btn_logout.attr("disabled","disabled");
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

	btn_getAccount.on('click' , function(){
		obj_account.loadType = "getAccount";
		obj_account.userId = text_userId.val();
		obj_account.pwd = text_pwd.val();
		obj_account.url = text_url.val();
		obj_account.con = text_con.val();
		ajaxGetAccount(obj_account);
	});

	btn_getInfo.on('click' , function(){
		obj_account.loadType = "getInfo";
		obj_account.userId = text_userId.val();
		obj_account.pwd = text_pwd.val();
		obj_account.url = text_url.val();
		obj_account.con = text_con.val();
		ajaxGetInfo(obj_account);
	});

	btn_getOffers.on('click' , function(){
		obj_account.loadType = "getOffers";
		obj_account.instrument = text_instrument.val();
		obj_account.userId = text_userId.val();
		obj_account.pwd = text_pwd.val();
		obj_account.url = text_url.val();
		obj_account.con = text_con.val();
		ajaxGetOffers(obj_account);
	});

	btn_clear.on('click' , function(){
		tableTbody.html("");
	});

	function ajaxGetAccount(obj_account){
		// console.log(JSON.stringify(obj_account));
		$.ajax({
			url: "AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				// console.log(data);
				var tbody = divAccount.find('tbody');
				var content , num;
				num = tbody.find('tr').length;
				content += "<tr><td>"+(num+1)+"</td>";
				// console.log(Object.keys(data));
				for(var i = 0 ; i < Object.keys(data).length ; i++){
					content += ("<td>"+data[arrAccount[i]]+"</td>");
				}
				content += "</tr>";
				tbody.append(content);
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

	function ajaxGetInfo(obj_account){
		// console.log(JSON.stringify(obj_account));
		$.ajax({
			url: "AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				// console.log(data);
				var tbody = divUserInfo.find('tbody');
				var content , num;
				num = tbody.find('tr').length;
				content += "<tr><td>"+(num+1)+"</td>";
				// console.log(Object.keys(data));
				for(var i = 0 ; i < Object.keys(data).length ; i++){
					content += ("<td>"+data[arrUserInfo[i]]+"</td>");
				}
				content += "</tr>";
				tbody.append(content);
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

	function ajaxGetOffers(obj_account){
		// console.log(JSON.stringify(obj_account));
		$.ajax({
			url: "AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				// console.log(data);
				var tbody = divOffers.find('tbody');
				var content , num;
				num = tbody.find('tr').length;
				content += "<tr><td>"+(num+1)+"</td>";
				// console.log(Object.keys(data));
				for(var i = 0 ; i < Object.keys(data).length ; i++){
					content += ("<td>"+data[arrOffers[i]]+"</td>");
				}
				content += "</tr>";
				tbody.append(content);
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