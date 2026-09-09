# CSSP Mobile — Maestro E2E Suite

End-to-end UI tests for the CSSP (Pensioner) mobile app, driven by Maestro
against the **live backend** on a physical Android device.

## Quick start

```sh
# 1. Install Maestro (2.10.0 used; https://maestro.mobile.dev)
# 2. Create secrets from the template (values are NEVER committed):
cp test/.env.example test/.env    # fill in real values

# 3. Per-folder runs:
npm run test:e2e:auth
npm run test:e2e:home

# 4. Full suite (config.yaml drives all folders serially):
npm run test:e2e
```

## Scripts

| Script             | Runs                                                                |
| ------------------ | ------------------------------------------------------------------- |
| `test:e2e`         | entire suite via `test/config.yaml`                                 |
| `test:e2e:auth`    | `test/flows/auth`                                                   |
| `test:e2e:home`    | `test/flows/home`                                                   |
| `test:e2e:dlc`     | `test/flows/dlc`                                                    |
| `test:e2e:profile` | `test/flows/profile`                                                |
| `test:e2e:cp`      | `test/flows/change-password`                                        |
| `test:e2e:static`  | `test/flows/static`                                                 |
| `test:e2e:flow`    | single file: `npm run test:e2e:flow -- test/flows/home/home-1.yaml` |

All scripts source `test/.env` (if present) into the shell environment and pass
`--device ${MAESTRO_DEVICE}` (default `a5da5d01`).

## Environment contract

See `test/.env.example`. Secrets live in gitignored `test/.env`:

- `PPO_NO`, `PASSWORD` — valid pensioner login (dev prefill may fill these).
- `REG_*` — treasury-matching details for the registration wizard.
- `NEW_PASSWORD` — temporary password for change-password success/restore flows
  (default `Test1234!`).
- `APP_ID`, `MAESTRO_DEVICE` — target app/device (defaults set).

## Helpers

- `helpers/launch-app.yaml` — `stopApp` + `launchApp`; set `CLEAR_STATE=true`
  via `runFlow ... env` for flows needing a logged-out start (auth/guest flows).
- `helpers/login.yaml` — ensures a signed-in home: launches the app; if a
  session survived (home marker visible) it force-logs-out via the drawer, then
  fills `login-input-username`/`login-input-password` from env and taps
  `login-submit`; asserts the home marker (`Submit your Digital Life
Cerificate`). All secure flows call this first.

> Note: auth flows intentionally clear app state so login/session logic is
> exercised from scratch (R4). Acceptable for test builds.

## Selectors

`id:` (= RN `testID`) preferred; fallback to exact visible text. TestIDs are
added per plan tasks 2–5 registries (see `docs/app-flow.md` §6 for
registry-vs-reality discrepancies and the approved deviations).

## Coverage matrix

Filled in at Task 14. Placeholder:

| Area            | Flow file                            | Scenario                                    | Status  |
| --------------- | ------------------------------------ | ------------------------------------------- | ------- |
| auth            | `flows/auth/login-valid.yaml`        | valid login + snackbar                      | pending |
| auth            | `flows/auth/login-validation.yaml`   | 4 validation strings                        | pending |
| auth            | `flows/auth/login-view-manual.yaml`  | open manual from login                      | pending |
| auth            | `flows/auth/login-register-nav.yaml` | register nav from login                     | pending |
| auth            | `flows/auth/registration-guide.yaml` | reg guide page                              | pending |
| auth            | `flows/auth/registration-step1.yaml` | PPO check step                              | pending |
| auth            | `flows/auth/registration-full.yaml`  | real `create_pensioner`                     | pending |
| auth            | `flows/auth/guest-guard.yaml`        | protected → /auth (logged out)              | pending |
| home            | `flows/home/*.yaml`                  | (4 flows)                                   | pending |
| dlc             | `flows/dlc/*.yaml`                   | (4 flows incl. face verification)           | pending |
| profile         | `flows/profile/*.yaml`               | (3 flows)                                   | pending |
| change-password | `flows/change-password/*.yaml`       | (3 flows, ordered `10_`/`20_`/`30_` per R5) | pending |
| static          | `flows/static/*.yaml`                | (5 flows)                                   | pending |

## Notes / deviations

- Full DLC submission, registration, and profile update hit the **live backend**
  (user-approved E2E). Some flows are stateful (e.g. registration creates an
  account; DLC success changes status) — re-running the full suite assumes a
  resettable/multi-profile device or fresh data (see `docs/app-flow.md` §7).
- Failure screenshots are saved to `test/screenshots/` (gitignored).
