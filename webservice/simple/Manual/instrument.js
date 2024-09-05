// instrument.js

async function sendDataToInflux(data) {
  const influxDBUrl = 'http://localhost:8086/write?db=perfWS';
  
  const body = `response_times,tag_key=duration field_key=${data}`;

  try {
    const response = await fetch(influxDBUrl, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'text/plain'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to send data: ${response.statusText}`);
    }
    console.log('Data sent successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = { sendDataToInflux };
