const express = require("express");
const app = express();
const cors = require("cors");
const data = require("./data/data.json");
const mongoose = require("mongoose");
const mongodata = require("./Mongodb module/Users-module");
const SongData = require("./Mongodb module/Data-module");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
mongoose.set("strictQuery", true);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const url = process.env.MONGO_LINK;
const localhost = process.env.LOCALHOST_LINK;
const deploy = process.env.DEPLOYMENT_LINK;

const allowedOrigins = [`${localhost}`, `${deploy}`];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Allow credentials if needed (cookies, etc.)
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

app.post("/Login", async (req, res) => {
  try {
    const name = req.body.name;
    const password = req.body.password;

    const data = await mongodata.findOne({
      UserName: name,
      Password: password,
    });
    console.log(data);
    if (!data) {
      res.json({ message: "not verified" });
    } else {
      res.json({ message: "verified" });
    }
  } catch (error) {
    console.log(error);
  }
});

try {
  const connectWithRetry = () => {
    console.log("Attempting to connect to MongoDB...");

    mongoose
      .connect(`${url}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected successfully");
      })
      .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
        setTimeout(connectWithRetry, 5000);
      });
  };

  connectWithRetry();
} catch (error) {
  console.log(error);
}

function shuffle(sourceArray) {
  for (var i = 0; i < sourceArray.length - 1; i++) {
    var j = i + Math.floor(Math.random() * (sourceArray.length - i));

    var temp = sourceArray[j];
    sourceArray[j] = sourceArray[i];
    sourceArray[i] = temp;
  }
  return sourceArray;
}

app.post("/SongUpload", async (req, res) => {
  const Song = req.body.Song;
  const SongImage = req.body.SongImage;
  const SongName = req.body.SongName;
  const SongArtist = req.body.SongArtist;
  const SongGenre = req.body.SongGenre;

  const data = {
    Song_Name: SongName,
    Song: Song,
    Song_Image: SongImage,
    Artist: SongArtist,
    Genre: SongGenre,
  };
  console.log(data);
  const std = new SongData(data);
  const result = std.save();
  console.log(result);
});

app.get("/SongsData", async (req, res) => {
  try {
    let data = [];
    data = await SongData.find();
    data = shuffle(data);
    data.length = 6;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/GetAllSongs", async (req, res) => {
  try {
    let data = [];
    data = await SongData.find();
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/SongsData/:id", async (req, res) => {
  try {
    const num = req.params.id;
    console.log(num);
    const data = await SongData.findById(num);
    res.json({ data });
  } catch (error) {
    console.log(error);
  }
});

app.post("/SignUp", async (req, res) => {
  try {
    const name = req.body.Name;
    const Password = req.body.password;
    const email = req.body.email;

    const user = await mongodata.findOne({
      UserName: name,
      Password: Password,
      Email: email,
    });
    if (user) {
      res.send("existed");
      console.log("existed");
    } else {
      const data = { UserName: name, Password: Password, Email: email };
      const std = new mongodata(data);
      const result = await std.save();
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/Login", async (req, res) => {
  try {
    const name = req.body.name;
    const password = req.body.password;

    const data = await mongodata.findOne({
      UserName: name,
      Password: password,
    });
    console.log(data);
    if (!data) {
      res.send("not verified");
    } else {
      res.send("verified");
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/Liked", async (req, res) => {
  const name = req.body.username;
  const password = req.body.password;

  const data = await mongodata.findOne({ UserName: name, Password: password });
  console.log(data);
  res.send({ data });
});

app.post("/UpdateLiked", async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const song = req.body.song;
  const image = req.body.image;
  const Username = req.body.username;
  const Password = req.body.password;

  const data = await mongodata.findOne({
    UserName: Username,
    Password: Password,
  });
  const result = data.Likedsongs.find((Song) => Song.name === name);
  if (result) {
    data.Likedsongs.pull({ id, name: name, Song: image });
    await data.save();
    res.send("removed");
  } else {
    const IsLiked = "liked";
    data.Likedsongs.push({
      id,
      name: name,
      Song: song,
      Image: image,
      IsLiked: IsLiked,
    });
    await data.save();
    res.send("added");
  }
  console.log(result);
});

app.post("/History", async (req, res) => {
  try {
    const { Songid, Songname, Song, SongImage, username, password } = req.body;

    // Find the user by username and password
    const user = await mongodata.findOne({
      UserName: username,
      Password: password,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out the song if it exists
    user.History = user.History.filter((song) => song.Song !== Song);

    // Add the song to the top of the history
    user.History.unshift({ id: Songid, name: Songname, Song: Song, Image: SongImage });

    // Save the updated user data
    await user.save();
    return res.status(200).json({ message: "Song added to history" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});


app.post("/HistoryData",async(req,res)=>{
  const username = req.body.username;
  const password = req.body.password;

  const user = await mongodata.findOne({UserName:username,Password:password})

  res.json({user})
})

app.post("/deleteHistory", async(req,res) => {
  const { Songid, Songname, Song, SongImage, username, password } = req.body;

  const data = await mongodata.findOne({
    UserName: username,
    Password: password,
  });
  const existingsong = data.History.find((Song) => Song.id === Songid);
  console.log(Songid);
  

  if (!existingsong) {
    console.log("data not existed");
  } else {
    data.History.pull({ id:Songid, name:Songname, Song:Song, Image:SongImage });
    await data.save();
    console.log(data);
    console.log("Song removed");
    res.send("removed");
  }
})

// app.get("/DeleteHistory",async(req,res)=>{
//   const DeleteHistory = await mongodata.findOne({UserName:"Ajay Sharma",Password:"powerhouseajay6556"});
//   DeleteHistory.History.pull({Song:"https://aac.saavncdn.com/073/64c7f6590b3b308b47ddcfd6e54eebb1_96.mp4"});
//   await DeleteHistory.save();
// })


// app.post("/UpdateHistory", async (req, res) => {
//   try {
//     const { Songid, Songname, Song, SongImage, username, password } = req.body;

//     // Find the user by username and password
//     const user = await mongodata.findOne({
//       UserName: username,
//       Password: password,
//     });

//     const songExists = user.History.some((song) => song.Song === Song);

//     if (songExists) {
//       user.History = user.History.filter((song) => song.Song !== Song);
      
//       await user.save();
//     } else {
//       return res.status(404).json({ message: "Song not found in history" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });


// app.post("/LikedSongs", async (req, res) => {
//   const id = req.body.id;
//   const name = req.body.name;
//   const image = req.body.image;
//   const Username = req.body.username;
//   const Password = req.body.password;

//   const data = await mongodata.findOne({
//     UserName: Username,
//     Password: Password,
//   });
//   const existingsong = data.Likedsongs.find((Song) => Song.id === id);
//   if (existingsong) {
//     console.log("data already existed");
//     data.Likedsongs.pull((Song) =>Song.id === id)
//   } else {
//     const Isliked = "Liked";
//     data.Likedsongs.push({ id, name, Song: image, IsLiked: Isliked });
//     await data.save();
//     const user = await mongodata.findOne({
//       UserName: Username,
//       Password: Password,
//     });
//     const result = data.Likedsongs;
//     res.send({ result });
//   }
// });

// app.get("/addlikedsongs", async (req, res) => {
//   const data = await mongodata.findOne({
//     UserName: "Ajay Sharma",
//     Password: "powerhouseajay6556",
//   });
//   data.Likedsongs.push({
//     id: "669dec1cbb228fcaa43a22e7",
//     name: "Mutiyaar",
//     Song: "https://aac.saavncdn.com/862/b3efc73947df8d3ade6a56b41395dc3e_96.mp4",
//     IsLiked: "liked",
//   });
//   await data.save();
//   res.send({ data });
// });

app.post("/RemoveLikedSongs", async (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  const Song = req.body.data;
  const Username = req.body.Username;
  const Password = req.body.Password;
  const Isliked = false;

  const data = await mongodata.findOne({
    UserName: Username,
    Password: Password,
  });
  const existingsong = data.Likedsongs.find((Song) => Song.id === id);
  if (!existingsong) {
    console.log("data not existed");
  } else {
    data.Likedsongs.pull({ id, name, Song, Isliked });
    await data.save();
    console.log(data);
    console.log("Song removed");
    res.send("removed");
  }
});

app.post("/GetUserData", async (req, res) => {
  const Username = req.body.Username;
  const Password = req.body.Password;

  const data = await mongodata.findOne({
    UserName: Username,
    Password: Password,
  });
  console.log(data);

  res.send(data);
});

app.get("/data", async (req, res) => {
  const data1 = data;
  const length = data.length;
  const data2 = await shuffle(length);
  console.log(data2);
  res.send(data2);
});

app.get("/data/:id", async (req, res) => {
  const num = parseInt(req.params.id);
  const data1 = data.find((data) => data.id === num);

  res.send(data1);
});

app.get("/data/:name", async (req, res) => {
  const String = req.params.name;
  const data1 = data.find((data) => data.name == String);
  res.send(data1);
});

app.listen(3000);
