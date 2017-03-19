import fs from 'fs';
import handlebars from 'handlebars';

let build = (eventName, payload) =>{
  return Promise.denodeify(fs.readFile)
    .call(fs, './templates/' + eventName + '.hbs')
    .then((source)=>{
      return Promise.resolve(handlebars.compile(source))
    })
    .then((template)=>{
      const msg = template(payload);
      console.log(msg);
      return Promise.resolve(msg);
    });
}

export default build;
