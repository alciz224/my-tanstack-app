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
      teacher: 'Teacher',
      student: 'Student',
      parent: 'Parent',
      systemLogs: 'System Logs',
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
      heroTitle: 'The #1 School Management Solution in Guinea',
      heroSubtitle: 'Simplify administration, secure payments (Orange/MTN), and engage parents. A reliable platform designed for our schools.',
      getStarted: 'Get Started',
      signUpFree: 'Sign Up Free',
      features: 'Why Choose EduVault?',
      featuresSubtitle: 'Everything needed for modern education in Guinea.',

      // Feature 1: Mobile Money
      payments: 'Mobile Payments',
      paymentsDesc: 'Automated tuition collection via Orange Money & MTN MoMo with instant receipts.',

      // Feature 2: SMS/WhatsApp
      communication: 'Parent Tracking',
      communicationDesc: 'Automatic SMS & WhatsApp alerts for grades, absences, and school announcements.',

      // Feature 3: Academic
      academic: 'Smart Reporting',
      academicDesc: 'Generate report cards and transcripts compliant with Ministry standards in one click.',

      // Feature 4: Finance
      finance: 'Financial Control',
      financeDesc: 'Real-time cash flow tracking, expense management, and digital receipts.',

      // Feature 5: Offline/Reliable
      reliability: 'Fast & Reliable',
      reliabilityDesc: 'Works smoothly even with slow connection speeds.',

      // Feature 6: Support
      support: 'Local Support',
      supportDesc: 'Dedicated support team based in Conakry available 7/7.',
      userManagement: 'User Management',

      // Stats
      stats: {
        schools: 'Partner Schools',
        students: 'Students Managed',
        efficiency: 'Efficiency Gain',
        schoolsValue: '50+',
        studentsValue: '12,000+',
        efficiencyValue: '40%',
      },

      // How It Works
      howItWorks: 'How It Works',
      steps: {
        step1: 'Create Account',
        step1Desc: 'Sign up in 2 minutes. No credit card required.',
        step2: 'Import Data',
        step2Desc: 'Easily upload your students, classes, and teachers via Excel.',
        step3: 'Go Live',
        step3Desc: 'Start managing grades, payments, and communication immediately.',
      },

      // Testimonials
      testimonials: 'What Principals Say',
      testimonial1: '"EduVault has completely transformed how we manage tuition payments. Parents love the Mobile Money integration!"',
      testimonial1Author: 'Mamadou Diallo',
      testimonial1Role: 'Principal, Lycée de Kipé',

      // FAQ
      faq: 'Frequently Asked Questions',
      faq1: 'Is my data secure?',
      faq1Ans: 'Yes, we use bank-level encryption and daily backups.',
      faq2: 'Can I try it for free?',
      faq2Ans: 'Absolutely! You have a 30-day free trial.',

      // Footer
      footer: {
        about: 'About',
        contact: 'Contact',
        legal: 'Legal',
        privacy: 'Privacy',
        terms: 'Terms',
        rights: 'All rights reserved.',
      },
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
      teacher: 'Enseignant',
      student: 'Étudiant',
      parent: 'Parent',
      systemLogs: 'Journaux Système',
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
      heroTitle: 'La Solution de Gestion Scolaire N°1 en Guinée',
      heroSubtitle: 'Simplifiez la gestion administrative, sécurisez les paiements (Orange/MTN) et impliquez les parents. Une plateforme fiable, conçue pour nos écoles.',
      getStarted: 'Commencer',
      signUpFree: 'Essai Gratuit',
      features: 'Pourquoi Choisir EduVault ?',
      featuresSubtitle: 'Tout ce dont vous avez besoin pour moderniser votre école.',

      // Feature 1: Mobile Money
      payments: 'Paiements Mobiles',
      paymentsDesc: 'Encaissement automatique des frais via Orange Money & MTN MoMo avec reçus instantanés.',

      // Feature 2: SMS/WhatsApp
      communication: 'Suivi Parentale',
      communicationDesc: 'Alertes SMS & WhatsApp automatiques pour les notes, absences et annonces.',

      // Feature 3: Academic
      academic: 'Bulletins Automatisés',
      academicDesc: 'Génération de bulletins et relevés conformes aux normes du Ministère en un clic.',

      // Feature 4: Finance
      finance: 'Contrôle Financier',
      financeDesc: 'Suivi de trésorerie en temps réel, gestion des dépenses et reçus numériques.',

      // Feature 5: Offline/Reliable
      reliability: 'Connexion Optimisée',
      reliabilityDesc: 'Fonctionne de manière fluide même avec une connexion internet lente.',

      // Feature 6: Support
      support: 'Support Local 7/7',
      supportDesc: 'Une équipe de support dédiée basée à Conakry pour vous accompagner.',
      userManagement: 'Gestion Utilisateurs',

      // Stats
      stats: {
        schools: 'Écoles Partenaires',
        students: 'Élèves Gérés',
        efficiency: 'Gain de Temps',
        schoolsValue: '50+',
        studentsValue: '12 000+',
        efficiencyValue: '40%',
      },

      // How It Works
      howItWorks: 'Comment ça marche ?',
      steps: {
        step1: 'Créer un compte',
        step1Desc: 'Inscrivez-vous en 2 minutes. Pas de carte bancaire requise.',
        step2: 'Importer vos données',
        step2Desc: 'Importez facilement vos élèves, classes et enseignants via Excel.',
        step3: 'Commencer',
        step3Desc: 'Gérez vos notes, paiements et communications immédiatement.',
      },

      // Testimonials
      testimonials: 'Ce que disent les Directeurs',
      testimonial1: '"EduVault a complètement transformé notre gestion des scolarités. Les parents adorent le paiement Mobile Money !"',
      testimonial1Author: 'Mamadou Diallo',
      testimonial1Role: 'Directeur, Lycée de Kipé',

      // FAQ
      faq: 'Questions Fréquentes',
      faq1: 'Mes données sont-elles sécurisées ?',
      faq1Ans: 'Oui, nous utilisons un cryptage bancaire et des sauvegardes quotidiennes.',
      faq2: 'Puis-je essayer gratuitement ?',
      faq2Ans: 'Absolument ! Vous bénéficiez de 30 jours d\'essai gratuit.',

      // Footer
      footer: {
        about: 'À propos',
        contact: 'Contact',
        legal: 'Légal',
        privacy: 'Confidentialité',
        terms: 'Conditions',
        rights: 'Tous droits réservés.',
      },
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
