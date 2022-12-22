require("dotenv").config()
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const service = google.youtube("v3");

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
const TOKEN_DIR = (process.env.YOUTUBE_CLIENT_ID || process.env.YOUTUBE_CLIENT_SECRET ||
    process.env.YOUTUBE_REDIRECT_URIS) + 'client_secret.json';
const TOKEN_PATH = TOKEN_DIR + 'client_oauth_token.json';

// Load client secrets from a local file.
fs.readFile('client_secret.json', function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the YouTube API.
  authorize(JSON.parse(content), getChannel);
});


function authorize(credentials, callback) {
  const clientSecret = credentials.web.client_secret;
  const clientId = credentials.web.client_id;
  const redirectUrl = credentials.web.redirect_uris[0];
  const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}


function getNewToken(oauth2Client, callback) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}


function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
    if (err) throw err;
    console.log('Token stored to ' + TOKEN_PATH);
  });
}


function getChannel(auth) {
  const service = google.youtube('v3');
  service.channels.list({
    
    auth: auth,
    part: 'snippet,contentDetails,statistics',
    forUsername: 'GoogleDevelopers'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    const channels = response.data.items;
    if (channels.length == 0) {
      console.log('No channel found.');
    } else {
      console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
                  'it has %s views.',
                  channels[0].id,
                  channels[0].snippet.title,
                  channels[0].statistics.viewCount);
    }
  });
}
function uploadVideo  (auth) {
  service.videos.insert(
      {  access_type: 'offline',
          auth: auth,
          part: 'snippet,contentDetails,status',
          resource: {
              // Video title and description
              snippet: {
                  title: 'ทดสอบชื่อวิดีโอ',
                  description: 'ทดสอบคำอธิบาย'
              },
              // I set to private for tests
              status: {
                  privacyStatus: 'private'
              }
          },

          // Create the readable stream to upload the video
          media: {
              body: fs.createReadStream('video/video56s.mp4') // Change here to your real video
          }
      },
      (error, data) => {
          if (error) {
              return (error);
          }
          console.log('https://www.youtube.com/watch?v=' + data.data.id);
          return (null, data.data.id);
      }
  );
};
