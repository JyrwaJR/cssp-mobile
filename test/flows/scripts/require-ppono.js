// Fails fast with a clear error when the PPO_NO env var is unavailable.
//
// Maestro injects flow/shell environment variables into a runScript's scope
// by name, so PPO_NO can be referenced directly. This guard runs as the
// FIRST command of login-invalid-credentials.yaml so a missing credential
// produces a clear error before any tap (or even app launch) happens,
// instead of a 30-second ambiguous timeout later.
//
// Env vars reach the script when exported in the shell that invokes maestro
// or passed via `maestro test -e PPO_NO=...`.
if (typeof PPO_NO === 'undefined' || PPO_NO === null || PPO_NO === '') {
  throw new Error(
    'Missing required env var PPO_NO. Export it in your shell or pass ' +
      '-e PPO_NO=... to maestro (see test/flows/README.md).'
  );
}
