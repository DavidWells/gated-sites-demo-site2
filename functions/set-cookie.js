import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import util from 'util'

exports.handler = (event, context, callback) => {

  const params = event.queryStringParameters
  const redirectUrl = params.url
  const authToken = params.token

  // invalid token - synchronous
  const secret = 'secret'
  try {
    var valid = jwt.verify(authToken, secret);
    console.log('authToken valid', valid)
  } catch(err) {
    console.log('verify error', err)
    console.log(err.name)
    console.log(err.message)
  }
  var hour = 3600000;
  var twoWeeks = 14 * 24 * hour
  const myCookie = cookie.serialize('nf_jwt', authToken, {
    secure: true,
    httpOnly: true,
    path: "/",
    maxAge: twoWeeks,
    // domain: 'gated-sites-demo-site1.netlify.com'
    // expires: expiresValue
  })

  let decodedToken
  try {
    decodedToken = jwt.decode(params.token, { complete: true })
    console.log('decodedToken')
    console.log(util.inspect(decodedToken, false, null))
  } catch (e) {
    console.log(e)
  }

  const html = `
  <html lang="en">
    <head>
    <meta charset="utf-8">
    <style>
      h1 { color: #73757d; }
      body { width: 100%; }
    </style>
    </head>
    <body>
      <noscript>
        <meta http-equiv="refresh" content="0; url=${process.env.URL}" />
      </noscript>
      <h1>Set Cookie</h1>

      <p>Cookie is now set. check dev tools for httpOnly cookies</p>

      <h2>Cookie value:</h2>
      <code>
        <pre>${myCookie}</pre>
      </code>

      <h2>Json web token:</h2>
      <code>
        <pre>${JSON.stringify(decodedToken, null, 2)}</pre>
      </code>

      <a href="${process.env.URL}">
        Try to go to ${process.env.URL}
      </a>
    </body>
    <script>
      function redirect(url) {
        var dom = window.document.createElement('form');

        var parts = url.split('?');
        var url_ = parts[0], params = parts[1] || '';
        var paramlist = params.split('&');

        dom.setAttribute('method', 'get');
        dom.setAttribute('action', url_);
        dom.style.display = 'none';
        dom.style.visibility = 'hidden';

        var e, kv, k, v;
        for (var i = 0; i < paramlist.length; ++i) {
          kv = paramlist[i].split('=');
          k = kv[0];
          v = kv[1];
          e = window.document.createElement('input');

          e.setAttribute('type', 'hidden');
          e.setAttribute('name', decodeURIComponent(k));
          e.setAttribute('value', decodeURIComponent(v));

          dom.appendChild(e);
        }

        window.document.body.appendChild(dom);
        dom.submit();
      }

      setTimeout(function(){
        redirect(${JSON.stringify(redirectUrl)})
      }, 0)
    </script>
  </html>`;

  const cookieResponse = {
    "statusCode": 200,
    "headers": {
      "Set-Cookie": myCookie,
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/html',
    },
    "body": html
  }

  console.log(process.env.URL, cookieResponse)

  // set cookie and redirect
  return callback(null, cookieResponse);
}
