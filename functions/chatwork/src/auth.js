import crypto from 'crypto';

exports.verify = (input, key) => new Promise((resolve, reject) => {
  const sha512 = crypto.createHash('sha512');
  sha512.update(input, 'utf-8');
  const hash = sha512.digest('hex');

  if (hash === key) {
    resolve(input);
  } else {
    reject({ error: 'Authentication Failed' });
  }
});
