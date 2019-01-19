/*************************************************************
You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.
**************************************************************/

//Store our message data below, and start with a dummy message
var postData = {
  results: [{
    username: "serverdefault",
    text: "serverDefault",
    createdAt: new Date(),
    objectId: 0
  }]
};

/* 
 * objectId is a unique identified for each item added via post
 * Note: the objectId starts at 1, because we had to add a dummy initial message above
 *  for chattbox to work properly (it required a non-empty response in order to initialize)
 */

var objectId = 1;

var requestHandler = function(request, response) {
  //log the request type to the Node console
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var headers = defaultCorsHeaders;

  //URLs are required to contain /classes/messages, else return statuscode 404;
  if (request.url !== '/classes/messages') {
    var statusCode = 404; //file not found
    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone
    response.end();
  } else if (request.method === "GET") {
    // console.log("get method received");
    var statusCode = 200; //200 means successful
    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone

    response.end(JSON.stringify(postData));  //Response.end will send the data inside () back to the client
    
  } else if (request.method === "POST") {
    // The below link is useful for understanding POST
    //  https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/

    var body = '';
    request.on('data', (data) => {
      body += data;
      let formattedData = JSON.parse(body);
      formattedData.createdAt = new Date();
      formattedData.objectId = objectId; //if we have duplicate text, it wont store
      objectId++;

      postData.results.push(formattedData); //store the message
      //console.log('postData after POST call'+JSON.stringify(postData.results));
    });

  
    var statusCode = 201; //201 means successful creation

    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone
    response.end();

  } else if (request.method === "OPTIONS"){
    var statusCode = 200; //200 means OK
    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone
    response.end();
  } else if (request.method === "DELETE"){
    var statusCode = 200; //OK/success

    var body = '';
    request.on('data', (data) => {
      body += data;
      let removalId = JSON.parse(body);

      for (let i = 0; i < postData.results.length; i++) {
        if (postData.results[i].objectId === removalId) { //check to see if this is the right unique objectId
          let itemRemoved = postData.results.splice(i,1);
        }
      }

    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone
    response.end();
  });


  }
  
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;