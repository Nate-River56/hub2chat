import fs from 'fs';
import path from 'path';
import _ from 'lodash';

export default class AGStub {
  constructor(jsonText) {
    this.hubEvent = JSON.parse(jsonText);
  }

  static getContext() {
    return Promise.resolve({
      invokeid: 'invokeid',
      done: () => {},
      succeed: () => {},
      fail: () => {},
    });
  }

  getEvent(eventName = 'push') {
    return this.constructor.getAGStub().then(AGEventBase => new Promise((resolve, reject) => {
      if (_.has(AGEventBase, 'requestParameters') && _.has(AGEventBase, 'headers["X-GitHub-Event"]')) {
        const AGEvent = AGEventBase;
        AGEvent.requestParameters = this.hubEvent;
        AGEvent.headers['X-GitHub-Event'] = eventName;
        resolve(AGEvent);
      } else {
        reject('Source does not have any key.');
      }
    }),
    );
  }

  static getAGStub() {
    const srcPath = path.join(__dirname, './api_gateway.json');
    return new Promise((resolve, reject) => {
      try {
        fs.readFile(srcPath, 'utf-8', (err, AGSource) => {
          if (err) {
            reject(err);
          }
          resolve(JSON.parse(AGSource));
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
