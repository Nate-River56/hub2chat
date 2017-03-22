import aws from 'aws-sdk';

exports.decrypt = encToken => new Promise((resolve, reject) => {
  const kms = new aws.KMS();
  kms.decrypt({ CiphertextBlob: new Buffer(encToken, 'base64') }, (err, data) => {
    if (err) {
      console.log('KMS decryption error.');
      reject(err);
    }
    // Return decrypted token
    resolve(data.Plaintext.toString('ascii'));
  });
});

