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
			url: "http://localhost:8080/ForexConnectAPI/AjaxServlet",
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(obj_account),
			contentType: 'application/json',
			mimeType: 'application/json',
			success: function(data) {
				var bid = [];
				var ask = [];
				var ans = [];

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
						tr.find('td:nth-child('+(10)+')').html(data[i]['']);
						tr.find('td:nth-child('+(11)+')').html(data[i]['']);
						tr.find('td:nth-child('+(12)+')').html(data[i]['Time']);

					}

				}else{
					// init
					tableOffers.empty();

					// console.log(data);

					for(var i = 0 ; i < Object.keys(data).length ; i++){

						tableOffers.append("<tr>");

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
						tr.append('<td>'+data[i]['']+'</td>');
						tr.append('<td>'+data[i]['']+'</td>');
						tr.append('<td>'+data[i]['Time']+'</td>');

						// EntryOrder eoOrder				
						entryOrder();
					}
				}

				first = 1;

				setTimeout(AllOffers , 0);
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
	}

	function Round(value , num) {
		var number = Math.pow(10,num);
		return Math.round(value * number) / number;
	}
});

