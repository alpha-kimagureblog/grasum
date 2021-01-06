// パーティ用の配列
let party_unit_list = [];
// エラーメッセージ
const err_msg1 = "選択は3つ以下にしてください";
const err_msg2 = "パーティは4体以下にしてください";
window.onload = unitEquipListAll;
// 各属性key
const element = [
	 "flame"
	,"water"
	,"wood"
	,"shine"
	,"dark"
];

// 全ユニットの装備枠を取得
function unitEquipListAll() {
	// 各属性別に取得
	for (var element_i = 0; element_i < element.length; element_i++) {
		// HTML出力用の変数
		let unit_equip_list = "";
		// ユニット情報を取得
		/* 引数
		* element[element_i] 各属性key
		* uni_inf_i          JSONの配列に格納されたユニットのインデックス
		*/
		for (let uni_inf_i = 0; uni_inf_i < unit_info[element[element_i]].length; uni_inf_i++) {
			unit_equip_list += getUnit(element[element_i], uni_inf_i)
		}
		// 属性別でHTMLタグを出力
		document.getElementById(element[element_i]).innerHTML = unit_equip_list;
	}
}

// 選択された装備枠を取得
function selectEquipList() {
	// 各属性別に取得
	for (var element_i = 0; element_i < element.length; element_i++) {
		// エラーメッセージを一度リセット
		error_message("");
		// 装備枠を4つ以上選択した時のカウント用
		let err_cnt = 0;
		// チェックボックスが配置されたフォームの情報を取得
		let equip_chk = document.forms['equip'];
		// チェックボックスのid格納用の配列
		let equip_chk_id_list = [];
		// チェックされたidを取得
		for (let eq_chk_i = 0; eq_chk_i < equip_chk.length; eq_chk_i++) {
			// チェックされたらidを配列に格納する
			if (equip_chk[eq_chk_i].checked) {
				equip_chk_id_list.push(equip_chk[eq_chk_i].id);
				// チェックされるたびにカウントを増やして、カウントが4以上になったらエラーにして処理を中断
				err_cnt++;
				if (err_cnt > 3) {
					error_message(err_msg1);
					return
				}
			}
		}
		if (equip_chk_id_list.length == 0) {
			// チェックがすべて外れたら、全ユニットを表示させる
			unitEquipListAll();
		} else {
			// checkboxがチェックされている装備枠と一致するユニット情報を取得して、属性別でHTMLタグを出力
			/* 引数
			* element[element_i] 各属性key
			* equip_chk_id_list  選択された装備枠のidリスト
			*/
			document.getElementById(element[element_i]).innerHTML = selectUnit(element[element_i], equip_chk_id_list);
		}
	}
}

// 装備枠を検索し、一致するユニット情報を取得するためのインデックスを取得する
function selectUnit(element, equip_chk_id_list) {
	// ユニット情報を取得するためのインデックス情報を格納する配列
	let unit_inf_index_list = [];
	// ユニット情報返却用
	let unit_equip_list = "";
	// 複数条件で絞り込めるように、選択された装備枠の数で条件分岐
	// 4つ以上のときはエラーとなるため、3つまでを用意
	// チェックが1つのとき
	if (equip_chk_id_list.length == 1) {
		// 選択された装備枠を持つユニットを検索
		/* 引数
		* element              各属性key
		* equip_chk_id_list[0] 1つ目のid
		*/
		unit_inf_index_list = getUnitInfIndex(element, equip_chk_id_list[0]);
		// ユニット情報を取得
		/* 引数
		* element                各属性key
		* unit_inf_index_list[i] JSONの配列に格納されたユニットのインデックス
		*/
		for (var i = 0; i < unit_inf_index_list.length; i++) {
			unit_equip_list += getUnit(element, unit_inf_index_list[i]);
		}
		return unit_equip_list;
	}
	// チェックが2つのとき
	if (equip_chk_id_list.length == 2) {
		// チェックが1つのときと同様に、選択された装備枠を持つユニットを絞り込み、さらにそこから2つ目のidで絞り込む
		/* 引数
		* element              各属性key
		* equip_chk_id_list[1] 2つ目のid
		* getUnitInfIndex(element, equip_chk_id_list[0]) 1つ目のidでHITしたユニット情報
		*/
		unit_inf_index_list = getUnitInfIndex2(
			element, equip_chk_id_list[1], getUnitInfIndex(element, equip_chk_id_list[0])
		);
		for (var i = 0; i < unit_inf_index_list.length; i++) {
			unit_equip_list += getUnit(element, unit_inf_index_list[i]);
		}
		return unit_equip_list;
	}
	// チェックが3つのとき
	if (equip_chk_id_list.length == 3) {
		// チェックが2つのときの絞り込みを2回やっているだけなので説明は割愛
		unit_inf_index_list = getUnitInfIndex2(
			element, equip_chk_id_list[2], getUnitInfIndex2(
				element, equip_chk_id_list[1], getUnitInfIndex(element, equip_chk_id_list[0])
			)
		);
		for (var i = 0; i < unit_inf_index_list.length; i++) {
			unit_equip_list += getUnit(element, unit_inf_index_list[i]);
		}
		// 取得したユニット情報を返す
		return unit_equip_list;
	}
}

// 装備idからユニット情報を取得するためのindex情報を取得
function getUnitInfIndex(element, equip_chk_id) {
	// 一致したユニット情報格納用の配列
	let select_unit = [];
	for (let uni_inf_i = 0; uni_inf_i < unit_info[element].length; uni_inf_i++) {
		let uni_inf = unit_info[element][uni_inf_i];
		for (let uni_equ_i = 0; uni_equ_i < uni_inf.equipment.length; uni_equ_i++) {
			if (equip_chk_id == uni_inf.equipment[uni_equ_i]) {
				select_unit.push(uni_inf_i);
				break;
			}
		}
	}
	// 一致したユニット情報を返す
	return select_unit;
}

// 取得したユニット情報を取得するためのindexから、装備idでさらに絞り込む
// getUnitInfIndexとやっていることはほぼ一緒
function getUnitInfIndex2(element, equip_chk_id, unit_inf_index_list) {
	let select_unit = [];
	for (var unit_inf_index_list_i = 0; unit_inf_index_list_i < unit_inf_index_list.length; unit_inf_index_list_i++) {
		let uni_inf = unit_info[element][unit_inf_index_list[unit_inf_index_list_i]]
		for (let uni_equ_i = 0; uni_equ_i < uni_inf.equipment.length; uni_equ_i++) {
			if (equip_chk_id == uni_inf.equipment[uni_equ_i]) {
				select_unit.push(unit_inf_index_list[unit_inf_index_list_i]);
				break;
			}
		}
	}
	return select_unit;
}

// 属性keyとユニット情報を取得するインデックスを基にHTMLタグ作成
function getUnit(element, index) {
	let unit_equip_list = "";
	// ユニットの名前、画像、URLを取得してHTMLタグ内にセット
	let uni_inf = unit_info[element][index];
	unit_equip_list += "<tr>"
	+ "<td class=\"unit_td\">"
	// パーティ作成用のボタンを作成
	// 属性と配列の格納場所を特定するために、valueに属性key、idにインデックスを埋め込む
	+ "<button type=\"button\" class=\"btn unit_btn\" value=\"" + element + "\" id=\"" + index + "\" onClick=\"selectParty(this)\"/>選択</button>"
	+ "</td>"
	+ "<td colspan=\"3\">"
	// ユニット記事にジャンプするようにユニット名にリンクを作成
	+ "<a href=\"" + uni_inf.url + "\">"
	+ "<span class=\"unit_name\">" + uni_inf.name + "</span>"	// ユニット名
	+ "</a></td></tr>"
	+ "<tr>"
	+ "<td>"
	// ユニット記事にジャンプするように画像にリンクを作成
	+ "<a href=\"" + uni_inf.url + "\">"
	+ "<img class=\"unit_img\" src=\"" + uni_inf.img + "\">"	// ユニット画像
	+ "</a></td>";
	// 対象ユニットの装備枠を取得してHTMLタグ内にセット
	for (let uni_equ_i = 0; uni_equ_i < uni_inf.equipment.length; uni_equ_i++) {
		unit_equip_list += "<td>"
		+ "<img class=\"equip_img\" src=\""
		+ equip_rarity[`${uni_inf.equipment[uni_equ_i]}`]
		+ "\"></td>";
	}
	unit_equip_list += "</tr>";
	return unit_equip_list;
}

