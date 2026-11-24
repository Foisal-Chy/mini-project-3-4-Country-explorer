const API_URL =
  "https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,area,languages,currencies,cca3";
const USE_LOCAL_FALLBACK = true;
const STORAGE_KEY = "countryExplorerFavorites";

const grid = document.getElementById("grid");
const statusBox = document.getElementById("status");
const searchInput = document.getElementById("searchInput");
const regionSelect = document.getElementById("regionSelect");
const resultCount = document.getElementById("resultCount");
const favCount = document.getElementById("favCount");
const tabs = document.querySelectorAll(".tab");
const modal = document.getElementById("detailsModal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");

let countries = [];
let favorites = loadFavorites();
let currentView = "all";

function loadFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (err) {
    return [];
  }
}
function saveFavorites() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (err) {
    console.error("Could not save favorites:", err);
  }
}

function showStatus(type, message) {
  grid.innerHTML = "";
  resultCount.textContent = "";
  statusBox.className =
    "text-center py-10 " +
    (type === "error" ? "text-red-600" : "text-gray-600");
  if (type === "loading") {
    statusBox.innerHTML = `<div class="w-9 h-9 mx-auto mb-3 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div><p>${message}</p>`;
  } else if (type === "error") {
    statusBox.innerHTML = `<p>${message}</p><button id="retryBtn" class="mt-3 px-5 py-2 bg-indigo-600 text-white rounded cursor-pointer">Try again</button>`;
    document
      .getElementById("retryBtn")
      .addEventListener("click", fetchCountries);
  } else {
    statusBox.innerHTML = `<p>${message}</p>`;
  }
}
function hideStatus() {
  statusBox.className = "hidden";
  statusBox.innerHTML = "";
}

async function fetchCountries() {
  showStatus("loading", "Loading countries...");
  try {
    const response = await fetch(API_URL);
    if (!response.ok)
      throw new Error("Server responded with " + response.status);
    countries = await response.json();
  } catch (err) {
    console.error(err);
    if (USE_LOCAL_FALLBACK) {
      countries = LOCAL_COUNTRIES.slice();
    } else {
      showStatus(
        "error",
        "Could not load countries. Please check your internet connection and try again.",
      );
      return;
    }
  }
  countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
  render();
}

function getVisibleCountries() {
  const term = searchInput.value.trim().toLowerCase();
  const region = regionSelect.value;
  return countries
    .filter((c) => c.name.common.toLowerCase().includes(term))
    .filter((c) => region === "all" || c.region === region)
    .filter((c) => currentView === "all" || favorites.includes(c.cca3));
}

function render() {
  favCount.textContent = favorites.length;
  const list = getVisibleCountries();
  grid.innerHTML = "";

  if (list.length === 0) {
    const msg =
      currentView === "favorites" && favorites.length === 0
        ? "No favorites yet. Tap the heart on a country to save it."
        : "No countries found. Try a different name or region.";
    showStatus("empty", msg);
    return;
  }

  hideStatus();
  resultCount.textContent = `Showing ${list.length} ${list.length === 1 ? "country" : "countries"}`;
  list.forEach((country) => grid.appendChild(createCard(country)));
}

function useLocalFlag(img, code) {
  img.onerror = null;
  const local =
    typeof LOCAL_COUNTRIES !== "undefined" &&
    LOCAL_COUNTRIES.find((c) => c.cca3 === code);
  if (local) img.src = local.flags.svg;
}

function flagFix(c) {
  return `useLocalFlag(this,'${c.cca3}')`;
}

function flagOf(c) {
  return c.flags ? c.flags.svg || c.flags.png : "";
}

