class Marquee {
	constructor(parent, id) {
		this.parent = parent;
		this.id = id;
	}

	createMarquee() {
		const marqueeBody = document.createElement("div");
		marqueeBody.classList.add("marquee");
		marqueeBody.id = this.id;
		this.getData().then(items => {
			const allListings = items.map(item => {
				if (item.changes.toString().includes("-")) {
					return `<li class="marquee-list"><span>${item.indexName}</span> <span class="negative">$${item.price}</span></li>`;
				} else {
					return `<li class="marquee-list"><span>${item.indexName}</span> <span class="positive">$${item.price}</span></li>`;
				}
			});
			const ul = document.createElement("ul");
			ul.classList.add("marquee-content", "flexible");
			ul.insertAdjacentHTML("beforeend", allListings.join(""));
			marqueeBody.appendChild(ul);
			this.parent.insertAdjacentElement("afterbegin", marqueeBody);
		});
	}

	async getData() {
		let marqueeResponse = await fetch(
			"https://financialmodelingprep.com/api/v3/majors-indexes"
		);
		let marqueeData = await marqueeResponse.json();
		let stocks = marqueeData.majorIndexesList;
		return stocks;
	}
}
