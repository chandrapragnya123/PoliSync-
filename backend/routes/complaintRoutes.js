// routes/complaintRoutes.js

//This line imports the Express framework, which is used to create and manage 
// routes in a Node.js application.
const express = require('express'); 

// This creates a new router object using Express. The router will hold all the routes related to complaints. 
// Think of it like a mini app inside your main app specifically for complaints.
const router = express.Router();

//This sets up a GET route for the base path / of this router. When a user accesses /complaints
//  (assuming this file is mounted on /complaints), this function will run.
//req is the request object.res is the response object.
router.get('/', (req, res) => {
  res.send('Complaints route working'); //This sends a plain text response saying "Complaints route working" to the client when they hit the route.
});
//This exports the router so it can be used in another file 
// (typically in your main app file like server.js or app.js where you mount it using something like app.use('/complaints', complaintRoutes)).

module.exports = router;