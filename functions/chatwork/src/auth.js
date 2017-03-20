import crypto from 'crypto';

exports.verify = (input, key) => {
  return new Promise((resolve, reject)=>{
    let sha512 = crypto.createHash('sha512');
    sha512.update(input, 'utf-8');
    const hash = sha512.digest('hex');

    if(hash === key){
      resolve(input);
      console.log(hash);
    }else{
      reject({"error": "Authentication Failed"});
    }
  });
}