// 引数で渡ってきた属性を基にパーティを出力
function selectParty(unit_element) {
	// 一度パーティをリセット
	let party_unit = "";
	// 選択したユニットを用意した配列に格納する
	party_unit_list.push(unit_element);
	// パーティは4体までのため、5体以上選択された場合は、5体目を削除してエラーにする
	if (party_unit_list.length > 4) {
		party_unit_list.pop();
		error_message(err_msg2)
	}
	// ユニット情報を取得
	/* 引数
	* party_unit_list[i].value 各属性key
	* party_unit_list[i].id    ユニット情報が格納された配列のインデックス
	* i                        パーティ削除用のインデックス
	*/
	for (var i = 0; i < party_unit_list.length; i++) {
		party_unit += getPartyUnit(party_unit_list[i].value, party_unit_list[i].id, i);
	}
	// パーティのHTMLタグを出力
	document.getElementById("party").innerHTML = party_unit;
}

// パーティから削除
function cancelParty(index) {
	// パーティを一度リセット
	let party_unit = "";
	// 取消ボタンを押したユニットを配列から削除
	party_unit_list.splice(index, 1);
	// パーティを出力し直す
	for (var i = 0; i < party_unit_list.length; i++) {
		party_unit += getPartyUnit(party_unit_list[i].value, party_unit_list[i].id, i);
	}
	document.getElementById("party").innerHTML = party_unit;
}

function getPartyUnit(element, index, value) {
	let unit_equip_list = "";
	// ユニットの名前、画像、URLを取得してHTMLタグ内にセット
	// 装備枠で絞り込む時とほぼ一緒
	let uni_inf = unit_info[element][index];
	unit_equip_list += "<tr>"
	+ "<td class=\"unit_td\">"
	// 取消ボタン用に、ユニットが格納されたインデックス情報をvalueにセット
	+ "<button type=\"button\" class=\"btn unit_btn\" value=\"" + value + "\" onClick=\"cancelParty(this.value)\"/>取消</button>"
	+ "</td>"
	+ "<td colspan=\"3\">"
	+ "<a href=\"" + uni_inf.url + "\">"
	+ "<span class=\"unit_name\">" + uni_inf.name + "</span>"
	+ "</a></td></tr>"
	+ "<tr>"
	+ "<td>"
	+ "<a href=\"" + uni_inf.url + "\">"
	+ "<img class=\"unit_img\" src=\"" + uni_inf.img + "\">"
	+ "</a></td>";
	// 対象ユニットの装備枠を取得してHTMLタグ内にセット
	for (let uni_equ_i = 0; uni_equ_i < uni_inf.equipment.length; uni_equ_i++) {
		unit_equip_list += "<td>"
		+ "<img class=\"equip_img\" src=\""
		+ equip_rarity[`${uni_inf.equipment[uni_equ_i]}`]
		+ "\"></td>";
	}
	unit_equip_list += "</tr>";
	// HTMLを返す
	return unit_equip_list;
}

// エラーメッセージ出力
function error_message(err_msg) {
	document.getElementById("err_msg").innerHTML = err_msg;
}

// 装備レアリティ画像を格納したJSON
const equip_rarity = {
	"physics5" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/physics5.png"
	,"physics4" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/physics4.png"
	,"physics3" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/physics3.png"
	,"magic5" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/magic5.png"
	,"magic4" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/magic4.png"
	,"magic3" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/magic3.png"
	,"defense5" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/defense5.png"
	,"defense4" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/defense4.png"
	,"defense3" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/defense3.png"
	,"heel5" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/heel5.png"
	,"heel4" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/heel4.png"
	,"heel3" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/heel3.png"
	,"support5" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/support5.png"
	,"support4" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/support4.png"
	,"support3" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/support3.png"
};

