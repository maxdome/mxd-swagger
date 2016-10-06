'use strict';

const fs = require('fs');
const path = require('path');
const SwaggerParser = require('swagger-parser');

module.exports = (app, express, opts) => {
  opts = opts || {};
  opts.fileformat = opts.fileformat || 'json';
  opts.version = opts.version || 'v1';
  opts.filename = opts.filename || opts.version;
  const api = require(`${process.cwd()}/config/swagger/${opts.filename}.${opts.fileformat}`);
  SwaggerParser.validate(api, () => {
    SwaggerParser.bundle(api, (err, schema) => {
      let revision = '';
      try {
        revision = '-' + fs.readFileSync(`${process.cwd()}/REVISION`, 'utf-8');
      } catch (e) {}
      schema.info.version = require(`${process.cwd()}/package.json`).version + revision;
      app.get('/api-docs', (req, res) => {
        res.redirect('/api-docs/' + opts.version);
      });
      app.get('/api-docs/' + opts.version, (req, res) => {
        res.send(schema);
      });
    });
  });
  app.get('/docs', (req, res) => {
    res.redirect('/docs/' + opts.version);
  });
  const swaggerUIDirname = path.dirname(require.resolve('swagger-ui/package.json'));
  let html = fs.readFileSync(`${swaggerUIDirname}/dist/index.html`, 'utf8');
  html = html.replace(/url = "(.*)"/, `url = window.location.protocol + '//' + window.location.host + '/api-docs/${opts.version}'`);
  app.get('/docs/' + opts.version, (req, res) => {
    res.send(html);
  });
  app.use('/docs/' + opts.version, express.static(`${swaggerUIDirname}/dist`));
};
