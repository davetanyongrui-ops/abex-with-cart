<?php
require_once 'config.php';

// Simple admin authentication (in production, use proper authentication)
$admin_username = 'admin';
$admin_password = 'password123'; // Change this in production!

session_start();

// Handle login
if ($_POST['action'] ?? '' === 'login') {
    if ($_POST['username'] === $admin_username && $_POST['password'] === $admin_password) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: admin_products.php');
        exit();
    } else {
        $error = 'Invalid credentials';
    }
}

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in'] || $_SESSION['admin_logged_in'] !== true) {
    // Show login form
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Login - ABEX Pumps</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <link rel="stylesheet" href="assets/css/common.css">
        <link rel="stylesheet" href="assets/css/main.min.css">
        <style>
            body {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: 'Poppins', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
            }
            .login-container {
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.1);
                width: 100%;
                max-width: 400px;
            }
            .login-container h2 {
                text-align: center;
                margin-bottom: 25px;
                color: var(--primary);
            }
            .form-group {
                margin-bottom: 20px;
            }
            .form-group label {
                display: block;
                margin-bottom: 8px;
                font-weight: 500;
                color: var(--dark);
            }
            .form-group input {
                width: 100%;
                padding: 12px 15px;
                border: 1px solid var(--light-gray);
                border-radius: 8px;
                font-family: inherit;
                font-size: 1rem;
            }
            .btn-login {
                width: 100%;
                padding: 12px;
                background: var(--primary);
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: background 0.3s;
            }
            .btn-login:hover {
                background: var(--primary-dark);
            }
            .error {
                color: #dc2626;
                text-align: center;
                margin-bottom: 15px;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <h2><i class="fas fa-lock"></i> Admin Login</h2>
            <?php if (isset($error)): ?>
                <div class="error"><?php echo htmlspecialchars($error); ?></div>
            <?php endif; ?>
            <form method="post">
                <input type="hidden" name="action" value="login">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn-login">Login</button>
            </form>
        </div>
    </body>
    </html>
    <?php
    exit();
}

// Handle product updates
if ($_POST['action'] ?? '' === 'update_product') {
    try {
        $pdo = getConnection();
        $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, description = ?, category = ? WHERE id = ?");
        $result = $stmt->execute([
            $_POST['name'],
            floatval($_POST['price']),
            $_POST['description'],
            $_POST['category'],
            $_POST['id']
        ]);
        
        if ($result) {
            $message = "Product updated successfully!";
        } else {
            $error = "Failed to update product.";
        }
    } catch (Exception $e) {
        $error = "Error: " . $e->getMessage();
    }
}

// Handle product additions
if ($_POST['action'] ?? '' === 'add_product') {
    try {
        $pdo = getConnection();
        $stmt = $pdo->prepare("INSERT INTO products (id, name, description, price, image_url, category) VALUES (?, ?, ?, ?, ?, ?)");
        $result = $stmt->execute([
            $_POST['id'],
            $_POST['name'],
            $_POST['description'],
            floatval($_POST['price']),
            $_POST['image_url'],
            $_POST['category']
        ]);
        
        if ($result) {
            $message = "Product added successfully!";
        } else {
            $error = "Failed to add product.";
        }
    } catch (Exception $e) {
        $error = "Error: " . $e->getMessage();
    }
}

// Handle product deletions
if ($_GET['action'] ?? '' === 'delete_product') {
    try {
        $pdo = getConnection();
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $result = $stmt->execute([$_GET['id']]);
        
        if ($result) {
            $message = "Product deleted successfully!";
        } else {
            $error = "Failed to delete product.";
        }
    } catch (Exception $e) {
        $error = "Error: " . $e->getMessage();
    }
}

