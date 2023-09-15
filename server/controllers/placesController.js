const User = require("../schema/user");
const Store = require("../schema/store");

const getAllPlaces = async (req, res) => {
  const { locality } = req.query;
  const places = await Store.find(
    {
      $and: [
        {
          verified: true,
        },
        {
          "address.lat": { $lte: parseFloat(locality.northEast.lat) },
        },
        {
          "address.lat": { $gte: parseFloat(locality.southWest.lat) },
        },
        {
          "address.lng": { $lte: parseFloat(locality.northEast.lng) },
        },
        {
          "address.lng": { $gte: parseFloat(locality.southWest.lng) },
        },
      ],
    },
    "address workingHours"
  ).exec();
  if (!places || places.length === 0) {
    return res.status(204).json({ message: "Няма намерени места!", data: [] });
  }

  res.json(places);
};

const getPlace = async (req, res) => {
  const { id } = req.params;
  const place = await Store.find({ userId: id }, "address workingHours");
  if (!place || place.length === 0) {
    return res.status(204).json({ message: "Няма намерени места!", data: [] });
  }
  res.json(place);
};

const updatePlace = async (req, res) => {
  const place = req.body.shop;
  if (!place) {
    return res.sendStatus(400);
  }
  const newPlace = await Store.findOneAndUpdate({ _id: place._id }, place, {
    new: true,
    select: "-__v",
  }).exec();
  res.json(newPlace);
};

module.exports = {
  getAllPlaces,
  getPlace,
  updatePlace
};
