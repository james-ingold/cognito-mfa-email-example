let aws = require('aws-sdk')
aws.config.update({region:'us-east-2'})
try {
  require('dotenv').config()
} catch (e) {}
function send (subject, to, text) {
  var params = {
    Destination: { /* required */
      ToAddresses: [
        to
      ]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: text
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: process.env.EMAIL_ADDRESS,
    ReplyToAddresses: [
      process.env.EMAIL_ADDRESS
    ],
    ReturnPath: process.env.EMAIL_ADDRESS
  }

  const ses = new aws.SES({apiVersion: '2010-12-01'})
  return new Promise((resolve, reject) => {
    ses.sendEmail(params, function (err, data) {
      if (err || !data) {
        console.log(err)
        console.log(data)
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  send: send
}
