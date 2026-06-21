// =======================================================
// ☁️ CONEXIÓN A SUPABASE (LA LIBRETA EN LA NUBE)
// =======================================================
// Esto va afuera del DOMContentLoaded para que la página lo cargue primero
const supabaseUrl = 'https://yrmidffmzyooperjnxpw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlybWlkZmZtenlvb3BlcmpueHB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5ODIwNDUsImV4cCI6MjA5NzU1ODA0NX0.uCMYcQOlEb1uAcTK2p_-gvbZDPpiXA6PWExo6cewS_U';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {

    // =======================================================
    // 🌽 LOGICA DEL CONTADOR DE VISITAS (SOLO ADMIN)
    // =======================================================
    let visits = localStorage.getItem('contador_tlacuachas');
    
    if (visits === null) {
        visits = 1;
    } else {
        visits = parseInt(visits) + 1;
    }
    localStorage.setItem('contador_tlacuachas', visits);


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
    // 💬 LOGICA DE LA SECCIÓN DE RESEÑAS (CON SUPABASE)
    // =======================================================
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    // Función para descargar las reseñas desde la nube
    async function cargarResenas() {
        if (!reviewsList) return;

        const { data: resenas, error } = await supabase
            .from('resenas')
            .select('*');

        if (error) {
            console.error('Error al cargar reseñas:', error);
            return;
        }

        // Limpiamos la lista y usamos tu mismo diseño de tarjeta para pintarlas
        reviewsList.innerHTML = '';
        
        // El .reverse() es para que las más nuevas salgan hasta arriba
        resenas.reverse().forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';
            
            // Transformamos el número a estrellitas (ej. 5 = ⭐⭐⭐⭐⭐)
            const stars = '⭐'.repeat(parseInt(review.calificacion) || 5); 
            
            card.innerHTML = `
                <div class="review-card-header">
                    <span class="review-author">${review.nombre}</span>
                    <span class="review-stars">${stars}</span>
                </div>
                <p>"${review.opinion}"</p>
            `;
            reviewsList.appendChild(card);
        });
    }

    // Cuando el cliente le da al botón de enviar reseña
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Tomamos los IDs exactos de tu HTML
            const nameInput = document.getElementById('review-name');
            const ratingInput = document.getElementById('review-rating');
            const textInput = document.getElementById('review-text');

            // Lo mandamos a las columnas correctas en Supabase
            const { error } = await supabase
                .from('resenas')
                .insert([{ 
                    nombre: nameInput.value, 
                    calificacion: ratingInput.value, 
                    opinion: textInput.value 
                }]);

            if (error) {
                alert('¡Ups! Hubo un problema al enviar tu reseña.');
                console.error(error);
            } else {
                alert('¡Gracias por tu reseña! A mi mamá y a mi tía les dará mucho gusto.');
                reviewForm.reset();
                cargarResenas(); // Recargamos para que se vea su reseña al instante
            }
        });
    }

    // Arrancamos cargando las reseñas de la base de datos al abrir la página
    cargarResenas();
});
