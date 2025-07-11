# Silvia Orengo - Sound Designer Portfolio

A modern, responsive portfolio website showcasing Silvia Orengo's work as a Sound Designer and Composer for film, documentary, and commercial projects.

## 🎯 Features

- **Single Page Application (SPA)** with smooth navigation
- **Torn Poster Effect** - Interactive cards with realistic paper tear animation
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Accessibility** - ARIA labels, semantic HTML, keyboard navigation
- **Contact Form** - Integrated with Web3Forms for easy communication
- **Protected Upload Area** - Password-protected section for client content
- **Modern CSS** - CSS Grid, Flexbox, CSS Variables, and smooth animations

## 📁 File Structure

```
so-sound-main/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
├── README.md           # This documentation
├── FAVICON_audio-editing.png
├── font/               # Custom fonts (needs to be added)
├── images/             # Portfolio images
│   ├── cv1.png
│   ├── IMDB.jpg
│   ├── IMDB2.jpg
│   └── Master_logo_BNC_web_color.png
└── sounds/             # Audio files (needs to be added)
```

## 🚀 Getting Started

1. **Clone or download** the project files
2. **Add your fonts** to the `font/` directory:
   - `SVBasicManual.woff2`
   - `SVBasicManual.woff`
   - `SVBasicManual.ttf`
   - `SVBasicManualBold.woff2`
   - `SVBasicManualBold.woff`
   - `SVBasicManualBold.ttf`
3. **Add audio files** to the `sounds/` directory
4. **Open `index.html`** in your browser

## 🎨 Design Features

### Torn Poster Effect
- Realistic paper tear animation on hover/click
- Random texture overlays for authenticity
- Smooth transitions and transforms
- Interactive information reveal

### Color Scheme
- **Background**: Dark theme (#1E1E2E)
- **Text**: Light gray (#f5f5f5)
- **Accent**: Pink (#ff4d6d)
- **Menu Green**: Emerald (#10b981)

### Typography
- Custom fonts: SVBasicManual (regular) and SVBasicManualBold
- Monospace aesthetic for technical/professional feel
- Responsive font sizing

## 📱 Responsive Design

The website is fully responsive with breakpoints:
- **Desktop**: Full layout with grid
- **Tablet**: Adjusted spacing and font sizes
- **Mobile**: Single column layout, optimized navigation

## 🔧 Customization

### Adding New Projects
1. Copy an existing project card structure
2. Update the image source, title, and details
3. Add appropriate ARIA labels for accessibility

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --bg-color: #1E1E2E;
    --text-color: #f5f5f5;
    --accent-color: #ff4d6d;
    --sidebands-color: #14141F;
}
```

### Updating Contact Form
The contact form uses Web3Forms. Update the access key in `index.html`:
```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY">
```

## 🔒 Security Notes

- **Password Protection**: The upload area uses client-side password protection
- **For Production**: Consider implementing server-side authentication
- **API Keys**: Keep Web3Forms access key secure

## 🌐 Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 📈 Performance Optimizations

- **External CSS/JS**: Separated for better caching
- **Optimized Images**: Use WebP format when possible
- **Font Loading**: `font-display: swap` for better performance
- **Minified Assets**: Consider minifying CSS/JS for production

## 🎵 Audio Integration

The portfolio includes audio preview sections. To add audio:
1. Place audio files in `sounds/` directory
2. Update the `<audio>` source in the HTML
3. Supported formats: MP3, WAV, OGG

## 🔧 Technical Improvements Made

### Code Organization
- ✅ Separated CSS into `styles.css`
- ✅ Separated JavaScript into `script.js`
- ✅ Fixed font paths
- ✅ Improved HTML structure

### Accessibility
- ✅ Added ARIA labels
- ✅ Semantic HTML elements
- ✅ Keyboard navigation support
- ✅ Screen reader friendly

### Security
- ✅ Added `rel="noopener"` to external links
- ✅ Improved password handling
- ✅ Better form validation

### Performance
- ✅ External file loading
- ✅ Optimized CSS selectors
- ✅ Better JavaScript organization

## 📞 Contact

For questions or support:
- Email: siorengo19@gmail.com
- IMDB: [Silvia Orengo on IMDB](https://www.imdb.com/it/name/nm8344062/)
- Studio: [BNC Apps](https://www.bncapps.it/)

## 📄 License

© 2025 silviaohrenwebdesign - All rights reserved

---

**Note**: This portfolio is designed to showcase sound design work with an emphasis on visual storytelling and user experience. The torn poster effect creates a unique, memorable interaction that reflects the creative nature of sound design work.