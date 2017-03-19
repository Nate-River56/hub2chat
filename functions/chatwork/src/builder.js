import fs from 'fs';
import handlebars from 'handlebars';

exports.build = (eventName, payload) =>{
  const source = fs.readFileSync(
    './templates/' + eventName +'.hbs',
    'utf-8'
  );
  console.log(source);

  const template = handlebars.compile(source);

  const message = template(payload);
  console.log(message);

  return message;
}
