class CompanyCompare {
	constructor(company, element) {
		this.company = company;
		this.element = element;
	}

	createCompareButton() {
		const compBtn = document.createElement("a");
		compBtn.textContent = "Search History";
		compBtn.classList.add("run-compare", "btn");
		compBtn.href = "http://localhost:5000/search-history";
		this.element.insertAdjacentElement("beforeend", compBtn);
		this.compBtn = compBtn;
		return compBtn;
	}

	clearPage() {
		const elements = compareBar.getElementsByClassName("deleteme");

		while (elements[0]) {
			elements[0].parentNode.removeChild(elements[0]);
		}
	}

	showError() {
		const error = document.createElement("div");
		error.textContent = "MAX 3";
		error.classList.add("warning", "deleteme");
		this.element.insertAdjacentElement("beforeend", error);
	}

	addButton() {
		const newBtn = document.createElement("button");
		newBtn.classList.add("company-compare-btn", "deleteme", "btn");
		newBtn.textContent = this.company.symbol;
		const quitBtn = document.createElement("button");
		quitBtn.classList.add("quit-btn", "btn");
		quitBtn.textContent = "X";
		newBtn.appendChild(quitBtn);
		this.element.insertAdjacentElement("afterbegin", newBtn);
		this.quitBtn = quitBtn;
		this.newBtn = newBtn;
		return this.quitBtn;
	}

	removeButton() {
		this.newBtn.remove();
	}
}

let displayError;
let symbolArray = [];
function accessCompare(company, compareBtn) {
	let counter = 0;
	compareBtn.addEventListener("click", () => {
		/*query selector to check for buttons*/
		let numOfButtons = document.querySelectorAll(".company-compare-btn").length;
		if (numOfButtons > 2) {
			if (compareBar.contains(displayError)) {
				console.log("Max 3");
			} else {
				companyCompareBtn.showError();
				displayError = document.querySelector(".warning");
			}
		} else {
			if (counter < 1) {
				counter += 1;
				symbolArray.push(company);
				const compBtn = new CompanyCompare(company, compareBar);
				const quitBtn = compBtn.addButton(company);
				quitBtn.addEventListener("click", () => {
					if (symbolArray.includes(company)) {
						let index = symbolArray.indexOf(company);
						symbolArray.splice(index, 1);
						console.log(symbolArray);
					}
					compBtn.removeButton();
					numOfButtons -= 1;
					counter = 0;
				});
			}
		}
	});
}
