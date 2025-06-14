import { Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive scaling function
const scale = (size: number) => (screenWidth / 375) * size;

const MilaFriendlyGreenStyle = {
  // Groene kleurenpalet met warme accenten
  Colors: {
    // Primaire groene tinten
    primary: {
      main: '#4CAF50',      // Fris bladgroen
      light: '#81C784',     // Licht bladgroen
      lighter: '#C8E6C9',   // Zeer licht groen
      dark: '#388E3C',      // Donker bladgroen
      darker: '#2E7D32',    // Extra donker groen
    },
    
    // Warme accent kleuren
    accent: {
      orange: '#FF6B35',    // Warm oranje voor CTAs
      coral: '#FF8E72',     // Licht koraal voor notificaties
      yellow: '#FFD93D',    // Zonnig geel voor highlights
      peach: '#FFB5A0',     // Zachte perzik tint
    },
    
    // Neutrale basis kleuren
    neutral: {
      cream: '#FEFDF8',     // Crème wit achtergrond
      lightGray: '#F5F5F5', // Zeer licht grijs
      gray: '#E0E0E0',      // Licht grijs voor borders
      darkGray: '#757575',  // Medium grijs voor secundaire tekst
      charcoal: '#424242',  // Donkergrijs voor hoofdtekst
      black: '#212121',     // Bijna zwart voor emphasis
    },
    
    // Semantische kleuren
    status: {
      success: '#66BB6A',   // Succes groen
      warning: '#FFA726',   // Waarschuwing oranje
      error: '#EF5350',     // Error rood
      info: '#42A5F5',      // Info blauw
    },
    
    // Achtergrond gradiënten
    gradients: {
      primary: ['#4CAF50', '#66BB6A'],      // Groen gradient
      warm: ['#FF6B35', '#FFD93D'],         // Warm oranje-geel
      soft: ['#FEFDF8', '#F8FFF7'],        // Zachte cream gradient
      fresh: ['#81C784', '#C8E6C9'],       // Frisse groene gradient
    },
  },
  
  // Typografie
  Typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xxs: scale(10),
      xs: scale(12),
      sm: scale(14),
      md: scale(16),
      lg: scale(18),
      xl: scale(24),
      xxl: scale(32),
      huge: scale(40),
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  // Spacing
  Spacing: {
    xxxs: scale(2),
    xxs: scale(4),
    xs: scale(8),
    sm: scale(12),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
    xxxl: scale(64),
  },
  
  // Layout
  Layouts: {
    borderRadius: {
      xs: scale(4),
      sm: scale(8),
      md: scale(12),
      lg: scale(16),
      xl: scale(24),
      full: 9999,
    },
    containerPadding: scale(20),
    cardPadding: scale(16),
  },
  
  // Component styles
  Components: {
    // Basis container met cream achtergrond
    container: {
      flex: 1,
      backgroundColor: '#FEFDF8',
    },
    
    // Vriendelijke card style
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: scale(16),
      padding: scale(16),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    
    // Primaire button (groen)
    buttonPrimary: {
      backgroundColor: '#4CAF50',
      paddingHorizontal: scale(24),
      paddingVertical: scale(14),
      borderRadius: scale(25),
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    
    buttonPrimaryText: {
      color: '#FFFFFF',
      fontSize: scale(16),
      fontWeight: '600' as const,
    },
    
    // Secundaire button (outline)
    buttonSecondary: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#4CAF50',
      paddingHorizontal: scale(24),
      paddingVertical: scale(12),
      borderRadius: scale(25),
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    
    buttonSecondaryText: {
      color: '#4CAF50',
      fontSize: scale(16),
      fontWeight: '600' as const,
    },
    
    // Accent button (oranje)
    buttonAccent: {
      backgroundColor: '#FF6B35',
      paddingHorizontal: scale(24),
      paddingVertical: scale(14),
      borderRadius: scale(25),
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    
    buttonAccentText: {
      color: '#FFFFFF',
      fontSize: scale(16),
      fontWeight: '600' as const,
    },
    
    // Input field
    input: {
      backgroundColor: '#FFFFFF',
      borderWidth: 2,
      borderColor: '#E0E0E0',
      borderRadius: scale(12),
      paddingHorizontal: scale(16),
      paddingVertical: scale(12),
      fontSize: scale(16),
      color: '#424242',
    },
    
    // Search bar
    searchBar: {
      backgroundColor: '#FFFFFF',
      borderRadius: scale(25),
      paddingHorizontal: scale(20),
      paddingVertical: scale(12),
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    
    // Floating Action Button
    fab: {
      width: scale(60),
      height: scale(60),
      borderRadius: scale(30),
      backgroundColor: '#FF6B35',
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      position: 'absolute' as const,
      bottom: scale(80),
      right: scale(20),
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    
    // Badge
    badge: {
      backgroundColor: '#4CAF50',
      borderRadius: scale(10),
      paddingHorizontal: scale(8),
      paddingVertical: scale(2),
      minWidth: scale(20),
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
    },
    
    badgeText: {
      color: '#FFFFFF',
      fontSize: scale(12),
      fontWeight: '700' as const,
    },
  },
  
  // Handgetekende icoon style configuratie
  Icons: {
    style: 'organic', // Voor handgetekende feel
    strokeWidth: 2.5,
    cornerRadius: scale(4),
  },
  
  // Animatie configuratie
  Animations: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
    },
    easing: {
      bounce: 'bounce',
      ease: 'ease',
      elastic: 'elastic(1)',
    },
  },
  
  // Helper functies
  scale,
  screenWidth,
  screenHeight,
};

export default MilaFriendlyGreenStyle;