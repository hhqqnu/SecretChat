var Result = function(data,error){
  this.data = data;
  this.error = error;
}

module.exports = function(data,error){
  return new Result(data,error);
}
