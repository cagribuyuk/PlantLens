# PlantLens

PlantLens is an AI-powered mobile application that identifies plants from photos.

Users can take a photo or choose one from the gallery, select the visible plant part, and receive plant identification results powered by the Pl@ntNet API.

## Features

- Camera and gallery image selection
- Plant part selection: Auto, Leaf, Flower, Fruit, Bark
- AI-powered plant identification
- Best match and confidence score
- Alternative predictions
- Taxonomy information
- User-friendly loading and error states

<img width="120" height="200" alt="Screenshot_20260914_131822" src="https://github.com/user-attachments/assets/c348cd2d-2582-4513-9653-57e2e505a649" />
<img width="120" height="200" alt="Screenshot_20260914_131848" src="https://github.com/user-attachments/assets/d55eefb4-5742-49f2-8be8-b8961774e0aa" />
<img width="120" height="200" alt="Screenshot_20260914_131902" src="https://github.com/user-attachments/assets/b17e7d1c-309d-441c-80bf-7156bb1fd00c" />
<img width="120" height="200" alt="Screenshot_20260914_131906" src="https://github.com/user-attachments/assets/170eca48-3cd8-4929-b4b1-5b6bcd9300b8" />

## Tech Stack
### Client
- React Native
- TypeScript
- Expo
- Expo Router
- Expo Image Picker
- TanStack Query
- React Context
- React Native Safe Area Context

### Server
- Node.js
- Express
- TypeScript
- Zod
- Pino / pino-http

### AI Provider
- Pl@ntNet Plant Identification API

## Architecture

```text
React Native App
      ↓
React Context
      ↓
TanStack Query
      ↓
PlantLens API
      ↓
Pl@ntNet API
```

The mobile application does not communicate directly with Pl@ntNet. The backend protects the API key, validates requests, maps third-party errors, and provides structured logging.

## Project Structure

```text
PlantLens/
├── client/
│   └── src/
│       ├── app/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── types/
│
├── server/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── schemas/
│       └── services/
│
└── README.md
```

## Environment Variables

### Server

Copy the example file:

```bash
cp server/.env.example server/.env
```

```env
PORT=3000
PLANTNET_API_KEY=your_plantnet_api_key
```

### Client

```bash
cp client/.env.example client/.env
```

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:3000
```

## Run Locally

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

### 2. Connect the Android emulator to the local backend

```bash
adb reverse tcp:3000 tcp:3000
```

This maps the emulator's `127.0.0.1:3000` to the host machine's `127.0.0.1:3000`.

### 3. Start the mobile application

```bash
cd client
npm install
npx expo start
```

Press `a` in the Expo terminal to open the app on the Android emulator.

## API

### Identify Plant

```http
POST /api/plants/identify
```

The client sends the selected image as Base64 JSON together with the file metadata and selected plant organ.

#### Request

```json
{
  "imageBase64": "<base64-image>",
  "fileName": "plant.jpg",
  "mimeType": "image/jpeg",
  "organ": "flower"
}
```

Supported `organ` values:

```text
auto
leaf
flower
fruit
bark
```

#### Success Response

```json
{
  "bestMatch": "Gerbera spp.",
  "results": [
    {
      "score": 0.93,
      "species": {
        "scientificNameWithoutAuthor": "Gerbera",
        "scientificName": "Gerbera spp.",
        "commonNames": [
          "Gerbera Daisy"
        ],
        "family": {
          "scientificName": "Asteraceae"
        },
        "genus": {
          "scientificName": "Gerbera"
        }
      }
    }
  ],
  "version": "latest"
}
```

The first item in `results` represents the highest-confidence prediction. Additional items are shown in the application as alternative matches.

#### Error Response

```json
{
  "code": "INVALID_IMAGE",
  "message": "The selected image could not be processed.",
  "requestId": "c8e1a6b0-..."
}
```

Possible failures include invalid images, timeouts, rate limits, no identification result, and third-party API errors.

### Health Check

```http
GET /health
```

#### Response

```json
{
  "status": "ok",
  "service": "PlantLens API"
}
```
## Engineering Notes

- Pl@ntNet API credentials are stored only on the server.
- Zod is used for backend validation.
- Pino provides structured logging and request IDs.
- TanStack Query manages request state.
- React Context stores the active identification session instead of passing large image data through navigation parameters.
- Automatic mutation retries are disabled to avoid duplicate AI requests.

Base64 transport is used for Expo Go compatibility in this project. For production-scale image uploads, multipart upload or object storage with pre-signed URLs would be preferred.

## Scope

The project focuses on the core plant identification experience:

```text
Photo
  ↓
Plant Part Selection
  ↓
AI Identification
  ↓
Confidence-Aware Result
```

Authentication, profiles, social features, and persistent history were intentionally kept outside the core scope.
