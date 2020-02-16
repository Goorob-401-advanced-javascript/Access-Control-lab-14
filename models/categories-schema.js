'use strict';
const mongoose = require('mongoose');
require('./products-schema.js');
const categories = mongoose.Schema({
  name: {type: String , require: true },

  type: { type : String , require: true },

},{toObject:{virtuals:true},toJSON:{virtuals:true}});
categories.virtual('products',{
  ref:'products',
  localField:'name',
  foreignField:'names',
  justOne:false,
});
categories.pre('findOne',function(){
  try{
    this.populate('products');
  }catch(e){
    console.error(e);

  }
});
module.exports = mongoose.model('categories' ,categories);
