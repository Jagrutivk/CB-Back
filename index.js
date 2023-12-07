require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
// const csrf_mid = require('./routers/middleware/csrf_mid');
const error_mid = require("./routers/middleware/error_mid");
const memberRouter = require("./routers/memberRouter/memberRouter");
const authRouter = require("./routers/authRouter/authRouter");
const membershipRequestRouter = require("./routers/membershipRequestRouter/membershipRequestRouter");
const membershipPlanRoutes = require("./routers/membershipPlanRouter/membershipPlanRouter");
const referralRouter = require("./routers/referralRouter/referralRouter");
const meetingRouter = require("./routers/meetingRouter/meetingRouter");
const chapterRouter = require("./routers/chapterRouter/chapterRouter");
const mamberCategoryRouter = require("./routers/mamberCatoegoryRouter/mamberCatoegoryRouter");
const meetingCommentRouter = require("./routers/meetingCommentRouter/meetingCommentRouter")
const referralCommentRouter = require('./routers/referralCommentRouter/referralCommentRouter')

const app = express();

/**
 * @middleware
 */
// url encode + json encode
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
// enable CORS
 //app.use(cors({ origin: ["http://localhost:3001"], credentials: true }));
app.use(cors());
app.use(helmet());
// csrf
// app.use(csrf_mid.csrfInit);
// app.use(csrf_mid.csrfToken);

// rate limiter
// You should configure and use rate limiting middleware here if needed

/**
 * @routers
 */
app.get("/", (req, res) => {
  res.send("home");
});

// @description auth (signup, login, logout, isLoggedIn) @author milon27
app.use("/auth", authRouter);
app.use("/members", memberRouter);
app.use("/membershipRequest", membershipRequestRouter);
app.use("/api/membership_plans", membershipPlanRoutes);
app.use("/referrals", referralRouter);
app.use("/meetings", meetingRouter);
app.use("/chapters", chapterRouter);
app.use("/memberCategory", mamberCategoryRouter);
app.use('/referralComment', referralCommentRouter)
app.use("/comments", meetingCommentRouter)

// catch all errors

app.use(error_mid);

const port = process.env.PORT || 3003;
app.listen(port, () =>
  console.log(`Server is running at http://localhost:${port}`)
);
