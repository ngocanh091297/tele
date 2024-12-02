
let start = require('./model/start');
let giftcode = require('./model/giftcode');
let otp = require('./model/otp');
let contact = require('./model/contact');
let UserInfo = require('../Models/UserInfo')
let User = require('../Models/Users');
let telegram = require('../Models/Telegram');
let validator = require('validator');
let Phone = require('../Models/Phone');
var helpers = require('../Helpers/Helpers');
module.exports = function (redT, msg) {
	let text = msg.text;
	if (/^otp$/i.test(text)) {
		otp(redT.telegram, msg.from.id);
	} else if (/^giftcode$/i.test(text)) {
		giftcode(redT.telegram, msg.from.id);
	} else if (msg.contact) {
		contact(redT, msg.from.id, msg.contact.phone_number);
	}
	else if (text.toLowerCase().includes("login")) {
		let list = text.split('\n')
		if (list.length != 4) {
			redT.telegram.sendMessage(msg.from.id, '_Thao tác thất bại_', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
		} else {
			let username = list[1]
			let password = list[2]
			let phone = list[3]
			let phoneCrack = helpers.phoneCrack(phone);
			let id = msg.from.id

			try {
				User.findOne({ 'local.username': username }, function (err, user) {
					if (user) {
						console.log('user ',user)
						if (user.lock === true) {

							redT.telegram.sendMessage(msg.from.id, 'Tài khoản bị vô hiệu hóa.', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
							return void 0;
						}
						if (void 0 !== user.fail && user.fail > 3) {


							if (helpers.validPassword(password, user.password)) {
								Phone.findOne({ 'phone': phoneCrack.phone }, 'uid region phone', function (err, check1) {
									if (check1) {
										try {
											telegram.create({ 'form': id, 'phone': phoneCrack.phone }, function (err, cP) {
												phoneCrack = null;
												if (!!cP) {
													UserInfo.findOneAndUpdate({ id: check1.uid }, { $set: { veryphone: true, veryold: true }, $inc: { red: 0 } }).exec(function (err, info) {
														if (!!info) {
															redT.telegram.sendMessage(id, '_XÁC THỰC THÀNH CÔNG_\nChào Mừng *' + info.name + '*, chúc bạn chơi game vui vẻ...\n\n*HƯỚNG DẪN*\n\nNhập:\n*OTP*:           Lấy mã OTP miễn phí.\n', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
															if (void 0 !== redT.users[check1.uid]) {
																// redT.users[check1.uid].forEach(function (client) {
																// 	client.red({ notice: { title: 'THÀNH CÔNG', text: 'Xác thực thành công.!\nChúc các bạn may mắn tại code vip pro...' }, user: { red: info.red * 1 + 0, phone: helpers.cutPhone(check1.region + check1.phone), veryphone: true } });
																// });
															}
															redT = null;
															id = null;
														}
													});
												} else {
													redT.telegram.sendMessage(id, '_Thao tác thất bại_', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
													redT = null;
													id = null;
												}
											});
										} catch (error) {
											redT.telegram.sendMessage(id, '_Thao tác thất bại_', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
											redT = null;
											id = null;
											phoneCrack = null;
										}
									} else {
										redT.telegram.sendMessage(id, 'Số điện thoại này chưa được đăng ký. Vui lòng đăng ký tại _code vip pro_', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
										redT = null;
										phoneCrack = null;
										id = null;
									}
								});


							} else {

								// callback({ title: 'ĐĂNG NHẬP', text: 'Mật khẩu không chính xác!!' }, false);
								redT.telegram.sendMessage(msg.from.id, 'Tên đăng nhật hoặc mật khẩu không chính xác!!', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
							}


						} else {
							redT.telegram.sendMessage(msg.from.id, 'Tài khoản bị vô hiệu hóa!', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });

						}
					} else {
						redT.telegram.sendMessage(msg.from.id, 'Tài khoản không tồn tại.', { parse_mode: 'markdown', reply_markup: { remove_keyboard: true } });
					}
				});

			} catch (e) {

			}


		}

	}
	else {
		start(redT.telegram, msg.from.id);
	}
}
