function highlight(profileName, symbol) {
	const name = document.createElement("span");
	name.classList.add("result-name");
	let text = searchText.value;
	text = text.toLowerCase();
	let nameIndex;
	let symbolIndex;
	if (profileName) {
		nameIndex = profileName.toLowerCase().indexOf(text);
	} else {
		nameIndex = -1;
	}
	if (symbol) {
		symbolIndex = symbol.toLowerCase().indexOf(text);
	} else {
		symbolIndex = -1;
	}
	if (nameIndex >= 0) {
		let highlightNeeded =
			profileName.substring(0, nameIndex) +
			"<span class='highlight'>" +
			profileName.substring(nameIndex, nameIndex + text.length) +
			"</span>" +
			profileName.substring(nameIndex + text.length);
		name.insertAdjacentHTML("afterbegin", highlightNeeded);
	} else {
		name.insertAdjacentHTML("afterbegin", profileName);
	}
	if (symbolIndex >= 0) {
		let highlightNeeded =
			symbol.substring(0, symbolIndex) +
			"<span class='highlight'>" +
			symbol.substring(symbolIndex, symbolIndex + text.length) +
			"</span>" +
			symbol.substring(symbolIndex + text.length);
		name.insertAdjacentHTML("beforeend", highlightNeeded);
	} else {
		name.insertAdjacentHTML("beforeend", ` (${symbol})`);
	}
	return name;
}

function getColor(isPositive, element) {
	return isPositive
		? element.classList.add("positive")
		: element.classList.add("negative");
}

class ResultsList {
	constructor(element) {
		this.element = element;
	}

	clearHistory() {
		let child = this.element.lastElementChild;
		while (child) {
			this.element.removeChild(child);
			child = this.element.lastElementChild;
		}
	}

	noMatches() {
		const error = document.createElement("div");
		error.insertAdjacentHTML(
			"afterbegin",
			`We did not find any results that match <strong>"${searchText.value}"</strong>`
		);
		error.classList.add("error-style");
		resultChart.append(error);
	}

	createListItems(companies) {
		companies.map(company => {
			//account for null values in API
			for (let item in company.profile) {
				if (company.profile[item] === null) {
					company.profile[item] = "";
				}
			}
			const symbol = company.symbol;
			const profile = company.profile;
			/*creation of elements w/style*/
			const contianer = document.createElement("div");
			contianer.classList.add("flexible", "result-container");
			const newResult = document.createElement("a");
			newResult.classList.add("result");
			const logo = document.createElement("img");
			logo.classList.add("uniform-size");
			logo.src = `${profile.image}`;
			const percentChange = document.createElement("span");
			getColor(
				profile.changesPercentage.toString().includes("+"),
				percentChange
			);
			percentChange.textContent = `${profile.changesPercentage}`;
			const lineBreak = document.createElement("hr");
			lineBreak.classList.add("line-break");
			const compare = document.createElement("div");

			const name = highlight(profile.companyName, symbol);

			/*append all elements to result div*/
			newResult.appendChild(logo);
			newResult.appendChild(name);
			newResult.appendChild(percentChange);
			newResult.href = `company.html?symbol=${symbol}`;
			compare.insertAdjacentHTML(
				"beforeend",
				'<button class="compare-btn btn">Compare</button>'
			);
			contianer.appendChild(newResult);
			contianer.appendChild(compare);
			/*append complete result to DOM*/
			this.element.appendChild(contianer);
			this.element.appendChild(lineBreak);

			/*compare button functionality*/
			accessCompare(company, compare);
		});
		// const searchLoader = document.getElementById("loader");
		// searchLoader.classList.add("hide");
	}
}
