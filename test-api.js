const http = require('http');

// Test products endpoint
console.log('Testing products endpoint...');
http.get('http://localhost:5000/api/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Products Status:', res.statusCode);
    console.log('Products Response:', data.substring(0, 200));
  });
}).on('error', err => console.error('Products Error:', err.message));

// Test login endpoint
setTimeout(() => {
  console.log('\nTesting login endpoint...');
  const loginData = JSON.stringify({ email: 'test@test.com', password: 'password' });
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Login Status:', res.statusCode);
      console.log('Login Response:', data);
    });
  }).on('error', err => console.error('Login Error:', err.message));

  req.write(loginData);
  req.end();
}, 500);
