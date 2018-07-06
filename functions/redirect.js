exports.handler = (event, context, callback) => {
  console.log('event', event)
  /*
  const redirect_uri = ''
  const response = {
    statusCode: 301,
    headers: {
      Location: redirect_uri,
      // Set no cache
      'Cache-Control': 'no-cache'
    }
  }

  return callback(null, response)
  */
  return callback(null, {
    statusCode: 200,
    body: JSON.stringify({
    	event: event,
      context: context
    })
  })
}
