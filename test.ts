
let obj = {
	_promiseFunc: async () => {
		return new Promise((resolve) => {
			setTimeout(() => resolve("Hello world!"), 1000);
		});
	}
}
async function test() {
	let ret = await obj._promiseFunc();
	console.log(ret);
}

test();