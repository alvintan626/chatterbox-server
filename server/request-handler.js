/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var qs = require('querystring'); //this allows us to parse the data (look it up later!!)

var postData = {
  results: [{
    username: "serverdefault",
    text: "serverDefault",
    createdAt: new Date(),
    objectId: 0
  }]
};

var objectId = 1;

var requestHandler = function(request, response) {
  /* ultimate goals:
    1. send a GET command from the client to request & return all of the messages store on the server
    2. send a PUT command from the client to request that a message is stored on the Server
    3. optionS????????
  */
  
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  //if URL does NOT contain /classes/messages, we need to return statuscode 404;
  if (request.url !== '/classes/messages') {
    //return 404
    // console.log('url mismatch');

    var statusCode = 404; //file not found
    var headers = defaultCorsHeaders; //CORS stuff

    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone
    response.end();
  } else if (request.method === "GET") {
    // console.log("get method received");
    var statusCode = 200; //200 means successful
    var headers = defaultCorsHeaders; //CORS stuff
    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone


    response.end(JSON.stringify(postData));  //Response.end will send the data inside () back to the client
    
  } else if (request.method === "POST") {
    //console.log(request);
    // 1. determine if post or get (we are at post):
    // 2. store the data inside of the request inside of an object (do we have one?? maybe)
    // 3. Send a success status message (201)

    // console.log("POST method received");

    //https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
    //hint: look up query string
    //https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
    console.log('postData before POST call: '+JSON.stringify(postData.results));

    
    var body = '';
    request.on('data', (data) => {
      body += data;
      let formattedData = JSON.parse(body);
      formattedData.createdAt = new Date();
      formattedData.objectId = objectId; //if we have duplicate text, it wont store
      objectId++;

      postData.results.push(formattedData); //store the message
      console.log('postData after POST call'+JSON.stringify(postData.results));
    });

  
    var statusCode = 201; //201 means successful creation
    var headers = defaultCorsHeaders; //CORS stuff

    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone
    response.end();

  }
  else if (request.method === "OPTIONS"){
    var statusCode = 200; //200 means OK
    var headers = defaultCorsHeaders; //CORS stuff

    headers['Content-Type'] = 'application/json';    // Tells the client what type of data we're sending
    response.writeHead(statusCode, headers); //writeHead fills out the headers of the respone
    response.end();
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

/*
1. We get the data
2. We store the data on a string
3. we parse the data using qs.parse()
4. the result looks like:
{ '{"username":"Jono","text":"Do my bidding!"}': '' }

*/
