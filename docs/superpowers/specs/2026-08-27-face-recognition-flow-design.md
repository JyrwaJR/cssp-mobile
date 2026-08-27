# Design: Face Recognition Flow Fix

## Overview
Fix the face recognition photo flow for registration (two-photo) mode. The current implementation fails to transition to the preview state after the first photo capture, leaving the user in a loading state.

## Design
1.  **Phase Management:**
    *   Transition `phase` to `'preview'` explicitly after `capturePhoto` completes the first capture.
    *   Use the existing `phase === 'preview'` state to display `FaceVerificationPhotoPreviewStep`.

2.  **Capture Flow (Registration Mode):**
    *   **Capture 1:** Camera -> `capturePhoto` -> set `image1` -> `updatePhase('preview')`.
    *   **Preview 1:** Display preview -> `onSubmitPress` -> `updatePhase('camera')` (to capture second photo).
    *   **Capture 2:** Camera -> `capturePhoto` -> set `image2` -> `updatePhase('preview')`.
    *   **Preview 2:** Display preview -> `onSubmitPress` -> `submitVerification(image1, image2)`.

3.  **Components:**
    *   `FaceVerificationPhotoPreviewStep` must differentiate between approving 1st photo and 2nd photo based on state (e.g., check if `image2` is empty).

## Data Flow
*   `registrationStatus === 1`
*   `setImage1` (capture 1)
*   `setImage2` (capture 2)
*   `submitVerification` (only after preview of 2nd photo)
