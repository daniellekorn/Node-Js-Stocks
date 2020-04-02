const getSearchHistory = async () => {
	let response = await fetch(`http://localhost:5000/search-history`);
	let data = await response.json();
	return data;
};

function resultList(element) {
	this.element = element;
	this.ul = document.createElement("ul");
	this.ul.className = "list-group";

	this.renderListItems = data => {
		const list = document.createElement("li");
		list.className = "list-group-item";
		const title = document.createElement("h5");
		title.classList.add("d-inline", "font-weight-bold");
		const link = document.createElement("a");
		link.href = `http://localhost:5000/search?query=${data.query}`;
		title.appendChild(link);
		const deleteBtn = document.createElement("a");
		deleteBtn.classList.add("btn", "btn-danger", "d-inline", "float-right");
		deleteBtn.href = `http://localhost:5000/search-history/${data._id}`;
		deleteBtn.textContent = "Delete";
		const queryValue = document.createElement("h5");
		queryValue.classList.add("text-success", "font-weight-bold");
		queryValue.textContent = `Query: ${data.query}`;
		const companies = document.createElement("div");
		companies.className = "ml-10";

		list.appendChild(title);
		list.appendChild(deleteBtn);
		list.appendChild(queryValue);
		list.appendChild(companies);

		console.log(data);

		data.map(company => {
			const oneCompany = document.createElement("div");
			oneCompany.classList.add("mb-1");
			const name = document.createElement("div");
			name.textContent = `${company.symbol} ${company.profile.companyName}`;
			name.className = "font-weight-bold";
			const price = document.createElement("span");
			price.className = "text-success";
			price.textContent = `${company.profile.price}`;
			name.appendChild(price);
			const description = document.createElement("div");
			description.textContent = `${company.profile.description}`;

			oneCompany.appendChild(name);
			oneCompany.appendChild(description);

			this.companies.appendChild(oneCompany);
		});

		this.ul.appendChild(list);
	};
}
