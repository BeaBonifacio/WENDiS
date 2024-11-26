async function getWeather() {
  const city = document.getElementById('city').value;
  const apiKey = '28f03a7d662e4eaf58f85448481bd955'; // Replace with your OpenWeatherMap API key
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === 200) {
      const weather = data.weather[0].main.toLowerCase();
      const statusElement = document.getElementById('weather-status');
      const ledElement = document.getElementById('led');

      statusElement.textContent = `Weather in ${city}: ${data.weather[0].description}`;

      // Update LED light based on weather
      ledElement.className = 'led'; // Reset LED class
      if (weather.includes('clear')) {
        ledElement.classList.add('sunny');
      } else if (weather.includes('rain')) {
        ledElement.classList.add('rainy');
      } else if (weather.includes('storm')) {
        ledElement.classList.add('stormy');
      } else {
        ledElement.style.background = 'gray';
        statusElement.textContent += ' (No alert)';
      }
    } else {
      alert('City not found. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('An error occurred. Please try again later.');
  }
}
