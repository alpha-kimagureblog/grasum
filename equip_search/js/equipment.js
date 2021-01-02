import unit_list from "./unitList"

function unitList() {
	console.log(unit_list);
	var unitList1 = "<tr>"
	+ "<td>ユニット名</td>"
	+ "<td>装備枠1</td>"
	+ "<td>装備枠2</td>"
	+ "<td>装備枠3</td>"
	+ "</tr>";
	document.getElementById("unit").innerHTML = unitList1;
}
