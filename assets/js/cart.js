// Shopping Cart System for ABEX Pumps
class ShoppingCart {
    constructor() {
        this.cart = this.loadCart();
        this.cartIcon = document.getElementById('cart-icon');
        this.cartCount = document.getElementById('cart-count');
        this.cartDropdown = document.getElementById('cart-dropdown');
        this.init();
    }

    // Initialize cart system
    init() {
        this.updateCartCount();
        this.bindEvents();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('abex_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('abex_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Add item to cart
    addItem(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += product.quantity || 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: product.quantity || 1
            });
        }
        
        this.saveCart();
        this.showAddToCartNotification(product.name);
        return true;
    }

    // Remove item from cart
    removeItem(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDropdown();
        return true;
    }

    // Update item quantity
    updateQuantity(productId, newQuantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
            this.updateCartDropdown();
        }
    }

    // Get cart total
    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Get item count
    getItemCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Update cart count display
    updateCartCount() {
        const count = this.getItemCount();
        if (this.cartCount) {
            this.cartCount.textContent = count;
            this.cartCount.style.display = count > 0 ? 'block' : 'none';
        }
    }

    // Update cart dropdown content
    updateCartDropdown() {
        if (!this.cartDropdown) return;
        
        if (this.cart.length === 0) {
            this.cartDropdown.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                </div>
            `;
            return;
        }

        const cartItemsHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>SGD $${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cart.removeItem('${item.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        const total = this.getCartTotal();
        
        this.cartDropdown.innerHTML = `
            <div class="cart-items">
                ${cartItemsHTML}
            </div>
            <div class="cart-summary">
                <div class="cart-total">
                    <strong>Total: SGD $${total.toFixed(2)}</strong>
                </div>
                <div class="cart-actions">
                    <a href="cart.html" class="btn btn-view-cart">View Cart</a>
                    <a href="checkout.html" class="btn btn-checkout">Checkout</a>
                </div>
            </div>
        `;
    }

    // Toggle cart dropdown
    toggleCartDropdown() {
        if (this.cartDropdown) {
            this.cartDropdown.classList.toggle('show');
            if (this.cartDropdown.classList.contains('show')) {
                this.updateCartDropdown();
            }
        }
    }

    // Bind event listeners
    bindEvents() {
        // Close cart dropdown when clicking outside
        document.addEventListener('click', (event) => {
            if (this.cartIcon && this.cartDropdown) {
                if (!this.cartIcon.contains(event.target) && !this.cartDropdown.contains(event.target)) {
                    this.cartDropdown.classList.remove('show');
                }
            }
        });

        // Toggle cart on icon click
        if (this.cartIcon) {
            this.cartIcon.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCartDropdown();
            });
        }
    }

    // Show notification when item is added
    showAddToCartNotification(productName) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} added to cart!</span>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Get cart items for display on cart page
    getCartItems() {
        return this.cart;
    }
}

// Initialize cart when DOM is loaded
let cart;
document.addEventListener('DOMContentLoaded', () => {
    cart = new ShoppingCart();
});

// Utility function to add product to cart
async function addToCart(productId, productName, price, image) {
    try {
        // Fetch latest product info from database to ensure correct price
        const response = await fetch('/api/products');
        const result = await response.json();
        
        if (result.success) {
            const productInfo = result.products.find(p => p.id === productId);
            
            if (productInfo) {
                const product = {
                    id: productId,
                    name: productInfo.name,
                    price: parseFloat(productInfo.price),
                    image: productInfo.image_url,
                    quantity: 1
                };
                
                cart.addItem(product);
            } else {
                // Fallback to provided info if not found in DB
                const product = {
                    id: productId,
                    name: productName,
                    price: parseFloat(price),
                    image: image,
                    quantity: 1
                };
                
                cart.addItem(product);
            }
        } else {
            // Fallback to provided info if API fails
            const product = {
                id: productId,
                name: productName,
                price: parseFloat(price),
                image: image,
                quantity: 1
            };
            
            cart.addItem(product);
        }
    } catch (error) {
        console.error('Error fetching product info:', error);
        
        // Fallback to provided info if API fails
        const product = {
            id: productId,
            name: productName,
            price: parseFloat(price),
            image: image,
            quantity: 1
        };
        
        cart.addItem(product);
    }
}

// Utility function to format currency
function formatCurrency(amount) {
    return `SGD $${amount.toFixed(2)}`;
}

// Wrapper function to handle async addToCart from HTML onclick
function handleAddToCart(productId, productName, price, image) {
    // Show loading indicator
    const button = event.target.closest('.add-to-cart');
    const originalHtml = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    button.disabled = true;
    
    addToCart(productId, productName, price, image)
        .catch(error => {
            console.error('Error adding to cart:', error);
        })
        .finally(() => {
            // Restore button
            button.innerHTML = originalHtml;
            button.disabled = false;
        });
}
