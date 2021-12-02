const genAccessToken = (p) => {
  var token = "";
  var psblChar =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < p; i++)
    token += psblChar.charAt(Math.floor(Math.random() * psblChar.length));

  return token;
};

module.exports = genAccessToken;
