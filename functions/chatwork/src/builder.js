import fs from 'fs';
import handlebars from 'handlebars';

exports.build = (eventName, payload) =>{
  return new Promise((resolve, reject)=>{
    try {
      const source = fs.readFileSync(
        './templates/' + eventName +'.hbs',
        'utf-8'
      );
    }catch(e){
      console.log("ReadFile Error.");
      reject(e);
    }
    const template = handlebars.compile(source);
    const message = template(payload);

    resolve(message);
  });
}
