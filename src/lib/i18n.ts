/**
 * Simple i18n system for French translations
 * No external dependencies, lightweight
 */

import { useLanguageStore, type Language } from '@/stores/languageStore'

const translations = {
  en: {
    // Brand
    brandName: 'EduVault',
    brandTagline: 'Academic Management Platform',
    brandDescription: 'Modern Academic Management Platform',

    // Navigation
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      admin: 'Admin',
      demos: 'Demos',
      profile: 'Profile',
      signOut: 'Sign out',
      signIn: 'Sign in',
      signUp: 'Sign up',
      openMenu: 'Open navigation menu',
      closeMenu: 'Close navigation',
    },

    // Auth
    auth: {
      welcomeBack: 'Welcome back to EduVault.',
      joinToday: 'Join EduVault today.',
      signInTitle: 'Sign in',
      signUpTitle: 'Create account',
      identifier: 'Identifier',
      identifierHelper: 'Use email, phone, or username',
      password: 'Password',
      rememberMe: 'Remember me',
      signInButton: 'Sign in',
      signUpButton: 'Create account',
      signingIn: 'Signing in…',
      creatingAccount: 'Creating account…',
      loggingOut: 'Logging out…',
      email: 'Email',
      firstName: 'First name',
      lastName: 'Last name',
      phone: 'Phone (optional)',
      phoneHelper: 'Format: +224XXXXXXXXX',
      confirmPassword: 'Confirm password',
      termsAccept: 'I accept the',
      termsService: 'Terms of Service',
      and: 'and',
      privacyPolicy: 'Privacy Policy',
      marketingOptIn: 'Send me product updates and news',
      noAccount: "Don't have an account?",
      hasAccount: 'Already have an account?',
      register: 'Register',
      required: 'required',
    },

    // Errors
    errors: {
      generic: 'An error occurred. Please try again.',
      network: 'Network error. Please try again.',
      invalidCredentials: 'Incorrect identifier or password.',
      accountLocked: 'Account Locked',
      accountLockedMessage: 'Account temporarily locked. Please contact support or try again later.',
      rateLimited: 'Rate Limited',
      rateLimitMessage: 'Too many attempts. Try again in {seconds} seconds.',
      tryAgainIn: 'Try again in {seconds}s',
      fixFields: 'Please fix the highlighted fields.',
      contactSupport: 'Contact Support',
      required: '{field} is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      passwordMinLength: 'Password must be at least 8 characters',
      passwordMismatch: 'Passwords do not match',
      termsRequired: 'You must accept the Terms to continue',
      logoutFailed: 'Logout Failed',
    },

    // Home page
    home: {
      getStarted: 'Get Started',
      signUpFree: 'Sign Up Free',
      features: 'Key Features',
      featuresSubtitle: 'Everything you need for modern academic management.',
      userManagement: 'User Management',
      userManagementDesc: 'Secure authentication with role-based access control and multi-factor verification.',
      enterpriseSecurity: 'Enterprise Security',
      enterpriseSecurityDesc: 'Industry-standard encryption, session management, and comprehensive audit trails.',
      dataPrivacy: 'Data Privacy',
      dataPrivacyDesc: 'GDPR-compliant data handling with secure storage and granular permissions.',
    },

    // User menu
    user: {
      signedInAs: 'Signed in as',
      verified: 'Verified',
      security: 'Security',
      refreshingAuth: 'Refreshing auth',
    },

    // Theme
    theme: {
      light: 'Light',
      dark: 'Dark',
      system: 'System',
      toggle: 'Toggle theme',
    },

    // Common
    common: {
      loading: 'Loading…',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
    },
  },

  fr: {
    // Brand
    brandName: 'EduVault',
    brandTagline: 'Plateforme de Gestion Académique',
    brandDescription: 'Plateforme Moderne de Gestion Académique',

    // Navigation
    nav: {
      home: 'Accueil',
      dashboard: 'Tableau de bord',
      admin: 'Administration',
      demos: 'Démos',
      profile: 'Profil',
      signOut: 'Se déconnecter',
      signIn: 'Se connecter',
      signUp: "S'inscrire",
      openMenu: 'Ouvrir le menu de navigation',
      closeMenu: 'Fermer la navigation',
    },

    // Auth
    auth: {
      welcomeBack: 'Bienvenue sur EduVault.',
      joinToday: "Rejoignez EduVault aujourd'hui.",
      signInTitle: 'Connexion',
      signUpTitle: 'Créer un compte',
      identifier: 'Identifiant',
      identifierHelper: "Utilisez email, téléphone ou nom d'utilisateur",
      password: 'Mot de passe',
      rememberMe: 'Se souvenir de moi',
      signInButton: 'Se connecter',
      signUpButton: 'Créer un compte',
      signingIn: 'Connexion en cours…',
      creatingAccount: 'Création du compte…',
      loggingOut: 'Déconnexion en cours…',
      email: 'Email',
      firstName: 'Prénom',
      lastName: 'Nom',
      phone: 'Téléphone (optionnel)',
      phoneHelper: 'Format : +224XXXXXXXXX',
      confirmPassword: 'Confirmer le mot de passe',
      termsAccept: "J'accepte les",
      termsService: "Conditions d'utilisation",
      and: 'et la',
      privacyPolicy: 'Politique de confidentialité',
      marketingOptIn: 'Envoyez-moi les actualités et mises à jour produit',
      noAccount: 'Pas encore de compte ?',
      hasAccount: 'Déjà un compte ?',
      register: "S'inscrire",
      required: 'requis',
    },

    // Errors
    errors: {
      generic: 'Une erreur est survenue. Veuillez réessayer.',
      network: 'Erreur réseau. Veuillez réessayer.',
      invalidCredentials: 'Identifiant ou mot de passe incorrect.',
      accountLocked: 'Compte Verrouillé',
      accountLockedMessage: 'Compte temporairement verrouillé. Veuillez contacter le support ou réessayer plus tard.',
      rateLimited: 'Limite Atteinte',
      rateLimitMessage: 'Trop de tentatives. Réessayez dans {seconds} secondes.',
      tryAgainIn: 'Réessayez dans {seconds}s',
      fixFields: 'Veuillez corriger les champs surlignés.',
      contactSupport: 'Contacter le Support',
      required: '{field} est requis',
      invalidEmail: 'Veuillez saisir une adresse email valide',
      invalidPhone: 'Veuillez saisir un numéro de téléphone valide',
      passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
      passwordMismatch: 'Les mots de passe ne correspondent pas',
      termsRequired: 'Vous devez accepter les Conditions pour continuer',
      logoutFailed: 'Échec de la Déconnexion',
    },

    // Home page
    home: {
      getStarted: 'Commencer',
      signUpFree: 'Inscription Gratuite',
      features: 'Fonctionnalités Clés',
      featuresSubtitle: 'Tout ce dont vous avez besoin pour la gestion académique moderne.',
      userManagement: 'Gestion des Utilisateurs',
      userManagementDesc: "Authentification sécurisée avec contrôle d'accès basé sur les rôles et vérification multi-facteurs.",
      enterpriseSecurity: 'Sécurité Entreprise',
      enterpriseSecurityDesc: "Chiffrement standard, gestion de session et pistes d'audit complètes.",
      dataPrivacy: 'Confidentialité des Données',
      dataPrivacyDesc: 'Traitement conforme RGPD avec stockage sécurisé et permissions granulaires.',
    },

    // User menu
    user: {
      signedInAs: 'Connecté en tant que',
      verified: 'Vérifié',
      security: 'Sécurité',
      refreshingAuth: "Actualisation de l'authentification",
    },

    // Theme
    theme: {
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
      toggle: 'Changer le thème',
    },

    // Common
    common: {
      loading: 'Chargement…',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      close: 'Fermer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
    },
  },
} as const

