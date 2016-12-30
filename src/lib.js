'use strict';

const fs = require('fs');
const path = require('path');
const SwaggerParser = require('swagger-parser');

module.exports = (app, express) => {
  const api = require(`${process.cwd()}/config/swagger.json`);
  SwaggerParser.validate(api, () => {
    SwaggerParser.bundle(api, (err, schema) => {
      let revision = '';
      try {
        revision = '-' + fs.readFileSync(`${process.cwd()}/REVISION`, 'utf-8');
      } catch (e) {}
      schema.info.version = require(`${process.cwd()}/package.json`).version + revision;
      app.get('/api-docs', (req, res) => {
        res.send(schema);
      });
    });
  });
  const swaggerUIDirname = path.dirname(require.resolve('swagger-ui/package.json'));
  app.use('/docs', express.static(`${swaggerUIDirname}/dist`));
  let html = fs.readFileSync(`${swaggerUIDirname}/dist/index.html`, 'utf8');
  html = html.replace(/url = "(.*)"/, `url = window.location.protocol + '//' + window.location.host + '/api-docs'`);
  app.get('/docs', (req, res) => {
    res.send(html);
  });
};
