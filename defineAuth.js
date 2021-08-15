module.exports.handler = async event => {
  if (
    event.request.session.length === 1 &&
    event.request.session[0].challengeName === 'SRP_A' &&
    event.request.session[0].challengeResult === true
  ) {
    event.response.issueTokens = false
    event.response.failAuthentication = false
    event.response.challengeName = 'PASSWORD_VERIFIER'
    return event
  }
  if (event.request.userNotFound) {
    event.response.failAuthentication = true
    event.response.issueTokens = false
    return event
  }

  // Check result of last challenge
  if (
    event.request.session &&
    event.request.session.length > 2 &&
    event.request.session.slice(-1)[0].challengeResult === true
  ) {
    // The user provided the right answer - issue their tokens
    event.response.failAuthentication = false
    event.response.issueTokens = true
    return event
  }

  event.response.issueTokens = false
  event.response.failAuthentication = false
  event.response.challengeName = 'CUSTOM_CHALLENGE'
  return event
}
