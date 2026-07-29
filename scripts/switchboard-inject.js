import {can_localStorage} from './utils.js'

document.addEventListener("load", loadswitchboard)

behaviormap = {
	"startnode": (_, d, o) => {replaceLinks(d.entry, o[0]); return o[0]},
	"endnode": (_, d, _) => {return () => d.endpoint},
	"loopendnode": (_, _, _) => {return () => "/switchboard/cycle"},
	"nullendnode": (_, _, _) => {return () => "/switchboard/dropped"},
}

expectedlength = {
	"startnode": 1,
	"endnode": 0,
	"loopendnode": 0,
	"nullendnode": 0,
}

function loadswitchboard() {
	if (!can_localStorage) {
		return;
	}

	let map = localStorage.getItem("switchboard");
	if (map === null) {
		return;
	}

	try {
		map = JSON.parse(map)
	} catch {
		localStorage.removeItem("switchboard");
		console.error(`switchboard - Map data is invalid: `, map)
		return;
	}
}

function interpretswitchboard(map) {
	let visitednodes = new Set();
	for (const n of Object.keys(map)) {
		if (n in visitednodes) continue;
		visit(map, visitednodes, n)
	}
}

function visit(map, visitednodes, n, path = []) {
	const data = map[n];
	if (path.length == 0 && data.entry == undefined) {
		return
	}
	path.push(n);
	visitednodes.add(n)
	const onodes = [];
	const routbounds = data.outbounds || [];
	for (let i=0; i<expectedlength[data.type]; i++) {
		const b = routbounds[i];
		if (b === undefined || b === null) {onodes.push(behaviormap["nullendnode"]());continue}
		if (path.includes(b)) {onodes.push(behaviormap["loopendnode"]());continue}
		visit(map, visitednodes, b, [...path, b])
	}

	return behaviormap[data.type](path, data, onodes)
}

function replaceLinks(entry, endpoint) {
	const d = document.querySelectorAll(`.switchnode.${entry}`);
	for (let i = 0; i < d.length; i++) {
		d[i].href = endpoint();
	}
}