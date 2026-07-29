function scaleVec(a, s) {
	return [a[0] * s, a[1] * s]
}

function subVec(a, b) {
	return [a[0] - b[0], a[1] - b[1]]
}

function addVec(a, b) {
	return [a[0] + b[0], a[1] + b[1]]
}

function getMousePosition(e, svg) {
	const CTM = svg.getScreenCTM();
  	if (e.touches) { e = e.touches[0]; }
  	return [
    	(e.clientX - CTM.e) / CTM.a,
    	(e.clientY - CTM.f) / CTM.d
	];
}


let displayelement = document.getElementById("switchboard");
displayelement.drag = false
for (let i = 0; i < displayelement.childNodes.length; i++) {
	const celement = displayelement.childNodes[i];
	if (celement?.nodeName !== "g") continue;
	const gelement = celement;
	
	const transforms = gelement.transform.baseVal;
	// Ensure the first transform is a translate transform
	if (transforms.length === 0 ||
		transforms.getItem(0).type !== SVGTransform.SVG_TRANSFORM_TRANSLATE) {
		// Create an transform that translates by (0, 0)
		const translate = displayelement.createSVGTransform();
		translate.setTranslate(0, 0);
		// Add the translation to the front of the transforms list
		gelement.transform.baseVal.insertItemBefore(translate, 0);
	}
}

function getTransforms(element) {
	const transforms = element.transform.baseVal;
	const transform = transforms.getItem(0);
	return [transform.matrix.e, transform.matrix.f];
}

displayelement.addEventListener("mousedown", (e) => {
	if (e.button !== 0) return;
	if (e.target !== displayelement) return;
	displayelement.drag = true
	displayelement.reference = getMousePosition(e, displayelement);
	displayelement.bases = {}
	for (let i = 0; i < displayelement.childNodes.length; i++) {
		const celement = displayelement.childNodes[i];
		if (celement?.nodeName !== "g") continue;
		
		displayelement.bases[gelement.id] = getTransforms(celement)
	}

	displayelement.bases[displayelement.id] = [...displayelement.style.backgroundPosition.matchAll(/(-?[0-9]+)px/gm).map(e => {return Number(e[1])})]
	
	if (displayelement.bases[displayelement.id].length === 0) {
		displayelement.bases[displayelement.id].push(0)
		displayelement.bases[displayelement.id].push(0)
	}
})
displayelement.addEventListener("mouseup", (e) => {
	if (e.button !== 0) return
	displayelement.drag = false

})
displayelement.addEventListener("mousemove", (e) => {
	if (!displayelement.drag) return
	const delta = subVec(
		getMousePosition(e, displayelement),
		displayelement.reference
	);
	for (let i = 0; i < displayelement.childNodes.length; i++) {
		const celement = displayelement.childNodes[i];
		if (celement?.nodeName !== "g") continue;
		const gelement = celement;
		
		const transforms = gelement.transform.baseVal;
		const transform = transforms.getItem(0);
		
		const newpos = addVec(
			displayelement.bases[gelement.id],
			delta
		);

		transform.setTranslate(...newpos);
	}

	const newbg = addVec(displayelement.bases[displayelement.id], delta);

	displayelement.style.backgroundPositionX = `${newbg[0]}px`
	displayelement.style.backgroundPositionY = `${newbg[1]}px`
	const html = document.getElementsByTagName("html")[0];
	const body = document.getElementsByTagName("body")[0];
	const newbgbg = scaleVec(newbg, 0.3);
	const newbgbgbg = scaleVec(newbg, 0.1);
	html.style.backgroundPositionX = `${newbgbgbg[0]}px`
	html.style.backgroundPositionY = `${newbgbgbg[1]}px`
	body.style.backgroundPositionX = `${newbgbg[0]}px`
	body.style.backgroundPositionY = `${newbgbg[1]}px`
})

let map = {}

function rendergroup(id, innerhtml, size) {
	const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.id = id
	group.innerHTML = `<rect
			style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
			width="${size[0]}"
			height="${size[1]}"/>
		<rect
			style="fill:#bdbdbd;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
			width="${size[0]}"
			height="30"/>`
	group.innerHTML += innerhtml;
	return group;
}

class subnode {
	constructor(id, type) {
		this.id = id;
		this.type = type;
	}
	addlisteners() {}
}

let inconnector = null;
class innode extends basenode {
	constructor(id) {
		super(id, "innode")
	}
	addlisteners() {
		document.getElementById(id).addEventListener("mousedown", (e) => {
			e.stopPropagation();
			inconnector = id;

		})
	}
	connect() {

	}
}

let outconnector = null;
class outnode extends basenode {
	constructor(id) {
		super(id, "innode")
	}
	addlisteners() {
		document.getElementById(id).addEventListener("mousedown", (e) => {
			e.stopPropagation();
			if (outconnector !== null) {
				outconnector = null;
				return;
			}
			outconnector = id;
			if (inconnector !== null) {
				connect
			}
		})
	}
	connect() {

	}
}

class basenode {
	constructor(name) {
		this.name = name;
		this.element = null;
		this.drag = false;
	}
	save() {}
	subnodes() {}
	render() {}
	addlisteners() {
		this.element.addEventListener("mousedown", (e) => {
			this.drag = true;
			this.reference = getMousePosition(e, displayelement);
			this.base = getTransforms(this.element);
		})
		this.element.addEventListener("mousemove", (e) => {
			if (!this.element.drag) return
			const delta = 
			gelement.transform.baseVal.getItem(0).setTranslate(...addVec(subVec(
				getMousePosition(e, displayelement),
				this.element.reference
			), this.base))
		})

		for (const snode of Object.entries(this.subnodes())) {
			snode.addlisteners()
		}
	}
}

class startnode extends basenode {
	constructor(name, entry) {
		super(name);
		this.entry = entry;
	}

	render() {
		this.innode = new innode(`in${this.name}-0`);
		this.outnode = new this.outnode(`out${this.name}-0`)
		let g = rendergroup(this.name, `
			<text
				xml:space="preserve">
				ENTRY
			</text>
			<ellipse
				style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
				cx="420"
				cy="135"
				rx="30"
				ry="30"
				id="out${this.name}-0"/>
			<ellipse
				style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
				cx="60"
				cy="135"
				rx="30"
				ry="30"
				id="in${this.name}-0" />
			<text x="100" y="120">
				${this.entry.toUpperCase()}
			</text>
		`, [480, 240])
		document.getElementById("sccontent").appendChild(g);
		this.element = g;
	}

	on_outnode_connect(_, innode) {
		this.outbounds[0] = innode;
	}

	save() {
		return {
			type: "startnode",
			entry: this.entry,
			outbounds: {[this.outnode.id]: this.outnode.pointer},
			connections: {[this.outnode.id]: this.outnode.pairnode}
		}
	}

	subnodes() {
		return [this.innode, this.outnode]
	}
}

class endnode extends basenode {
	constructor(name, endpoint) {
		super(name);
		this.endpoint = endpoint
	}

	save() {
		return {
			type: "endnode",
			endpoint: this.endpoint
		}
	}

	render() {
		let g = rendergroup(this.name, `
			<text
				xml:space="preserve">
				EXIT
			</text>
			<ellipse
				style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
				cx="60"
				cy="135"
				rx="30"
				ry="30"
				id="in${this.name}-0"
				class="innode"/>
			<text x="100" y="120">
				${this.endpoint}
			</text>
		`, [240, 240])

		document.getElementById("sccontent").appendChild(g);

		this.element = g;
	}

	subnodes() {
		return {
			[`out${this.name}-0`]: "outnode"
		};
	}
}