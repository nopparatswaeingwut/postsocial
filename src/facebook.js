const FB = require('fb');

const ACCESS_TOKEN =  'EAAHexu6utcgBAFArey4DMpp5nQGZArcZCjBut5HXKqz0loZA94xQRwS4EZBKz6pfeZC9FBIec5jkr1Ww0WZCWD3qcWBCxcZCjVsVXv28TVgBqt7ujIrC29x9eEaJFOls6jkVZCaukMPbeWJlB5M6MxTLW82fOkehTZBs0vd8NcDgmtxW9Anijzy8fOEfRtzOPClamIsDZBsDCNROevhuXUZABUZA';

FB.setAccessToken(ACCESS_TOKEN);
FB.api(
 '/sentifly/feed',
 'POST',
 { "message": "Testing with api" },
 function (response) {
  if (response.error) {
   console.log('error occurred: ' + response.error)
   return;
  }
  console.log('successfully posted to page!');
 }
);