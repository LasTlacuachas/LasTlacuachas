document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 🌽 LOGICA DEL CONTADOR DE VISITAS (SOLO ADMIN)
    // =======================================================
    // El contador suma automáticamente en el LocalStorage
    let visits = localStorage.getItem('contador_tlacuachas');
    
    if (visits === null) {
        visits = 1;
    } else {
        visits = parseInt(visits) + 1;
    }
    localStorage.setItem('contador_tlacuachas', visits);
    // Ya no buscamos 'visit-count' para evitar errores en consola.
    // Recuerda que puedes ver el número en F12 > Application > Local Storage.


    // =======================================================
    // ☰ LOGICA DEL MENÚ HAMBURGUESA (MÓVIL)
    // =======================================================
    const btnMenu = document.getElementById('btn-menu');
    const navLinks = document.getElementById('nav-links');

    if (btnMenu && navLinks) {
        btnMenu.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }


    // =======================================================
    // 💬 LOGICA DE LA SECCIÓN DE RESEÑAS
    // =======================================================
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    const defaultReviews = [
        { name: "Brenda M.", rating: 5, text: "¡Las empanadas preparadas de pollo están de locura! Súper recomendadas." },
        { name: "Carlos Xalapa", rating: 4, text: "Las garnachas tienen una salsa de chile seco riquísima. Volveré pronto." }
    ];

    let savedReviews = JSON.parse(localStorage.getItem('reseñas_tlacuachas'));
    if (!savedReviews) {
        savedReviews = defaultReviews;
        localStorage.setItem('reseñas_tlacuachas', JSON.stringify(savedReviews));
    }

    function displayReviews() {
        if (!reviewsList) return;
        reviewsList.innerHTML = '';
        savedReviews.slice().reverse().forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';
            const stars = '⭐'.repeat(review.rating);
            card.innerHTML = `
                <div class="review-card-header">
                    <span class="review-author">${review.name}</span>
                    <span class="review-stars">${stars}</span>
                </div>
                <p>"${review.text}"</p>
            `;
            reviewsList.appendChild(card);
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('review-name');
            const ratingInput = document.getElementById('review-rating');
            const textInput = document.getElementById('review-text');

            const newReview = {
                name: nameInput.value,
                rating: parseInt(ratingInput.value),
                text: textInput.value
            };

            savedReviews.push(newReview);
            localStorage.setItem('reseñas_tlacuachas', JSON.stringify(savedReviews));
            displayReviews();
            reviewForm.reset();
        });
    }

    displayReviews();
});
