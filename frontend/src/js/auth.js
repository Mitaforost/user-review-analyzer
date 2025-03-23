document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const username = document.getElementById("username").value;
            const password = passwordInput.value;

            try {
                const response = await fetch("http://127.0.0.1:5000/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Успешный вход!");
                    localStorage.setItem("user", JSON.stringify(result));
                    window.location.href = "index.html";
                } else {
                    alert(result.message || "Ошибка входа");
                }
            } catch (error) {
                console.error("Ошибка запроса:", error);
                alert("Ошибка соединения с сервером.");
            }
        });
    }

    if (togglePassword) {
        togglePassword.addEventListener("click", () => {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            const authEyes = document.querySelector('.auth__eyes');
            passwordInput.setAttribute("type", type);
            togglePassword.textContent = type === "password" ? "👁️" : "🙈";
            authEyes.firstChild.textContent = type === "password" ? "Показать пароль " : "Скрыть пароль ";
        });
    }
});
