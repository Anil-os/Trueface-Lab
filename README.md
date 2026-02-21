# Face Harmony Analyzer

A responsive Next.js web application that analyzes facial proportions in real-time using MediaPipe FaceMesh and the golden ratio (φ ≈ 1.618).

## Features

- 🎥 **Real-time face detection** using MediaPipe FaceMesh (468 landmarks)
- 📊 **Facial harmony scoring** based on the golden ratio
- 🎨 **Modern, responsive UI** built with TailwindCSS
- 🔒 **100% privacy-focused** - all processing happens in the browser
- 📱 **Mobile & desktop compatible**
- ⚡ **Optimized performance** with requestAnimationFrame
- 🎯 **Visual feedback** with facial mesh overlay and scanning animations

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Face Detection:** MediaPipe FaceMesh
- **Measurements:** Custom golden ratio algorithm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A webcam/camera
- Modern browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd "c:\Users\Hp\OneDrive\Desktop\TrueFace Lab"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
TrueFace Lab/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with features
│   ├── globals.css         # Global styles and animations
│   └── scan/
│       └── page.tsx        # Main scanning page
├── components/
│   ├── CameraView.tsx      # Webcam handling component
│   ├── FaceMeshCanvas.tsx  # Face mesh visualization
│   └── ScorePanel.tsx      # Score display component
├── lib/
│   └── faceMath.ts         # Facial harmony calculations
├── public/                 # Static assets
└── package.json
```

## How It Works

### 1. Face Detection
The application uses MediaPipe FaceMesh to detect 468 precise facial landmarks in real-time from your webcam feed.

### 2. Measurements
The `faceMath.ts` utility calculates:
- **Face width:** Distance between temples (landmarks 234-454)
- **Face height:** Distance from forehead to chin (landmarks 10-152)
- **Eye distance:** Distance between inner eye corners (landmarks 33-263)
- **Nose alignment:** Symmetry check using nose tip (landmark 1)

### 3. Scoring Algorithm
Each measurement is compared against the golden ratio (1.618):
- **Face Ratio Score (35%):** Height/Width ratio
- **Eye Ratio Score (35%):** Face width/Eye distance ratio
- **Symmetry Score (30%):** Nose centerline alignment

The final harmony score is a weighted average (0-100):
- **Green (>80):** Excellent harmony
- **Yellow (>60):** Good harmony
- **Red (<60):** Fair harmony

## Components

### CameraView
Handles webcam access and displays the video stream with:
- Camera permission requests
- Error handling
- Loading states
- Visual scanning frame

### FaceMeshCanvas
Renders facial landmarks on a canvas overlay:
- 468 landmark points
- Key measurement lines
- Face contour visualization
- Toggle-able mesh display

### ScorePanel
Displays harmony scores with:
- Circular progress indicator
- Component score breakdowns
- Color-coded feedback
- Privacy notice

## Performance Optimizations

- Prevents MediaPipe re-initialization on re-renders using refs
- Uses `requestAnimationFrame` for smooth rendering
- Optimized canvas drawing operations
- Lazy-loaded MediaPipe scripts from CDN
- Responsive layout with CSS transforms

## Privacy & Security

✅ All face detection happens in your browser  
✅ No images are uploaded to any server  
✅ No data is stored or transmitted  
✅ Camera access is only used for real-time analysis  

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

**Note:** Camera access requires HTTPS in production (HTTP is fine for localhost).

## Customization

### Adjust Scoring Weights
Edit `lib/faceMath.ts` to change the scoring algorithm:
```typescript
const overall = (
  faceRatioScore * 0.35 +  // Adjust weights here
  eyeRatioScore * 0.35 +
  symmetryScore * 0.30
);
```

### Change Color Thresholds
Modify `getScoreColor()` in `lib/faceMath.ts`:
```typescript
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-500';  // Change thresholds
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
}
```

### Customize UI Colors
Edit `app/globals.css` and TailwindCSS classes in components.

## Troubleshooting

### Camera not working
- Ensure camera permissions are granted
- Check if camera is being used by another application
- Try a different browser
- Use HTTPS (required for camera access in production)

### MediaPipe loading errors
- Check internet connection (scripts load from CDN)
- Clear browser cache and reload
- Ensure browser is up to date

### Low FPS on mobile
- Reduce video resolution in `CameraView.tsx`
- Disable mesh visualization
- Close other apps to free up resources

## License

This project is for educational and entertainment purposes. Results do not define beauty or attractiveness.

## Credits

- **MediaPipe** by Google for face detection
- **Next.js** by Vercel
- **TailwindCSS** for styling

---

Built with ❤️ using Next.js, TypeScript, and MediaPipe
