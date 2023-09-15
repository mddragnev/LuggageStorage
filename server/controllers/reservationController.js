const Reservation = require("../schema/reservation");
const Store = require("../schema/store");
const User = require("../schema/user");

const emailService = require("../services/mailjet");

const createReservation = async (req, res) => {
  if (!req.body.reservation) {
    res.sendStatus(400);
  }
  const { userId, shopId, totalPrice, fromDate, toDate, luggageSize, status } =
    req.body.reservation;

  const reservationDetails = {
    totalPrice,
    fromDate,
    toDate,
    luggageSize,
    status,
  };

  const client = await User.findById(userId).exec();

  const reservation = new Reservation({
    userInfo: {
      userId: userId,
      firstName: client.firstName,
      lastName: client.lastName,
    },
    shopId: shopId,
    reservationDetails: reservationDetails,
  });

  await reservation.save();

  const store = await Store.findById(shopId).exec();
  const user = await User.findById(store.userId).exec();

  await emailService.sendNewReservationEmail(
    user.firstName,
    user.email,
    reservation._id
  );

  res.status(201).json(reservation);
};

const getAllReservationOfPartner = async (req, res) => {
  const { partnerId } = req.query;

  // we need to find the storeId
  if (!partnerId) {
    return res.sendStatus(400);
  }
  const place = await Store.findOne({ userId: partnerId }).exec();

  if (!place) {
    return res
      .status(204)
      .json({ message: "Няма намерени места!", data: null });
  }

  const reservations = await Reservation.find({ shopId: place._id }).exec();

  if (!reservations || reservations.length === 0) {
    return res
      .status(204)
      .json({ message: "Няма резервации за този партньор", data: [] });
  }

  res.json(reservations);
};

const getAllReservationsOfClient = async (req, res) => {
  const { clientId } = req.query;

  // we need to find the storeId
  if (!clientId) {
    return res.sendStatus(400);
  }
  const reservations = await Reservation.find({
    "userInfo.userId": clientId,
  })
    .sort({ _id: -1 })
    .exec();

  if (!reservations || reservations.length === 0) {
    return res
      .status(204)
      .json({ message: "Няма резервации за този партньор", data: [] });
  }
  const result = [];
  for (const reservation of reservations) {
    const store = await Store.findById(reservation.shopId).exec();
    if (!store) continue;
    result.push({
      userInfo: reservation.userInfo,
      _id: reservation._id,
      shopId: reservation.shopId,
      reservationDetails: reservation.reservationDetails,
      address: store.address,
      workingHours: store.workingHours,
    });
  }

  res.json(result);
};

const updateReservation = async (req, res) => {
  const reservation = req.body.reservation;
  if (!reservation) {
    return res.sendStatus(400);
  }
  const newReservation = await Reservation.findOneAndUpdate(
    { _id: reservation._id },
    reservation,
    {
      new: true,
      select: "-__v",
    }
  ).exec();
  if (newReservation.reservationDetails.status === "canceled") {
    const store = await Store.findById(newReservation.shopId).exec();
    const partner = await User.findById(store.userId).exec();
    const client = await User.findById(newReservation.userInfo.userId);
    await emailService.cancelReservationEmail(
      partner.firstName,
      partner.email,
      newReservation._id
    );
    await emailService.cancelReservationEmail(
      client.firstName,
      client.email,
      newReservation._id
    );
  }
  res.json(newReservation);
};

module.exports = {
  createReservation,
  getAllReservationOfPartner,
  getAllReservationsOfClient,
  updateReservation,
};
