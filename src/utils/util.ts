function formatNumber(n: number): string {
	let str = n.toString();
	return str[1] ? str : '0' + str;
}

export function formatTime(date: Date): string {
	let year = date.getFullYear();
	let month = date.getMonth() + 1;
	let day = date.getDate();

	let hour = date.getHours();
	let minute = date.getMinutes();
	let second = date.getSeconds();

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}

export function groupBy(source: Array<any>, byKey: string): { [key: string]: any } {
	let ret: any = {};
	source.forEach(s => {
		let byVal = s[byKey];
		if (!ret[byVal]) {
			ret[byVal] = [];
		}
		ret[byVal].push(s);
	});
	return ret;
}

export function getParameterByName(name, url) {
	if (!url) {
		return '';
	}
	name = name.replace(/[\[\]]/g, "\\$&");
	name = name.toLowerCase();
	url = url.toLowerCase();
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}