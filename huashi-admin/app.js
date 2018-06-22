const fs = require('fs');
const path = require('path');
const express = require('express');
const proxy = require('express-http-proxy');

const app = express();


app.use('/api', proxy('172.28.1.82:18002', {
    proxyReqPathResolver: function(req) {
      console.log(require('url').parse(req.url).path)
      return require('url').parse(req.url).path;
    }
  }));

app.use(express.static(path.resolve(__dirname, './web')))
app.get('*', function(req, res) {
    const html = fs.readFileSync(path.resolve(__dirname, './web/index.html'), 'utf-8')
    res.send(html)
})

app.listen(80);