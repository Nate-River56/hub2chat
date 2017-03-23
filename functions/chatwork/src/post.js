import request from 'request';
import console from 'node-custom-console';

const cnsl = console('post');

exports.message = (apiToken, roomId, msg) => new Promise((resolve, reject) => {
  const options = {
    url: `https://api.chatwork.com/v2/rooms/${roomId}/messages`,
    method: 'POST',
    headers: {
      'X-ChatWorkToken': apiToken,
    },
    form: { body: msg },
    json: true,
  };

  request(options, (err, res, body) => {
    res.request.headers['X-ChatWorkToken'] = '';
    if (!err && res.statusCode === 200) {
      cnsl.info('Post Success!!');
      cnsl.info(body);
      resolve(res);
    } else {
      cnsl.log('Post Failed');
      cnsl.log(JSON.stringify(res, null, 2));
      cnsl.log(err);
      reject(err);
    }
  });
});

