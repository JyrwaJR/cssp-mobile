# Face Recognition Flow Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modify the face recognition camera flow to correctly handle the two-photo registration process by introducing a preview step after both the first and second photo captures, ensuring user approval before submission.

**Architecture:**
1.  **State Transition:** Explicitly transition phase to `'preview'` after each capture in registration mode.
2.  **Flow Logic:**
    -   1st Photo -> Preview -> Approve -> Return to Camera.
    -   2nd Photo -> Preview -> Approve -> Submit.
3.  **Component Interaction:** Use `FaceVerificationPhotoPreviewStep` for both previews, detecting which photo is being approved based on state.

**Tech Stack:** React Native, Expo, react-native-vision-camera, state hooks.

---

### Task 1: Update `capturePhoto` Logic

**Files:**
- Modify: `src/features/verification/screens/face-verification.tsx:145-165`

- [ ] **Step 1: Modify `capturePhoto` to transition to 'preview' after 1st capture**

```typescript
      // Registration mode: first photo → preview screen
      if (registrationStatus === 1 && !image1) {
        setImage1(cleanBase64);
        isCapturing.current = false;
        // Fix: Transition to preview instead of just returning
        updatePhase('preview'); 
        return;
      }
```

- [ ] **Step 2: Modify `capturePhoto` to transition to 'preview' after 2nd capture**

```typescript
      // Registration mode: second photo → preview screen (was: submit directly)
      if (registrationStatus === 1 && image1 && !image2) {
        setImage2(cleanBase64);
        isCapturing.current = false;
        // Fix: Transition to preview instead of submitting immediately
        updatePhase('preview');
        return;
      }
```

### Task 2: Update Preview Screen Submission

**Files:**
- Modify: `src/features/verification/screens/face-verification.tsx:412`

- [ ] **Step 1: Update `FaceVerificationPhotoPreviewStep` submission logic**

```tsx
        {/* PHASE: preview — first/second photo confirmation (registration mode only) */}
        {phase === 'preview' && (
          <FaceVerificationPhotoPreviewStep
            previewUri={previewUri}
            onSubmitPress={() => {
              if (registrationStatus === 1 && image1 && !image2) {
                 // Approved 1st photo, need to take 2nd
                 updatePhase('camera');
                 updateMsg('Please blink!!');
              } else if (registrationStatus === 1 && image1 && image2) {
                 // Approved 2nd photo, ready to submit
                 submitVerification(image1, image2);
              }
            }}
          />
        )}
```

### Task 3: Cleanup and Verification

**Files:**
- Modify: `src/features/verification/screens/face-verification.tsx`

- [ ] **Step 1: Ensure submission cleanup**
Ensure `isCapturing.current` is handled correctly if user goes back during preview.

- [ ] **Step 2: Commit changes**

```bash
git add src/features/verification/screens/face-verification.tsx
git commit -m "fix: face verification registration flow with two previews"
```
