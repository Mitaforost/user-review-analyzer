document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const reviewsContainer = document.getElementById("reviewsContainer");
    const filterRating = document.getElementById("filterRating");
    const applyFilterBtn = document.getElementById("applyFilterBtn");

    let reviews = [];

    function displayReviews(filteredReviews) {
        reviewsContainer.innerHTML = "";
        filteredReviews.forEach(review => {
            const reviewElement = document.createElement("div");
            reviewElement.classList.add("review-item");
            reviewElement.innerHTML = `
                <p><strong>Оценка:</strong> ${review.rating}</p>
                <p><strong>Отзыв:</strong> ${review.review_text}</p>
                <p><strong>Дата:</strong> ${new Date(review.created_at).toLocaleString()}</p>
            `;
            reviewsContainer.appendChild(reviewElement);
        });
    }

    function loadReviews() {
        fetch("http://localhost:5000/reviews")
            .then(response => response.json())
            .then(data => {
                reviews = data;
                displayReviews(reviews);
            })
            .catch(error => console.error("Ошибка при загрузке отзывов:", error));
    }

    applyFilterBtn.addEventListener("click", () => {
        const selectedRating = filterRating.value;
        const filteredReviews = selectedRating ? reviews.filter(review => review.rating == selectedRating) : reviews;
        displayReviews(filteredReviews);
    });

    // Загрузка всех отзывов при загрузке страницы
    loadReviews();
});
