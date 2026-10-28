# 📝 Task Tracker - Chrome Extension

A modern, high-performance **Task Management Chrome Extension (Manifest V3)** built with **React 19**, **TypeScript**, and **Vite**. 

Engineered with **zero external UI/form/i18n dependencies**, this project features a **custom-built mini React Hook Form (RHF) clone** and a **custom lightweight i18n engine (inspired by next-i18next)** written completely from scratch. It delivers sub-millisecond load times, zero flash of unstyled content (Anti-FOUC), and seamless dual-storage persistence.

---

## 🌟 Architectural Highlights

### 1. 🪶 Custom Mini React Hook Form (`src/RHF`)
Instead of pulling in heavy third-party form libraries into a lightweight Chrome Extension, this project features a hand-crafted **mini React Hook Form clone** (`src/RHF/useForm.ts`) that replicates the fundamental architectural principles of RHF:

- **Uncontrolled Inputs with `useRef`**: Bypasses React's standard re-render cycle on every keystroke, keeping form input rendering at 60 FPS while managing field references under the hood.
- **Declarative `register` Pattern**: Provides `{ name, ref, onChange }` binding, automatically linking DOM elements to internal validation state.
- **Dynamic Field Validation Engine**:
  - `required`: Accepts boolean flags or custom error strings.
  - `minLength`: Checks character count limits `{ value, message }`.
  - `validate`: Custom predicate function `(val) => boolean | string`.
  - Live re-validation only triggers after the initial submit error, avoiding annoying early error popups.
- **Reactive `formState.errors`**: Synchronizes errors to React state only when errors change, eliminating unnecessary component re-renders.
- **Synthetic Event Handling & Reset**: Fully typed `handleSubmit(onValid)` and `reset(values)` matching the industry-standard RHF API.

```tsx
// Example from src/components/TaskForm/TaskForm.tsx
const {
  register,
  handleSubmit,
  reset,
  formState: { errors },
} = useForm<TaskFormData>({
  defaultValues: { title: "", description: "", dueDate: "" },
});

const onSubmit = (data: TaskFormData) => {
  // Access typed data without re-render lag
  onAddTask(data);
  reset();
};

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input
      {...register("title", { required: "Title is required" })}
      className={errors.title ? "has-error" : ""}
    />
    {errors.title && <span>{errors.title.message}</span>}
  </form>
);
```

---

### 2. 🌐 Custom Mini i18n Engine (`src/i18n`)
A lightweight, zero-dependency internationalization engine inspired by **`i18next`** and **`next-i18next`**:

- **Dot-Notation Key Resolution**: Recursively resolves nested JSON keys (e.g. `t("taskForm.titlePlaceholder")` or `t("app.loading")`) with O(1) path splitting.
- **Dynamic Variable Interpolation**: Replaces `{{variable}}` placeholders in real-time (e.g. `t("taskItem.dueDate", { date: "2026-10-30" })`).
- **Safe Fallback Chain**: 
  1. Searches the active language dictionary (`vi` or `en`).
  2. Falls back to the default English dictionary if the key is missing.
  3. Returns the raw translation key if neither contains it.
- **Persistent Language Preference**: Integrated into the hybrid storage layer so preferences persist between browser sessions and popup reopens.
- **Sleek Capsule UI**: Matching 28px pill toggle (`[ VN / EN ]`).

```tsx
// Example from src/i18n/I18nContext.tsx
const t = (key: TranslationKey, params?: TranslationParams): string => {
  const currentDict = translations[language];
  const fallbackDict = translations.en;

  const rawText =
    getNestedValue(currentDict, key) ??
    getNestedValue(fallbackDict, key) ??
    key;

  return interpolate(rawText, params); // e.g., {{date}} -> formatted date string
};
```

---

## ✨ Features

- **📋 Task Operations**
  - Add tasks with title, optional description, and due date.
  - Interactive list with collapsible details and completion checkbox.
  - Task deletion with immediate local update.

- **🌓 Anti-FOUC Dark / Light Theme System**
  - Capsule pill toggle (`[ ☀️ / 🌙 ]`).
  - **Zero FOUC (Flash of Unstyled Content)**: An immediate inline `<script>` in `index.html` inspects `localStorage` and applies `data-theme` before the DOM renders.
  - Centralized CSS Design Tokens (`src/index.css`) for consistent colors, shadows, and smooth transitions.
  - Automatic fallback to OS-level system dark mode preference.

- **💾 Hybrid Dual-Storage Architecture**
  - Instant startup via synchronous `localStorage` combined with asynchronous `chrome.storage.local`.
  - Works out-of-the-box in both Chrome Extension popup mode and standard browser development (`localhost:5173`).

---

## 🛠️ Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **UI Framework** | React 19 | Latest React release with optimized rendering |
| **Language** | TypeScript 6.0 | Strict type definitions across forms, tasks, and i18n keys |
| **Build Tool** | Vite 8.3 | Ultra-fast HMR and minified rollup bundling |
| **Extension Standard** | Manifest V3 | Latest Google Chrome extension security & storage standard |
| **Form Management** | **Custom RHF Clone** | In-house `useForm` hook with validation and `useRef` efficiency |
| **Internationalization** | **Custom i18n Engine** | In-house nested key lookup, fallback chain, and string interpolation |
| **Styling** | Vanilla CSS | Token-driven CSS custom properties without CSS-in-JS overhead |

---

## 📂 Project Structure

```text
task-tracker-extension/
├── public/
│   └── manifest.json            # Chrome Extension Manifest V3 configuration
├── src/
│   ├── components/
│   │   ├── LanguageToggle/      # VN / EN capsule pill toggle
│   │   ├── TaskForm/            # Task creation form powered by custom RHF
│   │   ├── TaskItem/            # Expandable task item with status & actions
│   │   ├── TaskList/            # Task list view with empty state
│   │   └── ThemeToggle/         # ☀️ / 🌙 capsule pill toggle
│   ├── i18n/
│   │   ├── locales/             # vi.ts & en.ts dictionary files
│   │   ├── context.ts           # React Context for i18n
│   │   ├── I18nContext.tsx      # Mini i18n engine: getNestedValue & interpolate
│   │   └── types.ts             # Strict TranslationKey types
│   ├── RHF/
│   │   ├── types.ts             # FieldValues, RegisterOptions, FieldErrors
│   │   └── useForm.ts           # Mini React Hook Form implementation
│   ├── services/
│   │   └── storage.ts           # Hybrid storage adapter (localStorage + chrome.storage)
│   ├── theme/
│   │   ├── ThemeProvider.tsx    # Theme context & DOM data-theme manager
│   │   └── useTheme.ts          # useTheme hook
│   ├── types/
│   │   └── task.ts              # Task data interfaces
│   ├── App.tsx                  # Main popup component
│   ├── index.css                # Centralized CSS Design Tokens (Light/Dark)
│   └── main.tsx                 # Application entry point
├── index.html                   # HTML template with Anti-FOUC inline script
├── package.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **pnpm** (recommended) or **npm** / **yarn**

### 2. Installation
```bash
git clone https://github.com/your-username/task-tracker-extension.git
cd task-tracker-extension
pnpm install
```

### 3. Local Development (Web View)
```bash
pnpm run dev
```
Open `http://localhost:5173` in your browser.

### 4. Build for Chrome Extension
```bash
pnpm run build
```
The output will be placed in the `dist/` directory.

---

## 🧩 Installing into Google Chrome

1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** (top-left button).
4. Select the **`dist`** folder generated by `pnpm run build`.
5. Pin **Task Tracker** from the extension puzzle menu for quick access!

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
