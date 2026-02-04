// Image error handling for ABEX Pumps website

// Function to handle image loading errors
function handleImageError(imgElement) {
    // Set a fallback image
    imgElement.src = 'assets/logos/placeholder-logo.svg';
    
    // Add a class to style the fallback image
    imgElement.classList.add('image-error');
    
    // Log the error for debugging (optional)
    console.warn('Image failed to load, using fallback:', imgElement.alt);
}

// Function to add error handling to all images
function addImageErrorHandling() {
    // Get all images on the page
    const images = document.querySelectorAll('img');
    
    // Add error event listener to each image
    images.forEach(img => {
        // Only add error handling if not already added
        if (!img.hasAttribute('data-error-handler')) {
            img.addEventListener('error', function() {
                handleImageError(this);
            });
            
            // Mark that error handler has been added
            img.setAttribute('data-error-handler', 'true');
        }
    });
}

// Initialize image error handling when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    addImageErrorHandling();
});

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleImageError,
        addImageErrorHandling
    };
}