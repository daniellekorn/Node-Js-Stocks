async function callMyServer(query) {
	let response = await fetch(`http://localhost:3030/search/?query=${query}`);
	let data = await response.json();
	return data;
}

function createLoader() {
	const loader = document.createElement("div");
	loader.setAttribute("id", "loader");
	loader.classList.add("loader", "hide");
	const loaderBar = document.createElement("span");
	loaderBar.className = "loader-bar";
	const loaderBar2 = document.createElement("span");
	loaderBar2.className = "loader-bar";
	const loaderBar3 = document.createElement("span");
	loaderBar3.className = "loader-bar";
	loader.appendChild(loaderBar);
	loader.appendChild(loaderBar2);
	loader.appendChild(loaderBar3);
	return loader;
}

class Search {
	constructor(element, userInput) {
		this.element = element;
		this.userInput = userInput;

		const searchBarContainer = document.createElement("div");
		searchBarContainer.classList.add("form-container", "flexible");
		const formElement = document.createElement("form");
		formElement.setAttribute("id", "searchForm");
		formElement.autocomplete = "off";
		formElement.classList.add("flexible", "search-box");

		/*icon*/
		const iconContainer = document.createElement("div");
		const icon = `<i class="search-icon vertical-align fa fa-search fa-lg"></i>`;
		iconContainer.insertAdjacentHTML("afterbegin", icon);

		/*input area*/
		const autocompleteField = document.createElement("div");
		autocompleteField.className = "autocomplete";
		const inputBox = document.createElement("input");
		inputBox.setAttribute("id", "searchText");
		inputBox.type = "text";
		inputBox.classList.add("autocomplete", "search-text");
		inputBox.placeholder = "Search...";
		this.inputBox = inputBox;
		autocompleteField.appendChild(inputBox);

		/*form container*/
		formElement.appendChild(iconContainer);
		formElement.appendChild(autocompleteField);

		/*loader*/
		const loader = createLoader();

		/*search button*/
		const searchBtn = document.createElement("button");
		searchBtn.setAttribute("id", "searchButton");
		searchBtn.type = "submit";
		searchBtn.classList.add("search-button", "btn");
		searchBtn.textContent = "Search";
		autocompleteField.appendChild(searchBtn);

		/*append to parent*/
		searchBarContainer.appendChild(formElement);
		searchBarContainer.appendChild(loader);
		searchBarContainer.appendChild(searchBtn);
		element.insertAdjacentElement("afterbegin", searchBarContainer);
		const searchLoader = document.getElementById("loader");

		//Event listeners to run search
		//something about this isn't working (search button functionality)?
		// formElement.addEventListener("submit", event => {
		// 	event.preventDefault();
		// 	this.doSearch();
		// });

		let debounceTimeout;
		inputBox.addEventListener("keyup", event => {
			searchLoader.classList.remove("hide");
			event.preventDefault();
			if (debounceTimeout) {
				clearTimeout(debounceTimeout);
			}
			debounceTimeout = setTimeout(() => {
				callMyServer(this.inputBox.value).then(companies => {
					this.callback(companies);
				});
			}, 500);
			if (history.pushState) {
				let newurl =
					window.location.protocol +
					"//" +
					window.location.host +
					window.location.pathname +
					`?query=${searchText.value}`;
				window.history.pushState({ path: newurl }, "", newurl);
			}
		});

		formElement.addEventListener(
			"submit",
			function(e) {
				e.preventDefault();
			},
			false
		);
	}

	dataForResults(callback) {
		this.callback = callback;
	}
}
