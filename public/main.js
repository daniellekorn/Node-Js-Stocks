async function callMyServer(query) {
  const myAPI = `http://localhost:5000/search/?query=${query}?`;
  let response = await fetch(myAPI);
  let data = await response.json();
  window.location.href = myAPI;
  return data;
}

class SearchNasdaqAPI {
  constructor(element) {
    const formElement = document.createElement("form");
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.className = "form-control";
    const inputDiv = document.createElement("div");
    inputDiv.className = "input-group";
    inputDiv.appendChild(inputElement);
    const inputGroupDiv = document.createElement("div");
    inputGroupDiv.className = "input-group-prepend";
    const button = document.createElement("button");
    button.type = "submit";
    button.className = "btn btn-primary";
    button.innerHTML = "Search";
    button.setAttribute("id", "searchButton");
    const searchHistory = document.createElement("button");
    searchHistory.type = "submit";
    searchHistory.classList.add("btn", "btn-link");
    searchHistory.innerHTML = "Search History";
    inputGroupDiv.appendChild(button);
    inputDiv.appendChild(inputGroupDiv);
    formElement.appendChild(inputDiv);

    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
      callMyServer(inputElement.value);
    });

    searchHistory.addEventListener("click", (event) => {
      window.location.href = "http://localhost:5000/search-history.html";
    });

    element.appendChild(formElement);
    element.appendChild(searchHistory);
  }
}
