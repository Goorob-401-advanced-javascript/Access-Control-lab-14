'use strict';
const mongoose = require('mongoose');
require('./categories-schema.js');
const products = mongoose.Schema({
  name: {type: String , require: true },

  price: { type : Number, require: true },
},{toObject:{virtuals:true},toJSON:{virtuals:true}});
products.virtual(' categories',{
  ref:'categories',
  localField:'names',
  foreignField:'name',
  justOne:false,
});
products.pre('findOne',function(){
  try{
    this.populate(' categories');
  } catch(e){
    console.error(e);
  }
});
module.exports = mongoose.model('products' ,products);
