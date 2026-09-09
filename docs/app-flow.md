# CSSP Mobile — App Flow Reference

> **Purpose:** Design source for the Maestro E2E suite under `test/` (Tasks 6–13 of
> the approved plan). Every route, screen, guard, and endpoint below was
> cross-checked against the current source tree.
>
> **String policy:** reproduce UI strings **verbatim**, including intentional
> typos: `Submit your Digital Life Cerificate`, `Are u Re-Married`.
>
> **Reference constants:** `src/shared/utils/constants/routes.ts` (`PAGE_ROUTES`),
> `src/shared/utils/constants/endpoints.ts` (`ENDPOINTS`),
> `src/shared/utils/constants/auth.ts` (route tiers).

---

## 1. App overview

Expo (SDK 57) / expo-router React Native app for Meghalaya Treasury pensioners.
Route structure is split into three groups through the auth guard:

| Group      | Routes                                                                                                                   | Behavior when signed out | Behavior when signed in |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ----------------------- |
| Guest-only | `/auth`, `/auth/reg-instruction`, `/auth/register`                                                                       | Rendered                 | Redirected to `/`       |
| Public     | `/user-manual*`, `/privacy-policy`, `/contact-us`, `/about`                                                              | Rendered                 | Rendered                |
| Protected  | everything else (drawer, tabs, `/dlc-status`, `/profile/update`, `/face-recognition`, `/change-password`, `/withdrawal`) | Redirected to `/auth`    | Rendered                |

All API calls hit the live backend (no mocks — user decision: full E2E).

---

## 2. Route map (constant → file → screen)

Route constants come from `PAGE_ROUTES` (`src/shared/utils/constants/routes.ts`).

### 2.1 Guest-only

| Route                   | Constant                           | Screen file                                                                                | Component                            |
| ----------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------ |
| `/auth`                 | `PAGE_ROUTES.AUTH.HOME`            | `src/app/auth/index.tsx` → `src/features/auth/screens/login.tsx`                           | `LoginScreen`                        |
| `/auth/reg-instruction` | `PAGE_ROUTES.AUTH.REG_INSTRUCTION` | `src/app/auth/reg-instruction/index.tsx` → `src/features/auth/screens/reg-instruction.tsx` | `RegistrationInstructionScreen`      |
| `/auth/register`        | `PAGE_ROUTES.AUTH.REGISTER`        | `src/app/auth/register/index.tsx` → `src/features/auth/screens/registration.tsx`           | `RegistrationScreen` (4-step wizard) |

### 2.2 Public

| Route                          | Constant                                  | Screen file                                                                                   | Component                        |
| ------------------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------------- | -------------------------------- |
| `/user-manual`                 | `PAGE_ROUTES.USER_MANUAL.HOME`            | `src/features/user-manual/screens/user-manual.tsx`                                            | `UserManualScreen`               |
| `/user-manual/getting-started` | `PAGE_ROUTES.USER_MANUAL.GETTING_STARTED` | `src/features/user-manual/screens/getting-started.tsx`                                        | `UserManualGettingStartedScreen` |
| `/user-manual/dlc`             | `PAGE_ROUTES.USER_MANUAL.DLC`             | `src/features/user-manual/screens/dlc-screen.tsx`                                             | `UserManualDLCScreen`            |
| `/user-manual/change-password` | `PAGE_ROUTES.USER_MANUAL.CHANGE_PASSWORD` | `src/features/user-manual/screens/change-password.tsx`                                        | `UserManualChangePasswordScreen` |
| `/privacy-policy`              | `PAGE_ROUTES.PRIVACY`                     | `src/app/privacy-policy/index.tsx` → `src/features/privacy-policy/screens/privacy-policy.tsx` | `PrivacyPolicyScreen`            |
| `/contact-us`                  | `PAGE_ROUTES.CONTACT_US`                  | `src/app/contact-us/index.tsx` → `src/shared/components/screens/contact-us.tsx`               | `ContactScreen`                  |
| `/about`                       | `PAGE_ROUTES.ABOUT_US`                    | `src/app/about/index.tsx` → `src/shared/components/screens/about-us.tsx`                      | `AboutScreen`                    |

