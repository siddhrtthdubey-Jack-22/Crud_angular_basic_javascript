# Crud_angular_basic_javascript

AngularJS web CRUD plus an **Ionic Angular** mobile/web app for **AI assistant personas**.

## Apps in this repo

| App | Folder | Stack |
| --- | --- | --- |
| Browser CRUD | `index.html`, `js/`, `css/` | AngularJS 1.8 |
| Ionic app | `ionic-app/` | Ionic Angular, Capacitor, TypeScript |

Both apps use the same persona fields and `localStorage` key: `ai-assistant-personas`.

## What you need (Ionic project)

Install these once on your machine:

1. **Node.js 22+** and **npm** (this repo’s Ionic app is generated with the current Ionic CLI)
2. **Ionic CLI**: `npm install -g @ionic/cli`
3. **Git** (already used for this repository)
4. Optional native builds:
   - **Android**: Android Studio, JDK 21, an Android emulator or device
   - **iOS** (Mac only): Xcode, CocoaPods

Ionic 5 on a resume maps to the same building blocks this app uses: **Angular pages**, **Ionic UI components** (`ion-list`, `ion-item`, `ion-modal`, `ion-fab`), and **Capacitor** for Android/iOS.

## AngularJS app (root)

Open `index.html` in a browser, or:

```bash
npx --yes serve .
```

## Ionic app

```bash
cd ionic-app
npm install
npm start
```

Then open the URL printed in the terminal (usually `http://localhost:4200`).

Useful commands from `ionic-app/`:

```bash
npm start              # Angular/Ionic dev server
npm test               # Unit tests
npm run build          # Production web build into www/
npx cap add android    # one-time Android project
npx cap add ios        # one-time iOS project (macOS)
npx cap sync           # copy www/ into native projects
npx cap open android   # open Android Studio
```

### Integrations already wired

- **Ionic UI**: list, search, sliding edit/delete, modal form, detail page, FAB
- **Angular**: routing, NgModules, services, `ngModel` forms
- **Capacitor**: `capacitor.config.ts`, app id `com.siddharth.personas`
- **Haptics**: delete action uses `@capacitor/haptics` (no-op in desktop browsers)
- **localStorage**: create / read / update / delete personas

### Persona CRUD

- **Create**: tap `+`
- **Read**: tap a persona
- **Update**: swipe the row → Edit
- **Delete**: swipe the row → Delete, or Delete on the detail page

## JavaScript topics

- AngularJS module and controller (root app)
- Ionic/Angular components, routing, and services
- Arrays (`filter`, `find`, `findIndex`)
- `JSON.parse` / `JSON.stringify`
- Browser `localStorage`
- Capacitor plugins (Haptics)
