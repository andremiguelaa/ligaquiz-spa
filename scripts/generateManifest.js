require('dotenv').config({
  path: './.env',
});
const replace = require('replace-in-file');

replace({
  files: './public/manifest.json',
  from: [/%REACT_APP_NAME%/g, /%REACT_APP_SLUG%/g, /%REACT_APP_COLOR%/g],
  to: [process.env.REACT_APP_NAME, process.env.REACT_APP_SLUG, process.env.REACT_APP_COLOR],
});

replace({
  files: './public/browserconfig.xml',
  from: [/%REACT_APP_SLUG%/g, /%REACT_APP_COLOR%/g],
  to: [process.env.REACT_APP_SLUG, process.env.REACT_APP_COLOR],
});
