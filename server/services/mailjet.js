require("dotenv").config();
const Mailjet = require("node-mailjet");

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

const sendNewReservationEmail = async (name, email, reservationId) => {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "mddragnev@gmail.com",
            Name: "Краткосрочно съхранение на багаж",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Съобщение за нова резервация",
          TemplateLanguage: true,
          TemplateID: 4854458,
          Variables: {
            name: name,
            reservationId: reservationId,
          },
        },
      ],
    });
    return result;
  } catch (err) {
    console.log(err.statusCode);
  }
};

const sendRegistrationApproveEmail = async (name, email) => {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "mddragnev@gmail.com",
            Name: "Краткосрочно съхранение на багаж",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Съобщение за одобрена регистрация.",
          TemplateLanguage: true,
          TemplateID: 5097165,
          Variables: {
            name: name,
            email: email,
          },
        },
      ],
    });
    return result;
  } catch (err) {
    console.log(err.statusCode);
  }
};

const cancelReservationEmail = async (name, email, reservationId) => {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "mddragnev@gmail.com",
            Name: "Краткосрочно съхранение на багаж",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Съобщение за отказана резервация.",
          TemplateLanguage: true,
          TemplateID: 5097236,
          Variables: {
            name: name,
            reservationId: reservationId,
          },
        },
      ],
    });
    return result;
  } catch (err) {
    console.log(err.statusCode);
  }
};

module.exports = {
  sendNewReservationEmail,
  sendRegistrationApproveEmail,
  cancelReservationEmail,
};
