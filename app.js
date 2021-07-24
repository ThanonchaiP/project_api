const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const cors = require("cors");

//require config
const config = require("./config/index");

//import middleware
const errorHandler = require("./middleware/errorHandler");

const indexRouter = require("./routes/index");
const loginRouter = require("./routes/login");
const adinRouter = require("./routes/admin");
const studentRouter = require("./routes/student");
const advisorRouter = require("./routes/advisor");
const teacherRouter = require("./routes/teacher");
const classroomRouter = require("./routes/classroom");

const app = express();

//init passport
app.use(passport.initialize());

app.use(cors());

mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

app.use(logger("dev"));
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/admin", adinRouter);
app.use("/classroom", classroomRouter);
app.use("/student", studentRouter);
app.use("/advisor", advisorRouter);
app.use("/teacher", teacherRouter);

// [passportJWT.isLogin]

app.use(errorHandler);

module.exports = app;
