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
      title={isLight ? "Chuyển sang chế độ Tối (Dark)" : "Chuyển sang chế độ Sáng (Light)"}
      aria-label="Toggle theme"
    >
      <span
        className={`theme-segment ${isLight ? "active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setTheme("light");
        }}
        title="Chế độ Sáng (Light)"
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
        title="Chế độ Tối (Dark)"
      >
        🌙
      </span>
    </button>
  );
}

