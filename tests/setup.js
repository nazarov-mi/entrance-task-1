
const tester = require('graphql-tester').tester;
const url = 'http://127.0.0.1:3000/graphql';

beforeAll(() => {
  global.testgq = (query, variables = null, options = {}) => tester({
    url,
    contentType: 'application/json'
  })(
    JSON.stringify({
      query,
      variables
    }), 
    Object.assign({}, options, {
      jar: true
    })
  );
});
