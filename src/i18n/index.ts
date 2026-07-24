import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import fr from './locales/fr.json'
import es from './locales/es.json'
import pt from './locales/pt.json'

export const supportedLanguages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      pt: { translation: pt },
    },
    fallbackLng: 'fr',
    lng: 'fr',
    supportedLngs: ['en', 'fr', 'es', 'pt'],
    // Le français est la langue principale par défaut pour tout le monde,
    // peu importe la langue du navigateur/région du visiteur. On ne détecte
    // plus la langue automatiquement - seul le choix explicite de l'utilisateur
    // via le sélecteur de langue est mémorisé (localStorage) et respecté au
    // prochain passage.
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'flexcheck_lang',
    },
    interpolation: { escapeValue: false },
  })

export default i18n
