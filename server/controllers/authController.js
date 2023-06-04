const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../schema/user");
const Store = require("../schema/store");

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Имейлът и паролата са задължителни!" });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();
    if (!foundUser || !foundUser.verified) {
      return res
        .status(401)
        .json({ message: "Такъв потребител не съществува!" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const accessToken = jwt.sign(
        {
          userInfo: {
            email: foundUser.email,
            role: foundUser.role,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const refreshToken = jwt.sign(
        {
          email: foundUser.email,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      foundUser.refreshToken = refreshToken;
      const role = foundUser.role;
      await foundUser.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        samSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.json({
        message: "Потребителят влиза в системата!",
        accessToken,
        role,
        id: foundUser._id,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Потребителското име или паролата са грешни!" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const register = async (req, res) => {
  const { email, password } = req.body.user;
  console.log(req.body);
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Имейлът и паролата са задължителни!" });
  }
  try {
    const user = await User.findOne({ email: email }).exec();
    if (user) {
      return res.status(409).json({ message: "Потребителят вече съществува" }); //conflict
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      password: hashedPassword,
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      role: req.body.user.role,
      verified: true,
    });
    console.log(newUser);
    await newUser.save();
    return res.status(201).json({ message: "Потребителят е създаден." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const registerPartner = async (req, res) => {
  const { contactInfo, addressInfo, workingTime } = req.body;
  if (!contactInfo.email || !contactInfo.password) {
    return res
      .status(400)
      .json({ message: "Имейлът и паролата са задължителни!" });
  }
  try {
    const user = await User.findOne({ email: contactInfo.email }).exec();
    if (user) {
      return res.status(409).json({ message: "Потребителят вече съществува" }); //conflict
    }
    const hashedPassword = await bcrypt.hash(contactInfo.password, 10);
    const newUser = new User({
      email: contactInfo.email,
      password: hashedPassword,
      firstName: contactInfo.firstName,
      lastName: contactInfo.lastName,
      phone: contactInfo.phone,
      role: contactInfo.role,
      verified: false,
    });
    await newUser.save();
    console.log(newUser);
    const newStore = new Store({
      userId: newUser._id,
      address: addressInfo,
      workingHours: workingTime,
      verified: false,
    });
    await newStore.save();
    return res.status(201).json({ message: "Потребителят е създаден." });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  // On Client also delete the accessToken
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204);
  }

  const refreshToken = cookies.jwt;
  try {
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie("jwt", { httpOnly: true, samSite: "None", secure: true });
      return res.sendStatus(204);
    }
    //delete refresh token
    foundUser.refreshToken = "";
    await foundUser.save();
    res.clearCookie("jwt", { httpOnly: true, samSite: "None", secure: true });
    return res.sendStatus(204);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const refreshTokenHandler = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  try {
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
      return res.sendStatus(403);
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        console.log(decoded);
        if (err || foundUser.email !== decoded.email) {
          return res.sendStatus(403);
        }
        const accessToken = jwt.sign(
          {
            userInfo: {
              email: decoded.email,
              role: foundUser.role,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1h",
          }
        );
        res.json({ accessToken, role: foundUser.role, id: foundUser._id, email: foundUser.email });
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  login,
  register,
  registerPartner,
  logout,
  refreshTokenHandler,
};
