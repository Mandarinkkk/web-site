document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
    const createBtn = document.getElementById('create-btn') as HTMLButtonElement;
    const authPageLink = document.getElementById('auth-page-link') as HTMLAnchorElement;

    if (createBtn) {
        createBtn.addEventListener('click', () => {
            window.location.href = 'create.html'; 
        });
    }

    if (authPageLink) {
        authPageLink.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
    }
});
