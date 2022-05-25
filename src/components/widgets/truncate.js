export function truncate(str, n) {
  if (str) {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  }
}

export function truncateCenter(str, n, en) {
  if (str) {
    return str.length > n
      ? str.substr(0, n - 1) + "..." + str.substr(str.length - 10, en)
      : str;
  }
}
