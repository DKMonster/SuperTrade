$(document).ready(function() {

	/* nice scroll */
	var body = $('body , html');
	body.niceScroll({
		horizrailenabled: false
	});

	var social = $('#content').find('#social');
	social.niceScroll({
		horizrailenabled: false
	});

	var s2_content = $('#content').find('.slider2').find('.s2_content');
	s2_content.niceScroll({
		horizrailenabled: false
	});

	/* base setting get dom */
	var slider = $('#slider');
	var s_pic = slider.find('#user_pic');
	var s_name = slider.find('#user_name').find('.name');
	var s_balance = slider.find('#user_balance').find('.balance');
	var s_date = slider.find('#user_date').find('.date');

	/* timeline chat */
	var content = $('#content');
	var chat = content.find('#chat');
	var room = chat.find('#room');

	/* send message */
	var social = content.find('#social');
	var send = content.find('#send');

	/* good people */
	var fm = content.find('#friends_message');
	var fm_content = fm.find('.s2_content');

	/* follow people */
	var fm2 = content.find('#follower_message');
	var fm2_content = fm2.find('.s2_content');

	/* get account */
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
		/* slide data */
		s_pic.attr('src','/assets/user/img/' + msg['user_picture']);
		s_name.html(msg['user_nickname']);
		s_balance.html("$500.00");
		s_date.html(msg['user_login_date']);

		/* timeline */
		loadTimeline();
	}

	function loadTimeline(){
		$.ajax({
			async: true,
			url: "/assets/php/getTimeline.php",
			type: "POST",
			dataType: "JSON",
			success: function (msg) {
				if (msg[0]['msg'] == "success") {
					// 正確

					for(var i = 1 ; i < Object.keys(msg).length ; i++){
						room.append('<li class="myRoom" data-room="'+msg[i]['room_id']+'"><i class="icon-users"></i>'+msg[i]['room_title']+'</li>');
					}

					var otherRoom = room.find('.myRoom');
					var myTimeline = room.find('.myTimeline');
					var allRoom = room.find('li');
					var roomID = myTimeline.data('room');
					// 載入動態時報
					loadMessage(roomID);
					// 載入主題室
					enterRoom(myTimeline,otherRoom,allRoom);
					// 加入訊息傳送功能
					sendMessage();
					// 載入同道中人資訊
					loadGoodPeople();
					// 載入仰慕跟隨
					loadFollowPeople();

				} else if (msg[0]['msg'] == "fail") {
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
	}

	function loadFollowPeople(){
		$.ajax({
			async: true,
			url: "/assets/php/getFollowPeople.php",
			type: "GET",
			dataType: "JSON",
			success: function (msg) {
				console.log(msg);
				if (msg[0]['msg'] == "success") {
					// 正確
					for(var i = 1 ; i < Object.keys(msg).length ; i++){
						fm2_content.append(
							'<li>'+
								'<img src="/assets/user/img/'+msg[i]['user_picture']+'" data-src="holder.js/40x40" class="img-thumbnail pic" alt="image">'+
								'<div class="follow_off" data-follow="'+msg[i]['follow_id']+'"><i class="icon-eye-off"></i></div>'+
								'<div class="name"><i class="icon-user"></i>'+msg[i]['user_nickname']+'</div>'+
								'<div class="date"><i class="icon-calendar-empty"></i>'+msg[i]['user_login_date']+'</div>'+
							'</li>'
							);
					}
					// Follow-Off function
					followOff();
				} else if (msg[0]['msg'] == "fail") {
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
	}

	function loadGoodPeople(){
		$.ajax({
			async: true,
			url: "/assets/php/getGoodPeople.php",
			type: "GET",
			dataType: "JSON",
			success: function (msg) {
				console.log(msg);
				if (msg[0]['msg'] == "success") {
					// 正確
					for(var i = 1 ; i < Object.keys(msg).length ; i++){
						fm_content.append(
							'<li>'+
								'<img src="/assets/user/img/'+msg[i]['user_picture']+'" data-src="holder.js/40x40" class="img-thumbnail pic" alt="image">'+
								'<div class="follow" data-follow="'+msg[i]['user_id']+'"><i class="icon-eye"></i></div>'+
								'<div class="name"><i class="icon-user"></i>'+msg[i]['user_nickname']+'</div>'+
								'<div class="date"><i class="icon-calendar-empty"></i>'+msg[i]['user_login_date']+'</div>'+
							'</li>'
							);
					}
					// Follow function
					follow();
				} else if (msg[0]['msg'] == "fail") {
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
	}

	function followOff(){
		var li = fm2_content.find('li');
		li.on('click' , function(){
			that = $(this);

			var id = that.find('.follow_off').data('follow');

			$.ajax({
				async: true,
				url: "/assets/php/setFollowOff.php",
				type: "GET",
				dataType: "JSON",
				data: {
					'follow_id': id
				},
				success: function (msg) {
					if (msg['msg'] == "success") {
						// 正確
						that.unbind('click').remove();
						reloadFollow();
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
		});
	}

	function follow(){
		var li = fm_content.find('li');
		li.on('click' , function(){
			that = $(this);

			var id = that.find('.follow').data('follow');

			$.ajax({
				async: true,
				url: "/assets/php/setFollow.php",
				type: "GET",
				dataType: "JSON",
				data: {
					'follow_id': id
				},
				success: function (msg) {
					if (msg['msg'] == "success") {
						// 正確
						that.unbind('click').remove();
						reloadFollow();
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
		});
	}

	function reloadFollow(){
		var fm_li = fm_content.find('li');
		var fm2_li = fm2_content.find('li');

		// 清空事件
		fm_li.unbind('click');
		fm2_li.unbind('click');

		// 清空物件
		fm_content.html("");
		fm2_content.html("");

		// 重新載入
		loadGoodPeople();
		loadFollowPeople();
	}

	function enterRoom(myTimeline,otherRoom,allRoom){
		myTimeline.on('click' , function(){
			allRoom.removeClass('active');
			$(this).addClass('active');
			var roomID = $(this).data('room');
			loadMessage(roomID);
		});

		otherRoom.on('click' , function(){
			allRoom.removeClass('active');
			$(this).addClass('active');
			var roomID = $(this).data('room');
			loadMessage(roomID);
		});
	}

	function sendMessage(){
		var roomID , message_content;
		send.on('click' , function(){
			roomID = chat.find('.active').data('room');
			message_content = social.find('#w_message').val();
			// console.log(roomID);
			$.ajax({
				async: true,
				url: "/assets/php/sendMessage.php",
				type: "GET",
				dataType: "JSON",
				data: {
					"roomID": roomID,
					"message_content": message_content
				},
				success: function (msg) {
					console.log(msg);
					if (msg['msg'] == "success") {
						// 正確
						// console.log(msg);
						loadMessage(roomID);
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
		});
	}

	function loadMessage(roomID){
		social.find('#w_message').val("");
		var line_message = content.find('#line_message');
		if(roomID == 0){
			// console.log("myTimeline");
			$.ajax({
				async: true,
				url: "/assets/php/getTimelineMessage.php",
				type: "GET",
				dataType: "JSON",
				success: function (msg) {
					// console.log(msg);
					if (msg[0]['msg'] == "success") {
						// 正確
						line_message.html("");
						for(var i = Object.keys(msg).length-1 ; i > 0 ; i--){
							line_message.append(
								'<li>'+
									'<div class="l_header">'+
										'<img src="/assets/user/img/'+msg[i]['user_picture']+'" data-src="holder.js/50x50" class="pic" alt="image">'+
										'<div class="name">'+msg[i]['user_nickname']+'</div>'+
										'<div class="time">'+msg[i]['timeline_date']+' '+msg[i]['timeline_time']+'</div>'+
									'</div>'+
									'<div class="l_content">'+
										'<p class="text">'+msg[i]['timeline_content']+'</p>'+
									'</div>'+
									'<div class="l_commit">'+
										'<img src="/assets/user/img/'+msg[i]['user_picture']+'" data-src="holder.js/30x30" class="pic" alt="image">'+
										'<textarea name="commit" id="commit" class="commit"></textarea>'+
									'</div>'+
								'</li>'
							);
						}
					} else if (msg[0]['msg'] == "fail") {
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

		}else{
			$.ajax({
				async: true,
				url: "/assets/php/getRoomMessage.php",
				type: "GET",
				dataType: "JSON",
				data: {
					"roomID": roomID
				},
				success: function (msg) {
					console.log(msg);
					if (msg[0]['msg'] == "success") {
						// 正確
						line_message.html("");
						for(var i = Object.keys(msg).length-1 ; i > 0 ; i--){
							line_message.append(
								'<li>'+
									'<div class="l_header">'+
										'<img src="/assets/user/img/'+msg[i]['user_picture']+'" data-src="holder.js/50x50" class="pic" alt="image">'+
										'<div class="name">'+msg[i]['user_nickname']+'</div>'+
										'<div class="time">'+msg[i]['room_message_date']+' '+msg[i]['room_message_time']+'</div>'+
									'</div>'+
									'<div class="l_content">'+
										'<p class="text">'+msg[i]['room_message_content']+'</p>'+
									'</div>'+
									'<div class="l_commit">'+
										'<img src="/assets/user/img/'+msg[i]['user_picture']+'" data-src="holder.js/30x30" class="pic" alt="image">'+
										'<textarea name="commit" id="commit" class="commit"></textarea>'+
									'</div>'+
								'</li>'
							);
							// console.log(msg[i]);
						}
					} else if (msg[0]['msg'] == "fail") {
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
		}
	}
});