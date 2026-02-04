<?php
require_once 'config.php';

// Set content type to JSON
header('Content-Type: application/json');

try {
    $pdo = getConnection();
    
    // Fetch all active products
    $stmt = $pdo->query("SELECT id, name, description, price, image_url, category FROM products ORDER BY category, name");
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'products' => $products,
        'count' => count($products)
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}
?>