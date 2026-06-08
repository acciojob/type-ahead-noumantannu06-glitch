const typeahead = document.getElementById("typeahead");
const suggestionsList = document.getElementById("suggestions-list");

let timerId = null;

// Render suggestions
function renderSuggestions(suggestions) {
  suggestionsList.innerHTML = "";

  suggestions.forEach((suggestion) => {
    const li = document.createElement("li");
    li.textContent = suggestion;

    li.addEventListener("click", () => {
      typeahead.value = suggestion;
      suggestionsList.innerHTML = "";
    });

    suggestionsList.appendChild(li);
  });
}

// Fetch suggestions
async function fetchSuggestions(text) {
  try {
    const response = await fetch(
      `https://api.frontendexpert.io/api/fe/glossary-suggestions?text=${encodeURIComponent(
        text
      )}`
    );

    const data = await response.json();

    renderSuggestions(data);
  } catch (err) {
    console.error(err);
  }
}

// Input handler
typeahead.addEventListener("input", () => {
  clearTimeout(timerId);

  if (typeahead.value === "") {
    suggestionsList.innerHTML = "";
    return;
  }

  timerId = setTimeout(() => {
    fetchSuggestions(typeahead.value);
  }, 500);
});