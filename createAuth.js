const mailer = require('./mailer')
module.exports.handler = async event => {
  const challenge = event.request.userAttributes['custom:authChallenge']
  const [authChallenge, timestamp] = (event.request.userAttributes['custom:authChallenge'] || '').split(',')
  // This is sent back to the client app
  event.response.publicChallengeParameters = {
    email: event.request.userAttributes.email
  }

  // add acceptable answer
  // so it can be verified by the "Verify Auth Challenge Response" trigger
  event.response.privateChallengeParameters = {
    challenge: challenge
  }

  // we want to check and make sure we haven't sent the code before in this login session before sending the code  
  if (event.request.session.length < 3 && !event.request.session.find(s => s.challengeName === 'CUSTOM_CHALLENGE'))
    await mailer.send(
      'Your Access Code',
      event.request.userAttributes.email,
      'Please use the code below to login: <br /><br /> <b>' + authChallenge + '</b>'
    )

  return event
}
