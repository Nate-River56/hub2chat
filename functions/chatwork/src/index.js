import template from './builder.js';
import kms from './kms.js';
import cw from './post.js';
import auth from './auth.js';

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  // Encrypted Chatwork token
  const encCwtoken = process.env.CHATWORK_API_TOKEN || '';

  // Chatwork Room ID from queryString
  const roomId = event.pathParameters.room_id || '';

  // Payload from GitHub
  const payload = event.requestParameters;

  // GitHub Event Name
  const eventName = event.headers['X-GitHub-Event'] || event.headers['x-github-event'] || '';

  // Original API token
  const token = event.queryParameters.token || '';

  // API token key
  const tokenKey = process.env.API_TOKEN || '';

  auth.verify(token, tokenKey).then(() => Promise.all([
    kms.decrypt(encCwtoken),
    new Promise((resolve, reject) => {
      if (roomId != '') {
        resolve(roomId);
      } else {
        reject('roomId is blank.');
      }
    }),
    template.build(eventName, payload),
  ]))
  .then(payload => cw.message(
      payload[0], // Raw Chatwork token
      payload[1], // Chatwork Room ID
      payload[2], // Chatwork message body
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
