$(document).ready(function() {

	var slider = $('#slider');
	var s_pic = slider.find('#user_pic');
	var s_name = slider.find('#user_name').find('.name');
	var s_balance = slider.find('#user_balance').find('.balance');
	var s_date = slider.find('#user_date').find('.date');

	var content = $('#content');
	var orders = content.find('#orders');

	// var table_account = orders.find('.account');
	var table_order = orders.find('.order');
	var table_openPositions = orders.find('.openpositions');
	var table_summary = orders.find('.summary');
	var table_closePositions = orders.find('.closepositions');
	var table_actions = orders.find('.actions');

	var first = 0;

	$.ajax({
		async: true,
		url: "/SuperTrade/assets/php/getAccount.php",
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
		// console.log(msg);
		/* slide data */
		s_pic.attr('src','/SuperTrade/assets/user/img/' + msg['user_picture']);
		s_name.html(msg['user_nickname']);
		s_balance.html("$500.00");
		s_date.html(msg['user_login_date']);
	}

	// 選單
	tableMenu();

	// 開倉部位
	OpenPositions();

	// 訂單
	getOrder();

	// 總結
	getSummary();

	// 平倉
	getClosePositions();

	// 指令
	getActions();

	function tableMenu(){
		var table_menu = $('#table_menu');
		var table_info = $('.table_info');
		var liMenu = table_menu.find('li');

		liMenu.on('click' , function(){
			that = $(this);

			liMenu.removeClass('active');
			table_info.removeClass('active');

			var info = that.attr('info');
			that.addClass('active');
			content.find('.'+info+'').addClass('active');
		});
	}

	function OpenPositions(){
		var obj_account = new Object();
		obj_account.loadType = "getOpenPositions";
		obj_account.userId = "D172574180001";
		obj_account.pwd = "7384";
		obj_account.con = "Demo";

		$.ajax({
			url: "http://localhost:8080/ForexConnectAPI/AjaxOpenPositions",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {

				var tbody = table_openPositions.find('tbody');

				// console.log(data);

				// init
				tbody.empty();

				for(var i = 0 ; i < data.length ; i++){
					tbody.append(
						'<tr data-id="'+data[i]['TradeID']+'">'+
							'<td>'+(i+1)+'</td>'+
							'<td>'+data[i]['TradeID']+'</td>'+
							'<td>'+data[i]['AccountID']+'</td>'+
							'<td>'+data[i]['Instrument']+'</td>'+
							'<td>'+(data[i]['Amount']/1000)+'</td>'+
							'<td>'+data[i]['BuySell']+'</td>'+
							'<td>'+Round(data[i]['OpenRate'],3)+'</td>'+
							'<td>'+Round(data[i]['Close'],3)+'</td>'+
							'<td>'+Round(data[i]['PL'],1)+'</td>'+
							'<td>'+Round(data[i]['GrossPL'],2)+'</td>'+
							'<td>'+Round(data[i]['Commission'],2)+'</td>'+
							'<td>'+Round(data[i]['RolloverInterest'],2)+'</td>'+
							'<td>'+Round(data[i]['UsedMargin'],2)+'</td>'+
							'<td>'+data[i]['OpenTime']+'</td>'+
						'</tr>'
						);
				}

				// CloseOrder cpOrder
				var cpOrder = $('.closePositions');
				var cpSelect = cpOrder.find('#cpOrder');
				cpSelect.change(function(){
					var data = $(this).val();
					checkCPRate(data);
				});
				

				closeOrder();

				createCloseOrder();

				setTimeout(OpenPositions , 10000);
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

	function closeOrder(){
		var tr;
		var cpOrder = $('.closePositions').find('#cpOrder');
		var tr_length = table_openPositions.find('tbody tr').length;

		cpOrder.empty();

		for(var i = 0 ; i < tr_length ; i++){
			tr = table_openPositions.find('tr:nth-child('+(i+1)+')');
			td = tr.find('td:nth-child(4)').html();
			cpOrder.append('<option value="'+td+'">'+td+'</option>');
		}

		checkCPRate();
	}

	function checkCPRate(cpData){
		var cpOrder = $('.closePositions');
		var cpRate = cpOrder.find('.cpRate');

		if(cpData == null){
			cpData = cpOrder.find('#cpOrder :selected').val();
		}

		var data = table_openPositions.find('tr[data-id="'+cpData+'"]').find('td:nth-child(8)').html();

		cpRate.val(data);

		id = table_openPositions.find('tr[data-id="'+cpData+'"]').data('id');
		cpOrder.attr("data-id",id);
	}

	function createCloseOrder(){
		var cpOrder = $('.closePositions');

		var btnOK = cpOrder.find('#ok');
		var btnCancel = cpOrder.find('#cancel');
		var btnClose = cpOrder.find('#close');

		var plus = $('.plusCloseOrder');

		plus.on('click' , function(){
			cpOrder.transition({ x: 280 });
		});

		btnClose.on('click' , function(){
			cpOrder.transition({ x: 0 });
		});

		btnCancel.on('click' , function(){
			cpOrder.transition({ x: 0 });
		});

		btnOK.on('click' , function(){

			var obj_account = new Object();
			obj_account.loadType = "closePositions";
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";
			obj_account.instrument = cpOrder.find('.lvEntry').find('#cpOrder :selected').val();
			console.log(obj_account);

			$.ajax({
				async: true,
				url: "http://localhost:8080/ForexConnectAPI/AjaxClosePosition",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (msg) {
					console.log(msg);
					if (msg['msg'] == "success") {
						// 正確
						cpOrder.transition({ x: 0 });
						alert(msg['data']);
					} else if (msg['msg'] == "fail") {
						// 錯誤
						cpOrder.transition({ x: 0 });
						alert(msg['data']);
					}else{
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
		});
	}

	function getOrder(){

			var obj_account = new Object();
			obj_account.loadType = "getOrders";
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";

			// console.log(obj_account);

			$.ajax({
				async: true,
				url: "http://localhost:8080/ForexConnectAPI/AjaxGetOrder",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (data) {
					// console.log(data);
					tbody = table_order.find('tbody');

					// console.log(data);

					// init
					tbody.empty();

					for(var i = 0 ; i < data.length ; i++){
						if(data[i]['BuySell'] == "B"){
							tbody.append(
								'<tr data-id="'+data[i]['TradeID']+'">'+
									'<td>'+(i+1)+'</td>'+
									'<td>'+data[i]['TradeID']+'</td>'+
									'<td>'+data[i]['AccountID']+'</td>'+
									'<td>'+data[i]['Type']+'</td>'+
									'<td>'+data[i]['Status']+'</td>'+
									'<td>'+data[i]['Instrument']+'</td>'+
									'<td>'+(data[i]['Amount']/1000)+'</td>'+
									'<td></td>'+
									'<td>'+data[i]['Rate']+'</td>'+
									'<td>'+data[i]['Stop']+'</td>'+
									'<td>'+data[i]['Limit']+'</td>'+
									'<td>'+data[i]['StatusTime']+'</td>'+
									'<td>'+data[i]['ExpireDate']+'</td>'+
								'</tr>'
								);
						}else{
							tbody.append(
								'<tr data-id="'+data[i]['TradeID']+'">'+
									'<td>'+(i+1)+'</td>'+
									'<td>'+data[i]['TradeID']+'</td>'+
									'<td>'+data[i]['AccountID']+'</td>'+
									'<td>'+data[i]['Type']+'</td>'+
									'<td>'+data[i]['Status']+'</td>'+
									'<td>'+data[i]['Instrument']+'</td>'+
									'<td>'+(data[i]['Amount']/1000)+'</td>'+
									'<td>'+data[i]['Rate']+'</td>'+
									'<td></td>'+
									'<td>'+data[i]['Stop']+'</td>'+
									'<td>'+data[i]['Limit']+'</td>'+
									'<td>'+data[i]['StatusTime']+'</td>'+
									'<td>'+data[i]['ExpireDate']+'</td>'+
								'</tr>'
								);
						}
					}

					// CloseOrder cpOrder
					var eoOrder = $('.editOrder');
					var eoSelect = eoOrder.find('#eoOrder');
					eoSelect.change(function(){
						var data = $(this).val();
						checkEORate(data);
					});

					// CloseOrder cpOrder
					var reOrder = $('.removeOrder');
					var reSelect = reOrder.find('#reOrder');
					reSelect.change(function(){
						var data = $(this).val();
						checkRERate(data);
					});

					editOrderData();
					reOrderData();

					// 修改訂單
					editOrder();

					// 刪除訂單
					removeOrder();

					setTimeout(getOrder , 10000);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(xhr.statusText);
					console.log(xhr.responseText);
					return false;
				}
			});
	}

	function getSummary(){

			var obj_account = new Object();
			obj_account.loadType = "getSummary";
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";

			// console.log(obj_account);

			$.ajax({
				async: true,
				url: "http://localhost:8080/ForexConnectAPI/AjaxGetSummary",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (data) {
					// console.log(data);
					tbody = table_summary.find('tbody');

					// console.log(data);

					// init
					tbody.empty();

					for(var i = 0 ; i < data.length ; i++){
						tbody.append(
							'<tr data-id="'+data[i]['TradeID']+'">'+
								'<td>'+(i+1)+'</td>'+
								'<td>'+data[i]['Instrument']+'</td>'+
								'<td>'+Round(data[i]['SellNetPL'],2)+'</td>'+
								'<td>'+(data[i]['SellAmount']/1000)+'</td>'+
								'<td>'+data[i]['SellAvgOpen']+'</td>'+
								'<td>'+data[i]['BuyClose']+'</td>'+
								'<td>'+data[i]['SellClose']+'</td>'+
								'<td>'+data[i]['BuyAvgOpen']+'</td>'+
								'<td>'+data[i]['BuyAmount']+'</td>'+
								'<td>'+data[i]['BuyNetPL']+'</td>'+
								'<td>'+(data[i]['Amount']/1000)+'</td>'+
								'<td>'+Round(data[i]['GrossPL'],2)+'</td>'+
								'<td>'+Round(data[i]['NetPL'],2)+'</td>'+
							'</tr>'
							);
					}

					setTimeout(getSummary , 10000);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(xhr.statusText);
					console.log(xhr.responseText);
					return false;
				}
			});
	}

	function getClosePositions(){

			var obj_account = new Object();
			obj_account.loadType = "getClosePositions";
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";

			// console.log(obj_account);

			$.ajax({
				async: true,
				url: "http://localhost:8080/ForexConnectAPI/AjaxGetClosePositions",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (data) {
					// console.log(data);
					tbody = table_closePositions.find('tbody');

					// console.log(data);

					// init
					tbody.empty();

					for(var i = 0 ; i < data.length ; i++){
						tbody.append(
							'<tr data-id="'+data[i]['TradeID']+'">'+
								'<td>'+(i+1)+'</td>'+
								'<td>'+data[i]['TradeID']+'</td>'+
								'<td>'+data[i]['AccountID']+'</td>'+
								'<td>'+data[i]['Instrument']+'</td>'+
								'<td>'+(data[i]['Amount']/1000)+'</td>'+
								'<td>'+data[i]['BuySell']+'</td>'+
								'<td>'+Round(data[i]['OpenRate'],3)+'</td>'+
								'<td>'+Round(data[i]['CloseRate'],3)+'</td>'+
								'<td>'+Round(data[i]['PL'],1)+'</td>'+
								'<td>'+Round(data[i]['GrossPL'],2)+'</td>'+
								'<td>'+Round(data[i]['Commission'],2)+'</td>'+
								'<td>'+Round(data[i]['RolloverInterest'],2)+'</td>'+
								'<td>'+data[i]['OpenTime']+'</td>'+
								'<td>'+data[i]['CloseTime']+'</td>'+
							'</tr>'
							);
					}

					setTimeout(getClosePositions , 10000);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(xhr.statusText);
					console.log(xhr.responseText);
					return false;
				}
			});
	}

	function getActions(){

			var obj_account = new Object();
			obj_account.loadType = "getActions";
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";

			// console.log(obj_account);

			$.ajax({
				async: true,
				url: "http://localhost:8080/ForexConnectAPI/AjaxGetActions",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (data) {
					console.log(data);
					setTimeout(getActions , 10000);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(xhr.statusText);
					console.log(xhr.responseText);
					return false;
				}
			});
	}

	function editOrder(){

		var edit = $('.editOrder');
		var order = $('.order');
		var btnEdit = order.find('.edit');

		var btnClose = edit.find('#close');
		var btnCancel = edit.find('#cancel');
		var btnOk = edit.find('#ok');

		btnEdit.on('click' , function(){
			edit.transition({ x: 280 });
		});

		btnCancel.on('click' , function(){
			edit.transition({ x: 0 });
		});

		btnClose.on('click' , function(){
			edit.transition({ x: 0 });
		});

		btnOk.on('click' , function(){

			var obj_account = new Object();
			var eoOrder = $('.editOrder');
			obj_account.loadType = "editOrder";
			obj_account.orderId = eoOrder.find('#eoOrder :selected').val();
			obj_account.accountId = eoOrder.data('accountID');
			obj_account.amount = eoOrder.find('#eoAmount').val();
			obj_account.rate = eoOrder.find('#eoRate').val();
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";

			// console.log(obj_account);

			$.ajax({
				async: true,
				url: "http://localhost:8080/ForexConnectAPI/AjaxEditOrder",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (data) {
					console.log(data);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(xhr.statusText);
					console.log(xhr.responseText);
					return false;
				}
			});
		});

	}

	function editOrderData(){
		var tr;
		var eoOrder = $('.editOrder').find('#eoOrder');
		var tr_length = table_order.find('tbody tr').length;

		eoOrder.empty();

		for(var i = 0 ; i < tr_length ; i++){
			tr = table_order.find('tr:nth-child('+(i+1)+')');
			td = tr.find('td:nth-child(2)').html();
			eoOrder.append('<option value="'+td+'">'+td+'</option>');
		}

		checkEORate();
	}

	function checkEORate(eoData){
		var eoOrder =$('.editOrder');
		var eoRate = eoOrder.find('.eoRate');

		if(eoData == null){
			eoData = eoOrder.find('#eoOrder :selected').val();
		}

		var data = table_order.find('tr[data-id="'+eoData+'"]').find('td:nth-child(8)').html();
		if(data == ""){
			data = table_order.find('tr[data-id="'+eoData+'"]').find('td:nth-child(9)').html();
		}

		eoRate.val(data);

		eoOrder.attr('data-accountID',table_order.find('tr[data-id="'+eoData+'"]').find('td:nth-child(3)').html())
	}

	function removeOrder(){

		var re = $('.removeOrder');
		var order = $('.order');
		var btnRe = order.find('.trash');

		var btnClose = re.find('#close');
		var btnCancel = re.find('#cancel');
		var btnOk = re.find('#ok');

		btnRe.on('click' , function(){
			re.transition({ x: 280 });
		});

		btnCancel.on('click' , function(){
			re.transition({ x: 0 });
		});

		btnClose.on('click' , function(){
			re.transition({ x: 0 });
		});

		btnOk.on('click' , function(){

			var obj_account = new Object();
			var reOrder = $('.removeOrder');
			obj_account.loadType = "removeOrder";
			obj_account.orderId = reOrder.find('#reOrder :selected').val();
			obj_account.accountId = reOrder.data('accountID');
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";

			// console.log(obj_account);

			$.ajax({
				async: true,
				url: "http://localhost:8080/ForexConnectAPI/AjaxRemoveOrder",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (data) {
					console.log(data);
					setTimeout(getActions , 10000);
				},
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(xhr.statusText);
					console.log(xhr.responseText);
					return false;
				}
			});
		});
	}

	function reOrderData(){
		var tr;
		var reOrder = $('.removeOrder').find('#reOrder');
		var tr_length = table_order.find('tbody tr').length;

		reOrder.empty();

		for(var i = 0 ; i < tr_length ; i++){
			tr = table_order.find('tr:nth-child('+(i+1)+')');
			td = tr.find('td:nth-child(2)').html();
			reOrder.append('<option value="'+td+'">'+td+'</option>');
		}

		checkRERate();
	}

	function checkRERate(reData){
		var reOrder =$('.removeOrder');
		var reRate = reOrder.find('.reRate');

		if(reData == null){
			reData = reOrder.find('#reOrder :selected').val();
		}

		var data = table_order.find('tr[data-id="'+reData+'"]').find('td:nth-child(8)').html();
		if(data == ""){
			data = table_order.find('tr[data-id="'+reData+'"]').find('td:nth-child(9)').html();
		}

		reRate.val(data);

		reOrder.attr('data-accountID',table_order.find('tr[data-id="'+reData+'"]').find('td:nth-child(3)').html())
	}

	function Round(value , num) {
		var number = Math.pow(10,num);
		return Math.round(value * number) / number;
	}


});