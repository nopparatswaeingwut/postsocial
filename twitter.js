const Twitter = require("twitter")
const dotenv = require("dotenv")
const fs = require("fs")
dotenv.config()

const client = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token_key: process.env.ACCESS_TOKEN_KEY,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
})
//post status
// client.post("statuses/update", { status: "I tweeted from Node.js!" }, function(error, tweet, response) {
//   if (error) {
//     console.log(error)
//   } else {
//     console.log(tweet)
//   }
// })

//post image
// const imageData = fs.readFileSync("image/JPG.jpg") //replace with the path to your image

// client.post("media/upload", {media: imageData}, function(error, media, response) {
//   if (error) {
//     console.log(error)
//   } else {
//     const status = {
//       status: "ทดสอบโพสข้อความและรุปภาพ",
//       media_ids: media.media_id_string
//     }

//     client.post("statuses/update", status, function(error, tweet, response) {
//       if (error) {
//         console.log(error)
//       } else {
//         console.log("Successfully tweeted an image!")
//       }
//     })
//   }
// })

//post video

const pathToFile = "video/test.mp4"
const mediaType = "video/test.mp4"

const mediaData = fs.readFileSync(pathToFile)
const mediaSize = fs.statSync(pathToFile).size

initializeMediaUpload()
  .then(appendFileChunk)
  .then(finalizeUpload)
  .then(publishStatusUpdate)

function initializeMediaUpload() {
  return new Promise(function(resolve, reject) {
    client.post("media/upload", {
      command: "INIT",
      total_bytes: mediaSize,
      media_type: mediaType
    }, function(error, data, response) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve(data.media_id_string)
      }
    })
  })
}

function appendFileChunk(mediaId) {
  return new Promise(function(resolve, reject) {
    client.post("media/upload", {
      command: "APPEND",
      media_id: mediaId,
      media: mediaData,
      segment_index: 0
    }, function(error, data, response) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve(mediaId)
      }
    })
  })
}

function finalizeUpload(mediaId) {
  return new Promise(function(resolve, reject) {
    client.post("media/upload", {
      command: "FINALIZE",
      media_id: mediaId
    }, function(error, data, response) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve(mediaId)
      }
    })
  })
}

function publishStatusUpdate(mediaId) {
  return new Promise(function(resolve, reject) {
    client.post("statuses/update", {
      status: "ทดสอบโพสวิดีโอและข้อความ",
      media_ids: mediaId
    }, function(error, data, response) {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        console.log("Successfully uploaded media and tweeted!")
        resolve(data)
      }
    })
  })
}