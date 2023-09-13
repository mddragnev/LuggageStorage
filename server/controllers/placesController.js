const User = require("../schema/user");
const Store = require("../schema/store");

const getAllPlaces = async (req, res) => {
  const { locality } = req.query;
  const places = await Store.find(
    {
      verified: true,
      "address.locality": locality,
    },
    "address workingHours"
  ).exec();
  if (!places || places.length === 0) {
    return res.status(204).json({ message: "Няма намерени места!", data: [] });
  }

  res.json(places);
};

module.exports = {
  getAllPlaces,
};
