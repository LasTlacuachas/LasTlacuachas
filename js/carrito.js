document.addEventListener('DOMContentLoaded', () => {
    // REEMPLAZA AQUÍ: Pon los 10 dígitos del teléfono celular de Las Tlacuachas
    const TELEFONO_NEGOCIO = "https://wa.me/522281210057"; 

    let cart = [];

    // Captura de elementos de la interfaz
    const cartWidget = document.getElementById('cart-widget');
    const cartBadge = document.getElementById('cart-badge');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    const btnToggleCart = document.getElementById('btn-toggle-cart');
    const btnCloseCart = document.getElementById('btn-close-cart');
    const btnSendWhatsapp = document.getElementById('btn-send-whatsapp');

    // Escuchar clics en todos los botones de "Agregar al comal"
    document.querySelectorAll('.btn-add-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));

            addItemToCart(name, price);
        });
    });

    // Función para añadir producto o incrementar cantidad
    function addItemToCart(name, price) {
        const existingItem = cart.find(item => item.name === name);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCartUI();
    }

    // Actualizar la interfaz del carrito (Contadores, totales y listas)
    function updateCartUI() {
        // Calcular totales
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // Mostrar u ocultar el widget flotante según si hay productos
        if (totalItems > 0) {
            cartWidget.classList.remove('hidden');
            cartBadge.textContent = totalItems;
        } else {
            cartWidget.classList.add('hidden');
            cartModal.classList.add('hidden');
        }

        // Llenar la lista dentro de la ventana modal
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-text">El comal está vacío... ¡Añade unos antojitos!</p>';
        } else {
            cart.forEach((item, index) => {
                const row = document.createElement('div');
                row.className = 'cart-item-row';
                row.innerHTML = `
                    <div class="cart-item-info">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-meta">${item.quantity} x $${item.price.toFixed(2)}</span>
                    </div>
                    <button class="btn-remove-item" data-index="${index}">&times; Quitar</button>
                `;
                cartItemsList.appendChild(row);
            });

            // Asignar evento para borrar ítems de la lista
            document.querySelectorAll('.btn-remove-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const index = parseInt(btn.getAttribute('data-index'));
                    cart[index].quantity -= 1;
                    if (cart[index].quantity === 0) {
                        cart.splice(index, 1);
                    }
                    updateCartUI();
                });
            });
        }

        cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
    }

    // Eventos para abrir y cerrar la ventana modal
    btnToggleCart.addEventListener('click', () => cartModal.classList.remove('hidden'));
    btnCloseCart.addEventListener('click', () => cartModal.classList.add('hidden'));

    // =======================================================
    // 💬 ENVÍO FORMATEADO HACIA WHATSAPP
    // =======================================================
    btnSendWhatsapp.addEventListener('click', () => {
        if (cart.length === 0) return;

        let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Construimos el mensaje de forma visual e idéntica a una comanda real
        let mensaje = `🔥 *¡Hola Antojitos Las Tlacuachas!* 🔥\n`;
        mensaje += `Me gustaría hacer el siguiente pedido desde la página web:\n\n`;
        mensaje += `--------------------------------------\n`;

        cart.forEach(item => {
            let subtotal = item.price * item.quantity;
            mensaje += `🔸 *${item.quantity}x* ${item.name} — _$${subtotal.toFixed(2)}_\n`;
        });

        mensaje += `--------------------------------------\n`;
        mensaje += `💰 *Total estimado:* $${total.toFixed(2)}\n\n`;
        mensaje += `📌 _Por favor, confírmenme el tiempo de espera y el costo de envío si aplica._`;

        // Codificación segura para convertir los saltos de línea y emojis en URL
        const mensajeUrl = encodeURIComponent(mensaje);
        // Usamos api.whatsapp.com que es mucho más seguro para computadoras y celulares
        const urlWhatsApp = `https://api.whatsapp.com/send?phone=${TELEFONO_NEGOCIO}&text=${mensajeUrl}`;

        // Redirige al cliente abriendo la conversación oficial de WhatsApp
        window.open(urlWhatsApp, '_blank');
    });
});
