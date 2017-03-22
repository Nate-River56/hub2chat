import template from './builder.js';
import kms from './kms.js';
import cw from './post.js';
import auth from './auth.js';

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Encrypted Chatwork token
  const enc_cwtoken = process.env.CHATWORK_API_TOKEN || '';

  // Chatwork Room ID from queryString
  const room_id = event.pathParameters.room_id || '';

  // Payload from GitHub
  const payload = event.requestParameters;

  // GitHub Event Name
  const eventName = event.headers['X-GitHub-Event'] || event.headers['x-github-event'] || '';

  // Original API token
  const token = event.queryParameters.token || '';

  // API token key
  const token_key = process.env.API_TOKEN || '';

  auth.verify(token, token_key).then(() => Promise.all([
    kms.decrypt(enc_cwtoken),
    new Promise((resolve, reject) => {
      if (room_id != '') {
        resolve(room_id);
      } else {
        reject('room_id is blank.');
      }
    }),
    template.build(eventName, payload),
  ]))
  .then(payload => cw.message(
      payload[0], // Raw Chatwork token
      payload[1], // Chatwork Room ID
      payload[2],  // Chatwork message body
    ))
  .then((res) => {
    context.succeed(res);
  })
  .catch((reason) => {
    console.log(reason);
    console.log('Not post to chatwork.');
    context.fail(reason);
  });
};
