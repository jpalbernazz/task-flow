import { THEME_STORAGE_KEY } from "@/lib/theme/constants"

export function getThemeInitScript(): string {
  const storageKey = JSON.stringify(THEME_STORAGE_KEY)

  return `(function(){var storageKey=${storageKey};var preference="system";try{var stored=window.localStorage.getItem(storageKey);if(stored==="system"||stored==="light"||stored==="dark"){preference=stored}}catch(_error){}var isDark=preference==="dark"||(preference==="system"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",isDark);})();`
}