### 2.3 Protected (drawer + tabs)

All protected screens are inside the drawer group `src/app/(drawer)/_layout.tsx`
and the tabs group `src/app/(drawer)/(tabs)/_layout.tsx`. The drawer has
`headerShown: false` and `swipeEnabled: true` — **the drawer opens via a
left-edge swipe**, not a hamburger button.

| Route                             | Constant                       | Screen file                                                                                       | Component                                            |
| --------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `/`                               | `PAGE_ROUTES.HOME`             | `src/app/(drawer)/(tabs)/index.tsx` → `src/features/verification/screens/verification-status.tsx` | `VerificationStatusScreen` (home / "Status" tab)     |
| `/dlc`                            | `PAGE_ROUTES.DLC`              | `src/app/(drawer)/(tabs)/dlc.tsx` → `src/features/dlc/screens/dlc-screen.tsx`                     | `DLCScreen` ("Submit DLC" tab)                       |
| profile tab (`/profile` implicit) | —                              | `src/app/(drawer)/(tabs)/profile.tsx` → `src/features/profile/screens/profile-screen.tsx`         | `ProfileScreen`                                      |
| `/dlc-status`                     | `PAGE_ROUTES.DLC_STATUS`       | `src/app/dlc-status/index.tsx` → `src/features/dlc-status/screens/dlc-status.tsx`                 | `DLCStatusScreen`                                    |
| `/face-recognition`               | `PAGE_ROUTES.FACE_RECOGNITION` | `src/app/face-recognition/index.tsx` → `src/features/verification/screens/face-verification.tsx`  | `FaceVerificationScreen`                             |
| `/change-password`                | `PAGE_ROUTES.CHANGE_PASSWORD`  | `src/app/change-password/index.tsx` → `src/features/change-password/screens/change-passsword.tsx` | `ChangePasswordScreen` (note original filename typo) |
| `/profile/update`                 | `PAGE_ROUTES.PROFILE.UPDATE`   | `src/app/profile/update/index.tsx` → `src/features/profile/screens/profile-update-screen.tsx`     | `ProfileUpdateScreen`                                |
| `/withdrawal`                     | `PAGE_ROUTES.WITHDRAWAL`       | `src/app/withdrawal/index.tsx` → `src/features/withdrawal/screens/withdrawal.tsx`                 | `WithdrawalScreen`                                   |

Tab configuration (`(tabs)/_layout.tsx`): three tabs with screen names
`index`, `dlc`, `profile` and titles **Status**, **Submit DLC**, **Profile**.

---

## 3. Auth guard & hydration

Guard component: `src/shared/components/common/auth-redirect.tsx`
(`AuthRedirect`). Route-tier helpers in `src/shared/utils/constants/auth.ts`
(`isGuestOnlyRoute`, `isPublicRoute`, `isProtectedRoute`).

- **Guest-only:** signed-in users are sent to `PAGE_ROUTES.HOME` (`/`).
- **Protected:** signed-out users are sent to `/auth`, preserving an optional
  `redirect` query param; after login the app returns to `redirect` or defaults
  to `PAGE_ROUTES.HOME`.
- **Hydration:** while the auth store hydrates (`isAuthLoading`), the app
  renders the loading screen; the guard decision is only made after hydration
  completes.

Auth store `src/shared/stores/auth.store.ts`: Zustand + SecureStore. Holds
`user` (name, username, uid, ppo_no, approval, has_dlc, phone_no,
organization), `isSignedIn`, `isAuthLoading`; actions `setUser`, `logout`
(full clear — E2E auth flows must launch with `clearState: true` because dev
prefill comes from env, not storage), `refresh`.

`/login/` success shapes `user` from the response; logout also fires
`triggerSessionExpired` where relevant.

---

## 4. Screen-by-screen flows

