const express = require("express");
const port = 8003;
const app = express();
app.use(express.json());
const multer = require("multer")

const db = require("./src/models");

//db.sequelize.sync({ alter: true });
//-> dibuka komennya kalau ada perubahan aja

//routes

const {authRoute, verificationRoute, blogRoute} = require("./src/routes")

//middleware

app.use("/api/auth", authRoute)
app.use("/verify", verificationRoute)
app.use("/api/blog", blogRoute)

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        message: "File upload error",
        error: err.message,
      });
    }
    return res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  });

app.listen(port, function () {
    console.log(`server is running on localhost ${port}`)
})
