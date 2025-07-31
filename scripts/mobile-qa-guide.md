# Mobile QA Testing Guide

## Mobile Testing with Capacitor

This app is configured for mobile testing using Capacitor. You can test on physical devices or emulators.

## Quick Mobile Testing (Browser Dev Tools)

### Step 1: Open Developer Tools
1. Open the app in Chrome/Edge
2. Press F12 to open Developer Tools
3. Click the device toggle icon (📱) or press Ctrl+Shift+M
4. Select device presets (iPhone 12, iPad, etc.)

### Step 2: Test Different Screen Sizes
Test these viewport sizes:
- **Mobile Portrait**: 375×667 (iPhone SE)
- **Mobile Landscape**: 667×375
- **Tablet Portrait**: 768×1024 (iPad)
- **Tablet Landscape**: 1024×768

### Step 3: Mobile-Specific Checks

#### Navigation & Menu
- [ ] Hamburger menu (☰) is accessible on mobile
- [ ] Menu slides in/out smoothly
- [ ] All navigation items are tap-friendly (44px minimum)
- [ ] Menu doesn't overlap content
- [ ] Back button works properly

#### Touch Interactions
- [ ] All buttons are thumb-friendly (44px+ touch targets)
- [ ] Forms are easy to fill on mobile keyboards
- [ ] Modals and popups fit screen without clipping
- [ ] Swipe gestures work where expected
- [ ] No accidental touches on adjacent elements

#### Layout & Content
- [ ] No horizontal scrolling required
- [ ] Text is readable without zooming
- [ ] Images scale appropriately
- [ ] Tables are responsive or horizontally scrollable
- [ ] Cards and components stack properly

#### Performance
- [ ] Pages load quickly on mobile
- [ ] Smooth scrolling and animations
- [ ] No lag in touch responses
- [ ] Memory usage acceptable

## Physical Device Testing (Advanced)

If you want to test on actual mobile devices, follow these steps:

### Prerequisites
- Node.js installed
- Android Studio (for Android testing)
- Xcode (for iOS testing, Mac only)

### Setup Instructions

1. **Export to GitHub**: Use the "Export to GitHub" button in Lovable
2. **Clone locally**: `git clone YOUR_REPO_URL`
3. **Install dependencies**: `npm install`
4. **Build the project**: `npm run build`

### For Android Testing

```bash
# Add Android platform
npx cap add android

# Update platform
npx cap update android

# Sync project
npx cap sync

# Run on Android device/emulator
npx cap run android
```

### For iOS Testing (Mac only)

```bash
# Add iOS platform
npx cap add ios

# Update platform
npx cap update ios

# Sync project
npx cap sync

# Run on iOS device/simulator
npx cap run ios
```

## Persona-Specific Mobile Tests

### All Personas
- [ ] Login form works on mobile keyboards
- [ ] Dashboard widgets stack properly
- [ ] Navigation is accessible via hamburger menu
- [ ] Settings screens are mobile-friendly
- [ ] Logout works properly

### Client Persona
- [ ] Account balance cards readable on small screens
- [ ] Wealth dashboard charts scale appropriately
- [ ] Bank account forms work with mobile keyboards
- [ ] Transaction tables are scrollable horizontally if needed

### Advisor Persona
- [ ] Client list is accessible and searchable
- [ ] Performance charts fit mobile viewports
- [ ] Client management forms are thumb-friendly

### Admin Personas
- [ ] Admin tools are accessible on mobile
- [ ] User management tables work on small screens
- [ ] System diagnostics are readable

## Common Mobile Issues to Check

### Layout Problems
- Text cut off or overlapping
- Buttons too small to tap accurately
- Horizontal scrolling required
- Content doesn't fit viewport

### Navigation Issues
- Menu doesn't open/close properly
- Back navigation broken
- Deep links don't work
- Route transitions are jarring

### Form Problems
- Input fields too small
- Validation messages cut off
- Submit buttons unreachable
- Keyboard covers input fields

### Performance Issues
- Slow loading times
- Laggy scrolling
- Memory leaks
- Battery drain

## Testing Checklist by Screen Size

### Mobile Portrait (375px)
- [ ] All content fits without horizontal scroll
- [ ] Navigation menu accessible
- [ ] Form fields appropriately sized
- [ ] Buttons are 44px minimum touch targets
- [ ] Text remains readable

### Mobile Landscape (667px)
- [ ] Layout adapts to landscape orientation
- [ ] Navigation still accessible
- [ ] Content doesn't become too wide
- [ ] Virtual keyboard doesn't break layout

### Tablet (768px+)
- [ ] Better use of screen real estate
- [ ] Multi-column layouts where appropriate
- [ ] Touch targets remain thumb-friendly
- [ ] Desktop features available if appropriate

## Troubleshooting

### Common Capacitor Issues
- **Build fails**: Ensure `npm run build` completes successfully
- **App won't start**: Check `capacitor.config.ts` configuration
- **Hot reload not working**: Verify server URL in config
- **Native features broken**: Run `npx cap sync` after changes

### Mobile Browser Issues
- **Viewport meta tag**: Should be set for proper mobile rendering
- **Touch events**: Ensure touch events are properly handled
- **CSS viewport units**: Use `vh`/`vw` carefully on mobile browsers
- **iOS Safari**: Test specifically as it handles some CSS differently

For detailed mobile development guidance, read our blog post: https://lovable.dev/blogs/TODO