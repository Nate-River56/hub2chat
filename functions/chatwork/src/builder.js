import fs from 'fs';
import handlebars from 'handlebars';
import console from 'node-custom-console';

const cnsl = console('builder');

exports.build = (eventName, payload) => new Promise((resolve, reject) => {
  let source;
  try {
    source = fs.readFileSync(
        `./templates/${eventName}.hbs`,
        'utf-8',
      );
  } catch (e) {
    cnsl.log('ReadFile Error.');
    reject(e);
  }
  const template = handlebars.compile(source);
  const message = template(payload);
  cnsl.info(message);
  resolve(message);
});
