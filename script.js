"use strict";

const countriesContainer = document.querySelector(".countries");
const MILLION_PEOPLE_UNIT = 1000000;

/**
 * Render country from API data
 * @param {Object} data
 * @param {String} className
 */
function renderCountry(data, className = "") {
  const [language] = Object.values(data.languages);
  const currency = Object.values(data.currencies)[0].name;
  const currencySymbol = Object.values(data.currencies)[0].symbol;

  const population =
    data.population > MILLION_PEOPLE_UNIT
      ? (data.population / MILLION_PEOPLE_UNIT).toFixed(1) + " millions people"
      : data.population + " people";

  const html = `
        <article class="country ${className}">
          <img class="country__img" alt="${data.flags.alt}" src="${data.flags.png}" />
          <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${population}</p>
            <p class="country__row"><span>🗣️</span>${language}</p>
            <p class="country__row"><span>💰</span>${currency} ${currencySymbol}</p>
          </div>
        </article>
    `;

  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
}

// function getCountryData(country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener("load", function () {
//     const [data] = JSON.parse(this.responseText);

//     renderCountry(data);
//   });
// }

const getCountryDataAndNeighbours = (country) => {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((response) => response.json())
    .then(([data]) => {
      renderCountry(data);

      const borders = data.borders;
      // si le pays n'a pas de pays frontaliers on bloque l'execution du code ici
      if (!borders) {
        return;
      }

      return fetch(`https://restcountries.com/v3.1/alpha?codes=${borders}`);
    })
    .then((response) => response.json())
    .then((data) => {
      data.forEach((country) => {
        renderCountry(country, "neighbour");
      });
    });
};

getCountryDataAndNeighbours("france");