function createCard(c) {
  const isFav = favorites.includes(c.cca3);
  const card = document.createElement("article");
  card.className =
    "card relative bg-white rounded-md overflow-hidden shadow hover:shadow-lg cursor-pointer";
  card.dataset.code = c.cca3;
  card.innerHTML = `
    <img src="${flagOf(c)}" alt="Flag of ${c.name.common}" loading="lazy" onerror="${flagFix(c)}"
      class="w-full h-32 object-cover block border-b border-gray-200">
    <button class="fav-btn absolute top-2 right-2 w-9 h-9 rounded-full bg-white text-lg cursor-pointer ${isFav ? "text-red-600" : "text-gray-400"}"
      aria-label="${isFav ? "Remove from" : "Add to"} favorites">${isFav ? "♥" : "♡"}</button>
    <div class="p-3">
      <h3 class="text-lg font-bold mb-1.5">${c.name.common}</h3>
      <p class="text-sm text-gray-600"><strong>Capital:</strong> ${c.capital && c.capital.length ? c.capital[0] : "N/A"}</p>
      <p class="text-sm text-gray-600"><strong>Region:</strong> ${c.region || "N/A"}</p>
      <p class="text-sm text-gray-600"><strong>Population:</strong> ${(c.population || 0).toLocaleString()}</p>
    </div>`;
  return card;
}

function toggleFavorite(code) {
  if (favorites.includes(code)) {
    favorites = favorites.filter((f) => f !== code);
  } else {
    favorites.push(code);
  }
  saveFavorites();
  render();
}

function showDetails(code) {
  const c = countries.find((item) => item.cca3 === code);
  if (!c) return;
  const languages = c.languages ? Object.values(c.languages).join(", ") : "N/A";
  const currencies = c.currencies
    ? Object.values(c.currencies)
        .map((cur) => cur.name)
        .join(", ")
    : "N/A";
  const ind = INDEPENDENCE[c.cca3];
  const independence = ind
    ? `${ind.date} (${ind.text})`
    : "Not an independent country";
  const note = HISTORY_NOTES[c.cca3];
  const stand = COUNTRY_NOTES[c.cca3];
  modalBody.innerHTML = `
    <img src="${flagOf(c)}" alt="Flag of ${c.name.common}" onerror="${flagFix(c)}" class="w-full h-44 object-cover block">
    <div class="px-5 pt-4 pb-5">
      <h2 class="text-2xl font-bold">${c.name.common}</h2>
      <p class="text-sm text-gray-500 mb-3">${c.name.official}</p>
      <dl class="grid grid-cols-[110px_1fr] gap-x-2.5 gap-y-1.5 text-sm [&>dt]:font-bold">
        <dt>Capital</dt><dd>${c.capital && c.capital.length ? c.capital.join(", ") : "N/A"}</dd>
        <dt>Region</dt><dd>${c.region || "N/A"}${c.subregion ? " (" + c.subregion + ")" : ""}</dd>
        <dt>Population</dt><dd>${(c.population || 0).toLocaleString()}</dd>
        <dt>Area</dt><dd>${c.area ? c.area.toLocaleString() + " km²" : "N/A"}</dd>
        <dt>Languages</dt><dd>${languages}</dd>
        <dt>Currencies</dt><dd>${currencies}</dd>
        <dt>Independence</dt><dd>${independence}</dd>
      </dl>
      ${note ? `<h3 class="text-base font-bold mt-3.5 mb-1">History</h3><p class="text-sm text-gray-700">${note}</p>` : ""}
      ${stand ? `<p class="mt-3.5 p-2.5 bg-orange-50 border-l-4 border-orange-600 text-xs text-gray-800">${stand}</p>` : ""}
    </div>`;
  modal.showModal();
}

searchInput.addEventListener("input", render);
regionSelect.addEventListener("change", render);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    currentView = tab.dataset.view;
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle("bg-indigo-600", on);
      t.classList.toggle("text-white", on);
      t.classList.toggle("bg-white", !on);
      t.classList.toggle("text-indigo-600", !on);
    });
    render();
  });
});

grid.addEventListener("click", (event) => {
  const card = event.target.closest(".card");
  if (!card) return;
  if (event.target.closest(".fav-btn")) {
    toggleFavorite(card.dataset.code);
  } else {
    showDetails(card.dataset.code);
  }
});

closeModal.addEventListener("click", () => modal.close());
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

fetchCountries();
