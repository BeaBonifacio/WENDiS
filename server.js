const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const accountSid = 'AC7cc3682562bdc6e23b53c0ed2a9841a7'; // Replace with your Twilio Account SID
const authToken = 'e39a59f1eb1da8c1cfe565144bd87f0b';   // Replace with your Twilio Auth Token
const twilioClient = twilio(accountSid, authToken);

const apiKey = '28f03a7d662e4eaf58f85448481bd955';  // Replace with your OpenWeather API Key

app.post('/subscribe', async (req, res) => {
  const { phone, city } = req.body;

  try {
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const weather = weatherResponse.data;

    // Send SMS via Twilio
    await twilioClient.messages.create({
      body: `Subscribed! Weather in ${city}: ${weather.weather[0].description}, Temp: ${weather.main.temp}°C`,
      from: '+17752699543', // Replace with your Twilio number
      to: phone,
    });

    res.status(200).send({ message: `Subscribed to weather updates for ${city}` });
  } catch (error) {
    console.error('Error subscribing user:', error);
    res.status(500).send({ message: 'Error subscribing to updates' });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
