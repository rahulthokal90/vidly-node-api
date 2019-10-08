const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const schedule = require('node-schedule');
 
const app = express();
console.log('Hello');

// Connect Database
connectDB();

var j = schedule.scheduleJob('1 * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors());
// Define Routes
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
  app.use('/api/users', require('./routes/api/users'));
  app.use('/api/modules', require('./routes/api/table'));
  app.use('/api/profile', require('./routes/api/profile'));
  app.use('/api/posts', require('./routes/api/posts'));
  app.use('/api/exam', require('./routes/api/exam'));
 //app.use('/api/genres', require('./routes/api/genre'));



// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
