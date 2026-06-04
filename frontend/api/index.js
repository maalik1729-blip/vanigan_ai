import('../dist/server/server.js').then((m) => {
  module.exports = m.default || m;
});
