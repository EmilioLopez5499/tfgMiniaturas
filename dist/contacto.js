const SERVICE_ID = 'service_ipdedck';
const TEMPLATE_ID = 'template_gpq7qb4';
const PUBLIC_KEY = 'eQOB0qYUtSrnSHQPn';
const API_URL = 'http://localhost:3000';
export function iniciarContacto() {
    emailjs.init(PUBLIC_KEY);
    const form = document.getElementById('form-contacto');
    if (!form)
        return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;
        try {
            await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                nombre,
                email,
                mensaje
            });
            await fetch(`${API_URL}/api/contacto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, mensaje })
            });
            alert(`Gracias, ${nombre}. Tu mensaje ha sido recibido. Te contactaremos pronto.`);
            form.reset();
        }
        catch (error) {
            alert('Ha ocurrido un error al enviar el mensaje. Inténtalo de nuevo.');
            console.error(error);
        }
    });
}
//# sourceMappingURL=contacto.js.map