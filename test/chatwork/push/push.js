import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import AWStub from '../../utils/aws_stub';

const assert = require('assert');

describe('ES6 test of test in chatwork', () => {
  it('Sample: Add calculation', () => {
    const expect = 2;
    const actual = 1 + 1;

    assert(expect === actual);
  });

  it('push', () => {

    const source = fs.readFileSync(path.join(__dirname, './push_event.json'), 'utf-8');

    const stub = new AWStub(source);

    // stub.getEvent('push')
    //   .then((ctx) => {
    //     console.log(JSON.stringify(ctx, null, 2));
    //   }
    // );

  });


});

