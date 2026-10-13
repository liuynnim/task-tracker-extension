import { useI18n } from "../../i18n/context";
import "./LanguageToggle.css";

export default function LanguageToggle() {
  const { language, changeLanguage } = useI18n();

  const handleToggle = () => {
    const nextLang = language === "vi" ? "en" : "vi";
    changeLanguage(nextLang);
  };

  return (
    <button
      type="button"
      className="lang-toggle-btn"
      onClick={handleToggle}
      title={
        language === "vi"
          ? "Chuyển sang Tiếng Anh (English)"
          : "Chuyển sang Tiếng Việt"
      }
    >
      <span className="lang-toggle-flag">
        {language === "vi" ? "🇻🇳" : "🇬🇧"}
      </span>
      <span className="lang-toggle-text">
        {language === "vi" ? "VI" : "EN"}
      </span>
    </button>
  );
}
