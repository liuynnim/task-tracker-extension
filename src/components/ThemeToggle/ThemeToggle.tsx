import { useTheme } from "../../theme";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light");
  };

  const isLight = resolvedTheme === "light";

  return (
    <button
      type="button"
      className="theme-pill-btn"
      onClick={handleToggle}
      title={isLight ? "Switch to Dark mode" : "Switch to Light mode"}
      aria-label="Toggle theme"
    >
      <span
        className={`theme-segment ${isLight ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setTheme("light");
        }}
        title="Light mode"
      >
        ☀️
      </span>
      <span className="theme-divider">/</span>
      <span
        className={`theme-segment ${!isLight ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setTheme("dark");
        }}
        title="Dark mode"
      >
        🌙
      </span>
    </button>
  );
}

