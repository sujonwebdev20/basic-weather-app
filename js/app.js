function $(sel) {
  return document.querySelector(sel);
}

const key = "21c0fe1849b4212492dc642f366bc0d5";
let weatherInfo = {};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const lat = coords.latitude;
      const lon = coords.longitude;

      const uri = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`;

      fetch(uri)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          const cityAndCountry = data.name + ", " + data.sys.country;
          const condition = data.weather[0].description;
          const kelvinTemp = data.main.temp - 273.15;
          const pressure = data.main.pressure;
          const humidity = data.main.humidity;
          weatherInfo = {
            icon,
            cityAndCountry,
            condition,
            kelvinTemp,
            pressure,
            humidity,
          };
          console.log(
            icon,
            cityAndCountry,
            condition,
            kelvinTemp,
            pressure,
            humidity
          );
          displayToUI(weatherInfo);
        })
        .catch((err) => console.log(err));
    },
    (err) => {
      const uri = `https://api.openweathermap.org/data/2.5/weather?q=Dhaka&appid=${key}`;

      fetch(uri)
        .then((res) => res.json())
        .then((data) => {
          const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
          const cityAndCountry = data.name + ", " + data.sys.country;
          const condition = data.weather[0].description;
          const kelvinTemp = data.main.temp - 273.15;
          const pressure = data.main.pressure;
          const humidity = data.main.humidity;
          weatherInfo = {
            icon,
            cityAndCountry,
            condition,
            kelvinTemp,
            pressure,
            humidity,
          };
          displayToUI(weatherInfo);
        })
        .catch((err) => console.log(err))
        .finally(() => console.log(weatherInfo));
    }
  );
}
// https://openweathermap.org/img/wn/10d@2x.png
function displayToUI({
  icon,
  cityAndCountry,
  condition,
  kelvinTemp,
  pressure,
  humidity,
}) {
  $("#icon").src = icon;
  $("#city").textContent = cityAndCountry;
  $("#condition").textContent = condition;
  $("#temp").textContent = kelvinTemp.toFixed();
  $("#pressure").textContent = pressure;
  $("#humidity").textContent = humidity;
}

$("#search_btn").addEventListener("click", function () {
  const searchCity = $("#search").value;
  const uri = `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&appid=${key}`;
  if (!searchCity) return;

  fetch(uri)
    .then((res) => res.json())
    .then((data) => {
      const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
      const cityAndCountry = data.name + ", " + data.sys.country;
      const condition = data.weather[0].description;
      const kelvinTemp = data.main.temp - 273.15;
      const pressure = data.main.pressure;
      const humidity = data.main.humidity;
      weatherInfo = {
        icon,
        cityAndCountry,
        condition,
        kelvinTemp,
        pressure,
        humidity,
      };

      const historyCards = document.querySelectorAll(".history_card");

      const history = getDataFromLocalStorage();
      if (history.length === 3) {
        historyCards[2].remove();
        console.log(historyCards);
        history.pop();
        history.unshift(weatherInfo);
      } else {
        history.unshift(weatherInfo);
      }

      const div = document.createElement("div");
      div.id = "card_parent";
      div.innerHTML = `
        <div class="history_card">
        <div id="card_icon">
          <img src="${icon}" alt="" />
        </div>
        <div id="detail">
          <h4>${cityAndCountry}</h4>
          <p id="card_condition">${condition}</p>
          <p>Temp: ${kelvinTemp.toFixed()} °C, Pressure: ${pressure}, Humidity: ${humidity}</p>
        </div>
      </div>`;

      const cardContainer = $("#card_container");
      cardContainer.insertBefore(div, cardContainer.children[0]);
      displayToUI(weatherInfo);
      $("#search").value = "";

      localStorage.setItem("weather", JSON.stringify(history));
      // $("#left_area").style.display = "block";
    })
    .catch((err) => alert("Please enter a valid city name."));
});

function getDataFromLocalStorage() {
  const data = localStorage.getItem("weather");
  let weather = [];
  if (data) {
    weather = JSON.parse(data);
  }
  return weather;
}

function displayCardUI() {
  const history = getDataFromLocalStorage();
  history.forEach((card) => {
    const { icon, cityAndCountry, condition, kelvinTemp, pressure, humidity } =
      card;
    const div = document.createElement("div");
    div.id = "card_parent";
    div.innerHTML = `
      <div class="history_card">
      <div id="card_icon">
        <img src="${icon}" alt="" />
      </div>
      <div id="detail">
        <h4>${cityAndCountry}</h4>
        <p id="card_condition">${condition}</p>
        <p>Temp: ${kelvinTemp.toFixed()} °C, Pressure: ${pressure}, Humidity: ${humidity}</p>
      </div>
    </div>`;
    $("#card_container").appendChild(div);
  });
}

window.onload = displayCardUI;
