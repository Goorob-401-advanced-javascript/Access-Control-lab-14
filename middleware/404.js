module.exports = (req,res,next)=>{
  res.status(404);
  res.statusMessage = 'Not Found';
  res.json({erorr:'Not Found'});
};
