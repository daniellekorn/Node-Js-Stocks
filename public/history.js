const getSearchHistory = async () => {
  let response = await fetch(`http://localhost:5000/search-history`);
  let data = await response.json();
  return data;
};

const deleteItem = async (id) => {
  let response = await fetch(`http://localhost:5000/search-history/${id}`, {
    method: "DELETE",
  });
  let data = response.json();
  return data;
};

class ResultList {
  constructor(element) {
    this.element = element;
    this.ul = document.createElement("ul");
    this.ul.className = "list-group";
  }

  renderListItems = (data) => {
    data.map((entry) => {
      const list = document.createElement("li");
      list.className = "list-group-item";
      const title = document.createElement("h5");
      title.classList.add("d-inline", "font-weight-bold");
      const link = document.createElement("a");
      link.textContent = entry.date;
      link.href = `http://localhost:5000/search?query=${entry.query}`;
      title.appendChild(link);
      const deleteBtn = document.createElement("a");
      deleteBtn.classList.add("btn", "btn-danger", "d-inline", "float-right");
      deleteBtn.textContent = "Delete";
      deleteBtn.href = `http://localhost:5000/search-history`;
      deleteBtn.addEventListener("click", (event) => {
        event.preventDefault();
        deleteItem(entry._id);
        location.reload();
      });

      const queryValue = document.createElement("h5");
      queryValue.classList.add("text-success", "font-weight-bold");
      queryValue.textContent = `Query: ${entry.query}`;
      const container = document.createElement("div");
      container.className = "ml-10";

      list.appendChild(title);
      list.appendChild(deleteBtn);
      list.appendChild(queryValue);

      //   #MIGHT NEED TO MAKE EDITS HERE FOR NEW KEYS IN API
      if (entry.companies != null) {
            for (let i = 0; i < entry.companies.length; i++) {
                const company = entry.companies[i];
                if (company != null) {
                  if (!(company.status === 404)) {
                    const oneCompany = document.createElement("div");
                    oneCompany.classList.add("mb-1");
                    const name = document.createElement("div");
                    name.textContent = `${company.symbol} ${company.companyName}`;
                    name.className = "font-weight-bold";
                    const price = document.createElement("span");
                    price.className = "text-success";
                    price.textContent = ` ${company.price}`;
                    name.appendChild(price);
                    const description = document.createElement("div");
                    description.textContent = `${company.description}`;

                    oneCompany.appendChild(name);
                    oneCompany.appendChild(description);

                    container.appendChild(oneCompany);
                  }
                }
              }
        }
      list.appendChild(container);
      this.ul.appendChild(list);
      this.element.appendChild(this.ul);
    });
  };
}
