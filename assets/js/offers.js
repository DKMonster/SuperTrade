$(document).ready(function() {

	var slider = $('#slider');
	var s_pic = slider.find('#user_pic');
	var s_name = slider.find('#user_name').find('.name');
	var s_balance = slider.find('#user_balance').find('.balance');
	var s_date = slider.find('#user_date').find('.date');

	var content = $('#content');
	var offers = content.find('.offers');
	var table = offers.find('.content');
	var tableOffers = table.find('tbody');

	var first = 0;

	table.niceScroll({
		cursorwidth: 10
	});

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

	// 商品
	AllOffers();

	function AllOffers(){
		var obj_account = new Object();
		obj_account.loadType = "getOffers";
		obj_account.userId = "D172574180001";
		obj_account.pwd = "7384";
		obj_account.con = "Demo";

		$.ajax({
			url: "http://localhost:8080/ForexConnectAPI/AjaxGetOffer",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				var bid = [];
				var ask = [];
				var ans = [];

				// console.log(data);

				if(first != 0){

					for(var j = 0 ; j < Object.keys(data).length ; j++){
						bid[j] = tableOffers.find('tr:nth-child('+(j+1)+') td:nth-child('+3+')').data("bid");
						ask[j] = tableOffers.find('tr:nth-child('+(j+1)+') td:nth-child('+4+')').data("ask");
						ans[j] = tableOffers.find('tr:nth-child('+(j+1)+') td:nth-child('+5+')').data("ans");
						// console.log(tableOffers.find('tr:nth-child('+j+')').find('td:nth-child('+3+')').data("bid"));
						// console.log(bid[j] + " === " + ask[j] + " === " + ans[j]);

					}

					// console.log(data);

					for(var i = 0 ; i < Object.keys(data).length ; i++){

						var tr = tableOffers.find('tr:nth-child('+(i+1)+')');

						tr.find('td:nth-child('+(1)+')').html((i+1));

						tr.find('td:nth-child('+(2)+')').html(data[i]['Instrument']);

						var that_c3 = tr.find('td:nth-child('+(3)+')');
						if(bid[i] > data[i]['Bid']){
							that_c3
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("high")
								.attr("data-bid",data[i]['Bid'])
								.html(Round(data[i]['Bid'],3));
						}else if(bid[i] < data[i]['Bid']){
							that_c3
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("low")
								.attr("data-bid",data[i]['Bid'])
								.html(Round(data[i]['Bid'],3));
						}else{
							that_c3
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("nor")
								.attr("data-bid",data[i]['Bid'])
								.html(Round(data[i]['Bid'],3));
						}

						var that_c4 = tr.find('td:nth-child('+(4)+')');
						if(ask[i] > data[i]['Ask']){
							that_c4
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("high")
								.attr("data-ask",data[i]['Ask'])
								.html(Round(data[i]['Ask'],3));
						}else if(ask[i] < data[i]['Ask']){
							that_c4
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("low")
								.attr("data-ask",data[i]['Ask'])
								.html(Round(data[i]['Ask'],3));
						}else{
							that_c4
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("nor")
								.attr("data-ask",data[i]['Ask'])
								.html(Round(data[i]['Ask'],3));
						}

						var that_c5 = tr.find('td:nth-child('+(5)+')');
						if(ans[i] > (data[i]['Ask']-data[i]['Bid'])){
							that_c5
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("high")
								.attr("data-ans",(data[i]['Ask']-data[i]['Bid']))
								.html(Round((data[i]['Ask']-data[i]['Bid'])*100,1));
						}else if(ans[i] < (data[i]['Ask']-data[i]['Bid'])){
							that_c5
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("low")
								.attr("data-ans",(data[i]['Ask']-data[i]['Bid']))
								.html(Round((data[i]['Ask']-data[i]['Bid'])*100,1));
						}else{
							that_c5
								.removeClass("nor")
								.removeClass("low")
								.removeClass("high")
								.addClass("nor")
								.attr("data-ans",(data[i]['Ask']-data[i]['Bid']))
								.html(Round((data[i]['Ask']-data[i]['Bid'])*100,1));
						}
						
						tr.find('td:nth-child('+(6)+')').html(Round(data[i]['High'],3));
						tr.find('td:nth-child('+(7)+')').html(Round(data[i]['Low'],3));
						tr.find('td:nth-child('+(8)+')').html(Round(data[i]['SellInterest'],2));
						tr.find('td:nth-child('+(9)+')').html(Round(data[i]['BuyInterest'],2));
						tr.find('td:nth-child('+(10)+')').html(data[i]['PipCost']);
						tr.find('td:nth-child('+(11)+')').html(data[i]['']);
						tr.find('td:nth-child('+(12)+')').html(data[i]['Time']);

					}

				}else{
					// init
					tableOffers.empty();

					// console.log(data);

					for(var i = 0 ; i < Object.keys(data).length ; i++){

						tableOffers.append("<tr data-symbol="+data[i]['Instrument']+" data-perpie="+data[i]['PipCost']+">");

						var tr = tableOffers.find('tr:nth-child('+(i+1)+')');
						tr.append('<td>'+(i+1)+'</td>');
						tr.append('<td>'+data[i]['Instrument']+'</td>');

						if(bid[i] > data[i]['Bid']){
							tr.append('<td class="high" data-bid="'+data[i]['Bid']+'">'+Round(data[i]['Bid'],3)+'</td>');
						}else if(bid[i] < data[i]['Bid']){
							tr.append('<td class="low" data-bid="'+data[i]['Bid']+'">'+Round(data[i]['Bid'],3)+'</td>');
						}else{
							tr.append('<td class="nor" data-bid="'+data[i]['Bid']+'">'+Round(data[i]['Bid'],3)+'</td>');
						}

						if(ask[i] > data[i]['Ask']){
							tr.append('<td class="high" data-ask="'+data[i]['Ask']+'">'+Round(data[i]['Ask'],3)+'</td>');
						}else if(ask[i] < data[i]['Ask']){
							tr.append('<td class="low" data-ask="'+data[i]['Ask']+'">'+Round(data[i]['Ask'],3)+'</td>');
						}else{
							tr.append('<td class="nor" data-ask="'+data[i]['Ask']+'">'+Round(data[i]['Ask'],3)+'</td>');
						}

						if(ans[i] > (data[i]['Ask']-data[i]['Bid'])){
							tr.append('<td class="high" data-ans="'+(data[i]['Ask']-data[i]['Bid'])+'">'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'</td>');
						}else if(ans[i] < (data[i]['Ask']-data[i]['Bid'])){
							tr.append('<td class="low" data-ans="'+(data[i]['Ask']-data[i]['Bid'])+'">'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'</td>');
						}else{
							tr.append('<td class="nor" data-ans="'+(data[i]['Ask']-data[i]['Bid'])+'">'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'</td>');
						}
						
						tr.append('<td>'+Round(data[i]['High'],3)+'</td>');
						tr.append('<td>'+Round(data[i]['Low'],3)+'</td>');
						tr.append('<td>'+Round(data[i]['SellInterest'],2)+'</td>');
						tr.append('<td>'+Round(data[i]['BuyInterest'],2)+'</td>');
						tr.append('<td>'+data[i]['PipCost']+'</td>');
						tr.append('<td>'+data[i]['']+'</td>');
						tr.append('<td>'+data[i]['Time']+'</td>');
					}

					// EntryOrder eoOrder
					var eoOrder = $('.entryOrder');
					var eoSelect = eoOrder.find('#eoOrder');
					eoSelect.change(function(){
						var data = $(this).val();
						checkEORate(data);
					});

					var eoAmount = eoOrder.find('#eoAmount');
					eoAmount.change(function(){
						var data = $(this).val();
						checkEOPerPip(data);
					});

					entryOrder();

					// MarketOrder moOrder
					var moOrder = $('.marketOrder');
					var moSelect = moOrder.find('#moOrder');
					moSelect.change(function(){
						var data = $(this).val();
						checkMORate(data);
					});

					var moAmount = moOrder.find('#moAmount');
					moAmount.change(function(){
						var data = $(this).val();
						checkMOPerPip(data);
					});

					marketOrder();

					// init create order
					createEntryOrder();
					createMarketOrder();
				}

				first = 1;

				setTimeout(AllOffers , 100);
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

	function entryOrder(){
		var tr;
		var eoOrder = $('.entryOrder').find('#eoOrder');

		eoOrder.empty();

		for(var i = 0 ; i < tableOffers.find('tr').length ; i++){
			tr = tableOffers.find('tr:nth-child('+(i+1)+')');
			td = tr.find('td:nth-child(2)').html();
			eoOrder.append('<option value="'+td+'">'+td+'</option>');
		}

		checkEORate();
	}

	function marketOrder(){
		var tr;
		var moOrder = $('.marketOrder').find('#moOrder');

		moOrder.empty();

		for(var i = 0 ; i < tableOffers.find('tr').length ; i++){
			tr = tableOffers.find('tr:nth-child('+(i+1)+')');
			td = tr.find('td:nth-child(2)').html();
			moOrder.append('<option value="'+td+'">'+td+'</option>');
		}

		checkMORate();
	}

	function checkEORate(eoData){
		var eoOrder = $('.entryOrder');
		var eoRate = eoOrder.find('.eoRate');

		if(eoData == null){
			eoData = eoOrder.find('#eoOrder :selected').val();
		}

		var data = tableOffers.find('tr[data-symbol="'+eoData+'"]').find('td:nth-child(3)').html();

		eoRate.val(data);
	}

	function checkEOPerPip(eoData){
		var eoOrder = $('.entryOrder');
		var eoPerPip = eoOrder.find('#eoPerPip');
		var eoSymbol = eoOrder.find('#eoOrder :selected').val();
		if(eoData == null){
			eoData = eoOrder.find('#eoPerPip').val();
		}

		var data = tableOffers.find('tr[data-symbol="'+eoSymbol+'"]').data('perpie');
		eoPerPip.text(Round(data*eoData,2));
	}

	function checkMORate(moData){
		var moOrder = $('.marketOrder');
		var moRate = moOrder.find('.moRate');

		if(moData == null){
			moData = moOrder.find('#moOrder :selected').val();
		}

		var data = tableOffers.find('tr[data-symbol="'+moData+'"]').find('td:nth-child(3)').html();

		moRate.val(data);
	}

	function checkMOPerPip(moData){
		var moOrder = $('.marketOrder');
		var moPerPip = moOrder.find('#moPerPip');
		var moSymbol = moOrder.find('#moOrder :selected').val();
		if(moData == null){
			moData = moOrder.find('#moPerPip').val();
		}

		var data = tableOffers.find('tr[data-symbol="'+moSymbol+'"]').data('perpie');
		moPerPip.text(Round(data*moData,2));
	}

	function createEntryOrder(){
		var eoOrder = $('.entryOrder');
		var moOrder = $('.marketOrder');

		var btnOK = eoOrder.find('#ok');
		var btnCancel = eoOrder.find('#cancel');
		var btnClose = eoOrder.find('#close');

		var plus = $('#plusEntryOrder');

		plus.on('click' , function(){
			moOrder.transition({ x: 0 });
			eoOrder.transition({ x: 280 });
		});

		btnClose.on('click' , function(){
			eoOrder.transition({ x: 0 });
		});

		btnCancel.on('click' , function(){
			eoOrder.transition({ x: 0 });
		});

		// console.log(obj_account);

		btnOK.on('click' , function(){

			var obj_account = new Object();
			obj_account.loadType = "createEntry";
			obj_account.userId = "D172574180001";
			obj_account.pwd = "7384";
			obj_account.con = "Demo";
			obj_account.amount = (eoOrder.find('.lvEntry').find('#eoAmount').val()*1000);
			obj_account.rate = eoOrder.find('.lvEntry').find('#eoRate').val();
			obj_account.buysell = eoOrder.find('.lvEntry').find('.radio input:checked').val();
			obj_account.instrument = eoOrder.find('.lvEntry').find('#eoOrder :selected').val();
			console.log(obj_account);

			$.ajax({
				async: false,
				url: "http://localhost:8080/ForexConnectAPI/AjaxCreateEntry",
				type: 'POST',
				dataType: 'json',
				data: JSON.stringify(obj_account),
				contentType: 'application/json',
				mimeType: 'application/json',
				success: function (msg) {
					console.log(msg)
					if (msg['msg'] == "success") {
						// 正確
						eoOrder.transition({ x: 0 });
						alert(msg['data']);
					} else if (msg['msg'] == "fail") {
						// 錯誤
						eoOrder.transition({ x: 0 });
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

	function createMarketOrder(){
		var eoOrder = $('.entryOrder');
		var moOrder = $('.marketOrder');

		var btnOK = moOrder.find('#ok');
		var btnCancel = moOrder.find('#cancel');
		var btnClose = moOrder.find('#close');

		var plus = $('#plusMarketOrder');

		plus.on('click' , function(){
			eoOrder.transition({ x: 0 });
			moOrder.transition({ x: 280 });
		});

		btnClose.on('click' , function(){
			moOrder.transition({ x: 0 });
		});

		btnCancel.on('click' , function(){
			moOrder.transition({ x: 0 });
		});

		btnOK.on('click' , function(){

		});
	}

	function Round(value , num) {
		var number = Math.pow(10,num);
		return Math.round(value * number) / number;
	}
});

