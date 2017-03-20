let template = require('./builder.js');
let kms = require('./kms.js');
let cw = require('./post.js');

exports.handler = (event, context, callback) => {

  console.log('Received event:', JSON.stringify(event, null, 2));

  // Encrypted Chatwork token
  const enc_cwtoken = process.env.CHATWORK_API_TOKEN;

  // Chatwork Room ID from queryString
  const room_id = event.pathParameters['room_id'] || '';

  // Payload from GitHub
  const payload = event.requestParameters;

  // GitHub Event Name
  const eventName = event.headers['X-GitHub-Event'] || event.headers['x-github-event'];

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
      payload[2]  // Chatwork message body
    );
  }).then((res)=>{
    context.succeed(res);
  }).catch((reason)=>{
    console.log(reason);
    console.log("Not post to chatwork.");
    context.fail(reason);
  });

}
