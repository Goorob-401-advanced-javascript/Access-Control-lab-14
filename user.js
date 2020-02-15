
'use strict';
const mongoose =require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let SECRET = 'afterAllThisTime';

// let db = {};
// let users = {};
const users = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true } ,
  role: { type: String, required: true, default: 'user', enum: ['editor', 'user', 'admin'] },
});
// hashing password  without using mongodb
// users.save = async function (record) {

//   if (!db[record.username]) {
//     record.password = await bcrypt.hashSync(record.password, 5);

//     db[record.username] = record;
//     return record;
//   }

//   return Promise.reject();
// }
// with mongodb
// eslint-disable-next-line no-use-before-define
users.pre('save', async function(){
  if (!users.username) {
    this.password = await bcrypt.hash(this.password, 5);
  }
});
// compare  password  without using mongodb
// users.authenticateBasic = async function(user,pass) {
//   let valid = await bcrypt.compare(pass, db[user].password);
//   return valid ? db[user] : Promise.reject();
// }
// compare  password after using mongodb

users.statics.authenticateBasic = async function(username , password){
  let userName = { username };
  return this.findOne(userName)
    .then(user => user && user.comparePass(password))
    .catch(error => { throw error; });
} ;
users.methods.comparePass = function (password) {
  return bcrypt.compare(password, this.password)
    .then(valid => valid ? this : null);
};
//  generateToken after using mongodb and having _id
users.methods.signupTokenGenerator = function (user) {
  let token = {
    id: user._id,
    username: user.username,
    password: user.password,
    role: user.role,
  };
  return jwt.sign(token, SECRET);
};
users.statics.signinTokenGenerator = function (user) {
  let token = {
    id: user._id,
    username: user.username,
    password: user.password,
    role: user.role,
  };
  return jwt.sign(token, SECRET);
};
users.authenticateToken = async function (token) { // compare
  try {
    let tokenObject = jwt.verify(token, SECRET);
    if (tokenObject.username) {
      return Promise.resolve(tokenObject.username);
    } else {
      return Promise.reject();
    }
  } catch (e) {
    return Promise.reject();
  }
}
users.statics.capabilitiesChecker = (ability, role) => {
  let admin = ['read', 'create', 'update', 'delete'];
  let editor = ['read', 'create', 'update'];
  let user = ['read'];
  if (role === 'admin') {
    for (let i = 0; i < admin.length; i++) {
      if (admin[i]) {
        return true;
      }
    }
  }
  if (role === 'user') {
    for (let i = 0; i < user.length; i++) {
      if (user[i]) {
        return true;
      }
    }
  }
  if (role === 'editor') {
    for (let i = 0; i < editor.length; i++) {
      if (editor[i]) {
        return true;
      }
    }
  }
};

module.exports = mongoose.model('users', users);



