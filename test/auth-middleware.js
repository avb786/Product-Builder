const expect = require('chai').expect;
const jwt = require("jsonwebtoken")
const authMiddleware = require('../middleware/is-auth');
const sinon = require('sinon');

describe('Auth middleware', function() {
  it('should throw an error if no authorization header is present', function() {
    const req = {
      get: function(headerName) {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if the authorization header is only one string', function() {
    const req = {
      get: function(headerName) {
        return 'xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('Should yield a userId after decoding the token', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer hjfhdkfjs';
      }
    };
    sinon.stub(jwt, 'verify')
    jwt.verify.returns({ userId: 'fhdj' })
    authMiddleware(req, {}, () =>{})
    expect(req).to.have.property('userId');
    jwt.verify.restore()
  })

  it('should throw Error if token cannot be verified', function() {
    const req = {
      get: function(headerName) {
        return 'Bearer xvy';
      }
    }
    expect(authMiddleware.bind(this, req, {}, () =>{})).to.throw();
  })


});
