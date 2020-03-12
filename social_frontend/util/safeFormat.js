
export default function safeFormat(number) {
  if (
    number !== undefined && number !== null
    && number.toLocaleString !== undefined
  ) {
    return number.toLocaleString();
  }

  return '?';
}
