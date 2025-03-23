document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const submitReviewBtn = document.getElementById("submitReviewBtn");
    submitReviewBtn.addEventListener("click", () => {
        const reviewText = document.getElementById("reviewText").value;
        const reviewRating = document.getElementById("reviewRating").value;
        const keywords = [];  // Добавьте логику для получения ключевых слов, если необходимо

        if (!reviewText || !reviewRating) {
            alert("Пожалуйста, заполните все поля.");
            return;
        }

        const reviewData = {
            user_id: user.user.id,
            rating: parseInt(reviewRating),
            review_text: reviewText,
            keywords: keywords
        };

        fetch("http://localhost:5000/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reviewData),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error("Ошибка создания отзыва:", data.error);
                    alert("Ошибка на сервере при создании отзыва.");
                } else {
                    console.log("Новый отзыв создан:", data);
                    alert("Отзыв успешно добавлен!");
                    // Очистка формы после успешного добавления отзыва
                    document.getElementById("reviewText").value = "";
                    document.getElementById("reviewRating").value = "1";
                }
            })
            .catch(error => {
                console.error("Ошибка создания отзыва:", error);
                alert("Ошибка на сервере.");
            });
    });
});
