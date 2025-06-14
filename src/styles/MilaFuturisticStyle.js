/**
 * MILA FUTURISTIC DESIGN SYSTEM
 * Next-gen shopping experience with glassmorphism & modern UI
 * 
 * Design Philosophy:
 * - Glassmorphism with depth and transparency
 * - Vibrant gradients and micro-animations
 * - Dark mode first with light mode option
 * - Mobile-first responsive scaling
 * - Accessibility without compromising aesthetics
 */

import { StyleSheet, Platform, Dimensions } from 'react-native';

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Enhanced responsive helpers
const guidelineBaseWidth = 375; // iPhone 12/13 Pro
const guidelineBaseHeight = 812;

const scale = (size) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
const verticalScale = (size) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (scale(size) - size) * factor;

// Detect if in mobile view (console open)
const isMobileView = () => SCREEN_WIDTH < 500;

// ===========================
// FUTURISTIC COLOR SYSTEM
// ===========================
export const FuturisticColors = {
  // Gradient Palettes
  gradients: {
    primary: ['#FF006E', '#8338EC', '#3A86FF'], // Pink to Purple to Blue
    secondary: ['#06FFA5', '#00E0FF', '#7209FF'], // Green to Cyan to Purple
    sunset: ['#FA709A', '#FEE140'], // Pink to Yellow
    night: ['#667EEA', '#764BA2'], // Purple gradient
    aurora: ['#00F5FF', '#00D4FF', '#0099FF'], // Cyan variations
    fire: ['#FF512F', '#F09819'], // Orange to Yellow
    cosmic: ['#1A1A2E', '#16213E', '#0F3460'], // Dark blues
  },
  
  // Glass Colors (with transparency)
  glass: {
    white: 'rgba(255, 255, 255, 0.1)',
    whiteLight: 'rgba(255, 255, 255, 0.05)',
    whiteMedium: 'rgba(255, 255, 255, 0.15)',
    whiteStrong: 'rgba(255, 255, 255, 0.25)',
    black: 'rgba(0, 0, 0, 0.1)',
    blackLight: 'rgba(0, 0, 0, 0.05)',
    blackMedium: 'rgba(0, 0, 0, 0.15)',
    blackStrong: 'rgba(0, 0, 0, 0.25)',
  },
  
  // Neon Accents
  neon: {
    pink: '#FF10F0',
    blue: '#00D4FF',
    green: '#39FF14',
    purple: '#BD00FF',
    yellow: '#FFFF00',
    orange: '#FF6600',
  },
  
  // Dark Mode Base
  dark: {
    background: '#0A0A0F',
    surface: '#1A1A2E',
    card: '#16213E',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Light Mode Base
  light: {
    background: '#F8F9FF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Semantic
  status: {
    success: '#00F5A0',
    warning: '#FFD600',
    error: '#FF3B30',
    info: '#00D4FF',
  },
  
  // Text
  text: {
    dark: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.8)',
      tertiary: 'rgba(255, 255, 255, 0.6)',
      disabled: 'rgba(255, 255, 255, 0.3)',
    },
    light: {
      primary: '#0A0A0F',
      secondary: 'rgba(10, 10, 15, 0.8)',
      tertiary: 'rgba(10, 10, 15, 0.6)',
      disabled: 'rgba(10, 10, 15, 0.3)',
    },
  },
};

