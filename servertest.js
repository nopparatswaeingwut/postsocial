require("dotenv").config();
const express = require("express");
const app = express();
const { IgApiClient } = require("instagram-private-api");
const { writeFile, readFile, access } = require("fs/promises");
const path = require("path");
// const {
//   MediaCommentsFeedResponse,
//   MediaCommentsFeedResponseCommentsItem,
// } = require("responses");

async function instaSessionSave(data) {
  console.log("Trying to save the IG Session");
  try {
    await writeFile("login-data.json", JSON.stringify(data));
    console.log("Saved IG Session");
  } catch (err) {
    console.error(err);
  }
  return data;
}

async function instaSessionExists() {
  try {
    await access(path.join(__dirname, "login-data.json"));
    return true;
  } catch (err) {
    return false;
  }
}

async function instaSessionLoad() {
  console.log("Trying to load the IG Session");
  try {
    let data = await readFile("login-data.json");
    console.log("Loaded the IG Session");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return false;
  }
}

app.post("/api/login", function (req, res) {
  (async () => {
    const ig = new IgApiClient();
    ig.state.generateDevice(process.env.IG_USERNAME);
    let shouldLogin = true;
    console.log();
    try {
      if (await instaSessionExists()) {
        shouldLogin = false;
        console.log("Insta Session Exists");
        let loaded_session = await instaSessionLoad();
        console.log("loaded_session: " + loaded_session);
        await ig.state.deserialize(loaded_session);
        let userinfo = await ig.user.info(ig.state.cookieUserId);
        console.log("Insta Session Deserialized");
        
        return res.send(userinfo);
      } else {
        console.log("Insta Session Does Not Exist");
      }
    } catch (e) {
      console.log(e);
      return res.send(e);
    }

    if (shouldLogin) {
      console.log("----- !!! IG Account Login Procedure !!! ----- ");

      ig.request.end$.subscribe(async () => {
        const serialized = await ig.state.serialize();
        delete serialized.constants; // this deletes the version info, so you'll always use the version provided by the library
        instaSessionSave(serialized);
      });
      
      const loginInUser = await ig.account.login(
        process.env.IG_USERNAME,
        process.env.IG_PASSWORD
      );
      return res.send(loginInUser);
    }
  })();
});

app.post("/api/postvideo", function (req, res) {
  (async () => {
    const videoPath = "C:/Users/DELL/Desktop/instagram/video/Video1m.mp4";
    const coverPath = "C:/Users/DELL/Desktop/instagram/image/PNG.png";

    const publishResult = await ig.publish.video({
      video: await readFileAsync(videoPath),
      coverImage: await readFileAsync(coverPath),
      caption: "Test post video 1 minute instagram ",
    });

    console.log(publishResult);
    console.log("Post video succeed");
  })();
});
app.post("/api/postimage", function (req, res) {
  (async () => {
    const ig = new IgApiClient();
    console.log("Login succeed");
    console.log("Post photo succeed");
    const imageBuffer = await get({
      url: "https://cdn.pixabay.com/photo/2022/02/06/15/58/squirrel-6997505_960_720.jpg",
      encoding: null,
    });
    await ig.publish.photo({
      file: imageBuffer,
      caption: "Test post instagram #post #test #photo",
    });
  })();
});

const port = process.env.PORT || 3300;
app.listen(port, () =>
  console.log(`IG API server started listening on ${port}...`)
);
