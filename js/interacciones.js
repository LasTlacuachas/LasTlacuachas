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

        reviewsList.innerHTML = '';
        
        resenas.reverse().forEach(review => {
            const card = document.createElement('div');
            card.className = 'review-card';
            
            // OJO: Asegúrate de que en Supabase la columna se llame "calificacion" (sin acento)
            const stars = '⭐'.repeat(parseInt(review.calificacion) || 5); 
            
            card.innerHTML = `
                <div class="review-card-header">
                    <span class="review-author">${review.nombre}</span>
                    <span class="review-stars">${stars}</span>
                </div>
                                <p>"${review.comentario}"</p> 
            `;
            reviewsList.appendChild(card);
        });
    }

    // Cuando el cliente le da al botón de enviar reseña
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById('review-name');
            const ratingInput = document.getElementById('review-rating');
            const textInput = document.getElementById('review-text');

            // AQUÍ ESTABA EL OTRO ERROR: Cambiamos 'opinion' por 'comentario'
            const { error } = await supabase
                .from('resenas')
                .insert([{ 
                    nombre: nameInput.value, 
                    calificacion: ratingInput.value, 
                    comentario: textInput.value 
                }]);

            if (error) {
                alert('¡Ups! Hubo un problema al enviar tu reseña.');
                console.error(error);
            } else {
                alert('¡Gracias por tu reseña! A nuestro equipo le da mucho gusto.');
                reviewForm.reset();
                cargarResenas();
            }
        });
    }

    // Arrancamos cargando las reseñas de la base de datos al abrir la página
    cargarResenas();
});
