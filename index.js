require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const { IgApiClient } = require("instagram-private-api");
const { get } = require("request-promise");
const CronJob = require("cron").CronJob;
const fs = require("fs");
const { promisify } = require("util");
const readFileAsync = promisify(fs.readFile);
const ig = new IgApiClient();


async function login() {
  ig.state.generateDevice(process.env.IG_USERNAME);
  await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
}



// function fakeSave(data: id ) {

//   return '';
// }

// function fakeExists() {
//   return false;
// }

// function fakeLoad() {
//   return 'fakeLoad';
// }

// (async () => {

//   ig.request.end$.subscribe(async () => {
//     const serialized = await ig.state.serialize();
//     delete serialized.constants;
//     fakeSave(serialized);
//   });
//   if (fakeExists()) {
//     await ig.state.deserialize(fakeLoad());
//   }
//   await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
// })();

// x=1 Post Photo
// x=2 post Video



//************** post photo *************
// x = 2;
// if (x == 1) {
//   const postToInsta = async () => {
//     login();
//     const ig = new IgApiClient();
//     console.log("Login succeed");
//     console.log("Post photo succeed");
//     const imageBuffer = await get({
//       url: "https://cdn.pixabay.com/photo/2022/02/06/15/58/squirrel-6997505_960_720.jpg",
//       encoding: null,
//     });
//     await ig.publish.photo({
//       file: imageBuffer,
//       caption: "Test post instagram #post #test #photo",
//     });
//   };

//   console.log(postToInsta);
//   postToInsta();
// } else {
//  login();
//   //post Video
//   (async () => {
//     console.log("Login succeed");

//     const videoPath = "C:/Users/DELL/Desktop/instagram/video/Video1m.mp4";
//     // const coverPath = "C:/Users/DELL/Desktop/instagram/image/JPG.jpg";
//     const coverPath = "C:/Users/DELL/Desktop/instagram/image/PNG.png";

//     const publishResult = await ig.publish.video({
//       video: await readFileAsync(videoPath),
//       coverImage: await readFileAsync(coverPath),
//       caption: "Test post video 1 minute instagram ",
//     });

//     console.log(publishResult);
//     console.log("Post video succeed");
//   })();
// }


//************** show information *************
test = async () => {
  await login();
  const userID = await ig.user.getIdByUsername('test_work_post');
  const userInfo = await ig.user.info(userID);
  console.log("Show information");
  console.log(userInfo.follower_count);

console.log("test");
}
test();


// (async () => {
//   console.log("Test show information ");
  

//   console.log(showdata);

// })();

//************** แสดงข้อมูลของผู้ติดตามแต่ละคนทั้งหมด**************
// (async () => {
//   const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
//   const followersFeed = ig.feed.accountFollowers(auth.pk);
//   const wholeResponse = await followersFeed.request();
//   console.log(wholeResponse); 
//   const items = await followersFeed.items();
//   console.log(items); 
//   const thirdPageItems = await followersFeed.items();
 
//   console.log(thirdPageItems); 
//   const feedState = followersFeed.serialize(); 
//   console.log(feedState);
//   followersFeed.deserialize(feedState);
//   const fourthPageItems = await followersFeed.items();
//   console.log(fourthPageItems);

//   followersFeed.items$.subscribe(
//     followers => console.log(followers),
//     error => console.error(error),
//     () => console.log('Complete!'),
//   );
// })();

// set time post

// const cronInsta = new CronJob("30 5 * * *", async () => {
//     postToInsta();
// });
// cronInsta.start();

//************** test get like ****************

// const bluebird = require('bluebird')

// const { IG_USERNAME, IG_PASSWORD } = process.env

// const hashtags = [
//   'post ',
//   'test ',
//   'photo',
// ]

// function isContainHashtags(post) {
//   const { caption: { text } } = post
//   let result = false
//   hashtags.forEach((hashtag) => {
//     if (text.includes(`#${hashtag}`)) result = true
//   })
//   return result
// }

// function saveUser(user) {
//   //  save user to db or another place
// }

// async function postHandler(post) {
//   const fullUser = ig.user.info(post.user.pk)
//   const userFeed = ig.feed.user(post.user.pk)
//   await bluebird.delay(2000)
//   const userPosts = await userFeed.items()

//   let relevantPostsCount = 0
//   userPosts.forEach((userPost) => {
//     if (isContainHashtags(userPost)) relevantPostsCount += 1
//   })
//   if (fullUser.follower_count >= 1000 && relevantPostsCount > 6) {
//     saveUser(fullUser)
//   }
// };

// (async () => {
//   const ig = new IgApiClient();
//   ig.state.generateDevice(process.env.IG_USERNAME);
//   await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
//   console.log("Login succeed");
//   await ig.simulate.preLoginFlow()
//   await ig.simulate.postLoginFlow()

//   await bluebird.delay(2000)
//   await ig.feed.news().items()
//   await bluebird.delay(2000)
//   await ig.feed.discover()

//   let hashtagFeed = ig.feed.tags('test', 'top')
//   let posts = await hashtagFeed.items()

//   for (let i = 0; i < posts.length; i += 1) {
//     if (!posts[i]) continue
//     await postHandler(posts[i])
//   }

//   await bluebird.delay(2000)
//   hashtagFeed = this.ig.feed.tags('test', 'recent')
//   posts = await hashtagFeed.items()

//   for (let i = 0; i < posts.length; i += 1) {

//     await postHandler(posts[i])
//   }
// })();
