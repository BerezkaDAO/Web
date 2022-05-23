export function truncate(str, n) {
  if (str) {
    return str.length > n ? str.substr(0, n - 1) + "..." : str;
  }
}
