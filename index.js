module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const crypto = require('crypto');
  const axios = require('axios')

  const xero_webhook_key = 'XERO KEY HERE'
  
  const xero_header_key = req.headers['x-xero-signature'];
  
  const payload = req.rawBody.toString();
  
  const computedKey = crypto.createHmac('sha256', xero_webhook_key).update(payload,'utf8').digest('base64');

  const firstEvent = req.body['firstEventSequence'];
  const lastEvent = req.body['lastEventSequence'];

  if (firstEvent == lastEvent == 0){
    if (computedKey === xero_header_key) {
      context.res = {
        status: 200,
        body:''
      };
      context.log('status 200')
  }
  else {
      context.res = {
          status: 401,
          body:''
      };
      context.log('status 401')
  };

  context.log('x-xero-signature: '+xero_header_key)
  context.log('rawBody: '+req.rawBody)
  context.log('computedKey: '+computedKey)
  }
  else {
    context.log('Sending to Flow')
    var events = req.body['events']
  
    const flowurl = "TO EVENTS TO POWER-AUTOMATE PUT REQUEST URL HERE"
    
    //post data to flow
    axios
      .post(flowurl, {'events': events})
  .then(res => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res)
  })
  .catch(error => {
    console.error(error)
  })
    
  };
};
