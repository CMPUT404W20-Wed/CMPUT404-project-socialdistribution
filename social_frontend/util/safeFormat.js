
export default function safeFormat(number) {
  if (number !== undefined
    && Object.keys(number).indexOf('toLocaleString') >= 0
  ) {
    return number.toLocaleString();
  }

  return '?';
}
