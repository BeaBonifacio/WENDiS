const apiKey = '28f03a7d662e4eaf58f85448481bd955'; // Your API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather'; // OpenWeather API URL

document.getElementById('get-weather-btn').addEventListener('click', fetchWeather);
document.getElementById('pin-btn').addEventListener('click', pinCity);

let pinnedCities = [];

// Fetch weather based on city name
function fetchWeather() {
  const cityName = document.getElementById('city-name').value.trim();

  if (!cityName) {
    alert('Please enter a city name.');
    return;
  }

  fetch(`${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404') {
        alert('City not found!');
      } else {
        updateWeatherDisplay(data);
      }
    })
    .catch(error => {
      console.error('Error fetching weather:', error);
      alert('Failed to fetch weather data. Please try again.');
    });
}

// Update the displayed weather and LED color based on the status
function updateWeatherDisplay(data) {
  const weatherStatus = data.weather[0].main;
  const temperature = data.main.temp;
  const humidity = data.main.humidity;

  document.getElementById('weather-status').textContent = `${weatherStatus} | Temp: ${temperature}°C | Humidity: ${humidity}%`;

  // Set LED color based on weather condition
  const led = document.querySelector('#alert-display .led');
  const weatherLed = getWeatherLed(weatherStatus);

  // Change the LED color and the status display
  led.style.backgroundColor = weatherLed.color;
  led.style.boxShadow = `0 0 20px ${weatherLed.color}`;
}

// Determine the color of the LED based on weather status
function getWeatherLed(weatherStatus) {
  switch (weatherStatus.toLowerCase()) {
    case 'clear':
      return { color: 'yellow' };
    case 'rain':
      return { color: 'blue' };
    case 'storm':
      return { color: 'red' };
    default:
      return { color: 'gray' }; // Default gray for other conditions
  }
}

// Pin the city with weather status
function pinCity() {
  const cityName = document.getElementById('city-name').value.trim();

  if (!cityName) {
    alert('Please enter a city name to pin.');
    return;
  }

  const existingCity = pinnedCities.find(city => city.name.toLowerCase() === cityName.toLowerCase());

  if (existingCity) {
    alert('This city is already pinned.');
    return;
  }

  fetch(`${apiUrl}?q=${cityName}&appid=${apiKey}&units=metric`)
    .then(response => response.json())
    .then(data => {
      if (data.cod === '404') {
        alert('City not found!');
      } else {
        pinnedCities.push(data);
        displayPinnedCities();
      }
    })
    .catch(error => {
      console.error('Error pinning city:', error);
      alert('Failed to fetch data for pinned city.');
    });
}

// Remove a pinned city
function removeCity(index) {
  // Remove city from the pinnedCities array
  pinnedCities.splice(index, 1);
  displayPinnedCities();  // Re-render the list of pinned cities
}

// Display pinned cities and their weather info
function displayPinnedCities() {
  const list = document.getElementById('pinned-cities-list');
  list.innerHTML = '';

  pinnedCities.forEach((city, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="city-name">${city.name}</div>
      <div class="weather-status">${city.weather[0].main}</div>
      <div class="temperature">Temp: ${city.main.temp}°C</div>
      <div class="humidity">Humidity: ${city.main.humidity}%</div>
      <div class="led" style="background-color: ${getWeatherLed(city.weather[0].main).color};"></div>
      <button onclick="removeCity(${index})" class="remove-btn">Remove</button> <!-- Remove button -->
    `;
    list.appendChild(listItem);
  });
}
