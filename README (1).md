# Country Explorer

A simple web application to browse countries of the world, search and filter them, and save your favorite countries. Data is loaded from a public API using `fetch()` and `async/await`.

**Course:** Software Development I (CSE-2340), International Islamic University Chittagong
**Assessment:** Mini Project 3-4 (MP3-MP4): Interactive API-Driven Web Application
**Author:** Foisal Hossen (ID: C253077)

---

## Description

Country Explorer shows every country as a card with its flag, capital, region and population. You can search by name, filter by region, and click a card to see more details such as area, languages, currencies and independence day. Countries can be added to a Favorites list, which is saved in the browser and stays available after refreshing the page.

## Features

- Loads country data from the [REST Countries API](https://restcountries.com)
- Live search by country name
- Filter by region (Africa, Americas, Antarctic, Asia, Europe, Oceania)
- Cards with flag, capital, region and population
- Details popup: official name, area, languages, currencies, independence / national day, and a short history note for some countries
- Favorites: add or remove a country with the heart button
- Separate Favorites tab with a live counter
- Favorites are saved in `localStorage` and stay after page refresh
- Loading, error and empty ("No countries found") states
- Responsive layout for mobile and desktop

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- JavaScript (ES6): DOM manipulation, events, array methods
- `fetch()` with `async/await` and `try/catch`
- `localStorage` with `JSON.stringify` / `JSON.parse`

## Assignment Requirements

| Requirement | Marks | How it is done |
|---|---|---|
| DOM Manipulation and Dynamic Rendering | 4 | Cards are created with `createElement` and `innerHTML`; search, region filter and details popup update the page dynamically |
| Event Handling and JavaScript Logic | 3 | `addEventListener()` for input, change and click events. `filter()`, `forEach()`, `find()` and `sort()` manage the country data |
| API Integration and Asynchronous Operations | 4 | `fetch()` with `async/await`, a loading spinner, an error message with a "Try again" button, and an empty state |
| Local Storage | 3 | Favorite countries are saved in `localStorage` and loaded again on page refresh |

## Project Structure

```
country-explorer/
├── index.html   # Page layout (Tailwind CSS classes)
├── script.js    # All application logic
├── data.js      # Built-in backup data, flags, independence days and history notes
└── README.md
```

## How to Run

1. Download or clone this repository.
2. Keep all files in the same folder.
3. Open `index.html` in a browser (Chrome or Edge). An internet connection is needed for the API and for Tailwind CSS.

Optional: open the folder in VS Code and use the **Live Server** extension.

## How It Works

1. On page load, `fetchCountries()` requests the country list from the API.
2. The data is sorted by name and shown as cards by `render()`.
3. `render()` runs again on every search, region change, tab change and favorite click.
4. Favorites are stored as a list of country codes in `localStorage`.
5. If the API cannot be reached, the app uses the built-in data from `data.js`, so the page is never empty. Set `USE_LOCAL_FALLBACK` to `false` in `script.js` to show the error state instead.

## Data Sources

- Country data: [REST Countries API](https://restcountries.com)
- Built-in backup data: [mledoze/countries](https://github.com/mledoze/countries) and World Bank population data
- Flags: [country-flag-icons](https://www.npmjs.com/package/country-flag-icons) (MIT License)
- Independence days and history notes were written by hand and may contain mistakes, so please verify before using them elsewhere.

## Author

**Foisal Hossen**
Department of Computer Science and Engineering, International Islamic University Chittagong
