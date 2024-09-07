document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting the default way

    // Predefined admin credentials
    const correctAdminId = 'admin';
    const correctPassword = '123';

    // Get values from the form
    const adminId = document.getElementById('adminId').value;
    const password = document.getElementById('password').value;

    // Check credentials
    if (adminId === correctAdminId && password === correctPassword) {
        // Redirect to index.html
        window.location.href = 'index.html';
    } else {
        // Show error message
        const alertBox = document.getElementById('alert');
        alertBox.textContent = 'Wrong password! Cannot show inventory.';
        alertBox.style.display = 'block';
    }
});
