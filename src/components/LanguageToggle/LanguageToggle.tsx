import { useI18n } from "../../i18n/context";
import "./LanguageToggle.css";

export default function LanguageToggle() {
  const { language, changeLanguage } = useI18n();

  const handleToggle = () => {
    changeLanguage(language === "vi" ? "en" : "vi");
  };

  const isVi = language === "vi";

  return (
    <button
      type="button"
      className="lang-pill-btn"
      onClick={handleToggle}
      title={isVi ? "Chuyển sang Tiếng Anh (EN)" : "Switch to Tiếng Việt (VN)"}
      aria-label="Toggle language"
    >
      <span className={`lang-segment ${isVi ? "active" : ""}`}>VN</span>
      <span className="lang-divider">/</span>
      <span className={`lang-segment ${!isVi ? "active" : ""}`}>EN</span>
    </button>
  );
}
