export default async function handler(req, res) {
  try {
    // Import the TanStack Start server handler
    const { default: server } = await import('../dist/server/server.js');
    
    // Convert Node.js request to Web Request
    const url = `${req.headers['x-forwarded-proto'] || 'http'}://${req.headers.host}${req.url}`;
    const request = new Request(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });

    // Call the server handler
    const response = await server.fetch(request);
    
    // Convert Web Response to Node.js response
    res.status(response.status);
    
    // Set headers
    response.headers.forEach((value, key) => {
      res.setHeader(key, value);
    });
    
    // Send body
    const body = await response.text();
    res.send(body);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).send('Internal Server Error');
  }
}
