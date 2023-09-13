require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const verifyJWT = require("./middlewares/verifyJWT");
const API_URL = `/api/${process.env.API_VERSION}`;
const app = express();
const usersController = require("./controllers/usersController");

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "LuggageStorageDatabase",
  })
  .then(() => {
    console.log("Connected to DB");
  }).catch((err) => console.log(err));

//middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(cookieParser());

//Routes
app.get(`${API_URL}/users/verify`, usersController.isUserRegistered);
const placesRoutes = require("./routes/places");
app.use(placesRoutes);

const authRoutes = require("./routes/auth");
app.use(authRoutes);
app.use(verifyJWT);

const userRoutes = require("./routes/users");
app.use(userRoutes);

const reservationRoutes = require("./routes/reservation");
app.use(reservationRoutes);

const paymentRoutes = require("./routes/payment");
app.use(paymentRoutes);


//starting server
// console.log("Dsa");
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT || 4000, () => {
    console.log("listeting to port: " + process.env.PORT);
  });
});
