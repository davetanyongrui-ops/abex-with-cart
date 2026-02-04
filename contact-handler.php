<?php
// Contact form handler for ABEX Pumps website

// Check if form was submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';
    
    // Validate required fields
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Please enter a valid email address.']);
        exit;
    }
    
    // Set email recipient (replace with actual email)
    $to = "rickytan@abex-engrg.com";
    $subject = "New Contact Form Submission from ABEX Pumps Website";
    
    // Create email body
    $email_body = "New contact form submission:\n\n";
    $email_body .= "Name: " . $name . "\n";
    $email_body .= "Email: " . $email . "\n";
    $email_body .= "Phone: " . $phone . "\n";
    $email_body .= "Message: " . $message . "\n";
    
    // Set email headers
    $headers = "From: " . $email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    
    // Send email
    if (mail($to, $subject, $email_body, $headers)) {
        // Return success response
        echo json_encode([
            'status' => 'success',
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);
    } else {
        // Return error response
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Sorry, there was an error sending your message. Please try again later.'
        ]);
    }
} else {
    // If not a POST request, return error
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
}
?>