/**
 * Simple i18n system for French translations
 * No external dependencies, lightweight
 */

import type { Language } from '@/stores/languageStore'
import { useLanguageStore } from '@/stores/languageStore'

const translations = {
  en: {
    // Brand
    brandName: 'GuiSchool',
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
      portal: 'My Portal',
      selectPortal: 'Select Portal',
      changePortal: 'Change Portal',
      sectionPlatform: 'Platform',
      sectionAcademicReference: 'Academic Reference',
      sectionSchool: 'School',
      sectionAdmin: 'Administration',
      sectionTeacher: 'Teacher',
      sectionStudent: 'Student',
      sectionParent: 'Parent',
      schools: 'Schools',
      schoolYears: 'School Years',
      users: 'Users',
      configuration: 'Settings',
      reports: 'Reports',
      academicYears: 'Academic Years',
      cycles: 'Cycles',
      levels: 'Levels',
      subjects: 'Subjects',
      periods: 'Periods',
      staff: 'Staff',
      students: 'Students',
      parentsTutors: 'Parents/Tutors',
      classes: 'Classes',
      schedule: 'Schedule',
      assessments: 'Assessments',
      finance: 'Finance',
      myClasses: 'My Classes',
      attendance: 'Attendance',
      grades: 'Grades',
      homework: 'Homework',
      communications: 'Communications',
      resources: 'Resources',
      timetable: 'My Schedule',
      myGrades: 'My Grades',
      myChildren: 'My Children',
      schooling: 'Schooling',
      meetings: 'Meetings',
      current: 'Current',
      status: 'Status',
      actions: 'Actions',
      comingSoon: 'Coming soon',
      geography: 'Geography',
    },

    // Auth
    auth: {
      welcomeBack: 'Welcome back to GuiSchool.',
      joinToday: 'Join GuiSchool today.',
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
      loginSuccess: 'Welcome back!',
      loginSuccessMessage: 'You have successfully logged in.',
      registerSuccess: 'Account created!',
      registerSuccessMessage:
        'Welcome to GuiSchool! Your account has been created successfully.',
      logoutSuccess: 'Logged out',
      logoutSuccessMessage: 'You have been logged out successfully.',
    },

    // Errors
    errors: {
      generic: 'An error occurred. Please try again.',
      network: 'Network error. Please try again.',
      invalidCredentials: 'Incorrect identifier or password.',
      accountLocked: 'Account Locked',
      accountLockedMessage:
        'Account temporarily locked. Please contact support or try again later.',
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
      somethingWentWrong: 'Something went wrong',
      unexpectedError: 'An unexpected error occurred',
      authError: 'Authentication Error',
      authErrorMessage: 'Your session has expired. Please log in again.',
    },

    // Home page
    home: {
      heroTitle: 'The #1 School Management Solution in Guinea',
      heroSubtitle:
        'Simplify administration, manage complex academic cycles, and generate official transcripts. A reliable platform built for Guinean schools.',
      getStarted: 'Get Started',
      signUpFree: 'Sign Up Free',
      features: 'Why Choose GuiSchool?',
      featuresSubtitle: 'Everything needed for modern education in Guinea.',

      // Feature 1: Academic Structure
      payments: 'Academic Structure',
      paymentsDesc:
        'Support for Maternelle, Primaire, Collège, and Lycée with complete tracking of tracks (SM, SE, SS).',

      // Feature 2: Schedule & Classrooms
      communication: 'Class & Schedule Management',
      communicationDesc:
        'Organize classrooms, assign teachers securely, and manage time slots without overlaps.',

      // Feature 3: Academic
      academic: 'Ministry-Compliant Reports',
      academicDesc:
        'Generate report cards and official transcripts that meet the exact standards of the Guinean Ministry of Education.',

      // Feature 4: Pedagogy
      finance: 'Pedagogy & Assessments',
      financeDesc:
        'Rigorous assessment lifecycles (Draft to Validated) ensuring grading integrity across all subjects.',

      // Feature 5: Offline/Reliable
      reliability: 'Fast & Reliable',
      reliabilityDesc:
        'Designed to work smoothly even with slow connection speeds or locally.',

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
        step1: 'Configure Academic Structure',
        step1Desc: 'Set up your cycles, tracks, levels, and subjects.',
        step2: 'Enroll & Assign',
        step2Desc:
          'Register students to classes and assign teachers to schedules.',
        step3: 'Manage Pedagogy',
        step3Desc:
          'Track assessments and generate official transcripts with ease.',
      },

      // Testimonials
      testimonials: 'What Principals Say',
      testimonial1:
        '"GuiSchool has completely transformed how we manage our academic cycles and official transcripts!"',
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

    // Actions
    actions: {
      tryAgain: 'Try Again',
      goHome: 'Go to Home',
    },
  },

  fr: {
    // Brand
    brandName: 'GuiSchool',
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
      portal: 'Mon Portail',
      selectPortal: 'Choisir un Portail',
      changePortal: 'Changer de Portail',
      sectionPlatform: 'Plateforme',
      sectionAcademicReference: 'Référentiel académique',
      sectionSchool: 'Établissement',
      sectionAdmin: 'Administration',
      sectionTeacher: 'Enseignant',
      sectionStudent: 'Étudiant',
      sectionParent: 'Parent',
      schools: 'Écoles',
      schoolYears: 'Années scolaires',
      users: 'Utilisateurs',
      configuration: 'Configuration',
      reports: 'Rapports',
      academicYears: 'Années académiques',
      cycles: 'Cycles',
      levels: 'Niveaux',
      subjects: 'Matières',
      periods: 'Périodes',
      staff: 'Enseignants',
      students: 'Élèves',
      parentsTutors: 'Parents/Tuteurs',
      classes: 'Classes',
      schedule: 'Emploi du temps',
      assessments: 'Évaluations',
      finance: 'Finances',
      myClasses: 'Mes classes',
      attendance: 'Présence',
      grades: 'Notes',
      homework: 'Devoirs',
      communications: 'Communications',
      resources: 'Ressources',
      timetable: 'Mon emploi du temps',
      myGrades: 'Mes notes',
      myChildren: 'Mes enfants',
      schooling: 'Scolarité',
      meetings: 'Réunions',
      current: 'Courante',
      status: 'Statut',
      actions: 'Actions',
      comingSoon: 'Bientôt',
      geography: 'Géographie',
    },

    // Auth
    auth: {
      welcomeBack: 'Bienvenue sur GuiSchool.',
      joinToday: "Rejoignez GuiSchool aujourd'hui.",
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
      loginSuccess: 'Bon retour!',
      loginSuccessMessage: 'Vous vous êtes connecté avec succès.',
      registerSuccess: 'Compte créé!',
      registerSuccessMessage:
        'Bienvenue sur GuiSchool! Votre compte a été créé avec succès.',
      logoutSuccess: 'Déconnecté',
      logoutSuccessMessage: 'Vous avez été déconnecté avec succès.',
    },

    // Errors
    errors: {
      generic: 'Une erreur est survenue. Veuillez réessayer.',
      network: 'Erreur réseau. Veuillez réessayer.',
      invalidCredentials: 'Identifiant ou mot de passe incorrect.',
      accountLocked: 'Compte Verrouillé',
      accountLockedMessage:
        'Compte temporairement verrouillé. Veuillez contacter le support ou réessayer plus tard.',
      rateLimited: 'Limite Atteinte',
      rateLimitMessage:
        'Trop de tentatives. Réessayez dans {seconds} secondes.',
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
      somethingWentWrong: "Quelque chose s'est mal passé",
      unexpectedError: "Une erreur inattendue s'est produite",
      authError: "Erreur d'Authentification",
      authErrorMessage: 'Votre session a expiré. Veuillez vous reconnecter.',
    },

    // Home page
    home: {
      heroTitle: 'La Solution de Gestion Scolaire N°1 en Guinée',
      heroSubtitle:
        'Simplifiez la gestion administrative, gérez les cycles académiques complexes et générez des bulletins officiels. Une plateforme fiable, conçue pour nos écoles.',
      getStarted: 'Commencer',
      signUpFree: 'Essai Gratuit',
      features: 'Pourquoi Choisir GuiSchool ?',
      featuresSubtitle:
        'Tout ce dont vous avez besoin pour moderniser votre école.',

      // Feature 1: Academic Structure
      payments: 'Structure Académique',
      paymentsDesc:
        'Support complet pour Maternelle, Primaire, Collège et Lycée avec suivi des profils (SM, SE, SS).',

      // Feature 2: Schedule & Classrooms
      communication: 'Gestion des Classes et Horaires',
      communicationDesc:
        'Organisez les salles de classe, assignez les enseignants en toute sécurité et gérez les emplois du temps sans conflits.',

      // Feature 3: Academic
      academic: 'Rapports Conformes',
      academicDesc:
        "Génération de bulletins et relevés de notes conformes aux exigences strictes du Ministère de l'Éducation guinéen.",

      // Feature 4: Pedagogy
      finance: 'Pédagogie & Évaluations',
      financeDesc:
        "Cycle de vie d'évaluation rigoureux (Brouillon à Validé) garantissant l'intégrité des notes.",

      // Feature 5: Offline/Reliable
      reliability: 'Connexion Optimisée',
      reliabilityDesc:
        'Conçu pour fonctionner de manière fluide même avec une connexion internet lente ou en local.',

      // Feature 6: Support
      support: 'Support Local 7/7',
      supportDesc:
        'Une équipe de support dédiée basée à Conakry pour vous accompagner.',
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
        step1: 'Structure Académique',
        step1Desc: 'Configurez vos cycles, profils, niveaux et matières.',
        step2: 'Inscriptions et Affectations',
        step2Desc:
          'Inscrivez les élèves et assignez les enseignants à leurs emplois du temps.',
        step3: 'Gestion Pédagogique',
        step3Desc:
          'Suivez les évaluations et générez des relevés de notes officiels.',
      },

      // Testimonials
      testimonials: 'Ce que disent les Directeurs',
      testimonial1:
        '"GuiSchool a complètement transformé notre gestion des cycles académiques et des relevés de notes officiels !"',
      testimonial1Author: 'Mamadou Diallo',
      testimonial1Role: 'Directeur, Lycée de Kipé',

      // FAQ
      faq: 'Questions Fréquentes',
      faq1: 'Mes données sont-elles sécurisées ?',
      faq1Ans:
        'Oui, nous utilisons un cryptage bancaire et des sauvegardes quotidiennes.',
      faq2: 'Puis-je essayer gratuitement ?',
      faq2Ans: "Absolument ! Vous bénéficiez de 30 jours d'essai gratuit.",

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

    // Actions
    actions: {
      tryAgain: 'Réessayer',
      goHome: "Aller à l'Accueil",
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
