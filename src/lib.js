'use strict';

const fs = require('fs');
const SwaggerParser = require('swagger-parser');

module.exports = (app, express, version) => {
  version = version || 'v1';
  const api = require(`${process.cwd()}/config/swagger/${version}.json`);
  SwaggerParser.validate(api, () => {
    SwaggerParser.bundle(api, (err, schema) => {
      let revision = '';
      try {
        revision = '-' + fs.readFileSync(`${process.cwd()}/REVISION`, 'utf-8');
      } catch (e) {}
      schema.info.version = require(`${process.cwd()}/package.json`).version + revision;
      app.get('/api-docs', (req, res) => {
        res.send(schema)
      });
    });
  });
  app.get('/docs', (req, res) => {
    res.redirect('/docs/' + version);
  });
  let html = fs.readFileSync(`${__dirname}/../node_modules/swagger-ui/dist/index.html`, 'utf8');
  html = html.replace(/url = "(.*)"/, 'url = window.location.protocol + "//" + window.location.host + "/api-docs"');
  app.get('/docs/' + version, (req, res) => {
    res.send(html);
  });
  app.use('/docs/' + version, express.static(`${__dirname}/../node_modules/swagger-ui/dist`));
};
