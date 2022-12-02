require("dotenv").config();
const express = require("express");
const app = express();
const { IgApiClient } = require("instagram-private-api");
const { writeFile, readFile, access } = require("fs/promises");
const path = require("path");
const asios = require("axios");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");

// const {
//   MediaCommentsFeedResponse,
//   MediaCommentsFeedResponseCommentsItem,
// } = require("responses");

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended:true}));

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

app.post("/api/infoInstagram", function (req, res) {
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

app.post("/api/postfacebook",  (req, res) =>{

    const text =req.body.text;
    const img = req.body.img;
    pageId = "103583955925008"
    FBaccess_token = "EAAHexu6utcgBAE3sWdoOKr8DCUXpEKjkxKU1QaIJNhVWxUZChLD2rxbaxi77XfF04YfT78XbbTwoS5ytb0dvwFu2FpLZCBB6PbXZB3jCUyveKLO1LJZBwcoJvnEMJcgsvx1TOcR7FRjjOawlTXw0IZCkUQyD3VkTTxH1lHaSR8YnC8A8jMLCIZANi5YgXqSIZCZCULrgRXo1QW7ZAjdxZC3q8c"

    axios.post(`https://graph.facebook.com/${pageId}/photos?url=${img}?tok=ApRxY9_r?&FBaccess_token=${FBaccess_token}`,
    null
    )
    .then(function(response){
      console.log(response);
    })
    .catch(function (error){
      console.log(error);
    });
  });

const port = process.env.PORT || 3300;
app.listen(port, () =>
  console.log(` API server started listening on ${port}...`)
);
