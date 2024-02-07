const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const app = express();
const port = 8080;
const cors = require('cors')
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');

mongoose.connect("mongodb+srv://Shivam_HUmber:shivam@cluster0.kzkacae.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB")
}).catch((err) => {
    console.log("Error connecting to the DB", err)
})

app.listen(port, () => {
    console.log("Server is running on ", port)
})

const User = require("./models/user");
const Post = require("./models/post")

//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        //create a new user
        const newUser = new User({ name, email, password });

        //generate and store the verification token
        newUser.verificationToken = crypto.randomBytes(20).toString("hex");

        //save the  user to the database
        await newUser.save();

        //send the verification email to the user
        sendVerificationEmail(newUser.email, newUser.verificationToken);

        res.status(200).json({ message: "Registration successful" });
    } catch (error) {
        console.log("error registering user", error);
        res.status(500).json({ message: "error registering user" });
    }
});

const sendVerificationEmail = async (email, verificationToken) => {
    //create a nodemailer transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "shiv.can.sharma@gmail.com",
            pass: "xoyp lkdx gwxn bsgw"
        }
    })

    //compose the email message
    const mailOptions = {
        from: "threads.com",
        to: email,
        subject: "Email Verification",
        text: `Please Click the Following link to verifiy the email http://localhost:8080/verify/${verificationToken}`,
    }

    try {
        await transporter.sendMail(mailOptions);
    }
    catch (err) {
        console.log("Error sending email", err)
    }
}

app.get("/verify/:token", async (req, res) => {
    try {
        const token = req.params.token;
        const user = await User.findOne({ verificationToken: token });
        if (!user) {
            return res.status(404).json({ message: "Invalid Token" })
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({ message: "Email Verified Successfully" })
    }
    catch (err) {
        console.log("Error getting token", err),
            res.status(500).json({ message: "Email verification failed" })
    }
})

app.post("/login", async (req, res) => {
    const generateSecretKey = () => {
        const secretKey = crypto.randomBytes(32).toString("hex");
        return secretKey
    }
    const secretKey = generateSecretKey();
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Invalid Email" })
        }
        if (user.password != password) {
            return res.status(404).json({ message: "Invalid Password" })
        }

        const token = jwt.sign({ userId: user._id, }, secretKey);
        res.status(200).json({ token })
    }
    catch (err) {
        console.log("Login Failed", err)
        res.status(500).json({ message: "Login Falied" })
    }
})

//endpoint to access all the users except the logged in user
app.get("/users/:userId", async (req, res) => {
    try {
        const loggedInUserId = req.params.userId;
        const users = await User.find({ _id: { $ne: loggedInUserId } });
        if (!users) {
            return res.status(404).json({ message: "No other users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.log("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.get("/users", async (req, res) => {
    try {
        const loggedInUserId = req.query.userId; // Retrieve userId from req.query
        const users = await User.find({ _id: { $ne: loggedInUserId } });
        if (!users) {
            return res.status(404).json({ message: "No other users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.log("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


app.post("/follow", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {
        const user = await User.findByIdAndUpdate(selectedUserId, {
            $push: { followers: currentUserId },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in following a user" });
    }
});






//endpoint to unfollow a user
app.post("/users/unfollow", async (req, res) => {
    const { loggedInUserId, targetUserId } = req.body;
    try {
        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: loggedInUserId }
        })
        res.status(200).json({ message: "Unfollowed Successfully" })
    }
    catch (err) {
        res.status(500).json({ message: "error unfollowing the user" })
    }
})

//endpoint to create a new post in the backend
app.post("/create-post", async (req, res) => {
    try {
      const { content, userId } = req.body;
  
      const newPostData = {
        user: userId,
      };
  
      if (content) {
        newPostData.content = content;
      }
  
      const newPost = new Post(newPostData);
  
      await newPost.save();
  
      res.status(200).json({ message: "Post saved successfully" });
    } catch (error) {
      res.status(500).json({ message: "post creation failed" });
    }
  });

//enpoint for likes
app.put("/posts/:postId/:userId/like", async(req,res)=>{
    try{
        const postId = req.params.postId;
        const userId = req.params.userId;

        const post = await Post.findById(postId).populate("user", "name");

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {$addToSet:{likes:userId}},
            {new:true}
        )

        if(!updatedPost){
            return res.status(404).json({ message: "post not found" })
        }
        updatedPost.user = post.user;
        res.json(updatedPost)
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "an error occured while liking" })
    }
})

//endpoint unlike the post
app.put("/posts/:postId/:userId/unlike", async(req,res)=>{
    try{
        const postId = req.params.postId;
        const userId = req.params.userId;

        const post = await Post.findById(postId).populate("user", "name");

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {$pull:{likes:userId}},
            {new:true}
        )

        if(!updatedPost){
            return res.status(404).json({ message: "post not found" })
        }
        updatedPost.user = post.user;
        res.json(updatedPost)
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: "an error occured while liking" })
    }
})

//endpoint to get all the post
app.get("/get-posts",async(req,res)=>{
    try{
        const posts = await Post.find().populate("user","name").sort({createdAt:-1});
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json();
    }
})

//endpoint to get the details of the user
app.get("/profile/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        return res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({ message: "Error while getting ther user details" })
    }
})