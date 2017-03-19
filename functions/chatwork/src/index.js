import template from './builder.js';
import kms from './kms.js';
import cw from './post.js';

exports.handler = (event, context, callback) => {

  console.log('Received event:', JSON.stringify(event, null, 2));

  // Encrypted Chatwork token
  const enc_cwtoken = process.env.CHATWORK_API_TOKEN;

  // Original token
  const enc_token = process.env.TOKEN;

  // Chatwork Room ID from queryString
  const room_id = event.pathParameters.room_id;

  // Payload from GitHub
  const payload = event.requestParameters;


  kms.decrypt(enc_token).then((token)=>{
    return new Promise((resolve, reject)=>{
      if (token != event.queryStrings.token){
        reject("Authentication Failed.");
      }
      resolve(token);
    });
  }).then(()=>{
    return Promise.all([
      kms.decrypt(enc_cwtoken),
      new Promise((resolve, reject)=>{
        if(!room_id){
          resolve(room_id);
        }else{
          reject("room_id is blank.");
        }
      }),
      template.build(eventName, payload),
    ]);
  }).then((payload)=>{
    return cw.message(
      payload[0], // Raw Chatwork token
      payload[1], // Chatwork Room ID
      payload[2]
    );
  }).then((text)=>{
    callback(null, {"text": text});
    context.done();
  }).catch((reason)=>{
    console.log(reason);
    console.log("Not post to chatwork.");
    context.done();
  });

}
