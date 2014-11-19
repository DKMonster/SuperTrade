$(document).ready(function() {
	var body = $('body , html');
	body.niceScroll({
		horizrailenabled: false
	});

	var content = $('#content');
	var offers = content.find('.offers');
	var table = offers.find('.content')
	var tableOffers = table.find('tbody');

	var first = 0;

	table.niceScroll();

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
						bid[j] = tableOffers.find('tr:nth-child('+j+') td:nth-child('+3+')').data("bid");
						ask[j] = tableOffers.find('tr:nth-child('+j+') td:nth-child('+4+')').data("ask");
						ans[j] = tableOffers.find('tr:nth-child('+j+') td:nth-child('+5+')').data("ans");
						// console.log(tableOffers.find('tr:nth-child('+j+')').find('td:nth-child('+3+')').data("bid"));
						// console.log(bid[j] + " === " + ask[j] + " === " + ans[j]);
					}
				}

				first = 1;

				// init
				tableOffers.html("");

				// console.log(data);

				for(var i = 0 ; i < Object.keys(data).length ; i++){

					tableOffers.append("<tr>");

					var tr = tableOffers.find('tr:nth-child('+i+')');
					tr.append('<td>'+i+'</td>');
					tr.append('<td>'+data[i]['Instrument']+'</td>');

					if(bid[i] > Round(data[i]['Bid'],3)){
						tr.append('<td class="high" data-bid="'+Round(data[i]['Bid'],3)+'">'+Round(data[i]['Bid'],3)+'</td>');
					}else if(bid[i] < Round(data[i]['Bid'],3)){
						tr.append('<td class="low" data-bid="'+Round(data[i]['Bid'],3)+'">'+Round(data[i]['Bid'],3)+'</td>');
					}else{
						tr.append('<td class="nor" data-bid="'+Round(data[i]['Bid'],3)+'">'+Round(data[i]['Bid'],3)+'</td>');
					}

					if(ask[i] > Round(data[i]['Ask'],3)){
						tr.append('<td class="high" data-ask="'+Round(data[i]['Ask'],3)+'">'+Round(data[i]['Ask'],3)+'</td>');
					}else if(ask[i] < Round(data[i]['Ask'],3)){
						tr.append('<td class="low" data-ask="'+Round(data[i]['Ask'],3)+'">'+Round(data[i]['Ask'],3)+'</td>');
					}else{
						tr.append('<td class="nor" data-ask="'+Round(data[i]['Ask'],3)+'">'+Round(data[i]['Ask'],3)+'</td>');
					}

					if(ans[i] > Round((data[i]['Ask']-data[i]['Bid'])*100,1)){
						tr.append('<td class="high" data-ans="'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'">'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'</td>');
					}else if(ans[i] < Round((data[i]['Ask']-data[i]['Bid'])*100,1)){
						tr.append('<td class="low" data-ans="'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'">'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'</td>');
					}else{
						tr.append('<td class="nor" data-ans="'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'">'+Round((data[i]['Ask']-data[i]['Bid'])*100,1)+'</td>');
					}
					
					tr.append('<td>'+Round(data[i]['High'],3)+'</td>');
					tr.append('<td>'+Round(data[i]['Low'],3)+'</td>');
					tr.append('<td>'+Round(data[i]['SellInterest'],2)+'</td>');
					tr.append('<td>'+Round(data[i]['BuyInterest'],2)+'</td>');
					tr.append('<td>'+data[i]['']+'</td>');
					tr.append('<td>'+data[i]['']+'</td>');
					tr.append('<td>'+data[i]['Time']+'</td>');

				}

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

	function Round(value , num) {
		var number = Math.pow(10,num);
		return Math.round(value * number) / number;
	}
});

