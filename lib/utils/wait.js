/**
 * Promise-ified setTimeout
 */
module.exports = timeout =>
  new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
