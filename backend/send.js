function send(res, code, body) {
  res.send({
    statusCode: code,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

module.exports = send;
