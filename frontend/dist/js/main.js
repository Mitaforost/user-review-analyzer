document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const userInfoDiv = document.getElementById("userInfo");
    const role = user.user.role_id;
    const username = user.user.username;

    let roleText = "";
    switch (role) {
        case 1:
            roleText = "Администратор";
            break;
        case 2:
            roleText = "Клиент";
            break;
        default:
            roleText = "Неизвестная роль";
            break;
    }

    userInfoDiv.innerHTML = `<p>${roleText} - <span>${username}</span></p>`;

    // Ограничение доступа по ролям
    function restrictAccess() {
        if (role === 2) {
            // Клиент не может видеть статистику
            document.querySelector('a[href="statistics.html"]').style.display = "none";
        }
    }

    restrictAccess();

    function loadStatistics() {
        fetch('http://127.0.0.1:5000/statistics')
            .then(response => response.json())
            .then(data => {
                if (role === 1) {
                    if (document.getElementById("totalParts")) {
                        document.getElementById("totalParts").textContent = data.partCount;
                    }
                    if (document.getElementById("totalCustomers")) {
                        document.getElementById("totalCustomers").textContent = data.userCount;
                    }
                    if (document.getElementById("totalOrders")) {
                        document.getElementById("totalOrders").textContent = data.orderCount;
                    }
                    if (document.getElementById("totalPayments")) {
                        document.getElementById("totalPayments").textContent = data.paymentSum + ' BYN';
                    }
                    if (document.getElementById("totalLogs")) {
                        document.getElementById("totalLogs").textContent = data.logCount;
                    }
                } else if (role === 2) {
                    if (document.getElementById("totalOrders")) {
                        document.getElementById("totalOrders").textContent = data.orderCount;
                    }
                    if (document.getElementById("totalProducts")) {
                        document.getElementById("totalProducts").textContent = data.partCount;
                    }
                }
            })
            .catch(error => console.error('Ошибка при загрузке статистики:', error));
    }

    loadStatistics();

    setInterval(loadStatistics, 10000);

    const logoutPopup = document.getElementById("logoutPopup");
    const confirmLogout = document.getElementById("confirmLogout");
    const cancelLogout = document.getElementById("cancelLogout");

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.style.display = "inline-block";
        logoutBtn.addEventListener("click", () => {
            logoutPopup.style.display = "flex";
        });

        confirmLogout.addEventListener("click", () => {
            localStorage.removeItem("user");
            window.location.href = "login.html";
        });

        cancelLogout.addEventListener("click", () => {
            logoutPopup.style.display = "none";
        });
    }
});
