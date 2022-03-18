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

export {getCaller, getCSP};
