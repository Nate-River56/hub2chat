import request from 'request';

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
    if (!err && res.statusCode == 200) {
      console.log('Post Success!!');
      console.log(body);
      resolve(res);
    } else {
      console.log('Post Failed');
      console.log(JSON.stringify(res, null, 2));
      console.log(err);
      reject(err);
    }
  });
});

