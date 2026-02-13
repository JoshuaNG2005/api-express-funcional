const http = require('http');

function request(path){
  return new Promise((resolve)=>{
    const opts = { hostname: 'localhost', port: 3001, path, method: 'GET' };
    const req = http.request(opts, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', ()=> resolve({ statusCode: res.statusCode, body: data }));
    });
    req.on('error', err => resolve({ error: err.message }));
    req.end();
  });
}

(async ()=>{
  console.log('Checking /health...');
  console.log(await request('/health'));
  console.log('Checking /api/v1...');
  console.log(await request('/api/v1'));
  console.log('Checking /docs...');
  console.log(await request('/docs'));
})();
