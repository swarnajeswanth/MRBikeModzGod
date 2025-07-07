# Social Media Icons Component Guide

## Overview

The `SocialMediaIcons` component provides animated social media icons with click effects, hover animations, and smooth transitions to social media pages. When clicked, icons increase in size, fade out, and then transition to the respective social media platform.

## Features

### 🎯 Click Animations

- **Scale Increase**: Icons scale up to 200% on click
- **Rotation**: 45-degree rotation during animation
- **Fade Out**: Smooth opacity transition to 0
- **Particle Effects**: 6 animated particles burst from the icon
- **Ripple Effect**: Animated ripple and pulse effects

### 🎨 Hover Effects

- **Scale**: Icons scale to 125% on hover
- **Color Transitions**: Smooth color changes to platform-specific colors
- **Glow Effects**: Subtle glow with blur effects
- **Tooltips**: Platform names appear on hover

### 🌟 Animation Variants

- **Default**: Standard animations with hover effects
- **Minimal**: Compact spacing with subtle fade-in animations
- **Glowing**: Enhanced glow effects and pulse animations
- **Floating**: Continuous floating animation with staggered timing

### 📏 Size Options

- **Small**: 16x16px (h-4 w-4)
- **Medium**: 24x24px (h-6 w-6) - Default
- **Large**: 32x32px (h-8 w-8)

## Usage

### Basic Implementation

```tsx
import SocialMediaIcons from "@/components/SocialMediaIcons";

// Default usage
<SocialMediaIcons />

// With custom styling
<SocialMediaIcons
  variant="default"
  size="md"
  className="text-gray-400"
/>
```

### Variants

```tsx
// Default variant
<SocialMediaIcons variant="default" />

// Minimal variant - compact spacing
<SocialMediaIcons variant="minimal" size="sm" />

// Glowing variant - enhanced effects
<SocialMediaIcons variant="glowing" size="lg" />

// Floating variant - continuous animation
<SocialMediaIcons variant="floating" />
```

### Sizes

```tsx
// Small icons
<SocialMediaIcons size="sm" />

// Medium icons (default)
<SocialMediaIcons size="md" />

// Large icons
<SocialMediaIcons size="lg" />
```

## Social Media Platforms

The component includes the following platforms:

1. **Facebook** - Blue hover color
2. **Instagram** - Pink hover color
3. **YouTube** - Red hover color
4. **Twitter** - Light blue hover color
5. **LinkedIn** - Blue hover color

## Animation Details

### Click Animation Sequence

1. **Trigger**: User clicks on icon
2. **Scale**: Icon scales to 200%
3. **Rotate**: 45-degree rotation
4. **Fade**: Opacity reduces to 0
5. **Particles**: 6 particles burst outward
6. **Ripple**: Animated ripple effect
7. **Transition**: Opens social media page in new tab

### Animation Timing

- **Duration**: 800ms total animation
- **Scale**: 500ms transition
- **Particles**: 1s duration with staggered delays
- **Ripple**: Continuous ping animation

### Hover Effects

- **Scale**: 125% on hover
- **Color**: Platform-specific colors
- **Glow**: 20% opacity with 150% scale
- **Tooltip**: 200ms fade-in

## Customization

### CSS Classes

The component uses custom CSS animations defined in `SocialMediaIcons.css`:

```css
.social-pulse {
  animation: socialPulse 2s infinite;
}
.social-glow {
  animation: socialGlow 2s infinite;
}
.social-float {
  animation: socialFloat 3s ease-in-out infinite;
}
.social-bounce {
  animation: socialBounce 1s ease-in-out infinite;
}
.social-shake {
  animation: socialShake 0.5s ease-in-out;
}
.social-fade-in {
  animation: socialFadeIn 0.5s ease-out;
}
```

### Adding New Platforms

To add a new social media platform:

1. Import the icon from `lucide-react`
2. Add to the `socialLinks` array in the component
3. Define color and hover color classes
4. Set the platform name and URL

```tsx
{
  icon: TikTok,
  href: "https://tiktok.com/@mrbikemodz",
  color: "text-gray-400",
  hoverColor: "hover:text-black",
  platform: "TikTok"
}
```

## Accessibility

- **ARIA Labels**: Each icon has proper `aria-label` attributes
- **Keyboard Navigation**: Icons are keyboard accessible
- **Reduced Motion**: Animations respect `prefers-reduced-motion` setting
- **Focus Indicators**: Clear focus states for keyboard users

## Browser Support

- **Modern Browsers**: Full support for all animations
- **CSS Transforms**: Uses modern CSS transform properties
- **Fallbacks**: Graceful degradation for older browsers

## Performance

- **Optimized Animations**: Uses CSS transforms for smooth performance
- **Reduced Motion**: Respects user preferences for reduced motion
- **Efficient Rendering**: Minimal DOM manipulation during animations

## Demo

Visit `/social-demo` to see all variants and animations in action.

## Integration with Footer

The component is already integrated into the Footer component:

```tsx
// In Footer.tsx
<div className="mt-6">
  <SocialMediaIcons variant="default" size="md" className="text-gray-400" />
</div>
```

## Troubleshooting

### Common Issues

1. **Animations not working**: Check if CSS file is imported
2. **Icons not appearing**: Verify lucide-react icons are imported
3. **Click not working**: Ensure href URLs are valid
4. **Performance issues**: Check for reduced motion preferences

### Debug Mode

Add `console.log` statements to debug click events:

```tsx
const handleClick = (e: React.MouseEvent) => {
  console.log("Social media icon clicked:", platform);
  // ... rest of the code
};
```

## Future Enhancements

- [ ] Add more social media platforms
- [ ] Custom animation timing options
- [ ] Sound effects on click
- [ ] Analytics tracking
- [ ] Custom icon support
- [ ] Dark/light mode variants
