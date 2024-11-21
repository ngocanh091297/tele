let betPlay = obj.bet - TaiXiu_tong_red_lech;
let betwinP = 0;

obj.thanhtoan = true;
obj.win = win;
obj.tralai = TaiXiu_tong_red_lech;
TaiXiu_tong_red_lech = 0;
Helpers.MissionAddCurrent(obj.uid, (betPlay * 0.02 >> 0));

if (win) {
	// Thắng nhưng bị trừ tiền trả lại
	// cộng tiền thắng
	betwinP = truChietKhau(betPlay, 2);
	obj.betwin = betwinP;
	let redUpdate = obj.bet + betwinP;
	if (!obj.bot) {
		UserInfo.updateOne({ id: obj.uid }, { $inc: { totall: betwinP, red: redUpdate, redPlay: betPlay, redWin: betwinP } }).exec()
			.then(result => {
				// Kiểm tra kết quả trả về, result sẽ chứa thông tin về số bản ghi đã được thay đổi
				console.log("Cập nhật thành công:2", result);
			})
			.catch(err => {
				// Nếu có lỗi xảy ra trong quá trình cập nhật
				console.error("Lỗi khi cập nhật:2", err);
			});
	}

	TaiXiu_User.updateOne({ uid: obj.uid }, { $inc: { totall: betwinP, tWinRed: betwinP, tRedPlay: betPlay } }).exec();

	if (!!vipConfig && vipConfig.status === true) {
		TopVip.updateOne({ 'name': obj.name }, { $inc: { vip: betPlay } }).exec(function (errV, userV) {
			if (!!userV && userV.n === 0) {
				try {
					TopVip.create({ 'name': obj.name, 'vip': betPlay });
				} catch (e) {
				}
			}
		});
	}
} else {
	if (!obj.bot) {
		UserInfo.updateOne({ id: obj.uid }, { $inc: { totall: -betPlay, red: obj.tralai, redPlay: betPlay, redLost: betPlay } }).exec()
			.then(result => {
				// Kiểm tra kết quả trả về, result sẽ chứa thông tin về số bản ghi đã được thay đổi
				console.log("Cập nhật thành công:3", result);
			})
			.catch(err => {
				// Nếu có lỗi xảy ra trong quá trình cập nhật
				console.error("Lỗi khi cập nhật:3", err);
			});
	}

	TaiXiu_User.updateOne({ uid: obj.uid }, { $inc: { totall: -betPlay, tLostRed: betPlay, tRedPlay: betPlay } }).exec();
}
obj.save();
return TXCuocOne.updateOne({ uid: obj.uid, phien: game_id }, { $set: { win: win }, $inc: { tralai: obj.tralai, betwin: betwinP } }).exec();

if (win) {
	// cộng tiền thắng hoàn toàn
	let betwin = truChietKhau(obj.bet, 2);
	obj.thanhtoan = true;
	obj.win = true;
	obj.betwin = betwin;
	obj.save();
	Helpers.MissionAddCurrent(obj.uid, (obj.bet * 0.02 >> 0));

	if (!!vipConfig && vipConfig.status === true) {
		TopVip.updateOne({ 'name': obj.name }, { $inc: { vip: obj.bet } }).exec(function (errV, userV) {
			if (!!userV && userV.n === 0) {
				try {
					TopVip.create({ 'name': obj.name, 'vip': obj.bet });
				} catch (e) {
				}
			}
		});
	}

	let redUpdate = obj.bet + betwin;
	if (!obj.bot) {
		UserInfo.updateOne({ id: obj.uid }, { $inc: { totall: betwin, red: redUpdate, redWin: betwin, redPlay: obj.bet } }).exec()
			.then(result => {
				// Kiểm tra kết quả trả về, result sẽ chứa thông tin về số bản ghi đã được thay đổi
				console.log("Cập nhật thành công:4", result);
			})
			.catch(err => {
				// Nếu có lỗi xảy ra trong quá trình cập nhật
				console.error("Lỗi khi cập nhật:4", err);
			});
	}

	TaiXiu_User.updateOne({ uid: obj.uid }, { $inc: { totall: betwin, tWinRed: betwin, tRedPlay: obj.bet } }).exec();
	return TXCuocOne.updateOne({ uid: obj.uid, phien: game_id }, { $set: { win: true }, $inc: { betwin: betwin } }).exec();
} else {
	obj.thanhtoan = true;
	obj.save();
	Helpers.MissionAddCurrent(obj.uid, (obj.bet * 0.02 >> 0));
	if (!obj.bot) {
		UserInfo.updateOne({ id: obj.uid }, { $inc: { totall: -obj.bet, redLost: obj.bet, redPlay: obj.bet } }).exec()
			.then(result => {
				// Kiểm tra kết quả trả về, result sẽ chứa thông tin về số bản ghi đã được thay đổi
				console.log("Cập nhật thành công:5", result);
			})
			.catch(err => {
				// Nếu có lỗi xảy ra trong quá trình cập nhật
				console.error("Lỗi khi cập nhật:5", err);
			});
	}

	TaiXiu_User.updateOne({ uid: obj.uid }, { $inc: { totall: -obj.bet, tLostRed: obj.bet, tRedPlay: obj.bet } }).exec();
}