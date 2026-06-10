// Base de datos del menú ampliada
const BASE_DATOS_MENU = {
  1: { nombre: "Edamames al Vapor", precio: 15.00 },
  2: { nombre: "Gyozas de Cerdo x5", precio: 18.00 },
  3: { nombre: "Ebi Furai x6", precio: 24.00 },
  4: { nombre: "Acevichado Maki x10", precio: 28.00 },
  5: { nombre: "Furai Maki x10", precio: 26.00 },
  6: { nombre: "California Maki x10", precio: 25.00 },
  7: { nombre: "Lomo Maki x10", precio: 30.00 },
  8: { nombre: "Avocado Maki x10", precio: 27.00 },
  9: { nombre: "Inka Maki x10", precio: 26.00 },
  10: { nombre: "Tarí Maki x10", precio: 28.00 },
  11: { nombre: "Yakimeshi Especial", precio: 22.00 },
  12: { nombre: "Yakisoba de Pollo", precio: 26.00 },
  13: { nombre: "Chicken Katsu Curry", precio: 32.00 },
  14: { nombre: "Limonada Tradicional (1L)", precio: 12.00 },
  15: { nombre: "Gaseosa Personal", precio: 6.00 },
  16: { nombre: "Chicha Morada (1L)", precio: 14.00 },
  17: { nombre: "Jugo Combinado Maracuyá", precio: 15.00 },
  18: { nombre: "Té Verde Japonés Frío", precio: 8.00 }
};

const correlativoBoleta = Math.floor(200000 + Math.random() * 700000);

document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("formulario-carta");
  const inputMesa = document.getElementById("id_mesa");

  // Actualizar mesa en tiempo real
  inputMesa.addEventListener("input", () => {
    const mesa = inputMesa.value || 1;
    document.getElementById("mensaje-mesa").innerText = `📍 Mesa ${mesa} lista para ordenar.`;
    document.getElementById("boleta-mesa-num").innerText = mesa;
  });

  // GENERAR BOLETA
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const listaContenedor = document.getElementById("boleta-items-lista");
    listaContenedor.innerHTML = "";

    let acumuladoTotal = 0;
    let productosAgregados = 0;

    // Recorrer los 18 productos actuales
    for (let i = 1; i <= 18; i++) {
      const chk = document.getElementById(`chk-${i}`);

      if (chk && chk.checked) {
        const cantidad = parseInt(document.getElementById(`cant-${i}`).value) || 1;
        const producto = BASE_DATOS_MENU[i];
        const subtotal = producto.precio * cantidad;

        acumuladoTotal += subtotal;
        productosAgregados++;

        const fila = document.createElement("div");
        fila.className = "boleta-fila boleta-negrita";
        fila.innerHTML = `
          <div class="col-cant">${cantidad}x</div>
          <div class="col-desc">${producto.nombre}</div>
          <div class="col-subtotal">S/. ${subtotal.toFixed(2)}</div>
        `;
        listaContenedor.appendChild(fila);
      }
    }

    // Validación
    if (productosAgregados === 0) {
      alert("❌ Debes seleccionar al menos un producto.");
      return;
    }

    // Obtener método de pago seleccionado
    const metodoPagoSeleccionado = document.querySelector('input[name="metodo_pago"]:checked').value;
    document.getElementById("boleta-pago-metodo").innerText = metodoPagoSeleccionado;

    // Notas de cocina
    const notas = document.getElementById("notas-cocina").value.trim();
    const contenedorNotas = document.getElementById("boleta-nota-impresa");

    if (notas !== "") {
      contenedorNotas.innerHTML = `
        <div class="boleta-separador">-----------------------------------</div>
        <p><strong>NOTAS:</strong></p>
        <p style="font-style:italic">"${notas}"</p>
      `;
      contenedorNotas.style.display = "block";
    } else {
      contenedorNotas.style.display = "none";
    }

    // CÁLCULOS CONTABLES REALES (Los precios ya incluyen el IGV)
    const subtotalNeto = acumuladoTotal / 1.18; // Operación Gravada
    const igv = acumuladoTotal - subtotalNeto;   // Impuesto del 18%

    // Volcar datos al ticket digital
    document.getElementById("boleta-numero").innerText = correlativoBoleta;
    document.getElementById("boleta-mesa-num").innerText = inputMesa.value;
    document.getElementById("boleta-fecha").innerText = new Date().toLocaleString("es-PE");
    document.getElementById("boleta-subtotal").innerText = subtotalNeto.toFixed(2);
    document.getElementById("boleta-igv").innerText = igv.toFixed(2);
    document.getElementById("boleta-total").innerText = acumuladoTotal.toFixed(2);

    // Desbloquear vista de la boleta
    document.getElementById("boleta-bloqueado").style.display = "none";
    document.getElementById("contenedor-boleta").style.display = "block";
    document.getElementById("mensaje-exito-final").style.display = "none";

    // Scroll suave hasta el ticket
    document.getElementById("modulo-boleta").scrollIntoView({
      behavior: "smooth"
    });
  });

  // BOTÓN BORRAR
  document.getElementById("btn-borrar-todo").addEventListener("click", () => {
    formulario.reset();
    document.getElementById("contenedor-boleta").style.display = "none";
    document.getElementById("boleta-bloqueado").style.display = "block";
    document.getElementById("mensaje-exito-final").style.display = "none";
  });

  // BOTÓN ENVIAR A COCINA
  document.getElementById("btn-enviar-cocina").addEventListener("click", () => {
    document.getElementById("mesa-exito-num").innerText = inputMesa.value;
    document.getElementById("mensaje-exito-final").style.display = "block";
  });
});