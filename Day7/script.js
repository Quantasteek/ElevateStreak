document.addEventListener('DOMContentLoaded', () => {
    const usersContainer = document.getElementById('usersContainer');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorContainer = document.getElementById('errorContainer');
    const reloadBtn = document.getElementById('reloadBtn');

    const API_URL = 'https://jsonplaceholder.typicode.com/users';

    const showLoading = () => {
        loadingSpinner.classList.add('show');
        errorContainer.classList.remove('show');
        usersContainer.innerHTML = '';
    };

    const hideLoading = () => {
        loadingSpinner.classList.remove('show');
    };

    const showError = (message) => {
        errorContainer.textContent = message;
        errorContainer.classList.add('show');
    };

    const formatAddress = (address) => {
        return `${address.street}, ${address.suite}, ${address.city}, ${address.zipcode}`;
    };

    const createUserCard = (user) => {
        const card = document.createElement('div');
        card.className = 'user-card';
        
        card.innerHTML = `
            <h2 class="user-name">${user.name}</h2>
            <p class="user-email">${user.email}</p>
            <p class="user-address">${formatAddress(user.address)}</p>
        `;
        
        return card;
    };

    const fetchUsers = async () => {
        showLoading();
        
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const users = await response.json();
            
            usersContainer.innerHTML = '';
            users.forEach(user => {
                const userCard = createUserCard(user);
                usersContainer.appendChild(userCard);
            });
            
        } catch (error) {
            let errorMessage = 'Failed to fetch users. ';
            
            if (!navigator.onLine) {
                errorMessage += 'Please check your internet connection.';
            } else if (error.message.includes('HTTP error')) {
                errorMessage += 'Server error occurred.';
            } else {
                errorMessage += 'An unexpected error occurred.';
            }
            
            showError(errorMessage);
            console.error('Error fetching users:', error);
        } finally {
            hideLoading();
        }
    };

    fetchUsers();

    reloadBtn.addEventListener('click', () => {
        fetchUsers();
    });

    window.addEventListener('online', () => {
        if (errorContainer.classList.contains('show')) {
            fetchUsers();
        }
    });

    window.addEventListener('offline', () => {
        showError('You are offline. Please check your internet connection.');
    });
}); 