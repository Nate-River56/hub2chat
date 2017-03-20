let template = require('./builder.js');
let kms = require('./kms.js');
let cw = require('./post.js');

exports.handler = (event, context, callback) => {

  console.log('Received event:', JSON.stringify(event, null, 2));

  // try {
  //   var config = require('./.env.json')
  //   for (var key in config) {
  //     process.env[key] = config[key]
  //   }
  // } catch (err) {
  //   // ignore
  // }

  // Encrypted Chatwork token
  const enc_cwtoken = process.env.CHATWORK_API_TOKEN;

  // Chatwork Room ID from queryString
  const room_id = event.pathParameters['room_id'];

  // Payload from GitHub
  const payload = event.requestParameters;

  // GitHub Event Name
  const eventName = event.headers['X-GitHub-Event'];

  Promise.all([
    kms.decrypt(enc_cwtoken),
    new Promise((resolve, reject)=>{
      if(room_id != ''){
        resolve(room_id);
      }else{
        reject("room_id is blank.");
      }
    }),
    template.build(eventName, payload)
  ]).then((payload)=>{
    return cw.message(
      payload[0], // Raw Chatwork token
      payload[1], // Chatwork Room ID
      payload[2]
    );
  }).then((text)=>{
    callback(null, {"text": text});
    context.succeed();
  }).catch((reason)=>{
    console.log(reason);
    console.log("Not post to chatwork.");
    context.fail();
  });

}
