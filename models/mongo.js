'use strict';
class Model {
  constructor(schema){
    this.schema = schema ;
  }

  jsonSchema(){
    console.log(typeof this.schema.jsonSchema); // what we going to work with here
    return typeof this.schema.jsonSchema ==='function'? this.schema.jsonSchema(): {} ;
  }
  get (_id){
    let queryObjest = _id ? {_id} :{} ;
    return this.schema.find(queryObjest); //find by id and if there's no match id it will find empty object returns an array of all of your data ,
  }
  create(record){
    let newRecord = new this.schema(record);
    return newRecord.save(); // we don't need to add Promise.resolve or reject because here mongoose natively gives this back as promise
  }
  updata (_id , record){
    return this.schema.findByIdUpdate(_id , record , {new : true });
  }
  delete(_id){
    return this.schema.findByIdDelete(_id);
  }
}
module.exports= Model ;
