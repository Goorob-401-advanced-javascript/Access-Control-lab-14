module.exports = (err,req,res,next)=>{
  res.status(500);
  res.statusMessage = 'Error!';
  res.json({error:err});
};

