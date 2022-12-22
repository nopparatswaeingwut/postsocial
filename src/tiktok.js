// const myHeaders = new Headers();
// myHeaders.append("Authorization", "Bearer 29f2fe07bfecb635ccc7cec6f37d7e69");

// const raw = JSON.stringify({
//   "post": "Today is a great day!",
//   "platforms": [
//     "tiktok"
//   ],
//   "mediaUrls": [
//     "https://images.ayrshare.com/imgs/test-video.mp4"
//   ]
// });

// const requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("https://app.ayrshare.com/api/post", requestOptions)
//   .then(response => response.text())
//   .then(result => console.log(result))
//   .catch(error => console.log('error', error));


//Get the tags of the top trending videos:
const tiktok = require('tiktok-app-api');

let tiktokApp= await tiktok({
  signatureService: 'http://localhost:8080/api/sign',
});
(async () => {
  tiktokApp = await tiktok();
})

();
const options = {
  cursor: '0',
  count: 30,
};
// usage examples:
const trendingIterator = tiktokApp.getTrendingVideos(options);
const uploadedIterator = tiktokApp.getUploadedVideos(user, options);
const likedIterator = tiktokApp.getLikedVideos(user, options);
const iterator = tiktokApp.getTrendingVideos();
const videosResult = await iterator.next();
const trendingVideos = videosResult.value;

console.log(trendingVideos);