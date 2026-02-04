<?php
// Test MySQL connection
echo "Testing MySQL connection...\n";

try {
    $pdo = new PDO("mysql:host=localhost", "root", "");
    echo "✅ MySQL connection successful!\n";
    
    // Check if database exists
    $stmt = $pdo->query("SHOW DATABASES LIKE 'abex_pumps_db'");
    if ($stmt->rowCount() > 0) {
        echo "✅ Database 'abex_pumps_db' exists\n";
        
        // Check tables
        $pdo->exec("USE abex_pumps_db");
        $stmt = $pdo->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
        
        if (in_array('products', $tables)) {
            echo "✅ Products table exists\n";
        } else {
            echo "❌ Products table missing\n";
        }
        
        if (in_array('orders', $tables)) {
            echo "✅ Orders table exists\n";
        } else {
            echo "❌ Orders table missing\n";
        }
        
        if (in_array('order_items', $tables)) {
            echo "✅ Order items table exists\n";
        } else {
            echo "❌ Order items table missing\n";
        }
        
    } else {
        echo "❌ Database 'abex_pumps_db' not found\n";
        echo "Please run: /usr/local/mysql/bin/mysql -u root -p abex_pumps_db < database.sql\n";
    }
    
} catch (PDOException $e) {
    echo "❌ MySQL connection failed: " . $e->getMessage() . "\n";
    echo "Please check your MySQL installation and credentials\n";
}

echo "\nConfiguration check:\n";
echo "DB_HOST: " . (defined('DB_HOST') ? DB_HOST : 'Not defined') . "\n";
echo "DB_USER: " . (defined('DB_USER') ? DB_USER : 'Not defined') . "\n";
echo "DB_NAME: " . (defined('DB_NAME') ? DB_NAME : 'Not defined') . "\n";
?>