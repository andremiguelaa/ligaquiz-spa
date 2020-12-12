require('dotenv').config({
  path: './.env',
})
const replace = require('replace-in-file');
const options = {
  files: './public/manifest.json',
  from: /%REACT_APP_NAME%/g,
  to: process.env.REACT_APP_NAME,
};
replace(options);