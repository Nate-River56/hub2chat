import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import console from 'node-custom-console';

const cnsl = console('builder');


exports.build = (eventName, payload) => new Promise((resolve, reject) => {
  try {
    fs.readFile(
      path.join(__dirname, `../templates/${eventName}.hbs`),
      'utf-8',
      (err, source) => {
        if (err) {
          reject(err);
        } else {
          const template = handlebars.compile(source);
          const message = template(payload);
          cnsl.info(message);
          resolve(message);
        }
      },
    );
  } catch (e) {
    reject(e);
  }
});
