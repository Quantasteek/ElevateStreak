document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');

    // Email validation regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    // Name validation regex - only letters, spaces, and basic punctuation
    const nameRegex = /^[a-zA-Z\s\-'\.]+$/;

    const validateName = (name) => {
        const nameError = document.getElementById('nameError');
        if (!name.trim()) {
            nameError.textContent = 'Name is required';
            return false;
        }
        if (name.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters long';
            return false;
        }
        if (!nameRegex.test(name)) {
            nameError.textContent = 'Name should only contain letters, spaces, hyphens, and periods';
            return false;
        }
        nameError.textContent = '';
        return true;
    };

    const validateEmail = (email) => {
        const emailError = document.getElementById('emailError');
        if (!email.trim()) {
            emailError.textContent = 'Email is required';
            return false;
        }
        if (!emailRegex.test(email)) {
            emailError.textContent = 'Please enter a valid email address';
            return false;
        }
        emailError.textContent = '';
        return true;
    };

    const validateMessage = (message) => {
        const messageError = document.getElementById('messageError');
        if (!message.trim()) {
            messageError.textContent = 'Message is required';
            return false;
        }
        if (message.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters long';
            return false;
        }
        messageError.textContent = '';
        return true;
    };

    const showSuccessMessage = () => {
        successMessage.textContent = 'Thank you for your message! We will get back to you soon.';
        successMessage.classList.add('show');
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
    };

    const resetForm = () => {
        form.reset();
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    };

    // Real-time validation on input
    nameInput.addEventListener('input', () => validateName(nameInput.value));
    emailInput.addEventListener('input', () => validateEmail(emailInput.value));
    messageInput.addEventListener('input', () => validateMessage(messageInput.value));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateName(nameInput.value);
        const isEmailValid = validateEmail(emailInput.value);
        const isMessageValid = validateMessage(messageInput.value);

        if (isNameValid && isEmailValid && isMessageValid) {
            // Here you would typically send the data to a server
            console.log('Form submitted:', {
                name: nameInput.value,
                email: emailInput.value,
                message: messageInput.value
            });

            showSuccessMessage();
            resetForm();
        }
    });
}); 