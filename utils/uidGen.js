const uidGen = () => {
  const uid = new Date().getTime() * Math.floor(Math.random() * 10000);
  return uid;
};

module.exports = uidGen;
