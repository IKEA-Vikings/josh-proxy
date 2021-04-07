require('dotenv').config();

const express = require('express');
const axios = require('axios');
const port = process.env.JOSH_PROXY_PORT;

const app = express();

app.use(express.static(__dirname + '/../public'));
app.use(express.static(__dirname + '/../dist'));

app.get('/src/:service', (req, res, next) => {
  console.log(req.path);
  const serviceName = req.params.service;
  const serviceUrl = process.env[serviceName.toLocaleUpperCase()];

  axios.get(serviceUrl, {
    headers: {
      'Content-Type': 'text/javascript'
    }
  })
    .then(serviceResponse => {
      res.send(serviceResponse.data);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.get('/:item(\\d+)', (req, res, next) => {
  console.log(req.path);

  res.sendFile('index.html', {
    root: __dirname + '/../public/'
  }, () => res.end());
});

app.get('/api/:service', (req, res, next) => {
  console.log(req.path);

  const serviceUrl = process.env[`${req.params.service.toLocaleUpperCase()}_API`];
  const requestUrl = serviceUrl + req.query.path;

  axios.get(requestUrl).then(serviceResponse => {
    res.send(serviceResponse.data);
  }).catch(err => {
    console.error(err);
    res.sendStatus(404);
  });
});

app.get('/api/:service/*', (req, res, next) => {
  console.log(req.path);

  const serviceUrl = process.env[`${req.params.service.toLocaleUpperCase()}_API`];
  const requestUrl = serviceUrl + req.path.match(/\/api\/[^/]+\/(.*)/)[1];

  axios.get(requestUrl)
    .then(serviceResponse => {
      res.send(serviceResponse.data);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.get('/static/:service', (req, res, next) => {
  console.log(req.path);

  const serviceUrl = process.env[`${req.params.service.toLocaleUpperCase()}_STATIC`];
  const requestUrl = serviceUrl + req.query.path;

  axios.get(requestUrl)
    .then(serviceResponse => {
      res.type(serviceResponse.headers['content-type']);
      res.send(serviceResponse.data);
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(404);
    });
});

app.listen(port, () => console.log('josh proxy listening on port ' + port));