// ===========================
// GLASSMORPHISM EFFECTS
// ===========================
export const GlassEffects = {
  // Light glass effect
  lightGlass: {
    backgroundColor: FuturisticColors.glass.whiteLight,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderWidth: 1,
    borderColor: FuturisticColors.glass.whiteStrong,
  },
  
  // Medium glass effect
  mediumGlass: {
    backgroundColor: FuturisticColors.glass.whiteMedium,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderWidth: 1,
    borderColor: FuturisticColors.glass.whiteStrong,
  },
  
  // Strong glass effect
  strongGlass: {
    backgroundColor: FuturisticColors.glass.whiteStrong,
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Dark glass effect
  darkGlass: {
    backgroundColor: FuturisticColors.glass.blackMedium,
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    borderWidth: 1,
    borderColor: FuturisticColors.glass.blackStrong,
  },
};

// ===========================
// NEUMORPHISM EFFECTS
// ===========================
export const NeumorphicEffects = {
  pressed: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: -2, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  
  raised: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
};

// ===========================
// RESPONSIVE TYPOGRAPHY
// ===========================
export const FuturisticTypography = {
  // Font Families
  fontFamily: {
    light: Platform.select({
      ios: 'System',
      android: 'Roboto-Light',
      default: 'System',
    }),
    regular: Platform.select({
      ios: 'System',
      android: 'Roboto',
      default: 'System',
    }),
    medium: Platform.select({
      ios: 'System',
      android: 'Roboto-Medium',
      default: 'System',
    }),
    bold: Platform.select({
      ios: 'System',
      android: 'Roboto-Bold',
      default: 'System',
    }),
    black: Platform.select({
      ios: 'System',
      android: 'Roboto-Black',
      default: 'System',
    }),
  },
  
  // Responsive Font Sizes
  fontSize: {
    gigantic: moderateScale(isMobileView() ? 36 : 48),
    huge: moderateScale(isMobileView() ? 28 : 36),
    xxxl: moderateScale(isMobileView() ? 24 : 32),
    xxl: moderateScale(isMobileView() ? 20 : 28),
    xl: moderateScale(isMobileView() ? 18 : 24),
    lg: moderateScale(isMobileView() ? 16 : 20),
    md: moderateScale(isMobileView() ? 14 : 17),
    sm: moderateScale(isMobileView() ? 12 : 15),
    xs: moderateScale(isMobileView() ? 11 : 13),
    xxs: moderateScale(isMobileView() ? 10 : 11),
  },
};

// ===========================
// RESPONSIVE SPACING
// ===========================
export const FuturisticSpacing = {
  xxxs: scale(2),
  xxs: scale(4),
  xs: scale(8),
  sm: scale(12),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
  xxl: scale(48),
  xxxl: scale(64),
};

// ===========================
// FUTURISTIC LAYOUTS
// ===========================
export const FuturisticLayouts = {
  borderRadius: {
    none: 0,
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(48),
    full: 9999,
  },
  
  animation: {
    duration: {
      instant: 100,
      fast: 200,
      normal: 300,
      slow: 500,
      verySlow: 800,
    },
    
    spring: {
      tension: 40,
      friction: 7,
    },
  },
};

// ===========================
// FUTURISTIC COMPONENTS
// ===========================
export const FuturisticComponents = StyleSheet.create({
  // Main Containers
  darkContainer: {
    flex: 1,
    backgroundColor: FuturisticColors.dark.background,
  },
  
  lightContainer: {
    flex: 1,
    backgroundColor: FuturisticColors.light.background,
  },
  
  gradientContainer: {
    flex: 1,
    // Will be used with LinearGradient
  },
  
  // Glass Cards
  glassCard: {
    ...GlassEffects.mediumGlass,
    borderRadius: FuturisticLayouts.borderRadius.lg,
    padding: FuturisticSpacing.lg,
    marginHorizontal: FuturisticSpacing.md,
    marginVertical: FuturisticSpacing.xs,
    overflow: 'hidden',
  },
  
  glassCardLight: {
    ...GlassEffects.lightGlass,
    borderRadius: FuturisticLayouts.borderRadius.lg,
    padding: FuturisticSpacing.lg,
    marginHorizontal: FuturisticSpacing.md,
    marginVertical: FuturisticSpacing.xs,
    overflow: 'hidden',
  },
  
  // Futuristic Buttons
  buttonFuturistic: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: FuturisticSpacing.xl,
    paddingVertical: FuturisticSpacing.md,
    borderRadius: FuturisticLayouts.borderRadius.full,
    minHeight: scale(isMobileView() ? 48 : 56),
    ...NeumorphicEffects.raised,
  },
  
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: FuturisticSpacing.xl,
    paddingVertical: FuturisticSpacing.md,
    borderRadius: FuturisticLayouts.borderRadius.full,
    minHeight: scale(isMobileView() ? 48 : 56),
    overflow: 'hidden',
  },
  
  buttonGlass: {
    ...GlassEffects.mediumGlass,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: FuturisticSpacing.xl,
    paddingVertical: FuturisticSpacing.md,
    borderRadius: FuturisticLayouts.borderRadius.full,
    minHeight: scale(isMobileView() ? 48 : 56),
  },
  
  buttonTextFuturistic: {
    fontSize: FuturisticTypography.fontSize.md,
    fontWeight: '700',
    color: FuturisticColors.text.dark.primary,
    letterSpacing: 0.5,
  },
  
  // Futuristic Inputs
  inputFuturistic: {
    ...GlassEffects.lightGlass,
    minHeight: scale(isMobileView() ? 48 : 56),
    borderRadius: FuturisticLayouts.borderRadius.md,
    paddingHorizontal: FuturisticSpacing.lg,
    fontSize: FuturisticTypography.fontSize.md,
    color: FuturisticColors.text.dark.primary,
  },
  
  inputFocused: {
    borderColor: FuturisticColors.neon.blue,
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: FuturisticColors.neon.blue,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  
  // Floating Action Button
  fabFuturistic: {
    position: 'absolute',
    bottom: FuturisticSpacing.xl,
    right: FuturisticSpacing.xl,
    width: scale(isMobileView() ? 56 : 64),
    height: scale(isMobileView() ? 56 : 64),
    borderRadius: FuturisticLayouts.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...NeumorphicEffects.raised,
  },
  
  // Avatar
  avatarFuturistic: {
    width: scale(isMobileView() ? 80 : 100),
    height: scale(isMobileView() ? 80 : 100),
    borderRadius: FuturisticLayouts.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  
  // Badge
  badgeFuturistic: {
    paddingHorizontal: FuturisticSpacing.sm,
    paddingVertical: FuturisticSpacing.xs,
    borderRadius: FuturisticLayouts.borderRadius.full,
    backgroundColor: FuturisticColors.glass.whiteStrong,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // Divider
  dividerFuturistic: {
    height: 1,
    backgroundColor: FuturisticColors.glass.whiteLight,
    marginVertical: FuturisticSpacing.lg,
  },
});

// ===========================
// ANIMATION HELPERS
// ===========================
export const createPulseAnimation = () => ({
  from: { opacity: 0.5, scale: 0.95 },
  to: { opacity: 1, scale: 1 },
  duration: 1500,
  iterations: -1,
  useNativeDriver: true,
});

export const createSlideInAnimation = (direction = 'bottom') => {
  const translations = {
    bottom: { translateY: 50 },
    top: { translateY: -50 },
    left: { translateX: -50 },
    right: { translateX: 50 },
  };
  
  return {
    from: { opacity: 0, ...translations[direction] },
    to: { opacity: 1, translateY: 0, translateX: 0 },
    duration: 500,
    useNativeDriver: true,
  };
};

// Export everything
export default {
  Colors: FuturisticColors,
  Typography: FuturisticTypography,
  Spacing: FuturisticSpacing,
  Layouts: FuturisticLayouts,
  Components: FuturisticComponents,
  Glass: GlassEffects,
  Neumorphic: NeumorphicEffects,
  // Helpers
  scale,
  verticalScale,
  moderateScale,
  isMobileView,
  createPulseAnimation,
  createSlideInAnimation,
};