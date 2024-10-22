"use strict";

const countriesContainer = document.querySelector(".countries");
const btn = document.querySelector(".submit");
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

function renderError(msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
  countriesContainer.style.opacity = 1;
}

// function getCountryDataAndNeighbours(country) {
//   const request = new XMLHttpRequest();
//   request.open("GET", `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener("load", function () {
//     const [data] = JSON.parse(this.responseText);
//     //console.log(data);
//     renderCountry(data);

//     const borders = data.borders;
//     // si le pays n'a pas de pays frontaliers on bloque l'execution du code ici
//     if (!borders) {
//       return;
//     }

//     const request2 = new XMLHttpRequest();
//     request2.open(
//       "GET",
//       `https://restcountries.com/v3.1/alpha?codes=${borders}`
//     );
//     request2.send();

//     request2.addEventListener("load", function () {
//       const data = JSON.parse(this.responseText);

//       data.forEach((country) => {
//         renderCountry(country, "neighbour");
//       });
//     });
//   });
// }

//function getJSON(url, errorMsg = "Something went wrong") {
//  return fetch(url).then((response) => {
//    if (!response.ok) {
//      throw new Error(errorMsg);
//    }
//    return response.json();
//  });
//}

async function getJSON(url, errorMsg = "Something went wrong") {
  let response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMsg);
  }
  let data = await response.json();

  return data;
}

async function getCountryDataAndNeighbours(country) {
  const data = await getJSON(
    `https://restcountries.com/v3.1/name/${country}?fullText=true`,
    "API request error : enter a valid country name"
  );

  renderCountry(data[0]);

  const borders = data[0].borders;
  // si le pays n'a pas de pays frontaliers on bloque l'execution du code ici
  if (!borders) {
    throw new Error("It is an island : no borders");
  }

  const dataBorders = await getJSON(
    `https://restcountries.com/v3.1/alpha?codes=${borders}`,
    "API request error"
  );

  dataBorders.forEach((country) => {
    return renderCountry(country, "neighbour");
  });
}

btn.addEventListener("click", () => {
  getCountryDataAndNeighbours("france");
});

function whereAmI(lat, lng) {
  getJSON(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}%2C${lng}&language=en&key=a806e95f1e1d4808a5620860758b5a97`
  )
    .then((data) => {
      const city = data.results[0].components.city;
      const country = data.results[0].components.country;

      getCountryDataAndNeighbours(country);

      console.log(`You are in ${city}, ${country}.`);
    })
    .catch((error) => {
      console.error(error);
    });
}

whereAmI(35.689, 139.69);
