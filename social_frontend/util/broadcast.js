
const listeners = {};

export function broadcast(tag, data) {
  if (listeners[tag]) listeners[tag].map((listener) => (listener(data)));
}

export function listen(tag, callback) {
  if (listeners[tag] === undefined) listeners[tag] = [];
  return listeners[tag].push(callback);
}

export function removeListener(tag, index) {
  if (listeners[tag]) listeners[tag].splice(index, 1);
}
