# 🧊 Rate My Fridge

An AI-powered iOS app that analyzes your fridge photo and tells you what it says about you. Open your fridge, snap a photo, and get a witty rating, a fridge personality type, a roast, and recipe suggestions, all powered by AI vision.

---

## Features

-  **Camera & Gallery Support** — Take a live photo or pick one from your library
-  **AI Vision Analysis** — Sends your fridge image to Gemini 1.5 Flash for analysis
-  **Fridge Score** — Rated out of 10 with a dynamic score bar
-  **Personality Type** — Fun archetypes like "The Condiment Hoarder" or "The Sad Bachelor"
-  **The Roast** — One savage but lighthearted sentence about your fridge
-  **Silver Linings** — At least two positive things about your fridge
-  **Recipe Suggestions** — Two recipes based on what's actually in your fridge
-  **Shareable Result Card** — Share your fridge report with friends

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | React Native + Expo (TypeScript) |
| Navigation | React Navigation (Native Stack) |
| Camera / Gallery | expo-image-picker |
| File System | expo-file-system |
| AI Vision | Google Gemini 1.5 Flash API |
| HTTP Client | Axios |

---

## Project Structure

```
rate-my-fridge/
├── App.tsx                        # Root component with navigation setup
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Landing page
│   │   ├── CameraScreen.tsx       # Photo capture and upload
│   │   └── ResultScreen.tsx       # AI result card display
│   └── services/
│       └── api.ts                 # Gemini API integration
├── assets/
├── app.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Expo CLI (`npm install -g expo-cli`)
- Xcode (for iOS Simulator)
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com))

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/rate-my-fridge.git
cd rate-my-fridge

# Install dependencies
npm install
npx expo install expo-camera expo-image-picker expo-media-library expo-file-system expo-sharing
npm install @react-navigation/native @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context
```

### Configuration

Open `src/services/api.ts` and replace the API key:

```ts
const GEMINI_API_KEY = 'your-gemini-api-key-here';
```

### Running the App

```bash
npx expo start
```

Press `i` to open the iOS Simulator, or scan the QR code with Expo Go on your physical device.

---

## How It Works

1. User takes or selects a fridge photo
2. The image is read as a Base64 string using `expo-file-system`
3. The Base64 image is sent to the Gemini 1.5 Flash API along with a structured prompt
4. Gemini returns a JSON response with score, personality type, roast, positives, and recipes
5. The result is displayed on a styled result card
6. The user can share their result or scan another fridge

---

## Future Features

-  Friends leaderboard — compete for the best fridge score
-  Fridge history timeline — track improvements over time
-  Grocery suggestions — based on what's missing
-  User auth — save and sync your fridge history

---

## License

MIT
