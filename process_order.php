<?php
require_once 'config.php';

// Set content type to JSON
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Method not allowed');
    }

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Invalid JSON input');
    }

    // Validate required fields
    $required_fields = ['customer', 'items', 'subtotal', 'gst', 'total'];
    foreach ($required_fields as $field) {
        if (!isset($input[$field])) {
            throw new Exception("Missing required field: $field");
        }
    }

    $customer = $input['customer'];
    $items = $input['items'];
    $subtotal = floatval($input['subtotal']);
    $gst = floatval($input['gst']);
    $total = floatval($input['total']);

    // Validate customer data
    $required_customer_fields = ['fullName', 'email', 'phone', 'address', 'city', 'postalCode', 'country'];
    foreach ($required_customer_fields as $field) {
        if (empty($customer[$field])) {
            throw new Exception("Missing required customer field: $field");
        }
    }

    // Validate email format
    if (!filter_var($customer['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Invalid email format');
    }

    $pdo = getConnection();
    
    // Start transaction
    $pdo->beginTransaction();

    // Insert order
    $stmt = $pdo->prepare("INSERT INTO orders (
        customer_name, customer_email, customer_phone, customer_company,
        delivery_address, delivery_city, delivery_postal_code, delivery_country,
        order_notes, subtotal, gst, total_amount
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    $stmt->execute([
        $customer['fullName'],
        $customer['email'],
        $customer['phone'],
        $customer['company'] ?? '',
        $customer['address'],
        $customer['city'],
        $customer['postalCode'],
        $customer['country'],
        $customer['notes'] ?? '',
        $subtotal,
        $gst,
        $total
    ]);

    $order_id = $pdo->lastInsertId();

    // Insert order items
    $item_stmt = $pdo->prepare("INSERT INTO order_items (
        order_id, product_id, product_name, product_price, quantity, subtotal
    ) VALUES (?, ?, ?, ?, ?, ?)");

    foreach ($items as $item) {
        $item_stmt->execute([
            $order_id,
            $item['id'],
            $item['name'],
            $item['price'],
            $item['quantity'],
            $item['price'] * $item['quantity']
        ]);
    }

    // Commit transaction
    $pdo->commit();

    // Return success response
    echo json_encode([
        'success' => true,
        'message' => 'Order placed successfully',
        'order_id' => $order_id,
        'timestamp' => date('Y-m-d H:i:s')
    ]);

} catch (Exception $e) {
    // Rollback transaction on error
    if (isset($pdo)) {
        $pdo->rollback();
    }
    
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>