const LINK_TIMEOUT = 30 * 60

module.exports.handler = async event => {
  // Get challenge and timestamp
  const [authChallenge, timestamp] = (event.request.privateChallengeParameters.challenge || '').split(',')

  // Check if code is equal to what we expect...
  if (event.request.challengeAnswer === authChallenge) {
    // Check if the link hasn't timed out
    if (Number(timestamp) > new Date().valueOf() / 1000 - LINK_TIMEOUT) {
      event.response.answerCorrect = true
      return event
    }
  }

  event.response.answerCorrect = false
  return event
}
