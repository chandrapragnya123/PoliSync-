// routes/complaintRoutes.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Complaints route working');
});

module.exports = router;