require('dotenv').config();

const request = require('request');
const fs = require('fs');
const path = require('path');
const process = require('process');
const commitHash = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

fs.readdir('./dist/', function(err,files) {
  if(err) {
    console.error( "Could not list the directory.", err );
    process.exit( 1 );
  }
  files.forEach(function(file,index) {
    if(file.endsWith('.js') && fs.existsSync(`./dist/${file}.map`)){
      sendFile(file);
      cleanUpMapFile(file);
    }
  });
});

const sendFile = function(file){
  request({
    url: 'https://api.rollbar.com/api/1/sourcemap',
    headers: {
      'content-type': 'multipart/form-data'
    },
    method: 'POST',
    multipart: [
      {
        'Content-Disposition': 'form-data; name="access_token"',
        body: process.env.ROLLBAR_WRITE_ACCESS_TOKEN
      },
      {
        'Content-Disposition': 'form-data; name="version"',
        // The version number cannot contain any whitespace or it will break
        body: commitHash.trim()
      },
      {
        'Content-Disposition': 'form-data; name="minified_url"',
        body: `${process.env.MAIN_APP_URL}/${file}`
      },
      {
        'Content-Disposition': `form-data; name="source_map"; filename="${file}.map"`,
        body: fs.readFileSync(`./dist/${file}.map`)
      }
    ]
  }, function(err, response, body) { if(err){ console.log('Could not send file', err) } else { console.log(body) } });
}

const cleanUpMapFile = function(file) {
  fs.unlink(`./dist/${file}.map`, function(err) {
    if(err && err.code == 'ENOENT') {
        console.info("File doesn't exist, won't remove it.");
    } else if (err) {
        console.error("Error occurred while trying to remove file");
    } else {
        console.info("Removed map file");
    }
});
}
