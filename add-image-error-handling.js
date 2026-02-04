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

// Function to add image error handling to HTML files
function addImageErrorHandling() {
  htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Add the image error handler script before the closing body tag
    const scriptTag = '    <script src="image-error-handler.js"></script>\n</body>';
    content = content.replace('</body>', scriptTag);
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    
    console.log(`Updated ${file} with image error handling`);
  });
}

// Run the update
addImageErrorHandling();
console.log('All HTML files updated with image error handling.');