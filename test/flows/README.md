# Maestro E2E — Login Flow Suite

Maestro UI tests for the Pensioner Portal **login screen**: all client-side
validation, the show/hide password toggle, the server-side invalid-credentials
error, and a successful login landing on Home.

```
test/flows/
├── config.yaml                          # Maestro project config (appId, env, glob)
├── README.md                            # this file
├── login-validation-required-fields.yaml
├── login-validation-username.yaml
├── login-validation-password.yaml
├── login-password-toggle.yaml
├── login-invalid-credentials.yaml
└── login-successful.yaml                # tagged happy-path
```

> The existing `flows/face-verification/` directory holds product flow docs
> (HTML/JSON/MD), not Maestro flows. Maestro only discovers top-level `*.yaml`
> files in `test/flows/`, so the two are fully separate.

## Flow coverage

| Flow                                    | What it verifies                                                                                                                  | Network |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------- |
| `login-validation-required-fields.yaml` | Empty submit → `Username is Required` + `Password is required`                                                                    | No      |
| `login-validation-username.yaml`        | Too short / special chars / 21+ chars / space → `Invalid Username`; valid 3-char clears the error                                 | No      |
| `login-validation-password.yaml`        | 7 chars → `Password must be at least 8 characters`; 51 chars → `Password must be at most 50 characters`; 8 chars clears the error | No      |
| `login-password-toggle.yaml`            | `Show password` reveals the typed text; `Hide password` masks it again                                                            | No      |
| `login-invalid-credentials.yaml`        | Valid-format PPO No + wrong password → `Login Error!` alert                                                                       | Yes     |
| `login-successful.yaml`                 | Valid credentials → Home screen shows `Verification Status`                                                                       | Yes     |

## Prerequisites

1. **Maestro CLI** — <https://maestro.mobile.dev/getting-started/installing-maestro>
   ```bash
   curl -Ls "https://get.maestro.mobile.dev" | bash
   maestro --version
   ```
2. **Physical Android device** connected via adb:
   ```bash
   adb devices   # device must be listed
   ```
3. **App installed on the device** — the development build
   (`com.jyrwajr.csspmobile.dev`, from `eas build --profile development`).
4. **Device must be ONLINE.** The login form's Submit button is disabled while
   the app reports itself offline (`useNetworkStatus`), so `tapOn: "Submit"`
   would silently no-op and the flow would fail. Disable airplane mode.
5. **Dev-client first open.** The first launch of a dev-client build opens the
   Expo dev launcher. Open the app once manually, select your dev server, and
   let the JS bundle load. Subsequent `launchApp` steps reconnect
   automatically. (Your flow files use `clearState`, which does not remove the
   dev launcher's remembered server.)

## Running

```bash
# Validation suite — no real credentials needed
npm run test:e2e:validation

# Full suite including the happy path (needs valid credentials + backend)
npm run test:e2e

# A single flow
maestro test test/flows/login-validation-username.yaml
```

### Credentials (happy path only)

`PPO_NO` and `PASSWORD` are read from the shell environment at run time — they
are **never stored in version control**:

```bash
export PPO_NO=<valid-pensioner-ppo-no>
export PASSWORD=<test-password>
npm run test:e2e
```

### Switching the app under test

`test/flows/config.yaml` pins `appId: com.jyrwajr.csspmobile.dev` by default.
For the preview or production build, edit `appId` in that file
(`…csspmobile.preview` / `…csspmobile`).

## How the flows stay deterministic

- **Fresh session:** every flow starts with
  `launchApp: { clearState: true, stopApp: true }`. Auth persists in
  SecureStore and `isSignedIn` defaults to `true`, so without a state wipe a
  previous session would bounce the flow off the login screen.
- **DEV prefill:** in `__DEV__` builds the form pre-fills username/password
  from `EXPO_PUBLIC_PPO_NO` / `EXPO_PUBLIC_PASSWORD`. Every flow focuses the
  field and calls `eraseText` before typing.
- **Keyboard:** flows call `hideKeyboard` and `scrollUntilVisible` before
  tapping Submit (the login screen scrolls).
- **Network waits:** server-dependent assertions use
  `extendedWaitUntil` with generous timeouts.

## Troubleshooting

| Symptom                                          | Cause / fix                                                                                                                                                 |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tapOn "Submit"` does nothing                    | Device is offline — Submit is disabled. Check the network banner, disable airplane mode.                                                                    |
| Flow lands somewhere other than login            | Stale auth session — flows use `clearState`, but if you ran a flow manually mid-way, force-stop the app or `adb shell pm clear com.jyrwajr.csspmobile.dev`. |
| Fields pre-filled before typing                  | DEV prefill from `EXPO_PUBLIC_*` — resets on `clearState` + `eraseText`; if it persists, rebuild the APK without those env vars.                            |
| Happy path times out on `Verification Status`    | Backend unreachable or credentials invalid. Check the backend is reachable from the device; confirm `PPO_NO`/`PASSWORD`.                                    |
| `appId` mismatch (`INSTALL_FAILED`/launch error) | `test/flows/config.yaml` appId does not match the installed build.                                                                                          |
| Dev launcher opens instead of the app            | Open the dev server once manually (prerequisite 5).                                                                                                         |

## Security

- No credentials or secrets are committed: PPO No / password enter flows only
  via `${PPO_NO}` / `${PASSWORD}` from the shell environment.
- Flows never log or echo credential values — steps are `inputText`/`tapOn`
  only.
- The suite drives the existing app UI; it adds no new outbound network calls
  beyond what the app itself makes.