### 4.1 Login (`/auth`) — `LoginScreen` + `LoginForm`

- Branding: `Government of Meghalaya` / `Finance Department` / **`Pensioner Portal`**; logo image.
- Fields:
  - **Username** (label; placeholder `Enter your PPO No.`) — prefill: `EXPO_PUBLIC_PPO_NO` (dev builds).
  - **Password** (placeholder `Enter your password`, secure) — prefill: `EXPO_PUBLIC_PASSWORD`, **only when `__DEV__`**. Password never defaulted from env in release builds.
  - Visibility toggle (`accessibilityLabel` `Show password` → `Hide password`).
- **Submit** button. Validation (`LoginSchema`):
  - `Username is Required` / `Invalid Username` (username regex)
  - `Password is required` / `Password must be at least 8 characters` (max 50: `Password must be at most 50 characters`)
- On API failure: destructive alert `Login Error!` + server message.
- On success: snackbar `Login Success`; guard navigates to `redirect` or home.
- Below form:
  - **`New User? Register / Forgot Password`** (outline button) → `/auth/reg-instruction`.
  - **User Manual** card with **`View Manual`** button (`accessibilityLabel` `Open user manual`) → `/user-manual`.
- Footer partner logos.

### 4.2 Registration instruction (`/auth/reg-instruction`) — `RegistrationInstructionScreen`

- Chip `Guide`; title **`Registration Guide`**; subtitle `Follow the steps below to register or update your password`.
- Step 1 card **`Verify PPO Status`**: enter PPO Number → `Check PPO Status`.
  - Warning alert `If your PPO No. is showing as Invalid:` — support: email `dat-shil-meg@nic.in` (a11y `Email support at dat shil meg at nic dot in`), phone `0364-2226553` (a11y `Call support at 0364 222 6553`).
- Step 2 card **`Provide Verification Details`**: 1. Date of Birth (DOB) — alert `Family Pensioners:` `Do not enter your own DOB. Enter the DOB of the deceased primary pensioner from whom pension is received.`; 2. Bank Account Number; 3. Set Password (+ confirm).
- Destructive alert `Important` — `Please make sure all information provided matches your official treasury records before proceeding.`
- **User Manual** card (same `View Manual` / a11y `Open user manual` as login).
- **`Proceed to Registration`** → `/auth/register`.

### 4.3 Registration wizard (`/auth/register`) — `RegistrationScreen`

Shell renders `RegistrationStepHeader` (`Step {n} of 4`, step title/subtitle,
segmented progress bar) plus the active step form. On success the whole shell is
replaced by the success view.

Step titles/subtitles (step header):

1. **Check Your PPO Number** — `Enter your PPO Number below, then tap Check PPO Status.`
2. **Your Details** — `Enter your date of birth and your pension bank account number.`
3. **Create a Password** — `You will use this password every time you log in.`
4. **Confirm & Submit** — `Check your details below, then tap Confirm & Submit.`

