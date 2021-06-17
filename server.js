const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const port = process.env.PORT || 3000;

const DB = process.env.MONGO_CONNECTION.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
process.on('uncaughtException', (err) => {
  server.close(() => {
    process.exit(1);
  });
});

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('DB connection ');
  });

const server = app.listen(port, () => {
  console.log('app running on port ' + port);
});

process.on('unhandledRejection', (err) => {
  server.close(() => {
    process.exit(1);
  });
});
