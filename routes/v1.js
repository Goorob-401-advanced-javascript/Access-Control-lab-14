'use strict';

const express = require('express');
const router = express.Router();
const transporterAuth = require('./bearer-auth-middleware.js');
const protector = require('./acl.js');
const categories = require('../models/categories-model.js');
const products = require('../models/products-model.js');


function getModel(req , res , next){

  let model = req.params.model ;
  switch(model){
  case 'categories':
    req.model = categories ;
    next();
    return;
  case 'products':
    req.model = products;
    next();
    return ;
  default:
    next('invalid model');
    return;
  }
}

router.param('model' , getModel);

router.get('/api/v1/:model',getHandler);

router.get('/api/v1/:model/:_id',getHandlerId);

router.post('/api/v1/:model',postHandler);

router.put('/api/v1/:model/:_id',updateHandler);

router.delete('/api/v1/:model/:_id',deleteHandler);


function getHandler(req , res , next){

  req.model.get()
    .then(data => {
      res.status(200).json(data);
    }).catch(next);
}


function getHandlerId(req , res , next){
  let id = req.params._id ;
  req.model.get(id)
    .then(record => {
      res.status(200).json(record);
    }).catch(next);
}


function postHandler(req , res , next){
  let value = req.body ;
  req.model.create(value)
    .then(record => {
      res.status(201).json(record);
    })
    .catch(next);
}

function updateHandler(req , res , next){

  let value = req.body ;
  let id = req.params._id ;
  req.model.update(id , value)
    .then(record => {
      res.status(201).json(record);
    });
}


function deleteHandler(req , res , next){
  let id = req.params._id ;
  req.model.delete(id)
    .then(record => {
      res.status(200).json(record);
    });
}

module.exports= router ;
