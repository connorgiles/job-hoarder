module.exports = (data) => (typeof data === 'string' ? JSON.parse(data) : data);
