import {ENVIRONMENT} from './enum';

//basically this is only used to get the function that calls log()
function getCaller() {
  const err = new Error().stack;
  if (err) {
    const fname = err.split(' at ', 4)[3].trim().split(' ', 1)[0];
    if (fname && !fname.match('<anonymous>')) {
      return fname;
    }
  }
  return '';
}

function getCSP(cspList: string[], env: string) {
  const res = ["'self'"];
  if (env === ENVIRONMENT.PROD) {
    return res;
  }
  cspList.map((url: string) => {
    res.push(`${url}`);
  });
  return res;
}
// https://bobbyhadz.com/blog/javascript-remove-http-https-from-url#:~:text=To%20remove%20http%3A%2F%2F%20or,http%3A%2F%2F%20part%20is%20removed.&text=Copied!,(url)%20%7B%20return%20url.
function removeHttp(url: string) {
  return url.replace(/^https?:\/\//, '');
}

export {getCaller, getCSP, removeHttp};
