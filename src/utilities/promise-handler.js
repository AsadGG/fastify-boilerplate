export async function promiseHandler(promise, onfinally) {
  return promise
    .then((result) => [result, null, true])
    .catch((error) => [null, error, false])
    .finally(onfinally);
}
