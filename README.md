# ABEX Pumps Website

This is the official website for ABEX Pumps, a leading supplier of water pump solutions across Southeast Asia.

## Build Process

This website includes a build process to minify CSS and JavaScript files for production use.

### Prerequisites

- Node.js (v12 or higher)
- npm (comes with Node.js)

### Setup

1. Install dependencies:
   ```
   npm install
   ```

### Build Commands

- Minify all CSS and JavaScript files:
  ```
  npm run build
  ```

- Minify only CSS files:
  ```
  npm run build:css
  ```

- Minify only JavaScript files:
  ```
  npm run build:js
  ```

- Start a local development server:
  ```
  npm start
  ```

### Minified Files

The build process creates the following minified files:

- `assets/css/main.min.css` - Main styles
- `assets/css/contact.min.css` - Contact page specific styles
- `assets/css/product.min.css` - Product page specific styles
- `assets/css/project.min.css` - Project page specific styles
- `assets/js/main.min.js` - Main JavaScript
- `assets/js/projects.min.js` - Projects page JavaScript

The HTML files are automatically updated to use these minified versions during the build process.

## Development

To develop the website locally:

1. Run the development server:
   ```
   npm start
   ```

2. Open your browser to http://localhost:3000

## File Structure

- `assets/css/` - CSS files
- `assets/js/` - JavaScript files
- `assets/logos/` - Brand logos
- `images/` - Website images
- `*.html` - HTML pages

## Technologies Used

- HTML5
- CSS3
- JavaScript
- AOS (Animate On Scroll) library
- Font Awesome icons
- Google Fonts (Poppins and Open Sans)