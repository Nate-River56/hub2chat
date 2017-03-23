import console from 'node-custom-console';
import template from './builder';
import kms from './kms';
import cw from './post';
import auth from './auth';

const cnsl = console('index');

exports.handler = (event, context) => {
  cnsl.info('Received event:', JSON.stringify(event, null, 2));

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
      if (roomId !== '') {
        resolve(roomId);
      } else {
        reject('roomId is blank.');
      }
    }),
    template.build(eventName, payload),
  ]))
  .then(values => cw.message(
      values[0], // Raw Chatwork token
      values[1], // Chatwork Room ID
      values[2], // Chatwork message body
    ))
  .then((res) => {
    context.succeed(res);
  })
  .catch((reason) => {
    cnsl.log(reason);
    cnsl.log('Not post to chatwork.');
    context.fail(reason);
  });
};
