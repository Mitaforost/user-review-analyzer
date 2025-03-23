document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const averageRatingElement = document.getElementById("averageRating");
    const mostPopularKeywordElement = document.getElementById("mostPopularKeyword");
    const keywordFrequencyContainer = document.getElementById("keywordFrequencyContainer");

    function loadStatistics() {
        fetch("http://localhost:5000/statistics")
            .then(response => response.json())
            .then(data => {
                averageRatingElement.textContent = data.average_rating || "Нет данных";
                mostPopularKeywordElement.textContent = data.most_popular_keyword || "Нет данных";
            })
            .catch(error => console.error("Ошибка при загрузке статистики:", error));
    }

    function loadKeywords() {
        fetch("http://localhost:5000/keywords")
            .then(response => response.json())
            .then(keywords => {
                if (!Array.isArray(keywords)) {
                    throw new TypeError("Expected an array of keywords");
                }
                keywordFrequencyContainer.innerHTML = "";
                keywords.forEach(keyword => {
                    const keywordElement = document.createElement("div");
                    keywordElement.classList.add("keyword-item");
                    keywordElement.innerHTML = `
                        <p><strong>Ключевое слово:</strong> ${keyword.keyword}</p>
                        <p><strong>Частота:</strong> ${keyword.occurrences || "Нет данных"}</p>
                    `;
                    keywordFrequencyContainer.appendChild(keywordElement);
                });
            })
            .catch(error => console.error("Ошибка при загрузке ключевых слов:", error));
    }

    // Загрузка статистики и ключевых слов при загрузке страницы
    loadStatistics();
    loadKeywords();
});
