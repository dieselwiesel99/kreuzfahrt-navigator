exports.handler = async (event) => {
  const { city } = event.queryStringParameters;
  const API_KEY = 'a5e7cc455c504f8db81161220261801';
  
  if (!city) {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: 'city Parameter erforderlich' })
    };
  }
  
  try {
    const https = require('https');
    
    // WeatherAPI mit Stadt-Namen (Stockholm, Copenhagen, etc.)
    const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&lang=de`;
    
    const data = await new Promise((resolve, reject) => {
      https.get(apiUrl, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ error: error.message })
    };
  }
};
