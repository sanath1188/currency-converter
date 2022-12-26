const bodyParser = require("body-parser");
const compression = require("compression");
const cors = require('cors')
const express = require('express');
const passport = require('passport');

const PORT = 3000;

const expressSession = require('express-session')({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
});

const routes = require('./routes')

const app = express();
app.use(cors());
app.use(compression())
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});