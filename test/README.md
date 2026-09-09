# CSSP Mobile — Maestro E2E Suite

End-to-end UI tests for the CSSP (Pensioner) mobile app, driven by Maestro
against the **live backend** on Android.

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
`${MAESTRO_DEVICE}` (default `a5da5d01`).

## Environment contract

See `test/.env.example`. Secrets live in gitignored `test/.env`:

- `PPO_NO`, `PASSWORD` — valid pensioner login (dev prefill may fill these).
- `REG_*` — treasury-matching details for the registration wizard.
- `NEW_PASSWORD`, `PROFILE_DISPLAY_NAME`, `PROFILE_ORG_NAME` — mutation values.
- `APP_ID`, `MAESTRO_DEVICE` — target app/device (defaults set).

## Helpers

- `helpers/launch-app.yaml` — `stopApp` + `launchApp`; set `CLEAR_STATE=true`
  via `runFlow ... env` for flows needing a logged-out start (auth/guest flows).
- `helpers/login.yaml` — ensures a signed-in home: launches the app; if a
  session survived (home marker visible) it force-logs-out via the drawer, then
  fills `login-input-username`/`login-input-password` from env and taps
  `login-submit`; asserts the home marker (`Submit your Digital Life
Cerificate`). All secure flows call this first.

## Selectors

`id:` (= RN `testID`) preferred; fallback to exact visible text. TestIDs are
added per plan tasks 2–5 registries (see `docs/app-flow.md` §6 for
registry-vs-reality discrepancies and the approved deviations).

## Coverage matrix

| Screen / Area    | Flow file                                               | Scenario                                     | Status |
| ---------------- | ------------------------------------------------------- | -------------------------------------------- | ------ |
| Guest (Login)    | `flows/auth/login-valid.yaml`                           | valid login + session init                   | PASS   |
| Guest (Login)    | `flows/auth/login-validation.yaml`                      | 4 validation strings (username/password)     | PASS   |
| Guest (Login)    | `flows/auth/login-view-manual.yaml`                     | open manual from login screen                | PASS   |
| Guest (Login)    | `flows/auth/login-register-nav.yaml`                    | register navigation from login               | PASS   |
| Guest (Reg)      | `flows/auth/registration-guide.yaml`                    | registration instructions guide              | PASS   |
| Guest (Reg)      | `flows/auth/registration-step1.yaml`                    | Step 1 PPO check verification                | PASS   |
| Guest (Reg)      | `flows/auth/registration-full.yaml`                     | full 4-step `create_pensioner` E2E journey   | PASS   |
| Public Guard     | `flows/auth/guest-guard.yaml`                           | unauthenticated redirect to `/auth`          | PASS   |
| Home             | `flows/home/home-tab.yaml`                              | greeting + 3 bottom tabs (home/dlc/profile)  | PASS   |
| Home             | `flows/home/home-manual-cards.yaml`                     | manual guide cards (3 real cards)            | PASS   |
| Drawer           | `flows/home/drawer-navigation.yaml`                     | drawer navigation (Home → Change Pass → etc) | PASS   |
| Drawer           | `flows/home/drawer-logout.yaml`                         | drawer logout lands on login screen          | PASS   |
| DLC              | `flows/dlc/dlc-tab.yaml`                                | DLC tab view & actions                       | PASS   |
| DLC              | `flows/dlc/dlc-status-page.yaml`                        | DLC status polling & submitted state         | PASS   |
| DLC              | `flows/dlc/face-verification-camera.yaml`               | camera permission grant/deny + blink wait    | PASS   |
| DLC              | `flows/dlc/submit-dlc-e2e.yaml`                         | full live DLC submission & T&C dialog        | PASS   |
| Profile          | `flows/profile/profile-view.yaml`                       | profile view & readouts                      | PASS   |
| Profile          | `flows/profile/profile-update.yaml`                     | real `update_profile` with RS7 org fill      | PASS   |
| Profile          | `flows/profile/withdrawal-view.yaml`                    | withdrawal view-only & readback card         | PASS   |
| Change Password  | `flows/change-password/change-password-validation.yaml` | validation rules & errors                    | PASS   |
| Change Password  | `flows/change-password/change-password-success.yaml`    | success change to `NEW_PASSWORD`             | PASS   |
| Change Password  | `flows/change-password/change-password-restore.yaml`    | self-healing restore back to `PASSWORD`      | PASS   |
| Static (Manual)  | `flows/static/user-manual.yaml`                         | index + 3 sub-guides navigation              | PASS   |
| Static (Policy)  | `flows/static/privacy-policy.yaml`                      | privacy policy static view                   | PASS   |
| Static (Contact) | `flows/static/contact-us.yaml`                          | contact us static view                       | PASS   |
| Static (About)   | `flows/static/about.yaml`                               | about static view                            | PASS   |
| Static (Guard)   | `flows/static/public-guard.yaml`                        | public route unauthenticated deep links      | PASS   |

## Notes / deviations

- Full DLC submission, registration, and profile update hit the **live backend**
  (user-approved E2E). Some flows are stateful (e.g. registration creates an
  account; DLC success changes status) — re-running the full suite assumes a
  resettable/multi-profile device or fresh data (see `docs/app-flow.md` §7).
- Failure screenshots are saved to `test/screenshots/` (gitignored).
