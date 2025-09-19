// app/api/predict-interest/route.js (App Router)
export async function POST(request) {
  try {
    const body = await request.json();

    console.log('API Route - Interest: Received request:', body);

    const flaskResponse = await fetch('http://localhost:8080/predict-interest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    console.log('API Route - Interest: Flask response status:', flaskResponse.status);

    if (!flaskResponse.ok) {
      const errorText = await flaskResponse.text();
      console.error('API Route - Interest: Flask error:', errorText);
      let errorMessage = `Backend error: ${flaskResponse.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorMessage;
      } catch {}
      return Response.json({ success: false, message: errorMessage }, { status: flaskResponse.status });
    }

    const data = await flaskResponse.json();
    console.log('API Route - Interest: Flask success response:', data);
    return Response.json(data);
  } catch (error) {
    console.error('API Route - Interest: Connection error:', error);
    let message = 'Failed to connect to interest prediction service';
    if (error.code === 'ECONNREFUSED') {
      message = 'Backend server is not running. Please start your Flask server on port 8080.';
    }
    return Response.json({ success: false, message }, { status: 500 });
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
