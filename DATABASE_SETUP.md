# ABEX Pumps Database Setup Guide

## Step 1: Reset MySQL Root Password

1. Stop MySQL server:
   ```bash
   sudo /usr/local/mysql/support-files/mysql.server stop
   ```

2. Start MySQL in safe mode without password:
   ```bash
   sudo /usr/local/mysql/bin/mysqld_safe --skip-grant-tables &
   ```

3. Connect to MySQL:
   ```bash
   /usr/local/mysql/bin/mysql -u root
   ```

4. Update the root password:
   ```sql
   FLUSH PRIVILEGES;
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

5. Stop MySQL safe mode and restart normally:
   ```bash
   sudo pkill mysqld
   sudo /usr/local/mysql/support-files/mysql.server start
   ```

## Step 2: Create Database

1. Connect to MySQL with your new password:
   ```bash
   /usr/local/mysql/bin/mysql -u root -p
   ```

2. Create the database:
   ```sql
   CREATE DATABASE abex_pumps_db;
   USE abex_pumps_db;
   ```

3. Import the database schema:
   ```bash
   /usr/local/mysql/bin/mysql -u root -p abex_pumps_db < database.sql
   ```

## Step 3: Configure the Application

1. Edit `config.php` and update with your credentials:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', 'your_new_password');
   define('DB_NAME', 'abex_pumps_db');
   ```

## Step 4: Test the Setup

1. Start your web server:
   ```bash
   npm start
   ```

2. Visit: http://localhost:3000/admin_products.php
3. Login with:
   - Username: admin
   - Password: password123

## Step 5: Change Admin Credentials

After logging in, immediately change the admin credentials in `admin_products.php`:
```php
$admin_username = 'your_secure_username';
$admin_password = 'your_secure_password';
```

## Troubleshooting

If you encounter any issues:
- Make sure MySQL is running: `sudo /usr/local/mysql/support-files/mysql.server status`
- Check MySQL error logs: `/usr/local/mysql/data/mysqld.local.err`
- Verify PHP can connect to MySQL