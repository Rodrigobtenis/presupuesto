
 let presupuestos = [];
let presupuestoActual = {
  cliente: "",
  metodoPago: "",
  productos: [],
  totalEfectivo: 0,
  totalTransferencia: 0,
  totalPresupuesto: 0,
};

function cargarPresupuestosDesdeLocalStorage() {
  const presupuestosGuardados = localStorage.getItem("presupuestos");
  if (presupuestosGuardados) {
      presupuestoActual = JSON.parse(presupuestosGuardados);
  }
}


function agregarProducto() {
  const cliente = document.getElementById("cliente").value.trim();
  const producto = document.getElementById("producto").value.trim();
  const precio = parseFloat(document.getElementById("precio").value);
  const cantidad = parseInt(document.getElementById("cantidad").value);
  const metodoPago = document.getElementById("metodoPago").value;

  if (cliente === "" || producto === "" || isNaN(precio) || isNaN(cantidad)) {
    alert("Por favor complete todos los campos correctamente.");
    return;
  }

  let recargo = 0;
  if (metodoPago === "transferencia") {
    recargo = 0.1;
  } else if (metodoPago === "tarjeta" || metodoPago === "cuotas") {
    recargo = 0.25;
  }
  
  
  const totalUnitario = precio * cantidad;
  const totalConRecargo = totalUnitario + totalUnitario * recargo;

  const productoAgregado = {
    cliente,
    producto,
    precio,
    cantidad,
    metodoPago,
    totalUnitario,
    totalConRecargo,
  };

  presupuestoActual.productos.push(productoAgregado);
  actualizarPresupuesto();
  limpiarCampos();
  localStorage.setItem("presupuestos" , JSON.stringify(presupuestoActual));

  Swal.fire('Agregaste un producto nuevo!');
  setTimeout(function() {
    Swal.close(); 
  }, 750);
}


function actualizarPresupuesto() {
  const listaProductos = document.getElementById("listaProductos");
  listaProductos.innerHTML = "";

  let totalEfectivo = 0;
  let totalTransferencia = 0;
  let totalPresupuesto = 0;

  presupuestoActual.productos.forEach((producto, index) => {
    totalPresupuesto += producto.totalConRecargo;

    listaProductos.innerHTML += `
      <tr>
        <td class="cliente-celda">${producto.cliente}</td>
        <td>${producto.producto}</td>
        <td>$${formatoMiles(producto.precio.toFixed(2))}</td>
        <td>${producto.cantidad}</td>
        <td>$${formatoMiles(producto.totalConRecargo.toFixed(2))}</td>
        <td>
          <button class="editar" onclick="editarProducto(${index})">Editar</button>
          <button class="eliminar" onclick="eliminarProducto(${index})">Eliminar</button>
        </td>
      </tr>
    `;

    if (producto.metodoPago === "efectivo") {
      totalEfectivo += producto.totalConRecargo;
    } else {
      totalTransferencia += producto.totalConRecargo;
    }
  });

  presupuestoActual.totalEfectivo = totalEfectivo;
  presupuestoActual.totalTransferencia = totalTransferencia;
  presupuestoActual.totalPresupuesto = totalPresupuesto;

  const totalEfectivoElement = document.getElementById("totalEfectivo");
  totalEfectivoElement.textContent = `$${formatoMiles(totalEfectivo.toFixed(2))}`;

  const totalTransferenciaElement = document.getElementById("totalTransferencia");
  totalTransferenciaElement.textContent = `$${formatoMiles(totalTransferencia.toFixed(2))}`;
}

function limpiarCampos() {
  document.getElementById("producto").value = "";
  document.getElementById("precio").value = "";
  document.getElementById("cantidad").value = "";
  document.getElementById("metodoPago").value = "efectivo";
}

function editarProducto(index) {
  const productoEditado = presupuestoActual.productos[index];
  document.getElementById("cliente").value = productoEditado.cliente;
  document.getElementById("producto").value = productoEditado.producto;
  document.getElementById("precio").value = productoEditado.precio;
  document.getElementById("cantidad").value = productoEditado.cantidad;
  document.getElementById("metodoPago").value = productoEditado.metodoPago;

  presupuestoActual.productos.splice(index, 1);
  actualizarPresupuesto();
}

function eliminarProducto(index) {
  presupuestoActual.productos.splice(index, 1);
  actualizarPresupuesto();
  guardarPresupuestosEnLocalStorage();

  Swal.fire('Haz eliminado un producto');
  setTimeout(function() {
    Swal.close(); 
  }, 750);
}

function nuevoPresupuesto() {
  // Mostrar el mensaje antes de recargar la página
  Swal.fire('Hora de hacer un nuevo presupuesto!').then(() => {
    // Recargar la página para reiniciar todo después de que el usuario confirme el mensaje
    location.reload();
  });
}

function formatoMiles(numero) {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}




actualizarPresupuesto(); 
 

function guardarPresupuestosEnLocalStorage() {
  localStorage.setItem("presupuestos", JSON.stringify(presupuestos));
}






