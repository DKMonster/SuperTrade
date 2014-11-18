$(document).ready(function() {
	var body = $('body , html');
	body.niceScroll({
		horizrailenabled: false
	});

	var content = $('#content');
	var allTable = content.find('.allTable');
	var openpositions = content.find('.openpositions');
	var tableOrders = openpositions.find('.content');
	allTable.niceScroll({});

	// 開倉部位
	OpenPositions();

	function OpenPositions(){
		var obj_account = new Object();
		obj_account.loadType = "getTrade";
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
				var tbody = tableOrders.find('tbody');
				console.log(data);
				for(var i = 0 ; i < data.length ; i++){
					tbody.append(
						'<tr>'+
							'<td>'+(i+1)+'</td>'+
							'<td>'+data[i]['TradeID']+'</td>'+
							'<td>'+data[i]['AccountID']+'</td>'+
							'<td>'+data[i]['']+'</td>'+
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