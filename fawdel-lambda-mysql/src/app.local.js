/* eslint-disable no-console */
const app = require('./app');
const port = process.env.port;
app.listen(port);
console.log(`listening on http://localhost:${port}`);