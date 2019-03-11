var express = require('express')
var cors = require('cors');
var app = express()
app.use(express.json())    // <==== parse request body as JSON
//local
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));


//remote
// app.use(cors({ credentials: true, origin: 'https://tune-s.herokuapp.com' }));


require('./routes/browseRoutes')(app);
require('./models/db')(app);

const PORT = process.env.PORT || 5010;
app.listen(PORT);