import aws from 'aws-sdk';

let decrypt = (enc_token)=>{
  
  const kms = new aws.KMS();

  return new Promise((resolve, reject) => {
    kms.decrypt({CiphertextBlob: new Buffer(enc_token, 'base64')}, (err, data) => {
      if(err){
          console.log("Decrypt error.");
          reject(err);
      }
      // Return decrypted token
      resolve(data.Plaintext.toString('ascii'));
    })
  });
}

export default decrypt;

