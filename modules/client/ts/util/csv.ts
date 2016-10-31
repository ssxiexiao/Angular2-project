export function CSV(_: string) : any[] {
	let data: string[] = _.split('\n');
	let header: string[] = data.shift().split(',');
	let result: any[] = [];
	data.forEach((_) => {
		if (!_.length) return;
		let d = _.split(',');
		let obj = {};
		d.forEach((_, i) => {
			obj[header[i]] = _;
		});
		result.push(obj);
	});
	return result;
}