- **Step 1 — `RegistrationStatusForm`:** PPO Number input (a11y `PPO Number`, placeholder `Enter your PPO Number`, autoprefills from `EXPO_PUBLIC_PPO_NO` in dev) + **`Check PPO Status`** button. Server result shows alert `PPO Status Success` / `PPO Status Error` + message. On success (when response includes `dob` + `bank_account_no`): saves PPO, stores validation, **auto-advances to Step 2**. Validation: `PPO Number is Required` / `Invalid PPO Number`.
- **Step 2 — `RegistrationPersonalForm`:** fields **Organization** (`Enter your organization`, min 3 chars, `Invalid organization` / `Organization is Required`), **Date of Birth** (a11y `Date of Birth, format year dash month dash day`, placeholder `DD-MM-YYYY`, auto-formats digits to `DD-MM-YYYY`, 10 chars; hint `Use the date of birth of the pensioner receiving the pension.`), **Bank Account Number** (placeholder `Enter your Bank Account Number`, exactly 16 digits: `Account no should be 16 in length` / `Account no should be not less then 16 in length`). Server cross-checks: `Date of birth does not match the registered details.` / `Bank account number does not match the registered details.` Buttons **Back** (preserves data) / **Next** (disabled until valid).
- **Step 3 — `RegistrationPasswordForm`:** **Password** (`Enter your Password`) and **Confirm Password** (`Confirm your Password`), each with show/hide toggles. Rules: 8–50 chars (`Password must be at least 8 characters` / `Password must be at most 50 characters`); mismatch → `Passwords do not match`. Buttons **Back** / **Next**.
- **Step 4 — `ConfirmRegistrationScreen`:** summary card rows `PPO Number`, `Date of Birth`, `Bank Account` (masked `•••• •••• <last6>`), `Password` (`••••••••`). Buttons **Back** / **Submit**. Submit first validates, then opens dialog:
  - `RegistrationConfirmDialog` — title **`Confirm Registration?`**, text `Are you sure you want to register as a pensioner? Please make sure all the details you entered are correct.`; actions **Cancel** (a11y `Cancel registration`) / **Confirm** (a11y `Confirm and submit registration`).
  - Confirm → `POST /api/create_pensioner/` `{ppo_no, dob, password (formatted), bank_account_number}`.
  - Server failure → inline destructive alert **`Registration Failed`** + message (form stays). Duplicate PPO → graceful server message (the E2E `registration-full` flow asserts this path).
  - Success → `RegistrationSuccessView`: **`Registration Successful`** / `Your account has been created` / `You can now log in with your PPO Number and the password you just created.` + **`Go to Login`** button (resets wizard → `/auth`).

### 4.4 Home, drawer & tabs (protected)

**Drawer** (`(drawer)/_layout.tsx`, custom content):

- Header: avatar + signed-in user's `name`.
- Items (in order): **Home** (`/`), **Digital Life Certificate** (`/dlc-status`), **Change Password** (`/change-password`), **Contact Us**, **Withdrawal**, **User Manual**, **Privacy Policy**, **About**.
- Footer: **Logout** (destructive) → clears auth store → lands on `/auth`.
- NOTE: there is **no Profile item** in the drawer (Profile is the third bottom tab).

**Home tab (Status)** — `VerificationStatusScreen` (fetch `POST /api/verification_status/` `{ppo_no}`; pull-to-refresh):

- Status badge: `Verification Status` + raw `ver_status` code (em dash `—` if absent).
- Section subtitle (verbatim, typo): **`Submit your Digital Life Cerificate`**.
- Card **`Digital Life Certificate`** — `Submit a quick photo to verify your identity and complete your Digital Life Certificate.` + **`SUBMIT DLC`** button (currently `accessibilityLabel` `Open user manual` — **mislabeled; Task 3 fixes it to `Submit Digital Life Certificate`**; visible text unchanged) → `/face-recognition`.
- Warning alert **`Important Notice`**: `Face Verification is required twice every Calendar year. Validity extends for 6 months from your last successful verification.`
- Footer logos.

### 4.5 DLC submission journey

**Tab "Submit DLC" (`/dlc`)** — `DLCScreen`:

- `DLCHeader` intro; `DLCInstructions` numbered steps.
- Optional warning banner from `regStatus` (`user.approval`):
  - `02` → `Since the photo you submitted was rejected, the app will capture your photo twice.`
  - `03` → `Since you haven't submitted your photo, the app will capture your photo twice.`
- `DLCAlerts` — camera-permission / camera-availability / offline diagnostics.
- `DLCActions`:
  - **`Capture Photo`** — disabled until front camera available + permission granted + online. On press → `router.push('/face-recognition', { registrationStatus: regStatus in ('02','03') ? '1' : '0' })`.
  - **`Allow Camera Access`** — request permission (shown when permission not yet granted).
  - **`Open App Settings`** — `Linking.openSettings()` (shown when permission blocked).

**`/face-recognition`** — `FaceVerificationScreen({ registrationStatus })` state machine. Phases: `camera → capturing/submitting → preview* → camera (2nd) → submitting → declaration | result | error`.

