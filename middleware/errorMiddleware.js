const errorHandler = (err, req, res, next) => {
  //statusCode =node eq to express status() but ths won't work since it is already set
  //set code sent as default 200 ok (for errors sent with 200 success code default but this is not err code) to error code
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  //if no errors sent from routes/middleware/ give it 400/bad req
  res.status(statusCode ? statusCode : 400);

  if (process.env.NODE_ENV === "production") {
    res.send({ Error: err.message });
  } else {
    res.send({ Error: err.message });
  }
};
//404
export const notFound = (req, res, next) => {
  res.status(404);
  console.log(req)
  res.send(`Not Found - ${req.url}`);
};

export default errorHandler;
