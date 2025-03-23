document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const authEyes = document.querySelector('.auth__eyes');

    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = passwordInput.value;

            const userData = {
                username: name,
                email: email,
                password: password,
                role_id: 3
            };

            try {

                const response = await fetch('http://localhost:5000/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.ok) {
                    // Если регистрация успешна
                    alert('Регистрация успешна!');
                    window.location.href = 'login.html'; // Перенаправляем на страницу входа
                } else {
                    // Если произошла ошибка на сервере
                    alert('Ошибка: ' + data.error);
                }
            } catch (error) {
                // Если произошла ошибка в запросе
                console.error('Ошибка:', error);
                alert('Произошла ошибка при регистрации.');
            }
        });
    }

    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            togglePassword.textContent = type === "password" ? "👁️" : "🙈";
            authEyes.firstChild.textContent = type === "password" ? "Показать пароль " : "Скрыть пароль ";
        });
    }
});
