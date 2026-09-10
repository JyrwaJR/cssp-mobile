# Face Verification & DLC Flow

Interactive diagram: [verification-flow.html](./verification-flow.html)
(open in a browser — light/dark themes, phase focus views, trace animation).

This document describes the pensioner face-verification and
declaration-of-self (DLC) flow implemented in
`src/features/verification/`. Endpoint semantics were confirmed against the
screen, hook, and view components; the HTTP transport itself is the Meghalaya
government pension service (`https://shillong.meg.nic.in/PensionersApp/v1/`).

## Entry point

The flow starts on the **Status Screen** (`verification-status.tsx`).

- `useVerificationStatus` reads the current verification state and posts
  `POST /api/verification_status/` to render the status badge, date/time,
  declarations, and the **SUBMIT DLC** CTA.
- Tapping **SUBMIT DLC** (`verification-status.tsx:86`) pushes
  `PAGE_ROUTES.FACE_RECOGNITION` (`/face-recognition`) → the Camera screen.
- When the auth store reports `regStatus` `"02"`/`"03"` the app switches to
  two-photo **registration mode**: it captures 2 photos, shows an approval
  preview, and displays a warning banner.

## Phase machine

```
status ──SUBMIT DLC──▶ camera ──capture + upload──▶ submitting
                                                       │
                                          POST /api/verification/
                                                       │
                                                       ▼
                                                    result
                          ┌───────────▲───────────────┤
                          │           │               │
                     self_ver_code    │          self_ver_code
                     "4" / "04"       │          "00" | "22" | other
                          │           │               │
                          ▼           │          ┌────┴─────┐
                      declaration ────┘      success     retake/error
                    POST /api/lc/         (Go Back →    (→ camera /
                                             Home)         → status)
```

| Stage         | What happens                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------- |
| `status`      | Status screen; entry point. `POST /api/verification_status/` renders badge/date/declarations + SUBMIT DLC CTA. |
| `camera`      | Blink capture; 1 photo (normal) or 2 photos with approval preview (registration `regStatus` 02/03).            |
| `submitting`  | Compress image(s) to ≤ 500 KB → base64 → `POST /api/verification/`.                                            |
| `result`      | Branches on `self_ver_code` (see below).                                                                       |
| `declaration` | Self-declaration (DLC) questionnaire → `POST /api/lc/` → re-branch on the result.                              |
| `done`        | Terminal: result view **Go Back** (`router.push(PAGE_ROUTES.HOME)`).                                           |
| `error`       | **Try Again** → camera; **Go Back** (`router.back()`) → Status Screen.                                         |

## `self_ver_code` branching

After `POST /api/verification/` succeeds, the response carries a
`self_ver_code` that decides the UI:

| code                              | Meaning                   | UI action                                                    |
| --------------------------------- | ------------------------- | ------------------------------------------------------------ |
| `"00"`                            | Verification success      | `result` phase → **SuccessStatusCard**.                      |
| `"22"`                            | Rejected                  | `result` phase → **RejectStatusCard** with **Retake**.       |
| `"4"` / `"04"`                    | Self-declaration required | `declaration` phase → `POST /api/lc/`.                       |
| other + 2nd image (`img2 !== ''`) | Registration upload       | `result` phase → **DeclarationStatusCard** (proceed prompt). |
| other                             | Unrecognized / failed     | `error` phase with the server message.                       |

> Result-view rendering (`face-verification-result-view.tsx:151–187`):
> `"00"` renders the green success card; `"22"` renders the rejection card
> with **Retake** (`router.push(PAGE_ROUTES.FACE_RECOGNITION)`) only when
> there is no second image; every other code renders the
> **DeclarationStatusCard** with a proceed button into the declaration phase.

> Auth-store side effect (`use-verification.ts:42–56`): on success with
> `self_ver_code !== "03"` and stored `approval !== "00"`, the store's
> `approval` is set to `"01"` (marks the photo as submitted). A
> `"03"` response skips that update.

## Declaration (`POST /api/lc/`)

When `self_ver_code` is `"4"`/`"04"`:

1. The declaration form asks the **NEC** question always, and the **NMC**
   (marriage) question only when the code is exactly `"4"`
   (`face-verification-declaration-form.tsx:39`).
2. Answers are confirmed in a **T&C Yes** dialog.
3. Confirmation posts `POST /api/lc/` with the declaration answers and the
   originating `self_ver_code`.
4. The returned result re-branches on the new `self_ver_code`
   (success card, retake, or error).

## Error handling

| Screen           | Action        | Behavior                                                                                                                    |
| ---------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| error            | **Try Again** | Only shown when the parent wires `onTryAgainPress`; returns to the capture step (`face-verification-error-view.tsx:51–58`). |
| error            | **Go Back**   | `router.back()` → Status Screen (`face-verification-error-view.tsx:59`).                                                    |
| result (`"22"`)  | **Retake**    | `router.push(PAGE_ROUTES.FACE_RECOGNITION)` → back to the capture screen.                                                   |
| result / success | **Go Back**   | Pushes `PAGE_ROUTES.HOME` → `done` terminal (result view).                                                                  |
| success          | —             | Terminal; no return path into the flow.                                                                                     |

## API endpoints

| Endpoint                         | Purpose                                                             |
| -------------------------------- | ------------------------------------------------------------------- |
| `POST /api/verification_status/` | Status screen data (badge, date/time, declarations, DLC CTA state). |
| `POST /api/verification/`        | Photo upload: base64 image(s) ≤ 500 KB, returns `self_ver_code`.    |
| `POST /api/lc/`                  | Declaration submission; result re-branches the flow.                |

## Source references

| File                                                                          | Role                                                                   |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `src/features/verification/screens/verification-status.tsx`                   | Status screen, entry push (line 86).                                   |
| `src/features/verification/screens/face-verification.tsx`                     | Phase machine, capture/upload, `self_ver_code` branch (lines 109–119). |
| `src/features/verification/components/face-verification-error-view.tsx`       | Error screen: `router.back()` + optional Try Again.                    |
| `src/features/verification/components/face-verification-result-view.tsx`      | Result screen: success/retake cards, Go Back → Home.                   |
| `src/features/verification/components/face-verification-declaration-form.tsx` | Declaration form: NEC always, NMC when code `"4"`.                     |
| `src/features/verification/hooks/use-verification.ts`                         | Verification upload (`approval` side effect).                          |
| `src/features/verification/hooks/use-dlc-submit.ts`                           | Declaration (`/api/lc/`) submission.                                   |