// Fetch all products
try {
    $pdo = getConnection();
    $stmt = $pdo->query("SELECT * FROM products ORDER BY category, name");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Exception $e) {
    $error = "Error fetching products: " . $e->getMessage();
    $products = [];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Management - ABEX Pumps Admin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/common.css">
    <link rel="stylesheet" href="assets/css/main.min.css">
    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background: var(--light);
            padding-top: 20px;
        }
        .admin-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--light-gray);
        }
        .admin-title {
            color: var(--primary);
        }
        .logout-btn {
            background: #ef4444;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        .logout-btn:hover {
            background: #dc2626;
        }
        .message {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: var(--shadow);
        }
        .products-table th,
        .products-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid var(--light-gray);
        }
        .products-table th {
            background: var(--light);
            font-weight: 600;
            color: var(--dark);
        }
        .actions {
            display: flex;
            gap: 10px;
        }
        .btn-edit, .btn-delete, .btn-add {
            padding: 8px 12px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-size: 0.9rem;
        }
        .btn-edit {
            background: var(--primary);
            color: white;
        }
        .btn-edit:hover {
            background: var(--primary-dark);
        }
        .btn-delete {
            background: #ef4444;
            color: white;
        }
        .btn-delete:hover {
            background: #dc2626;
        }
        .btn-add {
            background: var(--accent);
            color: white;
            margin-bottom: 20px;
        }
        .btn-add:hover {
            background: #ea580c;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
        }
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 600px;
            max-height: 90vh;
            overflow-y: auto;
        }
        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }
        .close:hover {
            color: black;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        .form-group input,
        .form-group textarea,
        .form-group select {
            width: 100%;
            padding: 10px;
            border: 1px solid var(--light-gray);
            border-radius: 6px;
            font-family: inherit;
        }
        .form-actions {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-top: 20px;
        }
        .btn-save, .btn-cancel {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }
        .btn-save {
            background: var(--primary);
            color: white;
        }
        .btn-cancel {
            background: var(--light-gray);
            color: var(--dark);
        }
        .btn-save:hover {
            background: var(--primary-dark);
        }
        .btn-cancel:hover {
            background: var(--gray);
        }
    </style>
</head>
<body>
    <div class="admin-container">
        <div class="admin-header">
            <h1 class="admin-title"><i class="fas fa-cog"></i> Product Management</h1>
            <a href="?logout=1" class="logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
            </a>
        </div>

        <?php if (isset($message)): ?>
            <div class="message success"><?php echo htmlspecialchars($message); ?></div>
        <?php endif; ?>
        <?php if (isset($error)): ?>
            <div class="message error"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>

        <a href="#addModal" class="btn-add" onclick="openAddModal(event)">
            <i class="fas fa-plus"></i> Add New Product
        </a>

        <table class="products-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($products as $product): ?>
                <tr>
                    <td><?php echo htmlspecialchars($product['id']); ?></td>
                    <td><?php echo htmlspecialchars($product['name']); ?></td>
                    <td>SGD $<?php echo number_format($product['price'], 2); ?></td>
                    <td><?php echo htmlspecialchars($product['category']); ?></td>
                    <td class="actions">
                        <a href="#editModal" class="btn-edit" onclick="openEditModal(event, <?php echo htmlspecialchars(json_encode($product), ENT_QUOTES, 'UTF-8'); ?>)">
                            <i class="fas fa-edit"></i> Edit
                        </a>
                        <a href="?action=delete_product&id=<?php echo urlencode($product['id']); ?>" class="btn-delete" onclick="return confirm('Are you sure you want to delete this product?')">
                            <i class="fas fa-trash"></i> Delete
                        </a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <!-- Edit Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('editModal')">&times;</span>
            <h2>Edit Product</h2>
            <form method="post">
                <input type="hidden" name="action" value="update_product">
                <input type="hidden" name="id" id="edit-id" value="">
                
                <div class="form-group">
                    <label for="edit-name">Product Name</label>
                    <input type="text" id="edit-name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-price">Price (SGD)</label>
                    <input type="number" id="edit-price" name="price" step="0.01" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="edit-category">Category</label>
                    <select id="edit-category" name="category" required>
                        <option value="Water Pumps">Water Pumps</option>
                        <option value="Submersible Pumps">Submersible Pumps</option>
                        <option value="Industrial Pumps">Industrial Pumps</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="edit-description">Description</label>
                    <textarea id="edit-description" name="description" rows="4"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="edit-image">Image URL</label>
                    <input type="text" id="edit-image" name="image_url">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeModal('editModal')">Cancel</button>
                    <button type="submit" class="btn-save">Save Changes</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Add Modal -->
    <div id="addModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal('addModal')">&times;</span>
            <h2>Add New Product</h2>
            <form method="post">
                <input type="hidden" name="action" value="add_product">
                
                <div class="form-group">
                    <label for="add-id">Product ID</label>
                    <input type="text" id="add-id" name="id" required placeholder="Unique identifier (e.g., pump-001)">
                </div>
                
                <div class="form-group">
                    <label for="add-name">Product Name</label>
                    <input type="text" id="add-name" name="name" required>
                </div>
                
                <div class="form-group">
                    <label for="add-price">Price (SGD)</label>
                    <input type="number" id="add-price" name="price" step="0.01" min="0" required>
                </div>
                
                <div class="form-group">
                    <label for="add-category">Category</label>
                    <select id="add-category" name="category" required>
                        <option value="Water Pumps">Water Pumps</option>
                        <option value="Submersible Pumps">Submersible Pumps</option>
                        <option value="Industrial Pumps">Industrial Pumps</option>
                        <option value="Accessories">Accessories</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="add-description">Description</label>
                    <textarea id="add-description" name="description" rows="4"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="add-image">Image URL</label>
                    <input type="text" id="add-image" name="image_url" placeholder="Path to image (e.g., images/pump.jpg)">
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeModal('addModal')">Cancel</button>
                    <button type="submit" class="btn-save">Add Product</button>
                </div>
            </form>
        </div>
    </div>

    <script>
        function openEditModal(event, product) {
            event.preventDefault();
            
            document.getElementById('edit-id').value = product.id;
            document.getElementById('edit-name').value = product.name;
            document.getElementById('edit-price').value = product.price;
            document.getElementById('edit-category').value = product.category;
            document.getElementById('edit-description').value = product.description || '';
            document.getElementById('edit-image').value = product.image_url || '';
            
            document.getElementById('editModal').style.display = 'block';
        }
        
        function openAddModal(event) {
            event.preventDefault();
            
            // Reset form
            document.querySelector('#addModal form').reset();
            
            document.getElementById('addModal').style.display = 'block';
        }
        
        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }
        
        // Close modals when clicking outside
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        }
        
        // Handle logout
        <?php if (isset($_GET['logout'])): ?>
            <?php
            session_start();
            unset($_SESSION['admin_logged_in']);
            session_destroy();
            header('Location: admin_products.php');
            exit();
            ?>
        <?php endif; ?>
    </script>
</body>
</html>