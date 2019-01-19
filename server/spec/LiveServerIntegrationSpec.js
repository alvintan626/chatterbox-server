var request = require('request');
var expect = require('chai').expect;

describe('server', function() {
  it('should respond to GET requests for /classes/messages with a 200 status code', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('should send back parsable stringified JSON', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      expect(JSON.parse.bind(this, body)).to.not.throw();
      done();
    });
  });

  it('should send back an object', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      done();
    });
  });

  it('should send an object containing a `results` array', function(done) {
    request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
      var parsedBody = JSON.parse(body);
      expect(parsedBody).to.be.an('object');
      expect(parsedBody.results).to.be.an('array');
      done();
    });
  });

  it('should accept POST requests to /classes/messages', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });

  it('should respond with messages that were previously posted', function(done) {
    var requestParams = {method: 'POST',
      uri: 'http://127.0.0.1:3000/classes/messages',
      json: {
        username: 'Jono',
        text: 'Do my bidding!'}
    };

    request(requestParams, function(error, response, body) {
      // Now if we request the log, that message we posted should be there:
      request('http://127.0.0.1:3000/classes/messages', function(error, response, body) {
        var messages = JSON.parse(body).results;
        expect(messages[1].username).to.equal('Jono');
        expect(messages[1].text).to.equal('Do my bidding!');
        done();
      });
    });
  });

  it('Should 404 when asked for a nonexistent endpoint', function(done) {
    request('http://127.0.0.1:3000/arglebargle', function(error, response, body) {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });

  it('Should delete a message that is posted', function(done) {
      //first step: create the different requestParam variables we will need
      // we need: 1) post, 2) get, 3) delete, 4) get.
      var postRequest = {
        method: 'POST',
        uri: 'http://127.0.0.1:3000/classes/messages',
        json: {
          username: 'deletion test',
          text: 'i should not exist in the future :('
        }
      };
      var getRequest = { //reusable (confirmed)
        method: 'GET',
        uri: 'http://127.0.0.1:3000/classes/messages'
      };

      request(postRequest, function (error, response, body) { //post
        request(getRequest, function (error, response, body) { //get
          var messages = JSON.parse(body).results;
          var newMessageId = messages[messages.length-1].objectId; //for deletion
          //now we can create the delete params:
          var deleteRequest = {
            method: 'DELETE',
            uri: 'http://127.0.0.1:3000/classes/messages',
            json: newMessageId
          };
          request(deleteRequest, function (error,response,body) { //delete request
            request(getRequest, function (error, response, body) {
              var newMessages = JSON.parse(body).results;
              expect(messages.length > newMessages.length).to.equal(true);
              expect(messages.length).to.be.above(newMessages.length); 
              done();
            })
          })
        })
      })
  });

});