// 属性別でユニット名と画像、装備枠情報を格納したJSON
const unit_info = {
	"flame" : [
		{"name" : "ミラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/abc3705c5042f9a405a34573dd4d5c3d.png", "url" : "https://alpha-kimagureblog.xyz/character/mira/", "equipment" : ["physics5", "magic5", "heel4"]}
		,{"name" : "覇煌剣神クライド", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/565e95c6fd842e9e79eb67ecd25d09e0.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E8%A6%87%E7%85%8C%E5%89%A3%E7%A5%9E%E3%82%AF%E3%83%A9%E3%82%A4%E3%83%89", "equipment" : ["physics5", "physics5", "defense3"]}
		,{"name" : "神焔騎皇ラグナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/0b695b10e88ce2f18ec2e93f34f0b5bf.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E7%A5%9E%E7%84%94%E9%A8%8E%E7%9A%87%E3%83%A9%E3%82%B0%E3%83%8A", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "霊焔剣后リアン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/0bbabcf1a212df83b26c85aca513f5bb.png", "url" : "https://alpha-kimagureblog.xyz/character/lian/", "equipment" : ["support5", "physics5", "physics4"]}
		,{"name" : "輝焔斧后リシュリー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/669f5ba554794057dfddcad4b55acd74.png", "url" : "https://alpha-kimagureblog.xyz/character/rishuri/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "カイザーX・ガナン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/cd52fb8185f90fbff7276c250e9dd863.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%82%AB%E3%82%A4%E3%82%B6%E3%83%BCX%E3%83%BB%E3%82%AC%E3%83%8A%E3%83%B3%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "カティ・ソフィ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/df7da5791fcf5eaa065b3d28bdd52b65.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%82%AB%E3%83%86%E3%82%A3%E3%83%BB%E3%82%BD%E3%83%95%E3%82%A3%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["support5", "heel5", "physics4"]}
		,{"name" : "レウスネコ・アイルー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/f16eabf34de8595369b8ceed681cddaf.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%83%AC%E3%82%A6%E3%82%B9%E3%83%8D%E3%82%B3%E3%83%BB%E3%82%A2%E3%82%A4%E3%83%AB%E3%83%BC%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["support5", "heel5", "heel5"]}
		,{"name" : "焔聖護神アンナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/297d694a48a3d56060b6265721121121.png", "url" : "https://alpha-kimagureblog.xyz/character/anna/", "equipment" : ["physics5", "heel5", "physics4"]}
		,{"name" : "究至剣神ラサオウ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b7c72ef646147736ba4810396ad13eba.png", "url" : "https://alpha-kimagureblog.xyz/character/lasaou/", "equipment" : ["defense5", "physics5", "support4"]}
		,{"name" : "竜軍将帥ジェラルド", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/9d25579e3a6b3e18794f011492d14a09.png", "url" : "https://alpha-kimagureblog.xyz/character/gerald/", "equipment" : ["defense5", "physics5", "magic4"]}
		,{"name" : "纏 流子", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/30a9d5b9cb983a7cabeed428fe1bc068.png", "url" : "https://alpha-kimagureblog.xyz/character/ryuko/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "獣召魔煌ピエンツ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/646664b4d55ccacb7db215ee5a4f0208.png", "url" : "https://alpha-kimagureblog.xyz/character/pientz/", "equipment" : ["magic5", "magic5", "magic4"]}
		,{"name" : "快殺魔神ボーゲン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/013b3c31afd911a472cd66c3b4fa5b88.png", "url" : "https://alpha-kimagureblog.xyz/character/bogen/", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "煌華剣神タリス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7d7ba8be642945b89dfc42c1fe527796.png", "url" : "https://alpha-kimagureblog.xyz/character/thalys/", "equipment" : ["physics5", "support5", "support4"]}
		,{"name" : "焔統神イフリート", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/cb268da1fc596aadabf0f077f6c2f262.png", "url" : "https://alpha-kimagureblog.xyz/character/ifrit/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "護焔巨神バドル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/053e247b0fbec1dd2589d1d322338ace.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E8%AD%B7%E7%84%94%E5%B7%A8%E7%A5%9E%E3%83%90%E3%83%89%E3%83%AB", "equipment" : ["defense5", "physics5", "physics4"]}
		,{"name" : "杉元佐一", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/6ba11b0a534cb483850f2d8061170ce7.png", "url" : "https://alpha-kimagureblog.xyz/character/sugimoto/", "equipment" : ["physics5", "physics5", "defense5"]}
		,{"name" : "ベリック", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/9de6828ef099b3adf481c3ef624b7605.png", "url" : "https://alpha-kimagureblog.xyz/character/berwick/", "equipment" : ["magic5", "magic5", "support4"]}
		,{"name" : "煌炎烈后リオネ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b601b0c57cb3a001f785750068fa735e.png", "url" : "https://alpha-kimagureblog.xyz/character/lione/", "equipment" : ["support5", "support5", "physics4"]}
		,{"name" : "焔志獣神クルト", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/19c86439d456a8ab9ad38d9a0c16c6a9.png", "url" : "https://alpha-kimagureblog.xyz/character/kurt/", "equipment" : ["physics5", "heel5", "magic4"]}
		,{"name" : "ミリム", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/a97661c9fe4e2b82c9a460b597cc807c.png", "url" : "https://alpha-kimagureblog.xyz/character/mirim/", "equipment" : ["magic5", "support5", "physics4"]}
		,{"name" : "ベニマル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/671369806be309917695bfa367a2294c.png", "url" : "https://alpha-kimagureblog.xyz/character/benimaru/", "equipment" : ["physics5", "magic5", "defense4"]}
		,{"name" : "諜戮滅魔ミレニア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7e07bfefef4cb3bcc946d0d475f3a6ae.png", "url" : "https://alpha-kimagureblog.xyz/character/millenia/", "equipment" : ["support5", "physics5", "heel4"]}
		,{"name" : "剣士ベリック", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/05a11e1dd3c08895b9c6d37fa089507a.png", "url" : "https://alpha-kimagureblog.xyz/character/swords-berwick/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "熾天盾聖サンストン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/30197d15c76f4750495cb1bd34e7dd35.png", "url" : "https://alpha-kimagureblog.xyz/character/sanston/", "equipment" : ["defense5", "defense5", "support4"]}
		,{"name" : "神焔剣聖グラン=ブレイブ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/85badef6-bafb-491b-981a-e857331ca229-24268-000006bbf1d2a45e.png", "url" : "https://alpha-kimagureblog.xyz/character/gran-brave/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "キサラギ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/b99a1826-7e22-48b2-a385-fc33cfe5b20d-11171-0000035e4a2182f9.png", "url" : "https://alpha-kimagureblog.xyz/character/kisaragi/", "equipment" : ["physics5", "heel5", "physics4"]}
		,{"name" : "紅炎獣姫ミリーニャ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/4a65cd22-b2af-4c31-b660-4035f8dd6fbd-11171-0000035e4dcce052.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E7%B4%85%E7%82%8E%E7%8D%A3%E5%A7%AB%E3%83%9F%E3%83%AA%E3%83%BC%E3%83%8B%E3%83%A3", "equipment" : ["physics5", "heel5", "physics4"]}
		,{"name" : "焔豪剣士オルガ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/08/4227550c-5e95-4576-90da-b9f6b182b583-1137-000000450d295548.png", "url" : "https://alpha-kimagureblog.xyz/character/olga/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "タマエ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/09/72bbdcdc-462e-4f93-acdf-4a04d862db84-3515-000000b0996ea9be.png", "url" : "https://alpha-kimagureblog.xyz/character/tamae/", "equipment" : ["magic5", "physics5", "magic4"]}
		,{"name" : "覇煌竜神ダルギオン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/8315f6ac3f2f18fefefceb6829698c9b.jpg", "url" : "https://grandsummoners.gorillawiki.jp/entry/dalgion", "equipment" : ["physics5", "physics5", "magic4"]}
		,{"name" : "神燃導獅ヴァーミリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/06/db7c82dd695e608b0e17a5bc05ab5373.jpg", "url" : "https://alpha-kimagureblog.xyz/character/vermilia/", "equipment" : ["heel5", "defense5", "support4"]}
		,{"name" : "駆け抜ける焔ロイ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/12/df81c0751ab0331d9b8e30599a9ab1d8.png", "url" : "https://alpha-kimagureblog.xyz/character/flame-roy/", "equipment" : ["physics5", "magic5", "physics4"]}
		,{"name" : "ラダック", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/12/27157d61-f6d2-46ff-8c00-d1d8e75c5874-23665-00001efd19dc4da9.jpg", "url" : "https://alpha-kimagureblog.xyz/character/ladakh/", "equipment" : ["physics5", "defense5", "defense4"]}
		,{"name" : "神弧の画聖スミレ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/01/9cfcbd76-2e6e-4053-9aa5-4744b5be849f-66389-0000110ec90b69f9.png", "url" : "https://alpha-kimagureblog.xyz/character/sumire/", "equipment" : ["magic5", "magic5", "support4"]}
		,{"name" : "ガナン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/02/b83037b68044e425fa2e0b5debcb5856.jpg", "url" : "https://grandsummoners.gorillawiki.jp/entry/2919", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "撃滅の焔機神ソレイユ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/02/60eed7975118b237a00ef70be299572d.jpg", "url" : "https://alpha-kimagureblog.xyz/character/soleil/", "equipment" : ["magic5", "defense5", "magic4"]}
		,{"name" : "アンジェラス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/11c16e55c470c4a8c2a889ff0b1de440.jpg", "url" : "https://alpha-kimagureblog.xyz/character/angelas/", "equipment" : ["physics5", "magic5", "magic4"]}
		,{"name" : "神焔忍姫ホノカ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b57fdabbd05cae67d852d9fa663fbe2b.jpg", "url" : "https://alpha-kimagureblog.xyz/character/honoka/", "equipment" : ["physics5", "heel5", "physics4"]}
		,{"name" : "心の抱擁者アーシュリー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/02/da3dcf873f463de054dba2bcbe5fbe50.jpg", "url" : "https://alpha-kimagureblog.xyz/character/ashley/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "マリカ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2018/10/7cdc9ee80d63ec488bfdc4017036fbe4.jpg", "url" : "https://alpha-kimagureblog.xyz/character/marika/", "equipment" : ["magic5", "heel5", "defense4"]}
		,{"name" : "焔竜騎神アロスデア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/ad60269cc216d85bb6b52247637eefa5.jpg", "url" : "https://grandsummoners.gorillawiki.jp/entry/3329", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "煌炎の守護精フェルド", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/3b7f13a7ba97c9764339751797e39470.jpg", "url" : "https://grandsummoners.gorillawiki.jp/entry/3174", "equipment" : ["magic5", "heel5", "magic4"]}
		,{"name" : "ミリム(サンタver)", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/01/2020y12m15d_1949585516.jpg", "url" : "https://alpha-kimagureblog.xyz/character/milim-santa/", "equipment" : ["physics5", "heel5", "defense4"]}
	],
	"water" : [
		{"name" : "ロイ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/65c00c84673568aaecaa23489fcb5cb4.png", "url" : "https://alpha-kimagureblog.xyz/character/roy/", "equipment" : ["physics5", "heel5", "defense4"]}
		,{"name" : "絶氷剣后コルセア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/49a27233f66cf8ecc809c6a490f4b054.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E7%B5%B6%E6%B0%B7%E5%89%A3%E5%90%8E%E3%82%B3%E3%83%AB%E3%82%BB%E3%82%A2", "equipment" : ["magic5", "physics5", "defense3"]}
		,{"name" : "エスト", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/f24225da9343026d94b7ad60cfb0be54.png", "url" : "https://alpha-kimagureblog.xyz/character/est/", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "神霊槍妃デイシー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/32f694812f05f39913b998c534849e82.png", "url" : "https://alpha-kimagureblog.xyz/character/dacey/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "滅壊機神ラプレ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/2e90f6f5433ebd21490a3e68cdb0478f.png", "url" : "https://alpha-kimagureblog.xyz/character/rapre/", "equipment" : ["support5", "support5", "heel4"]}
		,{"name" : "唯海神ハーク", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/3502d653feb5cbd55e48da655b08dbac.png", "url" : "https://alpha-kimagureblog.xyz/character/hark/", "equipment" : ["support5", "physics5", "magic4"]}
		,{"name" : "ミツネS・ロイ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/57f65a6a9532316b5a9381128203dedc.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%83%9F%E3%83%84%E3%83%8DS%E3%83%BB%E3%83%AD%E3%82%A4%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["physics5", "heel5", "defense4"]}
		,{"name" : "悠碧の聖護神クオン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/1d3ee4ceab82e866a0e9a780d5017fad.png", "url" : "https://alpha-kimagureblog.xyz/character/quon/", "equipment" : ["magic5", "defense5", "heel4"]}
		,{"name" : "リアナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d92d192e13c7b5b86cf4dad26cfebc28.png", "url" : "https://alpha-kimagureblog.xyz/character/liana/", "equipment" : ["physics5", "physics5", "heel4"]}
		,{"name" : "魔壊封妃アリステラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/e45119e392eaa467094cb75162bd3f52.png", "url" : "https://alpha-kimagureblog.xyz/character/aristella/", "equipment" : ["heel5", "defense5", "support4"]}
		,{"name" : "鬼龍院 皐月", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/65f9043a53c9c8ae17c2a78477746135.png", "url" : "https://alpha-kimagureblog.xyz/character/satsuki/", "equipment" : ["physics5", "defense5", "heel4"]}
		,{"name" : "狼殺銃神スライ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/6e8144e868282529c7e0f64c7ea33ade.png", "url" : "https://alpha-kimagureblog.xyz/character/sly/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "封神狐后ジーラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/c0e6b2e4a72b9bbdd04bddcc7bf30afb.png", "url" : "https://alpha-kimagureblog.xyz/character/gira/", "equipment" : ["magic5", "support5", "magic4"]}
		,{"name" : "碧魔降帥ディアス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/2abb9937dc084632ef3dd253048f84cf.png", "url" : "https://alpha-kimagureblog.xyz/character/diaz/", "equipment" : ["magic5", "support5", "support4"]}
		,{"name" : "戦神獣王ロッズ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/3c8610c15d38438af683b554bd13d06d.png", "url" : "https://alpha-kimagureblog.xyz/character/rods/", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "醒魔槍神アルヴィナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/4e619d4f245c6637cdedc5e4b3ba05ef.png", "url" : "https://alpha-kimagureblog.xyz/character/alvina/", "equipment" : ["magic5", "physics5", "magic4"]}
		,{"name" : "瀑麗神后ヨミ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/8ad6ed54631093e0178302fd989851f3.png", "url" : "https://alpha-kimagureblog.xyz/character/yomi/", "equipment" : ["physics5", "support5", "physics4"]}
		,{"name" : "静聖神パルラミシア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/cb2aa8f3ed358dda1fd22ac0c7aabbd0.png", "url" : "https://alpha-kimagureblog.xyz/character/pallramicia/", "equipment" : ["magic5", "heel5", "magic4"]}
		,{"name" : "氷界の魔凍妃セリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d745becc3fc2c77a3638e8b5b397f36a.png", "url" : "https://alpha-kimagureblog.xyz/character/selia/", "equipment" : ["heel5", "magic5", "magic4"]}
		,{"name" : "竜克騎神ウィーバ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/ee2119b60c420066f3f83efb833fa9c5.png", "url" : "https://alpha-kimagureblog.xyz/character/weaver/", "equipment" : ["physics5", "support5", "support4"]}
		,{"name" : "蒼氷麗刃メリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/9b80756f1fc610624375eae77e527c48.png", "url" : "https://alpha-kimagureblog.xyz/character/water-melia/", "equipment" : ["physics5", "support5", "magic4"]}
		,{"name" : "絶零殺竜グラニス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/196c7b51b324d000e1e9695dc5326954.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E7%B5%B6%E9%9B%B6%E6%AE%BA%E7%AB%9C%E3%82%B0%E3%83%A9%E3%83%8B%E3%82%B9", "equipment" : ["magic5", "defense5", "magic4"]}
		,{"name" : "セティス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/3b1e21801adfd520b200f6412a0410cc.png", "url" : "https://alpha-kimagureblog.xyz/character/setis/", "equipment" : ["defense5", "physics5", "defense4"]}
		,{"name" : "氷魔槍皇ヴィッツ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/a5df29fd442d7276de0f1aca12afad74.png", "url" : "https://alpha-kimagureblog.xyz/character/vitz/", "equipment" : ["magic5", "defense5", "heel4"]}
		,{"name" : "ヴォックス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/9e65231c07697842c953327f97c3075e.png", "url" : "https://alpha-kimagureblog.xyz/character/vox/", "equipment" : ["physics5", "support5", "heel4"]}
		,{"name" : "聖天覇神ニース", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/11f6e0181a3a9a3ef89eeb885e819833.png", "url" : "https://alpha-kimagureblog.xyz/character/nice/", "equipment" : ["physics5", "heel5", "defense4"]}
		,{"name" : "リムル(スライムver)", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/4764ab8ca3c60ea60029fd25fd815549.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%83%AA%E3%83%A0%E3%83%AB%EF%BC%88%E3%82%B9%E3%83%A9%E3%82%A4%E3%83%A0ver%EF%BC%89%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["defense5", "defense5", "heel4"]}
		,{"name" : "リムル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/8342cc214b77e111765ce16bb352c195.png", "url" : "https://alpha-kimagureblog.xyz/character/limulle/", "equipment" : ["physics5", "support5", "magic4"]}
		,{"name" : "瑞麗占姫ティア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/c404b7371a47a675aa4cf7837d36c56b.png", "url" : "https://alpha-kimagureblog.xyz/character/tia/", "equipment" : ["magic5", "defense5", "support4"]}
		,{"name" : "覇獣魔王ザール", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b0d7900ae4eb937ed5c6931899c6ca2b.png", "url" : "https://alpha-kimagureblog.xyz/character/saar/", "equipment" : ["physics5", "support5", "defense4"]}
		,{"name" : "ロゼッタ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/ac60b13fe731f526e919e422b0c3c234.png", "url" : "https://alpha-kimagureblog.xyz/character/rosetta/", "equipment" : ["support5", "support5", "magic4"]}
		,{"name" : "獣神拳后シンシア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/6013ad94-4699-4cd9-b4ed-10c4d6ef2f2f-24268-000006bc072ba336.png", "url" : "https://alpha-kimagureblog.xyz/character/cynthia/", "equipment" : ["physics5", "physics5", "support4"]}
		,{"name" : "迅勇幻神サイ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/12bdd24b-4ca8-4c4b-9f97-8d5c75f5feff-2347-0000007b89d6ae00.png", "url" : "https://alpha-kimagureblog.xyz/character/sai/", "equipment" : ["physics5", "physics5", "heel4"]}
		,{"name" : "覇獣神后シャディ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/06/8e0a3910-b24b-453d-b60b-2095b361758e-14746-0000051328e501a2.png", "url" : "https://alpha-kimagureblog.xyz/character/shady/", "equipment" : ["support5", "support5", "support4"]}
		,{"name" : "ミズキ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/bb018243-afc1-43a0-9cd5-d2e960327321-82062-0000148732b6e8b5.png", "url" : "https://alpha-kimagureblog.xyz/character/mizuki/", "equipment" : ["support5", "support5", "physics4"]}
		,{"name" : "地獄のフブキ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/e02b34b7-0dc7-45f7-a469-802f6da7c644-46628-00000bdb20ecef6b.png", "url" : "https://alpha-kimagureblog.xyz/character/fubuki/", "equipment" : ["magic5", "magic5", "support4"]}
		,{"name" : "蒼碧術姫アデル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/08/0838a601-b284-4d14-a703-7396a49e5655-3999-0000011f2f701538.png", "url" : "https://alpha-kimagureblog.xyz/character/adele/", "equipment" : ["heel5", "support5", "magic4"]}
		,{"name" : "凛舞大鎌ベロニカ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/2e62f05e492c3b4f951b2be32434acb3.jpg", "url" : "https://alpha-kimagureblog.xyz/character/veronica/", "equipment" : ["magic5", "magic5", "physics4"]}
		,{"name" : "巨神愛姫ユミィ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/1ec4eb80dede3a2b2578992a2d163ec3.jpg", "url" : "https://alpha-kimagureblog.xyz/character/yumii/", "equipment" : ["defense5", "physics5", "physics4"]}
		,{"name" : "碧閃剣騎フィリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/12/2362bcc18b7b852fc5970239ef475dcf.png", "url" : "https://alpha-kimagureblog.xyz/character/philia/", "equipment" : ["physics5", "heel5", "defense4"]}
		,{"name" : "ヴィラーゴ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/02/84295b1bc205e183aa18932b2864c8b0.jpg", "url" : "https://alpha-kimagureblog.xyz/character/villago/", "equipment" : ["magic5", "defense5", "heel4"]}
		,{"name" : "メルティ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/b5a37367ceaad4d66f158e57beefe03a.jpg", "url" : "https://alpha-kimagureblog.xyz/character/melty/", "equipment" : ["magic5", "heel5", "heel4"]}
		,{"name" : "万霊騎皇エルメシオ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2021/01/0e2876cbf3f46a700441dddf89b47a89.png", "url" : "https://alpha-kimagureblog.xyz/character/hermesio/", "equipment" : ["magic5", "support5", "magic4"]}
		,{"name" : "浦飯幽助", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d0d1611a45b073f41552dd26c3a1ed1e.jpg", "url" : "https://alpha-kimagureblog.xyz/character/urameshi-yusuke/", "equipment" : ["magic5", "support5", "physics4"]}
		,{"name" : "奉凰慈聖フェレス</td>", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/44bd06fd51e30a97ef76082fe65c2dcf.jpg", "url" : "https://alpha-kimagureblog.xyz/character/ferres/", "equipment" : ["magic5", "support5", "heel4"]}
		,{"name" : "溢れる想像力 レイン</td>", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/09/5CFE534D-741F-4030-8F94-162D12B8C953.jpeg", "url" : "https://alpha-kimagureblog.xyz/character/rain/", "equipment" : ["magic5", "heel5", "support4"]}
		,{"name" : "エミリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/09/e0eb68c1e6e5ac8da51d71d9f916f8d8.jpg", "url" : "https://alpha-kimagureblog.xyz/character/re0-emilia/", "equipment" : ["magic5", "support5", "magic4"]}
		,{"name" : "レム", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/09/45544f7bdd0256b18abee47529ccd26e.jpg", "url" : "https://alpha-kimagureblog.xyz/character/re0-rem/", "equipment" : ["physics5", "magic5", "heel4"]}
		,{"name" : "氷藍獣姫ターニャ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/11/5160c47197185caf145ed547ef6fbdcb.jpg", "url" : "https://alpha-kimagureblog.xyz/character/tanya/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "リムル(サンタver)", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/01/2020y12m15d_1949574903.jpg", "url" : "https://alpha-kimagureblog.xyz/character/rimuru-santa/", "equipment" : ["magic5", "support5", "magic4"]}
	],
	"wood" : [
		{"name" : "双翠剣皇アルス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/71a1ae205afeb5b8de40d17ae2bfd6d7.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E5%8F%8C%E7%BF%A0%E5%89%A3%E7%9A%87%E3%82%A2%E3%83%AB%E3%82%B9", "equipment" : ["physics5", "magic5", "defense3"]}
		,{"name" : "フェン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/2aaf8f6438c18af21fe76b094fdeee83.png", "url" : "https://alpha-kimagureblog.xyz/character/fen/", "equipment" : ["physics5", "support5", "support4"]}
		,{"name" : "護神竜后ネリム", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/00684bd1c3c8d231afad668abca7a462.png", "url" : "https://alpha-kimagureblog.xyz/character/nerim/", "equipment" : ["heel5", "heel5", "magic4"]}
		,{"name" : "真識竜帥ルーヴェ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/6968f277fc084d166a52b7585f4c9911.png", "url" : "https://alpha-kimagureblog.xyz/character/rouve/", "equipment" : ["support5", "physics5", "heel4"]}
		,{"name" : "時空魔導卿アルマ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/2d28929dde8a3d0abb16394d656ae444.png", "url" : "https://alpha-kimagureblog.xyz/character/alma/", "equipment" : ["magic5", "magic5", "defense4"]}
		,{"name" : "碧命剣聖ヴォーグ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/cce3589c4d5d727f4b68dc62607fe18f.png", "url" : "https://alpha-kimagureblog.xyz/character/vogue/", "equipment" : ["physics5", "magic5", "physics4"]}
		,{"name" : "ケイン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/f29b18f693843ebb0d1b5e0389133245.png", "url" : "https://alpha-kimagureblog.xyz/character/cain/", "equipment" : ["magic5", "support5", "physics4"]}
		,{"name" : "滅界鬼神フォスレ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d2a23893b48bd6927c3af2823cd2c0a2.png", "url" : "https://alpha-kimagureblog.xyz/character/foslet/", "equipment" : ["physics5", "support5", "defense4"]}
		,{"name" : "星華弓聖マモリ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/67bdbd4ea00d467fda8d5d25f157865b.png", "url" : "https://alpha-kimagureblog.xyz/character/mamori/", "equipment" : ["support5", "physics5", "support4"]}
		,{"name" : "神機総帥ヴィシャス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/f4bc1aeafdcc8bb0be5c594147b9d1a7.png", "url" : "https://alpha-kimagureblog.xyz/character/vicious/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "国謀幻帥ジル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b865a0f23dda29cd48da57fad3308676.png", "url" : "https://alpha-kimagureblog.xyz/character/jill/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "冥華魔后ポーラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/63f4ce0df6ee5a25c9c3bacca54d851f.png", "url" : "https://alpha-kimagureblog.xyz/character/paula/", "equipment" : ["physics5", "heel5", "physics4"]}
		,{"name" : "桜華一刀流ミラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d3c401597536cf9adb0fe44789a7ccff.png", "url" : "https://alpha-kimagureblog.xyz/character/wood-mira/", "equipment" : ["physics5", "support5", "heel4"]}
		,{"name" : "ノルン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/e4edcfe98edc115036f8a51bc42f2bf8.png", "url" : "https://alpha-kimagureblog.xyz/character/norn/", "equipment" : ["magic5", "defense5", "support4"]}
		,{"name" : "リヴィエラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/ffcbb2842dfafafcc7b45302245144d7.png", "url" : "https://alpha-kimagureblog.xyz/character/riviera/", "equipment" : ["physics5", "magic5", "physics4"]}
		,{"name" : "豪剣覇皇ルーダ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/715251997d33d3c5d50920de89c42a50.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E8%B1%AA%E5%89%A3%E8%A6%87%E7%9A%87%E3%83%AB%E3%83%BC%E3%83%80", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "翠神帝姫ベル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7d8592c80f4b87806c8eaba2223c3d12.png", "url" : "https://alpha-kimagureblog.xyz/character/bell/", "equipment" : ["support5", "heel5", "magic4"]}
		,{"name" : "叡天騎帥パロット", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/563806b37f44bd2d9e967ee3f2b05190.png", "url" : "https://alpha-kimagureblog.xyz/character/parrot/", "equipment" : ["support5", "magic5", "magic4"]}
		,{"name" : "碧愛師聖マキナス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7e86928f21ef3dd845412790943063ac.png", "url" : "https://alpha-kimagureblog.xyz/character/makinas/", "equipment" : ["magic5", "heel5", "heel4"]}
		,{"name" : "闘竜軍神エイシス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d832e03d-e587-4176-abaa-26d80fa56c9b-9059-000002526b3a94a8.png", "url" : "https://alpha-kimagureblog.xyz/character/aesis/", "equipment" : ["physics5", "physics5", "magic4"]}
		,{"name" : "妖精弓手", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/dfda6ffb-072e-47de-a142-b03212d3c316-24268-000006bc142ec19b.png", "url" : "https://alpha-kimagureblog.xyz/character/fairy-archer/", "equipment" : ["physics5", "support5", "physics4"]}
		,{"name" : "古竜神妃ファブル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/1752921d-6076-4f6c-9e66-1552cfbcbc8c-8125-0000028829d360ff.png", "url" : "https://alpha-kimagureblog.xyz/character/fable/", "equipment" : ["heel5", "support5", "defense4"]}
		,{"name" : "サク", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/2bd2d638-0c35-44a1-a489-0c9a719b36b0-11171-0000035e59d0dc83.png", "url" : "https://alpha-kimagureblog.xyz/character/saku/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "戦慄のタツマキ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/08/ad3e38f4-fe60-4d78-b819-40bce86a88e2-21549-000005c4f2cbb141.png", "url" : "https://alpha-kimagureblog.xyz/character/tatsumaki/", "equipment" : ["magic5", "magic5", "magic4"]}
		,{"name" : "聖樹弓神アシュ・トト", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/26a2bc48e4a3cfd5e4df801dacbf5171.jpg", "url" : "https://alpha-kimagureblog.xyz/character/ash-toto/", "equipment" : ["support5", "support5", "heel4"]}
		,{"name" : "地動戦鬼ガーラン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/71a92385634f4c4ac49b3d8624331eae.png", "url" : "https://alpha-kimagureblog.xyz/character/garlan/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "システィーナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/12/3156da26-316e-4cf8-9734-7b69eed59278-23665-00001efd11cc741d.jpg", "url" : "https://alpha-kimagureblog.xyz/character/sistine/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "神滅兵器ヴァイド", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/8d12bc625496cddb85e1fb2ce303a85d.jpg", "url" : "https://alpha-kimagureblog.xyz/character/viid/", "equipment" : ["heel5", "magic5", "physics4"]}
		,{"name" : "貫いた理想サリサ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/0b7cfe58d73d562d6c6de8b6bf831586.jpg", "url" : "https://alpha-kimagureblog.xyz/character/salisa/", "equipment" : ["physics5", "heel5", "physics4"]}
		,{"name" : "フィーロ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/985afa239334b908860229c8b4662073.jpg", "url" : "https://alpha-kimagureblog.xyz/character/firo/", "equipment" : ["magic5", "physics5", "support4"]}
		,{"name" : "イーグル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/e647f63c6aeb7431e7a265fa9ea14f82.png", "url" : "https://alpha-kimagureblog.xyz/character/eagle/", "equipment" : ["defense5", "defense5", "physics4"]}
		,{"name" : "蔵馬", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/51d3c927a59bb712e7741d788d2d1d00.jpg", "url" : "https://alpha-kimagureblog.xyz/character/kurama/", "equipment" : ["magic5", "support5", "heel4"]}
		,{"name" : "双豪の義后カティロ</td>", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/00d3f3c9bc8cb9fdb36cde680743917e.jpg", "url" : "https://alpha-kimagureblog.xyz/character/catilou/", "equipment" : ["defense5", "physics5", "heel4"]}
		,{"name" : "ラム", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/09/0e1b05686cb182cb091fa563d3e9bedd.jpg", "url" : "https://alpha-kimagureblog.xyz/character/re0-ram/", "equipment" : ["magic5", "defense5", "support4"]}
		,{"name" : "精霊神妃ミュゼ</td>", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/8f92c0e8186ccd622d17a5bbc661c2f1.jpg", "url" : "https://alpha-kimagureblog.xyz/character/musee/", "equipment" : ["heel5", "magic5", "heel4"]}
		,{"name" : "ハルト", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2018/10/58dcef0052ec9396b4053fcd844f833e.jpg", "url" : "https://alpha-kimagureblog.xyz/character/hart/", "equipment" : ["magic5", "support5", "heel4"]}
	],
	"shine" : [
		{"name" : "リーゼ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/3b4e92ea7aff71006d262611568523fe.png", "url" : "https://alpha-kimagureblog.xyz/character/riese/", "equipment" : ["heel5", "magic5", "heel4"]}
		,{"name" : "ゼイオルグ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/9995ab1bdb7990807504d59a17e09b1a.png", "url" : "https://alpha-kimagureblog.xyz/character/zeiorg/", "equipment" : ["physics5", "physics5", "support4"]}
		,{"name" : "双聖騎神フィーナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/4d20e00bf72caa4a96347dd053541e80.png", "url" : "https://alpha-kimagureblog.xyz/character/feener/", "equipment" : ["magic5", "physics5", "support4"]}
		,{"name" : "神魔皇帝フリード", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/3d96d843186a7f30ff2b3b3d7457d5ee.png", "url" : "https://alpha-kimagureblog.xyz/character/fried/", "equipment" : ["physics5", "physics5", "support4"]}
		,{"name" : "ジンオウX・レイアス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/5876bb26061593dfcbda002b369e5c04.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%82%B8%E3%83%B3%E3%82%AA%E3%82%A6X%E3%83%BB%E3%83%AC%E3%82%A4%E3%82%A2%E3%82%B9%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["physics5", "defense5", "heel4"]}
		,{"name" : "レイアR・イリス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/4002bf4dc19c5a7b1f4ea40a36155fd5.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%83%AC%E3%82%A4%E3%82%A2R%E3%83%BB%E3%82%A4%E3%83%AA%E3%82%B9%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["defense5", "magic5", "heel4"]}
		,{"name" : "キリンR・リーゼ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/035e0088a408c8de4c8c0c5233391c1b.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E3%82%AD%E3%83%AA%E3%83%B3R%E3%83%BB%E3%83%AA%E3%83%BC%E3%82%BC%EF%BC%88%E8%A6%9A%E9%86%92%EF%BC%89", "equipment" : ["heel5", "magic5", "heel4"]}
		,{"name" : "シーリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/931cebf1828af3ce603749d84966ebaf.png", "url" : "https://alpha-kimagureblog.xyz/character/celia/", "equipment" : ["physics5", "defense5", "heel4"]}
		,{"name" : "霊視魔后ソニエ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/3fbd7759adbdd02aca4d529b3352917f.png", "url" : "https://alpha-kimagureblog.xyz/character/sonie/", "equipment" : ["support5", "support5", "magic4"]}
		,{"name" : "終視姫聖エンド", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/518956a5801dc5866f037f97cdbd1db4.png", "url" : "https://alpha-kimagureblog.xyz/character/end/", "equipment" : ["magic5", "magic5", "support4"]}
		,{"name" : "満艦飾 マコ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/65e599ae79ad57a122bd79cf4f2407ad.png", "url" : "https://alpha-kimagureblog.xyz/character/mako/", "equipment" : ["support5", "heel5", "physics4"]}
		,{"name" : "六魔使后ミクス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/a5957757bdd8a090aa4a95fef44bd1ec.png", "url" : "https://alpha-kimagureblog.xyz/character/mix/", "equipment" : ["magic5", "support5", "support4"]}
		,{"name" : "断無剣聖ノギア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/2f8c9c08efa495ddb21e68e2b1cac100.png", "url" : "https://alpha-kimagureblog.xyz/character/nogia/", "equipment" : ["physics5", "magic5", "magic4"]}
		,{"name" : "鳳神輝皇ダキ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/0544a7b9c8a23cd4f990af9d60bc763c.png", "url" : "https://alpha-kimagureblog.xyz/character/daki/", "equipment" : ["magic5", "heel5", "support4"]}
		,{"name" : "秘謀の調停者カテミラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/aa320ee740fd2217a88b72aeb79a49a3.png", "url" : "https://alpha-kimagureblog.xyz/character/catemila/", "equipment" : ["magic5", "defense5", "magic4"]}
		,{"name" : "煌忍烈機ジャック", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b27b8e43a7b587619705f3ccbb59fe06.png", "url" : "https://alpha-kimagureblog.xyz/character/jack/", "equipment" : ["physics5", "magic5", "magic4"]}
		,{"name" : "閃神槍覇レイオン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7841ccff9589b94403b90fad869ffd55.png", "url" : "https://alpha-kimagureblog.xyz/character/reion/", "equipment" : ["physics5", "support5", "physics4"]}
		,{"name" : "浄魔聖師バレンティア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/4571a1167ef02020a8581f4491077cdc.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E6%B5%84%E9%AD%94%E8%81%96%E5%B8%AB%E3%83%90%E3%83%AC%E3%83%B3%E3%83%86%E3%82%A3%E3%82%A2", "equipment" : ["heel5", "magic5", "support4"]}
		,{"name" : "アシリパ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/34778c77d376ac3da5fef3d6efcdfce2.png", "url" : "https://alpha-kimagureblog.xyz/character/asilipa/", "equipment" : ["support5", "physics5", "defense5"]}
		,{"name" : "暁天剣神エタニア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/09bc5607240f5fc98b5469101674839b.png", "url" : "https://alpha-kimagureblog.xyz/character/ethania/", "equipment" : ["physics5", "physics5", "magic4"]}
		,{"name" : "神煌聖騎プラチナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/df37c463a80156d849c7952fd4a9943c.png", "url" : "https://alpha-kimagureblog.xyz/character/platinum/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "夢幻魔后シャシャ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b731e962b0662eb60214266ea345e849.png", "url" : "https://alpha-kimagureblog.xyz/character/shasha/", "equipment" : ["support5", "heel5", "magic4"]}
		,{"name" : "神眼聖姫クーシー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/4fca740c4d0bc06bbb897ef3c928ebf4.png", "url" : "https://alpha-kimagureblog.xyz/character/cousy/", "equipment" : ["magic5", "heel5", "defense4"]}
		,{"name" : "聖護神威イオ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7733a998595959b7c3a7879154d24f53.png", "url" : "https://alpha-kimagureblog.xyz/character/io/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "神竜聖匠ロディア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d2bd77ae-a5f8-46a1-8ee0-0901057a8544-9059-00000252751d643c.png", "url" : "https://alpha-kimagureblog.xyz/character/rhodia/", "equipment" : ["physics5", "physics5", "heel4"]}
		,{"name" : "女神官", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/34ab4957-d968-4591-8e82-2b509ba338d3-24268-000006bc241541c8.png", "url" : "https://alpha-kimagureblog.xyz/character/female-priest/", "equipment" : ["heel5", "support5", "support4"]}
		,{"name" : "光竜騎神メリッサ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/682ec39e-cb63-4cd2-b260-f30d1a126d23-24268-000006bc26daa3d1.png", "url" : "https://alpha-kimagureblog.xyz/character/melissa/", "equipment" : ["physics5", "physics5", "heel4"]}
		,{"name" : "レオーネ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/06/f74dff9a-005c-4186-a0f2-9fdb6e065472-9287-00000235179f84de.png", "url" : "https://alpha-kimagureblog.xyz/character/leone/", "equipment" : ["support5", "support5", "defense4"]}
		,{"name" : "サイタマ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/08/77f1d07d-6358-40c3-a6aa-0d464a34bbc1-21549-000005c4ef669406.png", "url" : "https://alpha-kimagureblog.xyz/character/saitama/", "equipment" : ["physics5", "defense5", "defense5"]}
		,{"name" : "誅神超騎ゼクシア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/08/5cdff596-4687-4b40-b3ba-7b3b21bbac2e-1137-000000453fa1059e.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E8%AA%85%E7%A5%9E%E8%B6%85%E9%A8%8E%E3%82%BC%E3%82%AF%E3%82%B7%E3%82%A2", "equipment" : ["magic5", "heel5", "physics4"]}
		,{"name" : "アマネ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/09/5ad370b9-f23e-462c-b4a7-af7ceb4a8f62-11716-000003607db6a52c.png", "url" : "https://alpha-kimagureblog.xyz/character/amane/", "equipment" : ["physics5", "defense5", "heel4"]}
		,{"name" : "シキ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/09/b7a92750-fa31-4b3f-ac22-433a28993251-3515-000000b09f7c985d.png", "url" : "https://alpha-kimagureblog.xyz/character/shiki/", "equipment" : ["magic5", "heel5", "physics4"]}
		,{"name" : "燦煌射才アルズ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/657c1ce6ca4ed3bbe4672dbee37c6029.png", "url" : "https://alpha-kimagureblog.xyz/character/arz/", "equipment" : ["physics5", "physics5", "support4"]}
		,{"name" : "神剣舞后メルティ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b5a37367ceaad4d66f158e57beefe03a.jpg", "url" : "https://alpha-kimagureblog.xyz/character/melty/", "equipment" : ["physics5", "heel5", "support4"]}
		,{"name" : "マールゼクス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/11/5012d226-0d8d-46a1-9a67-caa89a0d7c46-81971-000014316f968393.jpg", "url" : "https://alpha-kimagureblog.xyz/character/shine-marxex/", "equipment" : ["physics5", "defense5", "heel5"]}
		,{"name" : "リザ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/12/38824c6f-47ed-41f4-94e7-80486c10fbc4-20278-0000059f84467332.jpg", "url" : "https://alpha-kimagureblog.xyz/character/liza/", "equipment" : ["support5", "magic5", "heel4"]}
		,{"name" : "蒼輝の獣神エルファラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/01a63092bcffd5dc36dad0124a45744d.jpg", "url" : "https://alpha-kimagureblog.xyz/character/elfara/", "equipment" : ["defense5", "defense5", "physics4"]}
		,{"name" : "オーヴェル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/02/e8930ff0235c92e64367e741edc48903.jpg", "url" : "https://alpha-kimagureblog.xyz/character/auvel/", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "ラフタリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/f599f8b257e4c53aa569331c2efacd78.jpg", "url" : "https://alpha-kimagureblog.xyz/character/raphtalia/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "岩谷尚文", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/bce58af8957110b12379f39cb147893f.jpg", "url" : "https://alpha-kimagureblog.xyz/character/naofumi/", "equipment" : ["defense5", "heel5", "support4"]}
		,{"name" : "桑原和真", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/062e7f5fd98c40954905b2282e88b959.jpg", "url" : "https://alpha-kimagureblog.xyz/character/kuwabara-kazuma/", "equipment" : ["magic5", "physics5", "physics4"]}
		,{"name" : "ヴィクトワール", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/b668f1231f7188b695264171df104ff1.jpg", "url" : "https://alpha-kimagureblog.xyz/character/victoire/", "equipment" : ["magic5", "magic5", "heel4"]}
		,{"name" : "ジュノー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/48cd2aaf3e07bb2d6d81ac61408a3eed.jpg", "url" : "https://alpha-kimagureblog.xyz/character/juneau/", "equipment" : ["magic5", "support5", "support4"]}
		,{"name" : "聖盾神騎デュラン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/db46b5552f6df5296b8ef0b24ec92160.jpg", "url" : "https://alpha-kimagureblog.xyz/character/duran/", "equipment" : ["defense5", "defense5", "physics4"]}
		,{"name" : "ノエル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7599deb1b6ade0a96b7fb172d8c1a87f.jpg", "url" : "https://alpha-kimagureblog.xyz/character/noel/", "equipment" : ["physics5", "physics5", "support4"]}
		,{"name" : "ミリム(和装ver)", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2021/01/a97661c9fe4e2b82c9a460b597cc807c.jpg", "url" : "https://alpha-kimagureblog.xyz/character/", "equipment" : ["physics5", "magic5", "support4"]}
	],
	"dark" : [
		{"name" : "冥黒騎皇レグルス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/da009804207b9592ae996baf2caf11ed.png", "url" : "https://alpha-kimagureblog.xyz/character/regulus/", "equipment" : ["physics5", "magic5", "heel4"]}
		,{"name" : "ラグシェルム", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/88f9b1e26b320c0aa0df6614f1acb819.png", "url" : "https://alpha-kimagureblog.xyz/character/ragsherum/", "equipment" : ["physics5", "magic5", "support5"]}
		,{"name" : "メリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/82728f7c767d69b8883ee0bac582a430.png", "url" : "https://alpha-kimagureblog.xyz/character/melia/", "equipment" : ["magic5", "magic5", "support4"]}
		,{"name" : "狂戮魔皇グロール", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/6b77df67b740ed0ec53e81dc24ecc1c7.png", "url" : "https://alpha-kimagureblog.xyz/character/growl/", "equipment" : ["magic5", "support5", "magic4"]}
		,{"name" : "魔神術卿オンファン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/56dc1cd69ca9346aa8e0d7b0340b6af9.png", "url" : "https://alpha-kimagureblog.xyz/character/onfan/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "No.2", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/No2.png", "url" : "https://alpha-kimagureblog.xyz/character/no2/", "equipment" : ["magic5", "heel5", "support4"]}
		,{"name" : "レム", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/45544f7bdd0256b18abee47529ccd26e.png", "url" : "https://alpha-kimagureblog.xyz/character/rem/", "equipment" : ["magic5", "support5", "defense4"]}
		,{"name" : "魔神臣姫ココ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/bf309eabfaec1da21ab6816646d51469.png", "url" : "https://alpha-kimagureblog.xyz/character/coco/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "神出砲姫コートニー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/ab5fade7db45e2c87e0e2b38d9e2e2e6.png", "url" : "https://alpha-kimagureblog.xyz/character/courtney/", "equipment" : ["support5", "magic5", "support4"]}
		,{"name" : "武神竜帥ロスト", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/af2eab02046bded3a294d95053b6dfaf.png", "url" : "https://alpha-kimagureblog.xyz/character/lost/", "equipment" : ["physics5", "defense5", "magic4"]}
		,{"name" : "冥葬鎌妃神リリー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/d50b14be169c760f139b11ef1f190c2a.png", "url" : "https://alpha-kimagureblog.xyz/character/lily/", "equipment" : ["magic5", "magic5", "heel4"]}
		,{"name" : "魔翼剣豪ラキ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/8ff5be9a270aaf73fb11f83221f7c666.png", "url" : "https://alpha-kimagureblog.xyz/character/raki/", "equipment" : ["physics5", "magic5", "support4"]}
		,{"name" : "禁破狂獣ゼルカラ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/1ff065f370605d27bea801a77f4228c5.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E7%A6%81%E7%A0%B4%E7%8B%82%E7%8D%A3%E3%82%BC%E3%83%AB%E3%82%AB%E3%83%A9", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "土方歳三", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/0fe7783ef5c7a110d2d0b3b57e68653f.png", "url" : "https://alpha-kimagureblog.xyz/character/hijikata/", "equipment" : ["physics5", "physics5", "support4"]}
		,{"name" : "魔剣英雄ゼイオルグ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/045bdf9a26bc4bba48aff81b8e52b3fe.png", "url" : "https://alpha-kimagureblog.xyz/character/dark-zeorg/", "equipment" : ["physics5", "magic5", "physics4"]}
		,{"name" : "創造邪精ストラフ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/c580c640145e8ebcb6d2cf7185c1df0b.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E5%89%B5%E9%80%A0%E9%82%AA%E7%B2%BE%E3%82%B9%E3%83%88%E3%83%A9%E3%83%95", "equipment" : ["magic5", "magic5", "magic4"]}
		,{"name" : "アッシュ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/900e6598f3328b976cefe0b837123273.png", "url" : "https://alpha-kimagureblog.xyz/character/ash/", "equipment" : ["physics5", "magic5", "magic4"]}
		,{"name" : "操死魔后アルティ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/92196624ca604ee136a83524ad2c4fff.png", "url" : "https://games.gaym.jp/iPhone/grandsummoners/wiki/?%E6%93%8D%E6%AD%BB%E9%AD%94%E5%90%8E%E3%82%A2%E3%83%AB%E3%83%86%E3%82%A3", "equipment" : ["magic5", "magic5", "physics4"]}
		,{"name" : "壊魂滅神ゼノン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/29fc41176b51a164982e83721300a794.png", "url" : "https://alpha-kimagureblog.xyz/character/how-to-use-xenon/", "equipment" : ["magic5", "physics5", "support4"]}
		,{"name" : "闇竜騎神ワーグル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/ea62c0b35885632593acb24fbf24a759.png", "url" : "https://alpha-kimagureblog.xyz/character/wagle/", "equipment" : ["magic5", "physics5", "magic4"]}
		,{"name" : "英将魔神レボル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/5d82a18348891ad95d67f6c206d1418a.png", "url" : "https://alpha-kimagureblog.xyz/character/revol/", "equipment" : ["physics5", "magic5", "physics4"]}
		,{"name" : "双銃冥皇ゼクト", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/dd6919b6f561140e2aa2824d946e83de.png", "url" : "https://alpha-kimagureblog.xyz/character/zect/", "equipment" : ["magic5", "magic5", "defense4"]}
		,{"name" : "縛封恐羅リゴール", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/6f12a332e4be8dec47026cf5959a77b9.png", "url" : "https://alpha-kimagureblog.xyz/character/rigor/", "equipment" : ["magic5", "heel5", "magic4"]}
		,{"name" : "漆黒銃皇フェン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/631a0efb292190327c66c96b2e6998cf.png", "url" : "https://alpha-kimagureblog.xyz/character/dark-fen/", "equipment" : ["magic5", "support5", "magic4"]}
		,{"name" : "漆黒剣皇ケイン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/7321f392-7650-4f12-894b-a85c580afa31-9059-000002527ef3faa2.png", "url" : "https://alpha-kimagureblog.xyz/character/dark-cain/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "ゴブリンスレイヤー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/91d62f49-145d-4105-986c-0061f410b3c7-24268-000006bc3b1f557f.png", "url" : "https://alpha-kimagureblog.xyz/character/goblin-slayer/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "冥宵竜神バロッサ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/88b6f8a1-3f31-4120-bc1a-771f294c3218-24268-000006bc3e2ca00b.png", "url" : "https://alpha-kimagureblog.xyz/character/barossa/", "equipment" : ["physics5", "defense5", "magic4"]}
		,{"name" : "冥鎌貴神シビル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/05/075760b9-52b6-4124-bae1-e596fab3bc8a-2347-0000007b911c7f2b.png", "url" : "https://alpha-kimagureblog.xyz/character/sibir/", "equipment" : ["magic5", "physics5", "magic4"]}
		,{"name" : "騎砲黒神ダリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/06/f676c287-818f-4cf6-9c39-09af18641360-9287-00000235230e9d8c.png", "url" : "https://alpha-kimagureblog.xyz/character/dahlia/", "equipment" : ["magic5", "magic5", "heel4"]}
		,{"name" : "デューク", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/06/b48894e6-c297-4d7d-8568-837ee6bf974b-14746-0000051387efc1c0.png", "url" : "https://alpha-kimagureblog.xyz/character/duke/", "equipment" : ["physics5", "physics5", "defense4"]}
		,{"name" : "ギンゾウ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/566af93b-6bba-45dd-8c37-19de498dd5f4-82062-0000148743d46134.png", "url" : "https://alpha-kimagureblog.xyz/character/ginzo/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "音速のソニック", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/d99818b3-ba1c-466c-84fe-4b631e36af2f-46628-00000bdb449f1692.png", "url" : "https://alpha-kimagureblog.xyz/character/sonic/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "ガロウ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/07/f248ca57-5ba8-4fd3-86b5-1a57a0fe93a8-46628-00000bdb47ccb395.png", "url" : "https://alpha-kimagureblog.xyz/character/gallow/", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "転魔狂神カイアス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/08/3eb74c07-af90-4b91-9689-22c8528a5abb-1137-000000455139387e.png", "url" : "https://alpha-kimagureblog.xyz/character/chias/", "equipment" : ["magic5", "support5", "heel4"]}
		,{"name" : "神魔統帥シーリア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/09/331f0234-afb3-4e65-895b-a60a2f61e5a9-11716-0000036083ba2e4b.png", "url" : "https://alpha-kimagureblog.xyz/character/dark-celia/", "equipment" : ["physics5", "magic5", "magic5"]}
		,{"name" : "シュリ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/09/f610787d-4d3c-4289-8481-932eea558592-11716-0000036086e51bef.png", "url" : "https://alpha-kimagureblog.xyz/character/shri/", "equipment" : ["physics5", "magic5", "physics4"]}
		,{"name" : "神滅の狂騎神アバドン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/df379a300c93eba7ecb0847a147c10f8.png", "url" : "https://alpha-kimagureblog.xyz/character/abadon/", "equipment" : ["magic5", "magic5", "defense4"]}
		,{"name" : "絶天神マールゼクス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/11/9f2dfb43-b8f1-4802-8018-bf7755acaf2a-81971-0000143175ded9f4.jpg", "url" : "https://alpha-kimagureblog.xyz/character/dark-marxex/", "equipment" : ["magic5", "magic5", "support5"]}
		,{"name" : "シグニット", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/12/4ef81ab1-f6d9-487d-8190-0729e27f722b-26334-0000071ef87bfded.jpg", "url" : "https://alpha-kimagureblog.xyz/character/sigknit/", "equipment" : ["physics5", "defense5", "physics4"]}
		,{"name" : "闇軍統妃フォルテ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/01/4437b7e6-d0fc-4963-8d2f-e883cf1afa5e-8678-00001b8d461a54b7.jpg", "url" : "https://alpha-kimagureblog.xyz/character/forte/", "equipment" : ["physics5", "support5", "magic4"]}
		,{"name" : "冥翼魔后リフィリー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/01/56a11097-c8b4-4b3c-8e9c-3dc404c18843-43422-000025036236b90f.jpg", "url" : "https://alpha-kimagureblog.xyz/character/refilly/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "アルカナ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/01/8dcab028be60eb64d7ba0e31496f4671.jpg", "url" : "https://alpha-kimagureblog.xyz/character/arcana/", "equipment" : ["magic5", "support5", "heel4"]}
		,{"name" : "グラード", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/1807b03a523fd3a7393b72ef6aa9a93b.jpg", "url" : "https://grandsummoners.gorillawiki.jp/entry/2970", "equipment" : ["physics5", "magic5", "magic4"]}
		,{"name" : "バクー", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/381617be41d5f3b99363e8c8edef0986.jpg", "url" : "https://alpha-kimagureblog.xyz/character/baku/", "equipment" : ["magic5", "heel5", "support4"]}
		,{"name" : "飛影", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/0de7f0d9d9e556b0d532ebe6ea17606d.jpg", "url" : "https://alpha-kimagureblog.xyz/character/hiei/", "equipment" : ["physics5", "magic5", "magic4"]}
		,{"name" : "戸愚呂(弟)", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/a02896448d024d46812c5d647d54d59a.jpg", "url" : "https://alpha-kimagureblog.xyz/character/toguro-brother/", "equipment" : ["physics5", "physics5", "physics4"]}
		,{"name" : "殲滅の怨魔神リオン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/f781c60f1578e6b3a480a53f2d1ceb75.jpg", "url" : "https://alpha-kimagureblog.xyz/character/lion/", "equipment" : ["support5", "magic5", "support4"]}
		,{"name" : "ルアン", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/06/6265bb544f6d83fa0875b2bc730a42e0.jpg", "url" : "https://alpha-kimagureblog.xyz/character/luang/", "equipment" : ["physics5", "magic5", "magic4"]}
		,{"name" : "クロエ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/06/67182873861edb8faf1880f7355203ac.jpg", "url" : "https://alpha-kimagureblog.xyz/character/chloe/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "闘神竜将ゾロアス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/09/BEC9E00D-4835-40AF-AD93-6E9F4B510083.jpeg", "url" : "https://alpha-kimagureblog.xyz/character/zoroas/", "equipment" : ["physics5", "support5", "magic4"]}
		,{"name" : "創成の申し子アルル", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/09/70F1EDAB-1D7F-42C9-B57E-F9BBAC9151EA.jpeg", "url" : "https://alpha-kimagureblog.xyz/character/arles/", "equipment" : ["magic5", "support5", "heel4"]}
		,{"name" : "ベアトリス", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/09/b559fb667e925e7b7f80f74f5bde7623.jpg", "url" : "https://alpha-kimagureblog.xyz/character/re0-beatrice/", "equipment" : ["support5", "magic5", "heel4"]}
		,{"name" : "黒猫探偵リーゼ", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/04/4958ca23746fe99fdd227e708417e156.jpg", "url" : "https://alpha-kimagureblog.xyz/character/dark-liese/", "equipment" : ["physics5", "support5", "magic4"]}
		,{"name" : "ニーア", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2020/03/109c9fa7712b63f2013d5ef690359b83.jpg", "url" : "https://grandsummoners.gorillawiki.jp/entry/3004", "equipment" : ["physics5", "magic5", "heel4"]}
		,{"name" : "シオン(サンタver)", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2019/01/2020y12m15d_1949595171.jpg", "url" : "https://alpha-kimagureblog.xyz/character/sion-santa/", "equipment" : ["physics5", "defense5", "support4"]}
		,{"name" : "リムル(和装ver)", "img" : "https://alpha-kimagureblog.xyz/wp-content/uploads/2021/01/8342cc214b77e111765ce16bb352c195.jpg", "url" : "https://alpha-kimagureblog.xyz/character/", "equipment" : ["physics5", "support5", "physics4"]}
	]
};
