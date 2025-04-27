const countriesList = document.getElementById("countries-list");
const continent = document.getElementById("kontinent");
const modalBody = document.getElementById("oneCountry-body");
const modalTitle = document.querySelector("#oneCountry .modal-title"); // <<< Přidáno: najdeme nadpis modalu
const modal = new bootstrap.Modal(document.getElementById("oneCountry"));

function loadCountries(region) {
  countriesList.innerHTML = "";
  fetch(`https://restcountries.com/v3.1/region/${region}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      data.forEach((country) => {
        let blockCountry = `
            <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                <div class="card">
                    <img class="card-img-top" src="${country.flags.png}" alt="${country.name.common} flag"/>
                    <div class="card-body">
                        <h4 class="card-title"><a href="#">${country.translations.ces.official}</a></h4>
                        <p class="card-text">Hlavní město: <b>${country.capital ? country.capital[0] : "Neznámé"}</b></p>
                        <p><button class="btn btn-secondary" 
                            data-bs-toggle="modal" 
                            data-bs-target="#oneCountry"
                            data-name="${country.name.common}">Informace</button></p>
                    </div>
                </div>
            </div>
        `;
        countriesList.innerHTML += blockCountry;
      });

      document.querySelectorAll('button[data-name]').forEach(button => {
        button.addEventListener('click', () => {
          const countryName = button.getAttribute('data-name');
          modalTitle.textContent = "Informace"; // <<< Přidáno: nastavíme nadpis na "Informace"
          modal.show();
          fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
          .then(res => res.json())
          .then(data => {
            const country = data[0];

            let funFact = "";
            if (country.area > 1000000) {
              funFact = "Je to obrovská země s rozlohou přes milion km²!";
            } else if (country.population > 50000000) {
              funFact = "Má více než 50 milionů obyvatel!";
            } else if (country.independent) {
              funFact = "Tato země je nezávislá!";
            } else {
              funFact = "Je to jedna z unikátních zemí na světě.";
            }

            modalBody.innerHTML = `
              <h4>${country.translations.ces.common}</h4>
              <p><b>Hlavní město:</b> ${country.capital ? country.capital[0] : "Neznámé"}</p>
              <p><b>Počet obyvatel:</b> ${country.population.toLocaleString("cs-CZ")}</p>
              <p><b>Rozloha:</b> ${country.area.toLocaleString("cs-CZ")} km²</p>
              <hr>
              <h5>🧠 Zajímavost:</h5>
              <p>${funFact}</p>
            `;
          })
          .catch(error => {
            console.error(error);
          });
        });
      });
    })
    .catch(error => {
      console.error(error);
    });
}

loadCountries("europe");

continent.addEventListener("change", function (event) {
  loadCountries(event.target.value);
});
