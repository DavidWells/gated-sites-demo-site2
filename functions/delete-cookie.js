import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import util from 'util'

exports.handler = (event, context, callback) => {

  const params = event.queryStringParameters || {}
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

  const myCookie = cookie.serialize('nf_jwt', null, {
    secure: true,
    httpOnly: true,
    path: "/",
    maxAge: -1,
  })

  const html = `
  <html lang="en">
    <head>
      <meta charset="utf-8">
    </head>
    <body>
      <noscript>
        <meta http-equiv="refresh" content="0; url=${process.env.URL}" />
      </noscript>
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
        redirect('https://gated-sites-demo-login-site.netlify.com/')
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

  console.log(`${process.env.URL} Delete`, cookieResponse)

  // set cookie and redirect
  return callback(null, cookieResponse);
}
