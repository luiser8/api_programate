var nodemailer = require("nodemailer");

const mail = async (email, subject, token) => {

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        tls:true,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'email@gmail.com', // generated ethereal user
          pass: 'pass', // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: 'noreply@example.com', // sender address
        to: email, // list of receivers
        subject: subject, // Subject line
        text: "Registro de usuario", // plain text body
        html: token ? `Codigo para restablecer su constraseña ${token}` : "<b>Su cuenta ha sido registrada exitosamente</b>", // html body
      });
      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = mail;