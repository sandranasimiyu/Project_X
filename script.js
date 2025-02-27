function menu() {
  const cont = document.querySelector(".cont-3");
  const container = document.querySelector(".cont-4");
  const cont8 = document.querySelector(".cont-8");
  const conttt = document.querySelector(".day-data");

  cont.style.display = "block";
  cont.style.display = "flex";
  cont.style.flexDirection = "column";
  cont.style.margin = "1.5rem";

  container.style.position = "relative";
  container.style.top = "35rem";

  container.style.marginBottom = "50rem";
  conttt.style.marginTop = "50rem";
}

function back() {
  const cont = document.querySelector(".cont-3");
  const container = document.querySelector(".cont-4");
  const cont8 = document.querySelector(".cont-8");
  const conttt = document.querySelector(".day-data");

  cont.style.display = "none";
  container.style.position = "relative";
  container.style.top = "auto";
  cont8.style.marginTop = "auto";
  conttt.style.position = "relative";
}
let key = "39RS9A8TZ6Y4L3PQLXZCMJ4RF";
let main = {};

let input = document.getElementById("location");
let temperature = document.getElementsByClassName("daytemp")[0];
let wind = document.getElementById("wind");
let rain = document.getElementById("rain");
let humidity = document.getElementById("humidity");
let pressure = document.getElementById("pressure");
let sunshine = document.getElementById("sunshine");
let mainImg = document.getElementById("main-img");

let condition = document.getElementsByClassName("t")[0];
let dew = document.getElementById("dew");
let visibility = document.getElementById("visibility");

let hourdata = [];
let daydata = [];
const daysofweek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const hourlyElements = document.querySelectorAll(".hrly");
const dailyElements = document.querySelectorAll(".siku");

document.querySelector(".deg.c").classList.add("active");

function search() {
  fetchData(input.value);
}

async function fetchData(city) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${key}`
    );
    let data = await response.json();
    console.log(data);
    main = data;

    const currentDateTime = new Date(main.currentConditions.datetime);
    const currentHour = new Date(main.currentConditions.datetime).getHours();
    hourdata =
      currentHour >= 17
        ? main.days[0].hours.slice(17, 24)
        : main.days[0].hours.slice(currentHour, currentHour + 7);

    daydata = main.days.slice(0, 7);
    assignData();
    // console.log(hourdata);
    // updateHourlyForecast();
    updateDailyForecast();
    assignData();
  } catch (error) {
    console.error("Error", error);
  }
}

let isCelsius = true;
const celsiusToFahrenheit = (c) => (c * 9) / 5 + 32;
const fahrenheitToCelsius = (f) => ((f - 32) * 5) / 9;
document.querySelector(".deg.c").classList.add("active");
function convert() {
  isCelsius = !isCelsius;
  document
    .querySelectorAll(".deg")
    .forEach((deg) => deg.classList.remove("active"));
  document
    .querySelector(`.deg.${isCelsius ? "c" : "f"}`)
    .classList.add("active");
  assignData();
  updateDailyForecast();
}

function weatherImg(condition) {
  let lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes("cloudy")) {
    return "https://cdn-icons-png.flaticon.com/128/704/704845.png";
  } else if (lowerCaseCondition.includes("clear")) {
    return "https://cdn-icons-png.flaticon.com/128/7865/7865939.png";
  } else if (lowerCaseCondition.includes("rain")) {
    return "https://cdn-icons-png.flaticon.com/128/4088/4088981.png";
  }
  return "https://cdn-icons-png.flaticon.com/128/1163/1163662.png";
}

function assignData() {
  if (main.currentConditions) {
    const temp = isCelsius
      ? main.currentConditions.temp
      : celsiusToFahrenheit(main.currentConditions.temp);

    temperature.textContent = `Temperature: ${Math.round(temp)}°${
      isCelsius ? "C" : "F"
    }`;
    wind.textContent = main.currentConditions.windspeed + "m/s";
    humidity.textContent = main.currentConditions.humidity + "%";
    rain.textContent = main.currentConditions.precip + "mm";
    sunshine.textContent = main.currentConditions.solarenergy + "m²";
    mainImg.src = weatherImg(main.currentConditions.icon);
    condition.textContent = main.currentConditions.conditions;

    visibility.textContent =
      "visibility: " + main.currentConditions.visibility + " km";
    pressure.textContent =
      "Pressure: " + main.currentConditions.pressure + " Pa";
    dew.textContent = "Dew: " + main.currentConditions.dew;
    // updateHourlyForecast();
    updateDailyForecast();
  }
}

// function updateHourlyForecast() {
//   hourlyElements.forEach((element, index) => {
//     if (hourdata[index]) {
//       const hour = hourdata[index];
//       const timePart = hour.datetime.split(":");
//       const hour12 = timePart[0] % 12 || 12;
//       const ampm = timePart[0] >= 12 ? "PM" : "AM";

//       // Update elements within the current hourly element
//       element.querySelector(
//         ".hour"
//       ).textContent = `${hour12}:${timePart[1]} ${ampm}`;
//       element.querySelector(".mini-img").src = weatherImg(hour.icon);
//       element.querySelector(".daytemp").textContent = `${Math.round(
//         hour.temp
//       )}°C`;
//     }
//   });
// }

function updateDailyForecast() {
  dailyElements.forEach((element, index) => {
    if (daydata[index]) {
      const day = daydata[index];
      const date = new Date(day.datetime);

      const minTemp = isCelsius
        ? day.tempmin
        : celsiusToFahrenheit(day.tempmin);
      const maxTemp = isCelsius
        ? day.tempmax
        : celsiusToFahrenheit(day.tempmax);

      element.querySelector(".dy").textContent = daysofweek[date.getDay()];
      element.querySelector(".mini-img").src = weatherImg(day.icon);
      element.querySelector(".daytemp").textContent = `${Math.round(minTemp)}°${
        isCelsius ? "C" : "F"
      } - ${Math.round(maxTemp)}°${isCelsius ? "C" : "F"}`;
    }
  });
}
