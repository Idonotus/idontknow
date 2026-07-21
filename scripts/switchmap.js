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
displayelement.addEventListener("mousedown", (e) => {
	if (e.button !== 0) return
	displayelement.drag = true
	displayelement.reference = getMousePosition(e, displayelement);
	displayelement.bases = {}
	for (let i = 0; i < displayelement.childNodes.length; i++) {
		const celement = displayelement.childNodes[i];
		if (celement?.nodeName !== "g") continue;
		const gelement = celement;
		
		const transforms = gelement.transform.baseVal;
		const transform = transforms.getItem(0);
		displayelement.bases[gelement.id] = [transform.matrix.e, transform.matrix.f];
		displayelement.bases[displayelement.id] = [...displayelement.style.backgroundPosition.matchAll(/(-?[0-9]+)px/gm).map(e => {return Number(e[1])})]
		
		if (displayelement.bases[displayelement.id].length === 0) {
			displayelement.bases[displayelement.id].push(0)
			displayelement.bases[displayelement.id].push(0)
		}
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

function rendergroup(id, innerhtml) {
	const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
	group.id = id
	group.innerHTML = innerhtml;
	return group;
}

function initnodeEvents(node) {
	// Dragging
	node.addEventListener()

	// Connectors

	// Delete
	
}

function renderStartNode(name) {
	let g = rendergroup(name, `
		<rect
			style="fill:#ffffff;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
			width="480"
			height="240"/>
		<rect
			style="fill:#bdbdbd;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
			width="480"
			height="30"/>
		<text
			xml:space="preserve"
			style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:condensed;font-size:26.6667px;font-family:Impact;-inkscape-font-specification:'Impact Condensed';text-align:center;writing-mode:lr-tb;direction:ltr;white-space:pre;shape-inside:url(#rect3);fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"><tspan>ENTRY</tspan>
		</text>
		<rect
			style="fill:#ff0000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
			width="25"
			height="25"
			x="452.5"
			y="2.5" />
		<ellipse
			style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
			cx="420"
			cy="135"
			rx="30"
			ry="30"
			id="out${name}"/>
		<ellipse
			style="fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"
			cx="60"
			cy="135"
			rx="30"
			ry="30"
			id="in${name}" />
		<text
			xml:space="preserve"
			style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:condensed;font-size:26.6667px;font-family:Impact;-inkscape-font-specification:'Impact Condensed';text-align:center;writing-mode:lr-tb;direction:ltr;white-space:pre;fill:#000000;fill-opacity:1;stroke:#000000;stroke-width:0;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1;paint-order:markers fill stroke"><tspan x="50%" y="50%">HOME</tspan>
		</text>
	`)

	g.setAttributeNS("http://www.w3.org/2000/svg", "width", "480");
	g.setAttributeNS("http://www.w3.org/2000/svg", "height", "240");

	document.getElementById("sccontent").appendChild(g);
}

renderStartNode("george")