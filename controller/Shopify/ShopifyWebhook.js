const nodemailer = require("nodemailer");
const config = require("../../config");

async function Shopify(Product) {
  let productTitle = Product.title;

  let inventryQuatity = Product.variants[1].inventory_quantity
    ? Product.variants[1].inventory_quantity
    : "null";

  console.log(`${productTitle} has ${inventryQuatity} Inventery Quatity`);
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.emailSender,
      pass: config.senderPassword,
    },
  });

  var mailOptions = {
    from: config.emailSender,
    to: "akash.techinvento@gmail.com",
    subject: "Sending Email using Node.js",
    text: `${productTitle} has ${inventryQuatity} Inventery Quatity`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = Shopify;
