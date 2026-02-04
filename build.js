const fs = require('fs');
const path = require('path');

// List of HTML files to update
const htmlFiles = [
  'new-index.html',
  'new-index-zh.html',
  'new-about.html',
  'new-about-zh.html',
  'new-products.html',
  'new-products-zh.html',
  'new-projects.html',
  'new-projects-zh.html',
  'new-contact.html',
  'new-contact-zh.html'
];

// Function to update CSS and JS references in HTML files
function updateHtmlFiles() {
  htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace CSS references
    content = content.replace(
      'assets/css/main-styles.css', 
      'assets/css/main.min.css'
    );
    
    content = content.replace(
      'assets/css/contact-styles.css', 
      'assets/css/contact.min.css'
    );
    
    content = content.replace(
      'assets/css/product-styles.css', 
      'assets/css/product.min.css'
    );
    
    content = content.replace(
      'assets/css/project-styles.css', 
      'assets/css/project.min.css'
    );
    
    // Replace JS references
    content = content.replace(
      'assets/js/main.js', 
      'assets/js/main.min.js'
    );
    
    content = content.replace(
      'assets/js/projects.js', 
      'assets/js/projects.min.js'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Updated ${file} to use minified assets`);
  });
}

// Run the update
updateHtmlFiles();
console.log('All HTML files updated to use minified CSS and JavaScript files.');