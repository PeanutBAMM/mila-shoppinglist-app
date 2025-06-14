// App configuration
export const APP_NAME = 'Mila';
export const PREMIUM_PRICE = '€4,95';
export const TRIAL_DAYS = 30;

// Colors (matching your brand)
export const COLORS = {
  primary: '#FF6B6B',     // Coral/Red
  secondary: '#4ECDC4',   // Teal
  success: '#10B981',     // Green
  warning: '#F59E0B',     // Amber
  error: '#EF4444',       // Red
  info: '#3B82F6',        // Blue
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  }
};

// Dutch UI Texts
export const TEXTS = {
  common: {
    loading: 'Laden...',
    save: 'Opslaan',
    cancel: 'Annuleren',
    delete: 'Verwijderen',
    edit: 'Bewerken',
    add: 'Toevoegen',
    back: 'Terug',
    next: 'Volgende',
    done: 'Klaar',
    yes: 'Ja',
    no: 'Nee',
  },
  auth: {
    welcome: 'Welkom bij Mila',
    tagline: 'Jouw slimme boodschappen assistent',
    login: 'Inloggen',
    register: 'Registreren',
    logout: 'Uitloggen',
    email: 'E-mailadres',
    password: 'Wachtwoord',
    forgotPassword: 'Wachtwoord vergeten?',
    noAccount: 'Nog geen account?',
    hasAccount: 'Al een account?',
    createAccount: 'Account aanmaken',
    trialInfo: 'Start met 30 dagen gratis Premium',
  },
  subscription: {
    free: 'Gratis',
    trial: 'Proefperiode',
    premium: 'Premium',
    upgradeToPremium: 'Upgrade naar Premium',
    price: PREMIUM_PRICE + ' per maand',
    trialDaysLeft: 'Nog {days} dagen in je proefperiode',
    features: {
      free: 'Alle basis functies',
      premium: 'Mila AI assistent + alle premium functies',
    }
  },
  lists: {
    myLists: 'Mijn Lijsten',
    newList: 'Nieuwe lijst',
    emptyState: 'Je hebt nog geen lijsten',
    createFirst: 'Maak je eerste boodschappenlijst',
    items: '{count} items',
    addItem: 'Item toevoegen',
  },
  mila: {
    greeting: 'Hoi! Ik ben Mila 👋',
    howCanIHelp: 'Hoe kan ik je helpen?',
    premiumOnly: 'Deze functie is alleen voor Premium gebruikers',
  }
};