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

export {getCaller};
