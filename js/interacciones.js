document.addEventListener('DOMContentLoaded', () => {
    
    // =======================================================
    // 🌽 LOGICA DEL CONTADOR DE VISITAS
    // =======================================================
    let visits = localStorage.getItem('contador_tlacuachas');
    
    if (visits === null) {
        // Primera vez que entra el cliente
        visits = 1;
    } else {
        // Sumamos una visita nueva
        visits = parseInt(visits) + 1;
    }
    
    // Guardamos el nuevo valor en la memoria del navegador
    localStorage.setItem('contador_tlacuachas', visits);
    
    // Lo mostramos en la pantalla
    document.getElementById('visit-count').textContent = visits;


    // =======================================================
    // 💬 LOGICA DE LA SECCIÓN DE RESEÑAS
    // =======================================================
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    // Reseñas iniciales por defecto (para que no se vea vacío al principio)
    const defaultReviews = [
        { name: "Brenda M.", rating: 5, text: "¡Las empanadas preparadas de pollo están de locura! Súper recomendadas." },
        { name: "Carlos Xalapa", rating: 4, text: "Las garnachas tienen una salsa de chile seco riquísima. Volveré pronto." }
    ];

    // Cargar reseñas guardadas o usar las por defecto si no hay nada en memoria
    let savedReviews = JSON.parse(localStorage.getItem('reseñas_tlacuachas'));
    if (!savedReviews) {
        savedReviews = defaultReviews;
        localStorage.setItem('reseñas_tlacuachas', JSON.stringify(savedReviews));
    }

    // Función para dibujar las reseñas en la web
    function displayReviews() {
        if (!reviewsList) return; // Evita errores si no encuentra la lista
        
        reviewsList.innerHTML = ''; // Limpiamos la lista anterior
        
        // Las recorremos al revés para que la más nueva salga arriba
        savedReviews.slice().reverse().forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';
            
            // Convertimos el número de calificación en estrellas visuales
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

    // Escuchar cuando el usuario envía una nueva reseña
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evitamos que la página se recargue

            // Capturamos los datos del formulario
            const nameInput = document.getElementById('review-name');
            const ratingInput = document.getElementById('review-rating');
            const textInput = document.getElementById('review-text');

            const newReview = {
                name: nameInput.value,
                rating: parseInt(ratingInput.value),
                text: textInput.value
            };

            // Añadimos la reseña al arreglo y guardamos en LocalStorage
            savedReviews.push(newReview);
            localStorage.setItem('reseñas_tlacuachas', JSON.stringify(savedReviews));

            // Actualizamos la lista en pantalla
            displayReviews();

            // Limpiamos los campos del formulario para la siguiente opinión
            reviewForm.reset();
        });
    }

    // Arrancamos mostrando las opiniones existentes al cargar la página
    displayReviews();

    // =======================================================
    // ✨ LOGICA DE LA BARRA LATERAL DESLIZABLE (NUEVO)
    // =======================================================
    const btnAbrir = document.getElementById('btn-abrir-resenas');
    const btnCerrar = document.getElementById('btn-cerrar-resenas');
    const sidebar = document.getElementById('sidebar-resenas');

    // Cuando le dan clic a "Reseñas" en el menú...
    if (btnAbrir && sidebar) {
        btnAbrir.addEventListener('click', function(evento) {
            evento.preventDefault(); // Evita que la página salte bruscamente al inicio
            sidebar.classList.add('activa'); // Añade la clase que la desliza hacia adentro
        });
    }

    // Cuando le dan clic al botón "✖ Cerrar"...
    if (btnCerrar && sidebar) {
        btnCerrar.addEventListener('click', function() {
            sidebar.classList.remove('activa'); // Quita la clase para que se esconda
        });
    }
});