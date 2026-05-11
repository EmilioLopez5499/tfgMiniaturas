"use strict";
const API_URL = 'http://localhost:3000';
function normalizar(texto) {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}
function calcularPresupuesto(descripcion) {
    const texto = normalizar(descripcion);
    const desglose = [];
    // Detectar cantidad
    let cantidad = 1;
    const matchCantidad = texto.match(/(\d+)\s*(figura|figuras|miniatura|miniaturas|modelo|modelos|marine|marines|guerrero|guerreros|unidad|unidades)/);
    if (matchCantidad) {
        cantidad = parseInt(matchCantidad[1]);
    }
    // Detectar nivel de pintado
    let precioPintado = 8;
    let nivelPintado = 'Básico';
    if (/competicion|display|coleccion/.test(texto)) {
        precioPintado = 40;
        nivelPintado = 'Competición / Display';
    }
    else if (/nmm|osl|zenithal|iluminacion/.test(texto)) {
        precioPintado = 25;
        nivelPintado = 'Avanzado (NMM/OSL/Zenithal)';
    }
    else if (/avanzado|intermedio|sombreado|lavado/.test(texto)) {
        precioPintado = 15;
        nivelPintado = 'Avanzado';
    }
    else if (/basico|tabletop|simple/.test(texto)) {
        precioPintado = 8;
        nivelPintado = 'Básico / Tabletop';
    }
    desglose.push({
        concepto: `Pintado ${nivelPintado} x${cantidad} figura${cantidad > 1 ? 's' : ''}`,
        precio: precioPintado * cantidad
    });
    // Detectar extras
    if (/peana|basing|base/.test(texto)) {
        desglose.push({ concepto: 'Peana / Basing', precio: 5 });
    }
    if (/conversion|sculpt|modelado/.test(texto)) {
        desglose.push({ concepto: 'Conversión / Sculpt', precio: 15 });
    }
    if (/escudo|banner|estandarte/.test(texto)) {
        desglose.push({ concepto: 'Escudo / Banner / Estandarte', precio: 5 });
    }
    if (/weathering|envejecido|oxidado/.test(texto)) {
        desglose.push({ concepto: 'Weathering / Envejecido', precio: 8 });
    }
    if (/personaje|heroe|unico/.test(texto)) {
        desglose.push({ concepto: 'Personaje / Héroe único', precio: 10 });
    }
    const total = desglose.reduce((acc, item) => acc + item.precio, 0);
    return { desglose, total, cantidad, nivelPintado };
}
function mostrarPresupuesto(presupuesto) {
    const seccion = document.getElementById('seccion-presupuesto');
    const desglose = document.getElementById('presupuesto-desglose');
    const total = document.getElementById('presupuesto-total-precio');
    if (!seccion || !desglose || !total)
        return;
    desglose.innerHTML = '';
    presupuesto.desglose.forEach(item => {
        const linea = document.createElement('div');
        linea.classList.add('desglose-linea');
        linea.innerHTML = `<span>${item.concepto}</span><span>${item.precio}€</span>`;
        desglose.appendChild(linea);
    });
    total.textContent = `${presupuesto.total}€`;
    seccion.style.display = 'block';
    seccion.scrollIntoView({ behavior: 'smooth' });
}
async function confirmarPedido(presupuesto) {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    const mensaje = document.getElementById('pedido-mensaje');
    const figura = document.getElementById('pedido-figura').value;
    const descripcion = document.getElementById('pedido-descripcion').value;
    if (!token || !usuarioGuardado || !mensaje)
        return;
    try {
        const respuesta = await fetch(`${API_URL}/api/pedidos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                figura,
                descripcion,
                nivelPintado: presupuesto.nivelPintado,
                cantidad: presupuesto.cantidad,
                precioTotal: presupuesto.total,
                notas: descripcion
            })
        });
        if (respuesta.ok) {
            mensaje.textContent = '¡Pedido creado correctamente! Puedes verlo en tu perfil.';
            mensaje.className = 'admin-mensaje ok';
            setTimeout(() => {
                window.location.href = 'perfil.html';
            }, 2000);
        }
        else {
            mensaje.textContent = 'Error al crear el pedido.';
            mensaje.className = 'admin-mensaje error';
        }
    }
    catch (error) {
        if (mensaje) {
            mensaje.textContent = 'Error al conectar con el servidor.';
            mensaje.className = 'admin-mensaje error';
        }
    }
}
function verificarAcceso() {
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
        window.location.href = 'login.html';
    }
}
function iniciarCerrarSesion() {
    const btn = document.getElementById('btn-cerrar-sesion');
    if (!btn)
        return;
    btn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'index.html';
    });
}
document.addEventListener('DOMContentLoaded', () => {
    verificarAcceso();
    iniciarCerrarSesion();
    let presupuestoActual = null;
    const btnCalcular = document.getElementById('btn-calcular');
    if (btnCalcular) {
        btnCalcular.addEventListener('click', () => {
            const descripcion = document.getElementById('pedido-descripcion').value;
            if (!descripcion.trim()) {
                alert('Por favor describe el trabajo antes de calcular el presupuesto.');
                return;
            }
            presupuestoActual = calcularPresupuesto(descripcion);
            mostrarPresupuesto(presupuestoActual);
        });
    }
    const btnConfirmar = document.getElementById('btn-confirmar');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', () => {
            if (presupuestoActual)
                confirmarPedido(presupuestoActual);
        });
    }
    const btnCancelar = document.getElementById('btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            const seccion = document.getElementById('seccion-presupuesto');
            if (seccion)
                seccion.style.display = 'none';
            presupuestoActual = null;
        });
    }
});
//# sourceMappingURL=pedido.js.map