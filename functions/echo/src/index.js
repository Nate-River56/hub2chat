import console from 'node-custom-console';

const cnsl = console('echo');

export default (event, context, callback) => {
  cnsl.log('Received event:', JSON.stringify(event, null, 2));
  callback(null, event, () => {
    context.done();
  });
};

