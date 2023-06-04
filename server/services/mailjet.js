require("dotenv").config();
const Mailjet = require("node-mailjet");

const mailjet = new Mailjet({
  apiKey: process.env.MAILJET_API_KEY,
  apiSecret: process.env.MAILJET_SECRET_KEY,
});

const sendMail = async (name, email) => {
  try {
    const result = await mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "mddragnev@gmail.com",
            Name: "Martin",
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: "Съобщение за нова резервация",
          TemplateLanguage: true,
          TextPart:
            'Здравейте, {{var:name:"потребител"}}. Имате нова резервация. За повече информация,моля, влезте в системата.',
          Variables: {
            name: name,
          },
        },
      ],
    });
    console.log(result.body);
  } catch (err) {
    console.log(err.statusCode);
  }
};

module.exports = sendMail;