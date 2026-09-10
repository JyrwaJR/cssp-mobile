# Face Verification Flow

## Overview

The face verification flow is controlled by two things:

- `phase` — controls which screen/state is displayed.
- `self_ver_code` — returned by the backend after face verification and determines the next business state.

---

## Flow

```text
CAMERA
  │
  │ User blinks
  ▼
capturePhoto()
  │
  ├── registrationStatus === 1
  │     │
  │     ├── image1 is empty
  │     │       │
  │     │       ▼
  │     │     PREVIEW
  │     │       │
  │     │       └── Take Second Photo
  │     │                 │
  │     │                 ▼
  │     │               CAMERA
  │     │
  │     └── image1 exists && image2 is empty
  │             │
  │             ▼
  │           PREVIEW
  │             │
  │             └── Submit Photo
  │                       │
  │                       ▼
  │             submitVerification(image1, image2)
  │
  └── registrationStatus === 0
        │
        ▼
  submitVerification(image1, '')
        │
        ▼
  self_ver_code
        │
        ├── '00'
        │     │
        │     ▼
        │   RESULT
        │   Verification Successful
        │
        ├── '22'
        │     │
        │     ▼
        │   RESULT
        │   Photo Rejected
        │
        ├── '4' / '04'
        │     │
        │     ▼
        │   DECLARATION
        │     │
        │     └── Submit DLC
        │              │
        │              ▼
        │            RESULT
        │
        └── Other code
              │
              ├── image2 exists
              │      │
              │      ▼
              │    RESULT
              │    Pending Approval
              │      │
              │      └── Submit Self Declaration
              │
              └── image2 does not exist
                     │
                     ▼
                   ERROR
```

---

## Phase 1 — Camera

```text
phase = 'camera'
```

The camera is displayed and face/liveness detection runs.

When a valid face is detected and the user blinks:

```text
blink detected
      ↓
capturePhoto()
```

The camera remains mounted during the native photo capture.

---

## Phase 2 — Capturing

```text
camera
  ↓
capturePhoto()
  ↓
phase = 'capturing'
```

The photo is captured and compressed to the required size.

After compression, the flow depends on `registrationStatus`.

---

## Phase 3 — Registration Mode

When:

```text
registrationStatus === 1
```

two photos are required.

### First photo

```text
image1 === ''
```

The captured photo is stored:

```text
image1 = captured photo
```

Then:

```text
phase = 'preview'
```

No API request is made yet.

```text
CAMERA
  ↓
capturePhoto()
  ↓
image1
  ↓
PREVIEW
  ↓
Take Second Photo
  ↓
CAMERA
```

### Second photo

When:

```text
image1 !== ''
image2 === ''
```

the second captured photo is stored:

```text
image2 = captured photo
```

Then:

```text
phase = 'preview'
```

Again, the API is not called immediately.

The user must approve the second photo.

```text
CAMERA
  ↓
capturePhoto()
  ↓
image2
  ↓
PREVIEW
  ↓
Submit Photo
  ↓
submitVerification(image1, image2)
```

---

## Phase 4 — Normal Mode

When:

```text
registrationStatus === 0
```

only one photo is required.

The captured photo is immediately submitted:

```text
CAMERA
  ↓
capturePhoto()
  ↓
image1
  ↓
submitVerification(image1, '')
```

There is no photo preview step in normal mode.

---

# Phase 5 — Face Verification Submission

`submitVerification()` changes the phase to:

```text
phase = 'submitting'
```

The API receives:

```text
image_1
image_2
```

The backend returns:

```text
self_ver_code
msg
```

`self_ver_code` determines the next phase.

---

## `self_ver_code === '00'`

```text
submitVerification()
      ↓
self_ver_code = '00'
      ↓
phase = 'result'
```

Result screen:

```text
Verification Successful
```

---

## `self_ver_code === '22'`

```text
submitVerification()
      ↓
self_ver_code = '22'
      ↓
phase = 'result'
```

Result screen:

```text
Photo Verification Failed
      ↓
Retake Photo
      ↓
CAMERA
```

The rejected photo is displayed when available.

---

## `self_ver_code === '4'` or `'04'`

```text
submitVerification()
      ↓
self_ver_code = '4' / '04'
      ↓
phase = 'declaration'
```

The face-verification result screen is skipped.

The user goes directly to the declaration form.

```text
DECLARATION
    │
    ├── Non-Employment declaration
    │
    └── if self_ver_code === '4'
            │
            └── Non-Marriage / Re-marriage declaration
```

After validation:

```text
Submit Declaration
      ↓
Confirmation Dialog
      ↓
Confirm
      ↓
submitDLC()
      ↓
phase = 'submitting'
      ↓
DLC response
      ↓
phase = 'result'
```

---

# Phase 6 — Second Photo Result

When the verification request included a second image:

```text
submitVerification(image1, image2)
```

and the response is neither:

```text
'00'
```

nor:

```text
'22'
```

the result phase displays the pending-approval state.

```text
image1 + image2
      ↓
submitVerification()
      ↓
self_ver_code
      ↓
RESULT
      ↓
Pending Official Approval
      ↓
Submit Self Declaration
```

The user then proceeds to the next declaration/capture flow through:

```text
onProceedToDeclaration()
```

---

# Complete State Transition

```text
                         ┌──────────────┐
                         │    CAMERA    │
                         └──────┬───────┘
                                │
                              blink
                                │
                                ▼
                         ┌──────────────┐
                         │   CAPTURE    │
                         └──────┬───────┘
                                │
                ┌───────────────┴───────────────┐
                │                               │
        registrationStatus=1          registrationStatus=0
                │                               │
             image1                             │
                │                               │
                ▼                               ▼
           ┌─────────┐                 submitVerification
           │ PREVIEW │                    (image1, '')
           └────┬────┘                         │
                │                              │
         Take Second Photo                     │
                │                              │
                ▼                              │
             CAMERA                            │
                │                              │
              blink                            │
                │                              │
                ▼                              │
             image2                            │
                │                              │
                ▼                              │
           ┌─────────┐                         │
           │ PREVIEW │                         │
           └────┬────┘                         │
                │                              │
          Submit Photo                         │
                │                              │
                └──────────────┬───────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ submitVerification()│
                    └──────────┬──────────┘
                               │
                               ▼
                       ┌───────────────┐
                       │ self_ver_code │
                       └───────┬───────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
            '00'              '22'            '4'/'04'
             │                 │                 │
             ▼                 ▼                 ▼
          RESULT            RESULT          DECLARATION
          Success           Rejected             │
                                                 │
                                           Submit DLC
                                                 │
                                                 ▼
                                              RESULT
```

## Key Rules

1. **Camera capture does not always mean API submission.**

   - Registration first photo → preview.
   - Registration second photo → preview.
   - Normal mode photo → immediate submission.

2. **`self_ver_code` is only available after `submitVerification()`.**

3. **`'00'` always goes to `result`.**

4. **`'22'` always goes to `result` with the rejection UI.**

5. **`'4'` / `'04'` goes directly to `declaration`.**

6. **A second-image submission with another response code goes to `result` and allows Self Declaration.**

7. **DLC submission happens only after the declaration has been validated and confirmed.**

8. **DLC success returns to `result`.**
