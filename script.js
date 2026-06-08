//your JS code here. If required.
const input = document.getElementById("typeahead");
const suggestionsList = document.getElementById("suggestions-list");

let timer;

input.addEventListener("input", () => {
  clearTimeout(timer);

  const text = input.value.trim();

  // If input is empty, clear suggestions and don't make API call
  if (text === "") {
    suggestionsList.innerHTML = "";
    return;
  }

  timer = setTimeout(async () => {
    try {
      const response = await fetch(
        `https://api.frontendexpert.io/api/fe/glossary-suggestions?text=${encodeURIComponent(text)}`
      );

      const suggestions = await response.json();

      // Clear previous suggestions
      suggestionsList.innerHTML = "";

      suggestions.forEach((suggestion) => {
        const li = document.createElement("li");
        li.textContent = suggestion;

        li.addEventListener("click", () => {
          input.value = suggestion;
          suggestionsList.innerHTML = "";
        });

        suggestionsList.appendChild(li);
      });
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, 500);
});
