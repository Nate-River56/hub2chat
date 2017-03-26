import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import console from 'node-custom-console';
import denodeify from 'denodeify';

const readFile = denodeify(fs.readFile);
const cnsl = console('builder');

exports.build = (eventName, payload) => new Promise((resolve, reject) => {
  readFile(path.join(__dirname, `../templates/${eventName}.hbs`))
    .then(source => Promise.resolve(handlebars.compile(source)))
    .then(template => Promise.resolve(template(payload)))
    .then((message) => {
      cnsl.info(message);
      resolve(message);
    })
    .catch((err) => {
      reject(err);
    });
});
