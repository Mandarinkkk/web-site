document.addEventListener('DOMContentLoaded', () => {
    const backToAuthLink = document.getElementById('back-to-auth-link') as HTMLAnchorElement;

    if (backToAuthLink) {
        backToAuthLink.addEventListener('click', () => {
            window.location.href = 'index.html'; // Переход на страницу авторизации
        });
    }
});

// frontend/registration.ts
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registration-form') as HTMLFormElement;

    if (registrationForm) {
        registrationForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = (document.getElementById('name') as HTMLInputElement).value;
            const email = (document.getElementById('email') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement).value;

            if (password !== confirmPassword) {
                alert('Пароли не совпадают. Попробуйте снова.');
                return;
            }

            try {

                const response = await fetch('http://localhost:3000/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Регистрация прошла успешно:', data);
                    window.location.href = 'main.html';
                } else {
                    alert(data.message || 'Что-то пошло не так. Попробуйте снова.');
                }
            }
            catch (error) {
                console.error('Ошибка при регистрации:', error);
                alert('Что-то пошло не так. Попробуйте снова.');
            }
        });
    }
});