- **camera:** live front-camera feed with face detection; **blink-based auto capture — there is NO capture button (operator-assisted by design)**. Guidance messages (verbatim): `No Face Detected`, `Multiple Faces Detected`, `Please look straight`, `Center your face`, `Move closer to camera`, `Blink your eyes`, `Eyes Closed`, `Blink Detected`, `Please blink!!`, `Capturing photo...`, `Please wait...`. Capture triggers after ONE blink when the face is centered, large enough, and eyes reopen. Photo is compressed to ≤500 KB base64.
- **preview (registration mode only):** shows the captured photo; action label **`Submit Photo`** (first) / **`Take Second Photo`** (second); includes retake option. First photo approved → back to camera for photo 2; second approved → submit both images.
- **submitting:** `POST /api/verification/` `{image_1, image_2}` (this endpoint's body is **not** auto-encrypted/versioned by the request interceptor).
- **result** (`self_ver_code`): `00` → success card; `22` → rejected card; other (+ second image) → declaration card.
  - Success card: **`Verification Successful`** / `Identity confirmed` / `Official Approval` (`Your photo has been successfully submitted and is approved by the Treasury Officer at your registered Treasury Office for pension disbursement.`) + **`Go Back`** → `/`.
  - Rejected card: **`Photo Verification Failed`** (+ message; `Rejected Photo` badge on photo) + **`Retake Photo`** → `/face-recognition`.
  - Declaration card: **`Pending Official Approval`** + **`Submit Self Declaration`**.
- **declaration:** `FaceVerificationDeclarationForm` — Non-Employment question (Radio **Yes**/**No**, default **No**); Non-Marriage question appears only when `self_ver_code === '4'` (also Yes/No, default No). Empty selection → snackbar `Please select Yes or No`. Submit opens dialog:
  - `FaceVerificationConfirmDialog` — title **`Terms and Conditions.`**, text `By submitting this Declaration, you have agreed that the information furnished by you is true.\n\nAre you sure you want to submit?`; actions **No** / **Yes**.
  - **Yes** → `POST /api/lc/` `{selfVerNec, selfVerNmc, self_ver_code}` → result view.
- **error:** **`Something went wrong`** / `Please try again.` + **`Try Again`** (→ camera) + **`Go Back`** (`router.back()`).
- **loading:** spinner during `capturing` / `submitting`.

Status is then visible on Home and `/dlc-status` (see 4.6) — both poll
`/api/verification_status/` with pull-to-refresh.

### 4.6 DLC status (`/dlc-status`) — `DLCStatusScreen`

- Chip `Status`; title **`Digital Life Certificate`**; subtitle `Pensioner digital life verification status`.
- Section subtitle (dynamic): `ver_status === '22'` → **`Details of Photo Submitted`**; otherwise **`Details of Last Face Verification & Self Declarations`**.
- Rows (values or `—` if absent): **Date**, **Time**, **Place**.
- Declaration cards: **`Are you Re-Employed`** and (verbatim typo) **`Are u Re-Married`**, each showing the raw `ver_nec` value.
- Same **`Digital Life Certificate`** card + **`SUBMIT DLC`** button (mislabeled a11y `Open user manual` — Task 3 fixes) → `/face-recognition`.
- Warning alert `Important Notice` (same copy as home).
- Pull-to-refresh.

### 4.7 Withdrawal (`/withdrawal`) — `WithdrawalScreen` (static info)

- Chip `Service Request`; title **`` `Pensioner's` Life Certificate ``**; subtitle **`Application Withdrawal & Notice`**.
- **App Details** card with version pill **`v{APP_VERSION}`**.
- **Treasury Request**: `A request can be made to the Treasury Office by any user who wants to stop using the application.`
- **Important Notice**: `Please contact your designated Treasury Office to submit and finalize your withdrawal procedure.`

### 4.8 Profile (tab + `/profile/update`)

**Profile tab** — `ProfileScreen` (read-only; pull-to-refresh; data from auth store):

- Chip `Personal info`; heading = user's `name`; org line.
- Field rows: **Name, Username, UID, PPO No, Approval, Has DLC, Phone No, Organization** (`Phone No`/`Organization` fall back to `—`).
- **`Update Profile`** button → `/profile/update`.
- Fallback when no user: `No profile data available.`

**/profile/update** — `ProfileUpdateScreen`:

- Chip `Account`; title **`Update Profile`**; subtitle `Update your profile details below.`
- Fields (pre-filled from user): **Name** (`Enter your name`), **Organization** (`Enter your organization`), **Username** (`Enter your username`).
- **`Save Changes`** → `POST /api/update_profile/` `{name, organization, username}`.
- Success: **`Profile Updated`** / `Your profile has been updated.`
- Inline API error banner: `Failed to update profile. Please try again.` fallback.

### 4.9 Change password (`/change-password`) — `ChangePasswordScreen`

- Chip `Security Change`; title **`Change Password`**; subtitle `Update your account password to keep your pension profile secure.`
- Fields: **Old Password** (`Enter your old password`), **New Password** (`Enter your new password`), **Confirm New Password** (`Retype your new password`). New/confirm share the visibility toggle; old has its own.
- `PasswordRequiredments` live checklist driven by the watched new password.
- **`Change Password`** button (disabled unless form valid and not pending) → `ChangePasswordConfirmDialog` → `POST /api/change_password/` `{oldPassword (formatted), newPassword (formatted)}`.
- Success banner: **`Password Changed Successfully`** / `Your password has been updated. Please use your new password for future log ins.`
- Inline API error: server message, fallback `Failed to change password. Please try again.`
- Validator schema is `ChangePasswrodSchema` (original typo’d name).

### 4.10 Static pages

- **`/user-manual`** — `UserManualScreen`: header `Pensioner App User Guide` + `Easy Step-by-Step Instructions {APP_VERSION}`; helpline card (two `📞 Call <number>` buttons); Privacy Policy quick-link card; **Step-by-Step Guides** card with three Pressables (existing a11y labels):
  1. **Getting Started** — a11y `Open step-by-step guide to get started with the app` → `/user-manual/getting-started`
  2. **Digital Life Registration** — a11y `Open step-by-step guide for digital life registration` → `/user-manual/dlc`
  3. **Change Password** — a11y `Open step-by-step guide for changing your password` → `/user-manual/change-password`
- **`/user-manual/getting-started`** — `UserManualGettingStartedScreen`: sections `What is This App For?`, `Who Can Use This App?` (eligibility: Meghalaya Treasury PDA only, `(Bank pension accounts will be supported in future updates).`), `What Your Phone Needs` (front selfie camera ≥2MP, Android 5.0+, internet), `First Time Registration Steps`; family-pensioner DOB warning; Invalid PPO helpdesk (`Treasury Helpdesk: Nokrek Building, 3rd Secretariat, Lower Lachumiere, Shillong - 793001` + email button).
- **`/user-manual/dlc`** — `UserManualDLCScreen`: `Digital Life Registration` step-by-step guide.
- **`/user-manual/change-password`** — `UserManualChangePasswordScreen`: `Change Password` step-by-step guide.
- **`/privacy-policy`** — `PrivacyPolicyScreen` (policy overview, sections, grievance-redressal card).
- **`/contact-us`** — `ContactScreen`: **Finance Department** (address `3rd Secretariat, Nokrek Building, Lower Lachumiere, Meghalaya, Shillong - 793001`, Land Line, FAX, Email) + **Technical Support** (Email, Phone).
- **`/about`** — `AboutScreen`: title `` `Pensioner's` Life Certificate Verification ``; Version pill `Version {APP_VERSION}`; three description blocks (purpose, AI liveness/face-verification tech, self-declaration + status tracking).

---

## 5. Endpoint table

Base URL: configured at runtime (dev backend for the dev build). All calls go
through the shared axios client `src/shared/utils/http/`.

### 5.1 Transport behavior (request interceptor)

- Attaches **`Authorization: accessToken <token>`** (token from SecureStore; scheme is literally `accessToken`, not `Bearer`).
- Plain-object bodies are **auto-encrypted** (`encryptFields`) and stamped with `version: '24'`; pre-serialized bodies (`string`, `URLSearchParams`, `FormData`) pass through untouched. **Exception:** `/api/verification/` bodies are NOT encrypted/versioned.
- Login uses form-urlencoded (`Content-Type: application/x-www-form-urlencoded`).
- Session expiration fires a registered handler → app redirects to login.

### 5.2 Endpoints

| Constant                    | URL                                               | Method | Body (as sent on wire)                                      | Notes                                                                                                                        |
| --------------------------- | ------------------------------------------------- | ------ | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `AUTH.LOGIN`                | `/login/`                                         | POST   | form-urlencoded `username`, `password` (formatted)          | No token required; returns user payload (`approval`, `username`, `uid`, `name`, `has_dlc`) + token; shapes `auth.store.user` |
| `AUTH.LOGOUT`               | `/logout/`                                        | POST   | —                                                           | Clears session                                                                                                               |
| `AUTH.VALIDATE_TOKEN`       | `/api/validate_token/`                            | POST   | —                                                           | Token validation                                                                                                             |
| `AUTH.CURRENT_USER`         | `/current-user/`                                  | POST   | —                                                           | Refresh current user                                                                                                         |
| `USER.REGISTRATION_STATUS`  | `/get_registration_status/`                       | POST   | `{ppo_no}` (encrypted)                                      | PPO check; returns `{status, dob, bank_account_no}`; drives wizard Step 1→2                                                  |
| `USER.CREATE_PENSIONER`     | `/api/create_pensioner/`                          | POST   | `{ppo_no, dob, password (formatted), bank_account_number}`  | Registration submit (Step 4); duplicate → server error message                                                               |
| `USER.CHANGE_PASSWORD`      | `/api/change_password/`                           | POST   | `{oldPassword, newPassword}` (formatted)                    | Change-password submit                                                                                                       |
| `USER.UPDATE_PROFILE`       | `/api/update_profile/`                            | POST   | `{name, organization, username}`                            | Profile save                                                                                                                 |
| `VERIFICATION.VERIFICATION` | `/api/verification/`                              | POST   | `{image_1, image_2}` (base64 data; NOT encrypted/versioned) | Face verification photos                                                                                                     |
| `VERIFICATION.STATUS`       | `/api/verification_status/`                       | POST   | `{ppo_no}` (encrypted)                                      | Status shown on Home + `/dlc-status`                                                                                         |
| `DLC.CREATE`                | `/api/lc/`                                        | POST   | `{selfVerNec, selfVerNmc, self_ver_code}`                   | DLC self-declaration submit                                                                                                  |
| `DOCUMENTATION.MANUAL`      | `https://shillong.meg.nic.in/manual.html`         | GET    | —                                                           | External manual link                                                                                                         |
| `DOCUMENTATION.POLICY`      | `https://shillong.meg.nic.in/privacy_policy.html` | GET    | —                                                           | External policy link                                                                                                         |

### 5.3 Status codes observed in code

| Field                          | Value | Meaning (per current code)                                      |
| ------------------------------ | ----- | --------------------------------------------------------------- |
| `user.approval` / `regStatus`  | `02`  | Photo was rejected → capture twice                              |
| `user.approval` / `regStatus`  | `03`  | No photo submitted yet → capture twice                          |
| verification `self_ver_code`   | `00`  | Verification successful                                         |
| verification `self_ver_code`   | `22`  | Photo rejected                                                  |
| verification `self_ver_code`   | `4`   | Declaration form shows the Non-Marriage question                |
| `ver_status` (status endpoint) | `22`  | `/dlc-status` subtitle switches to `Details of Photo Submitted` |

> Note: the app itself is not fully consistent about `22` (rejected photo vs.
> photo-submitted state). Flows should assert UI strings, not code semantics.

---

## 6. Registry vs. reality — discrepancies found in Task 1

These are recorded so Tasks 3/5/8 (subagents) implement the plan’s intent against
the **real** UI (rule R2: testIDs only where elements exist; skip + report otherwise).

| Plan registry                                                                                             | Reality (source)                                                                                                                                              | Action                                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `home-manual-pensioner`, `home-manual-office`, `home-manual-fund`, `home-manual-forms` (4 home doc cards) | No such cards. `/user-manual` has **3** guide Pressables: Getting Started / Digital Life Registration / Change Password (existing a11y labels quoted in 4.10) | Task 3: add `home-manual-getting-started`, `home-manual-dlc`, `home-manual-change-password` to the 3 cards; Task 8 manual-cards flow opens those 3                 |
| `drawer-profile` (drawer item)                                                                            | Drawer has **no Profile item** (Profile is a bottom tab)                                                                                                      | Skip `drawer-profile`; drawer-navigation flow covers Home / DLC-status / Change-password / Contact-us / Withdrawal / User Manual / Privacy Policy / About / Logout |
| `fv-terms-no`, `fv-terms-yes` ("terms checkbox states")                                                   | No checkboxes; the T&C dialog has **No** / **Yes** AlertDialog buttons                                                                                        | Task 4: put ids on dialog buttons as `fv-terms-no` / `fv-terms-yes`                                                                                                |
| `fv-success-back`                                                                                         | Success card button is `Go Back` (→ `/`)                                                                                                                      | id on that button                                                                                                                                                  |
| `fv-retake`                                                                                               | `Retake Photo` on rejected-result card (→ `/face-recognition`) and retake affordance on photo preview                                                         | id on both                                                                                                                                                         |
| `fv-error-retry` / `fv-error-back`                                                                        | `Try Again` / `Go Back` on error view                                                                                                                         | ids on those buttons                                                                                                                                               |
| `withdrawal-input`                                                                                        | Withdrawal is static (no inputs); use readback container/card                                                                                                 | put id on the Treasury Request / App Details card (readback container)                                                                                             |
| login screen "open manual"                                                                                | Real a11y label `Open user manual` on `View Manual`                                                                                                           | `login-view-manual` id + keep/reuse label                                                                                                                          |

---

## 7. Dev / test conventions relevant to the suite

- **Dev prefill:** `EXPO_PUBLIC_PPO_NO` prefills login username AND registration
  Step 1; `EXPO_PUBLIC_PASSWORD` prefills login password **only in `__DEV__`**.
  Auth flows must launch with `clearState: true`; helper `login.yaml` can rely on
  prefill or explicit fill.
- **Selectors:** prefer `id:` (= RN `testID`). Fallback to exact visible text.
  Never author selectors from screenshots alone.
- **Reload after testID changes:** Metro fast refresh picks up new `testID`s;
  relaunch the app before running flows (plan: Tasks 2–5 then reload).
- The two SUBMIT DLC buttons (home `verification-status.tsx` and
  `dlc-status.tsx`) currently have the mislabeled a11y `Open user manual`;
  Task 3 fixes BOTH to `Submit Digital Life Certificate`.
- Registration Step 1/2 validate against treasury data returned by the PPO
  check; E2E registration uses `REG_*` env values that must match real records
  (`REG_DOB`, `REG_BANK`, `REG_ORGANIZATION`, `REG_PASSWORD`).
- Known pre-existing type issue (NOT introduced here):
  `src/shared/hooks/use-verification-status.ts` imports
  `VerificationStatusT` from `'../types'` (= `src/shared/types`), which does not
  export it (it lives in `src/features/verification/types/verification-status.ts`).
  This is a type-only import used in a generic position (babel strips it at
  runtime, so the app runs), but `npx tsc --noEmit` will flag it. Recommend a
  small fix commit before/with the testID tasks.
