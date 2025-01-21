document.addEventListener('DOMContentLoaded', () => {
    const authForm = document.getElementById('auth-form') as HTMLFormElement;

    if (authForm) {
        authForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = (document.getElementById('email') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;

            try {
                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Авторизация успешна:', data);
                    window.location.href = 'main.html';
                } else {
                    alert(data.message || 'Ошибка авторизации. Проверьте данные.');
                }
            } catch (error: unknown) {
                console.error('Ошибка авторизации:', error instanceof Error ? error.message : error);
                alert('Не удалось выполнить авторизацию. Попробуйте позже.');
            }
        });
    }
});
