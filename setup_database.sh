#!/bin/bash

# ABEX Pumps Database Setup Script

echo "=== ABEX Pumps Database Setup ==="
echo ""

# MySQL path
MYSQL="/usr/local/mysql/bin/mysql"
MYSQLADMIN="/usr/local/mysql/bin/mysqladmin"

# Check if MySQL is running
echo "Checking MySQL connection..."
if $MYSQL -u root -e "SELECT 1" >/dev/null 2>&1; then
    echo "✅ MySQL is running and accessible"
else
    echo "❌ Cannot connect to MySQL. Please make sure MySQL is running."
    echo "Try starting MySQL with: sudo $MYSQLADMIN start"
    exit 1
fi

echo ""
echo "Creating database and tables..."
$MYSQL -u root -e "CREATE DATABASE IF NOT EXISTS abex_pumps_db;"
$MYSQL -u root abex_pumps_db < database.sql

if [ $? -eq 0 ]; then
    echo "✅ Database setup completed successfully!"
    echo ""
    echo "Database created: abex_pumps_db"
    echo "Tables created: products, orders, order_items"
    echo ""
    echo "Next steps:"
    echo "1. Update config.php with your MySQL credentials"
    echo "2. Access admin panel at: http://localhost:3000/admin_products.php"
    echo "3. Default login - Username: admin, Password: password123"
    echo "4. CHANGE THE DEFAULT CREDENTIALS IMMEDIATELY!"
else
    echo "❌ Database setup failed. Please check the error messages above."
fi