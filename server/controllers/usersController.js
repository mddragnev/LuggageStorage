const Store = require("../schema/store");
const User = require("../schema/user");
const emailService = require("../services/mailjet");

const getAllUsers = async (req, res) => {
  const users = await User.find({}, "-_id -password -refreshToken -__v");
  if (!users) {
    return res.status(204).json({ message: "Няма потребители!" });
  }

  res.json(users);
};

const updateUser = async (req, res) => {
  const user = req.body.user;
  if (!user) {
    return res.sendStatus(400);
  }
  const newUser = await User.findOneAndUpdate({ email: user.email }, user, {
    new: true,
    select: "-_id -password -refreshToken -__v",
  }).exec();
  res.json(newUser);
};

const verifyUser = async (req, res) => {
  const user = req.body.user;
  if (!user) {
    return res.sendStatus(400);
  }
  //verify user
  const newUser = await User.findOneAndUpdate(
    { email: user.email },
    {
      verified: true,
    },
    { new: true, select: "-password -refreshToken -__v" }
  ).exec();

  //send verification email to approved user
  emailService.succesfulRegistrationEmail(user.firstName, user.email);

  //verify place
  const updatedPlace = await Store.findOneAndUpdate(
    { userId: newUser._id },
    { verified: true },
    { new: true }
  ).exec();
  res.json(newUser);
};

const isUserRegistered = async (req, res) => {
  const user = await User.findOne({ email: req.query.email }).exec();
  if (user) {
    return res.status(200).json({ message: "User is found!" });
  }
  return res.status(404).json({ message: "User not found" });
};

module.exports = {
  getAllUsers,
  verifyUser,
  isUserRegistered,
  updateUser,
};