// Re-export Language type for convenience
export type { Language }

type NestedKeyOf<TObject> = TObject extends object
  ? {
    [Key in keyof TObject & (string | number)]: TObject[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeyOf<TObject[Key]>}`
    : `${Key}`
  }[keyof TObject & (string | number)]
  : never

type TranslationKey = NestedKeyOf<typeof translations.en>

export function t(
  key: TranslationKey,
  params?: Record<string, string | number>,
): string {
  const lang = useLanguageStore.getState().language
  const keys = key.split('.')

  let value: any = translations[lang]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      // Fallback to English if key not found
      value = translations.en
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey]
        } else {
          return key // Return key if not found at all
        }
      }
      break
    }
  }

  if (typeof value === 'string' && params) {
    return Object.entries(params).reduce(
      (acc, [paramKey, paramValue]) =>
        acc.replace(`{${paramKey}}`, String(paramValue)),
      value,
    )
  }

  return typeof value === 'string' ? value : key
}

/**
 * Reactive translation hook that subscribes to language changes
 * Use this in components to ensure they re-render when language changes
 */
export function useTranslation() {
  const language = useLanguageStore((state) => state.language)

  return {
    t: (key: TranslationKey, params?: Record<string, string | number>) => {
      const keys = key.split('.')

      let value: any = translations[language]

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k]
        } else {
          // Fallback to English if key not found
          value = translations.en
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey]
            } else {
              return key // Return key if not found at all
            }
          }
          break
        }
      }

      if (typeof value === 'string' && params) {
        return Object.entries(params).reduce(
          (acc, [paramKey, paramValue]) =>
            acc.replace(`{${paramKey}}`, String(paramValue)),
          value,
        )
      }

      return typeof value === 'string' ? value : key
    },
    language,
  }
}
