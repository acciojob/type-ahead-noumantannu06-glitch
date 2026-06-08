const typeahead = document.getElementById("typeahead");
const suggestionsList = document.getElementById("suggestions-list");

let timeoutId;

// Display suggestions
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
async function getSuggestions(text) {
  try {
    const response = await fetch(
      `https://api.frontendexpert.io/api/fe/glossary-suggestions?text=${text}`
    );

    const data = await response.json();

    renderSuggestions(data);
  } catch (error) {
    console.error(error);
  }
}

// Input event
typeahead.addEventListener("input", () => {
  clearTimeout(timeoutId);

  const value = typeahead.value.trim();

  // Clear list and don't request API if empty
  if (value === "") {
    suggestionsList.innerHTML = "";
    return;
  }

  timeoutId = setTimeout(() => {
    getSuggestions(value);
  }, 500);
});