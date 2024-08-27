const userLocationInput = document.getElementById("userLocation");
const weatherIcon = document.querySelector(".weatherIcon");
const temperature = document.querySelector(".temperature");
const feelslike = document.querySelector(".feelslike");
const description = document.querySelector(".description");
const date = document.querySelector(".date");
const city = document.querySelector(".city");
const HValue = document.getElementById("HValue");
const WValue = document.getElementById("WValue");
const SRValue = document.getElementById("SRValue");
const SSValue = document.getElementById("SSValue");
const CValue = document.getElementById("CValue");
const UVValue = document.getElementById("UVValue");
const PValue = document.getElementById("PValue");
const Forecast = document.querySelector(".Forecast");
const converter = document.getElementById('converter');

const WEATHER_API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather?appid=f684413b35cac7fd00f044ed47ecc45b&q=';
const WEATHER_DATA_ENDPOINT = 'https://api.openweathermap.org/data/3.0/onecall?appid=f684413b35cac7fd00f044ed47ecc45b&exclude=minutely&units=metric';

function findUserLocation() {
    const location = userLocationInput.value.trim();
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    fetch(WEATHER_API_ENDPOINT + encodeURIComponent(location))
        .then(response => response.json())
        .then(data => {
            if (data.cod !== 200) {
                alert(data.message);
                return;
            }
            console.log(data);

            fetch(`${WEATHER_DATA_ENDPOINT}&lon=${data.coord.lon}&lat=${data.coord.lat}`)
                .then(response => response.json())
                .then(weatherData => {
                    console.log(weatherData);
                    updateWeatherDisplay(data, weatherData);
                })
                .catch(error => {
                    console.error('Error fetching additional weather data:', error);
                });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

function updateWeatherDisplay(data, weatherData) {
    const tempUnit = converter.value || '°C';
    city.innerHTML = `${data.name}, ${data.sys.country}`;
    weatherIcon.style.background = `url(https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png)`;
    temperature.innerHTML = TempConverter(weatherData.current.temp, tempUnit);
    feelslike.innerHTML = `Feels like ${TempConverter(weatherData.current.feels_like, tempUnit)}`;
    description.innerHTML = `<i class="fa-brands fa-cloudversify"></i>&nbsp;${data.weather[0].description}`;
    
    const options = {
        weekday: "long",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };

    const timezoneOffset = weatherData.timezone_offset;
    date.innerHTML = getLongFormattedDateTime(data.dt, timezoneOffset, options);
    HValue.innerHTML = `${Math.round(data.main.humidity)}%`;
    WValue.innerHTML = `${Math.round(data.wind.speed)} m/s`;
    SRValue.innerHTML = "Sunrise " + getLongFormattedDateTime(data.sys.sunrise, timezoneOffset, { hour: "numeric", minute: "numeric", hour12: true });
    SSValue.innerHTML ="Sunset " + getLongFormattedDateTime(data.sys.sunset, timezoneOffset, { hour: "numeric", minute: "numeric", hour12: true });
    CValue.innerHTML = `${data.clouds.all}%`;
    PValue.innerHTML = `${data.main.pressure} hPa`;
    if (weatherData.current) {
        UVValue.innerHTML = `${weatherData.current.uvi}`;
        
        
        Forecast.innerHTML = '';

weatherData.daily.forEach((weather) => {
    let div = document.createElement("div");

    
    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
    };
    
   
    let daily = getLongFormattedDateTime(weather.dt, 0, options).split(" at ");
    
   
    div.innerHTML = `<div class="forecast-date">${daily[0]}</div>`;
    div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}" />`;
    div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}</p>`;
    div.innerHTML += `<p class="temp-range">Max: ${TempConverter(weather.temp.max, converter.value)} / Min: ${TempConverter(weather.temp.min, converter.value)}</p>`;
    
   
    Forecast.appendChild(div);
});

        };
    }


function formatUnixTime(dtValue, offset, options = {}) {
    const date = new Date((dtValue + offset) * 1000);
    return date.toLocaleString([], { timeZone: "UTC", ...options });
}

function getLongFormattedDateTime(dtValue, offset, options) {
    return formatUnixTime(dtValue, offset, options);
}

function TempConverter(temp, unit) {
    let tempValue = Math.round(temp);
    if (unit === "°F") {
        tempValue = (tempValue * 9 / 5) + 32;
        return `${tempValue}<span>°F</span>`;
    }
    return `${tempValue}<span>°C</span>`;
}


document.getElementById('searchIcon').addEventListener('click', findUserLocation);


converter.addEventListener('change', () => {
    const tempUnit = converter.value;
    updateWeatherDisplay(weatherData, weatherData);
});
