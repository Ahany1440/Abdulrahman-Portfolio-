# Images to provide

The site uses 16:10 frames. Export screenshots at **1600 × 1000** (JPG or WebP). To replace a file, use the **same name**; to rename one, update its `src` in `src/content.ts`.

## Already real

These are screenshots taken from the live site at cyber-attacks-map.vercel.app:

- `public/images/threatpulse-01.jpg` to `threatpulse-04.jpg`, used in the Threat-Pulse scroll story.

## Placeholders (each is labelled "PLACEHOLDER" on screen)

| File | Project card | What to capture |
|---|---|---|
| `public/images/mindspace.jpg` | MindSpace | The app home screen or the AI companion chat |
| `public/images/esp32-radar.jpg` | ESP32 Cyber Radar | A photo of the board, or the radar / BLE signal view |
| `public/images/directory-scanner.jpg` | Directory Security Scanner | Console output flagging a hidden executable |
| `public/images/port-scanner.jpg` | Network Port Scanner | A terminal run mapping open ports |
| `public/images/cryptotool.jpg` | CryptoTool CLI | The terminal menu in Kali with an encode or decode run |

## Optional

- **Screen-recording loops:** any `media` item in `content.ts` accepts `video: "/videos/name.mp4"`. Use a 6–12 second MP4 with no audio, under about 3 MB. It plays muted over the screenshot.
- **Site address:** change `site.url` in `content.ts` to the final hosted address.
- **MindSpace repo link:** it points to `github.com/youssef-110/MindSpace-FullStack-Core`, as on the old portfolio. Change it if there's a different repo.
