# 📸 Capture Feature Guide

## New Capture Functionality

The Face Harmony Analyzer now includes a powerful capture feature that lets you save your facial harmony score with a beautiful overlay!

### ✨ Features Added

1. **Capture Button**
   - Appears when face is detected
   - Takes a snapshot of current video frame
   - Preserves facial landmarks and harmony score

2. **Captured Image View**
   - Displays your captured photo
   - Shows facial mesh overlay
   - "Captured" badge indicator
   - Toggle mesh visibility on/off

3. **Download with Score Overlay**
   - Downloads image with embedded score information
   - Includes:
     - Overall harmony score (in large text)
     - Face proportions score
     - Eye spacing score
     - Symmetry score
   - Color-coded score (Green/Yellow/Red)
   - Professional overlay design

4. **Retake Option**
   - Easily return to live scanning mode
   - Take multiple captures
   - Compare different poses/angles

### 🎯 How to Use

#### Step 1: Start Scanning
1. Go to `/scan` page
2. Allow camera access
3. Position your face in frame
4. Wait for face detection (green indicator)

#### Step 2: Capture
1. Click **"Capture Photo"** button
2. Photo is instantly captured with current score
3. View switches to captured image mode

#### Step 3: Review
- See your frozen image with score
- Toggle mesh on/off to view details
- Review component scores on the right panel

#### Step 4: Download
1. Click **"Download Result"** button
2. Image saves with embedded score overlay
3. Filename includes your score and timestamp
4. Example: `face-harmony-score-85-1708456789.png`

#### Step 5: Retake (Optional)
1. Click **"Retake Photo"** to return to live mode
2. Adjust position/lighting
3. Capture again for better results

### 🎨 UI States

**Live Scanning Mode:**
- Real-time video feed
- Live mesh overlay
- Scanning line animation
- "Capture Photo" button (enabled when face detected)
- "Back to Home" button

**Captured Mode:**
- Static captured image
- Preserved facial mesh
- Green "Captured" badge
- "Download Result" button
- "Retake Photo" button
- "Back to Home" button

### 💾 Download Output

The downloaded image includes:

**Visual Elements:**
- Your captured photo
- Score overlay box (top-left corner)
- Purple border around score box
- Semi-transparent dark background

**Score Information:**
```
Face Harmony Score
85                    ← Large colored number
Face Proportions: 82
Eye Spacing: 88
Symmetry: 85
```

**Color Coding:**
- Green (80-100): Excellent
- Yellow (60-79): Good
- Red (0-59): Fair

### 🔧 Technical Details

**Capture Process:**
1. Video frame captured using HTML5 Canvas
2. Mirrored horizontally for natural view
3. Landmarks and score frozen at capture moment
4. Image stored as base64 data URL

**Download Process:**
1. Creates composite canvas
2. Draws captured image
3. Overlays score information
4. Renders colored text and borders
5. Converts to PNG format
6. Triggers browser download

### 📱 Mobile Support

- Works on mobile devices
- Touch-friendly buttons
- Responsive button layout
- Optimized for vertical/horizontal views

### 🎓 Tips for Best Results

1. **Good Lighting**: Ensures accurate face detection
2. **Centered Position**: Keep face in center of frame
3. **Straight Angle**: Look directly at camera
4. **Wait for Detection**: Capture button enables when ready
5. **Try Multiple Captures**: Compare different poses
6. **Share Your Results**: Downloaded images are shareable!

### 🆕 Updated Instructions

The scan page now shows updated instructions:
- ✓ Position your face in the center of the frame
- ✓ Ensure good lighting for accurate detection
- ✓ Keep your head straight and look at the camera
- ✓ Click "Capture Photo" to save your score
- ✓ Download the result image with your harmony score

---

Enjoy capturing and sharing your Face Harmony scores! 📸✨
