// Fails fast with a clear error when PPO_NO or PASSWORD is unavailable.
//
// Maestro injects flow/shell environment variables into a runScript's scope
// by name, so PPO_NO and PASSWORD can be referenced directly. This guard
// runs as the FIRST command of login-successful.yaml so missing credentials
// produce a clear error before any tap (or even app launch) happens,
// instead of a 30-second ambiguous timeout later.
//
// Env vars reach the script when exported in the shell that invokes maestro
// or passed via `maestro test -e PPO_NO=... -e PASSWORD=...`.
if (
  typeof PPO_NO === 'undefined' ||
  PPO_NO === null ||
  PPO_NO === '' ||
  typeof PASSWORD === 'undefined' ||
  PASSWORD === null ||
  PASSWORD === ''
) {
  throw new Error(
    'Missing required env vars. Export PPO_NO and PASSWORD in your shell ' +
      'or pass -e PPO_NO=... -e PASSWORD=... to maestro ' +
      '(see test/flows/README.md).'
  );
}
