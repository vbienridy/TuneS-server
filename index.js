var express = require('express')
var cors = require('cors');
var app = express()

//local
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


//remote
// app.use(cors({ credentials: true, origin: 'https://tune-s.herokuapp.com' }));


require('./routes/browseRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);