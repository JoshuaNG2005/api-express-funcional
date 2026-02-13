const http = require('http');
const payload = { nombre: 'Test User', email: 'testuser@example.com', telefono: '+34123456789', password: 'TestPass123!' };
const data = JSON.stringify(payload);

const options = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/v1/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, res => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', body);
  });
});

req.on('error', err => console.error('ERR', err.message));
req.write(data);
req.end();
