
'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const basicAuth = require('./basic-auth-middleware.js');
const oauthMidd = require('./oauth-middleware.js');
const User = require('./user.js');
const bearerAuth = require('./bearer-auth-middleware');
const acl = require('./bearer-auth-middleware');
const dynamicRouter = require("./routes/v1.js") ;
const app = express();

app.use(express.json());
app.use(express.static('./public'));
app.use(dynamicRouter); 
app.post('/signup', (req, res , next) => {
  let user = new User(req.body);
  user.save()
    .then((user) => {
      let token = user.generateToken(user);
      res.status(200).send(token);
    }).catch(next);
});

app.post('/signin', basicAuth, (req, res , next) => {
  res.status(200).send(req.token);
});

// app.get('/users', basicAuth, (req, res) => {
//   res.status(200).json(users.list());
// });

app.get('/oauth',oauthMidd,oauth);

function oauth(req, res, next) {
  console.log('hello',req.body);
  res.json(req.token);
}
app.get('user' , bearerAuth ,(req , res) =>{
  res.status(200).json(req.token);
});


app.get('/allusers', bearerAuth, (req, res) => {
  res.status(200).send('OK!');
});

app.get('/create', bearerAuth, acl('create'), (req, res) => {
  res.status(200).send('create!');
});

app.get('/update', bearerAuth, acl('update'), (req, res) => {
  res.status(200).send('update!');
})

app.get('/delete', bearerAuth, acl('delete'), (req, res) => {
  res.status(200).send('delete!');
})
module.exports = {
  server: app,
  start: (port) => {
    app.listen(port, () => {
      console.log(`Server Up on ${port}`);
    });
  },
};





























