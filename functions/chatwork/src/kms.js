import aws from 'aws-sdk';

export default class Kms {

  constructor(){
    this.kms = new aws.KMS();
  }

  decrypt(enc_token){
    return new Promise((resolve, reject) => {
      this.kms.decrypt({CiphertextBlob: new Buffer(enc_token, 'base64')}, (err, data) => {
        if(err){
            console.log("Decrypt error.");
            reject(err);
        }
        // Return decrypted token
        resolve(data.Plaintext.toString('ascii'));
      })
    });
  }

}

