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

// SEO enhancements to add
const seoEnhancements = {
  'new-index.html': {
    canonical: 'https://abex-engrg.com/',
    ogTitle: 'ABEX Pumps - Premium Water Pump Solutions',
    ogDescription: 'ABEX delivers premium water pump solutions for industrial, commercial, and residential applications. Featuring Paragon Pump - known for durability and energy efficiency.',
    ogUrl: 'https://abex-engrg.com/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-index-zh.html': {
    canonical: 'https://abex-engrg.com/zh/',
    ogTitle: 'ABEX 水泵 - 优质水泵解决方案',
    ogDescription: 'ABEX 提供优质的水泵解决方案，适用于工业、商业和住宅应用。特色产品 Paragon Pump - 以耐用性和能效著称。',
    ogUrl: 'https://abex-engrg.com/zh/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-about.html': {
    canonical: 'https://abex-engrg.com/about/',
    ogTitle: 'About Us - ABEX Pumps',
    ogDescription: 'Learn about ABEX Pumps, a leading supplier of water pump solutions across Southeast Asia with over two decades of industry expertise.',
    ogUrl: 'https://abex-engrg.com/about/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-about-zh.html': {
    canonical: 'https://abex-engrg.com/zh/about/',
    ogTitle: '关于我们 - ABEX 水泵',
    ogDescription: '了解 ABEX 水泵，东南亚地区领先的水泵解决方案供应商，拥有二十多年的行业专业知识。',
    ogUrl: 'https://abex-engrg.com/zh/about/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-products.html': {
    canonical: 'https://abex-engrg.com/products/',
    ogTitle: 'Our Products - ABEX Pumps',
    ogDescription: 'Explore ABEX\'s complete range of water pumping solutions including water pumps, submersible pumps, industrial pumps, and accessories.',
    ogUrl: 'https://abex-engrg.com/products/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-products-zh.html': {
    canonical: 'https://abex-engrg.com/zh/products/',
    ogTitle: '我们的产品 - ABEX 水泵',
    ogDescription: '探索ABEX完整的水泵解决方案，包括水泵、潜水泵、工业泵和配件。',
    ogUrl: 'https://abex-engrg.com/zh/products/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-projects.html': {
    canonical: 'https://abex-engrg.com/projects/',
    ogTitle: 'Our Projects - ABEX Pumps',
    ogDescription: 'View ABEX\'s completed water pump projects across Singapore, Malaysia, and Indonesia. Industrial, commercial, and residential installations.',
    ogUrl: 'https://abex-engrg.com/projects/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-projects-zh.html': {
    canonical: 'https://abex-engrg.com/zh/projects/',
    ogTitle: '我们的项目 - ABEX 水泵',
    ogDescription: '查看ABEX在新加坡、马来西亚和印度尼西亚完成的水泵项目。工业、商业和住宅安装。',
    ogUrl: 'https://abex-engrg.com/zh/projects/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-contact.html': {
    canonical: 'https://abex-engrg.com/contact/',
    ogTitle: 'Contact Us - ABEX Pumps',
    ogDescription: 'Contact ABEX Pumps for water pump solutions, industrial pumps, and submersible pumps in Singapore and Southeast Asia.',
    ogUrl: 'https://abex-engrg.com/contact/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  },
  'new-contact-zh.html': {
    canonical: 'https://abex-engrg.com/zh/contact/',
    ogTitle: '联系我们 - ABEX 水泵',
    ogDescription: '联系ABEX水泵，获取新加坡和东南亚地区的水泵解决方案、工业泵和潜水泵。',
    ogUrl: 'https://abex-engrg.com/zh/contact/',
    ogImage: 'https://abex-engrg.com/wp-content/themes/abex-engineering/images/page_template/logo.png'
  }
};

// Function to update SEO meta tags in HTML files
function updateSeoMetaTags() {
  htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Get the SEO data for this file
    const seoData = seoEnhancements[file];
    
    if (seoData) {
      // Add canonical link
      content = content.replace(
        '</title>',
        `</title>\n    <link rel="canonical" href="${seoData.canonical}">`
      );
      
      // Add Open Graph meta tags
      const ogTags = `
    <meta property="og:title" content="${seoData.ogTitle}">
    <meta property="og:description" content="${seoData.ogDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${seoData.ogUrl}">
    <meta property="og:image" content="${seoData.ogImage}">
    <meta property="og:site_name" content="ABEX Pumps">`;
      
      content = content.replace(
        '<meta name="author" content="ABEX Pumps">',
        `<meta name="author" content="ABEX Pumps">${ogTags}`
      );
      
      // Add Twitter Card meta tags
      const twitterTags = `
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${seoData.ogTitle}">
    <meta name="twitter:description" content="${seoData.ogDescription}">
    <meta name="twitter:image" content="${seoData.ogImage}">
    <meta name="twitter:site" content="@ABEXPumps">`;
      
      content = content.replace(
        '<meta name="author" content="ABEX 水泵">',
        `<meta name="author" content="ABEX 水泵">${twitterTags}`
      );
      
      // Write the updated content back to the file
      fs.writeFileSync(filePath, content, 'utf8');
      
      console.log(`Updated ${file} with SEO meta tags`);
    }
  });
}

// Run the update
updateSeoMetaTags();
console.log('All HTML files updated with enhanced SEO meta tags.');