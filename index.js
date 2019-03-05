var express = require('express')
var cors = require('cors');
var app = express()

app.use(cors());

require('./routes/browseRoutes')(app);

const PORT = process.env.PORT || 8050;
app.listen(PORT);