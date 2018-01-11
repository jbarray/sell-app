export function formatDate(date, fom) {
	// if (/(y+)/.test(fmt)) {
	// 	fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	// }
	// let o = {
	// 	'M+': date.getMonth() + 1,
	// 	'd+': date.getDate(),
	// 	'h+': date.getHours(),
	// 	'm+': date.getMinutes(),
	// 	's+': date.getSeconds()
	// };
	// for (let k in o) {
	// 	if (new RegExp(`(${k})`).test(fmt)) {
	// 		let str = o[k] + '';
	// 		fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
	// 	}
	// }
  let y = date.getFullYear();
  let M = date.getMonth();
  let d = date.getDay();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  let fom = y+'-'+M+'-'+d+' '+h+'-'+m+'-'+s;
  return fom;
}

function padLeftZero(str) {
	return ('00' + str).substr(str.length);
}
