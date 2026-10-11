// Lista de productos de ejemplo
const productos = [
  { id: 1, nombre: "Audífonos", categoria: "Audio", precio: 25, icono: "🎧" },
  { id: 2, nombre: "Parlante Bluetooth", categoria: "Audio", precio: 30, icono: "🔊" },
  { id: 3, nombre: "Mouse inalámbrico", categoria: "Accesorios", precio: 15, icono: "🖱️" },
  { id: 4, nombre: "Teclado", categoria: "Accesorios", precio: 28, icono: "⌨️" },
  { id: 5, nombre: "Memoria USB", categoria: "Computación", precio: 10, icono: "💾" },
  { id: 6, nombre: "Cámara web", categoria: "Computación", precio: 22, icono: "📷" }
];

const contenedorProductos = document.getElementById("productos");
const buscador = document.getElementById("buscador");
const contador = document.getElementById("contador");
const seccionCarrito = document.getElementById("seccion-carrito");
const listaCarrito = document.getElementById("lista-carrito");
const carritoVacio = document.getElementById("carrito-vacio");
const total = document.getElementById("total");
const mensaje = document.getElementById("mensaje");

let categoriaSeleccionada = "Todos";
let carrito = [];

// Mostrar productos en la página
function mostrarProductos() {
  const texto = buscador.value.toLowerCase();

  const encontrados = productos.filter(producto => {
    const coincideTexto = producto.nombre.toLowerCase().includes(texto);
    const coincideCategoria = categoriaSeleccionada === "Todos" ||
      producto.categoria === categoriaSeleccionada;
    return coincideTexto && coincideCategoria;
  });

  contenedorProductos.innerHTML = "";

  encontrados.forEach(producto => {
    contenedorProductos.innerHTML += `
      <article class="tarjeta">
        <div class="icono">${producto.icono}</div>
        <p class="mt-3 text-sm text-cyan-700">${producto.categoria}</p>
        <h3 class="my-1 text-lg font-bold">${producto.nombre}</h3>
        <p class="mb-3">$${producto.precio.toFixed(2)}</p>
        <button class="agregar w-full rounded-lg bg-cyan-500 px-3 py-2 font-bold hover:bg-cyan-400"
          data-id="${producto.id}">Agregar al carrito</button>
      </article>
    `;
  });

  if (encontrados.length === 0) {
    contenedorProductos.innerHTML = '<p>No se encontraron productos.</p>';
  }
}

// Agregar producto. Si ya existe, aumenta su cantidad.
function agregarProducto(id) {
  const producto = productos.find(item => item.id === id);
  const repetido = carrito.find(item => item.id === id);

  if (repetido) {
    repetido.cantidad++;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }

  mostrarCarrito();
  mensaje.textContent = producto.nombre + " agregado al carrito.";
  setTimeout(() => mensaje.textContent = "", 2000);
}

// Mostrar carrito y calcular el total
function mostrarCarrito() {
  listaCarrito.innerHTML = "";
  let suma = 0;
  let cantidadTotal = 0;

  carrito.forEach(item => {
    suma += item.precio * item.cantidad;
    cantidadTotal += item.cantidad;

    listaCarrito.innerHTML += `
      <li class="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
        <div>
          <p class="font-bold">${item.icono} ${item.nombre}</p>
          <p class="text-sm text-gray-600">$${item.precio.toFixed(2)} cada uno</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="cambiar rounded border px-3 py-1 hover:bg-gray-100"
            data-id="${item.id}" data-cambio="-1" aria-label="Disminuir cantidad">−</button>
          <span class="min-w-5 text-center">${item.cantidad}</span>
          <button class="cambiar rounded border px-3 py-1 hover:bg-gray-100"
            data-id="${item.id}" data-cambio="1" aria-label="Aumentar cantidad">+</button>
          <button class="quitar ml-1 text-sm text-rose-600 underline"
            data-id="${item.id}">Quitar</button>
        </div>
        <p class="w-full text-right font-bold">$${(item.precio * item.cantidad).toFixed(2)}</p>
      </li>
    `;
  });

  contador.textContent = cantidadTotal;
  total.textContent = "$" + suma.toFixed(2);
  carritoVacio.classList.toggle("hidden", carrito.length > 0);
}

// Buscar productos
buscador.addEventListener("input", mostrarProductos);

// Filtrar por categoría
document.querySelectorAll(".categoria").forEach(boton => {
  boton.addEventListener("click", () => {
    categoriaSeleccionada = boton.dataset.categoria;
    mostrarProductos();
  });
});

// Botón para agregar productos
contenedorProductos.addEventListener("click", evento => {
  const boton = evento.target.closest(".agregar");
  if (boton) agregarProducto(Number(boton.dataset.id));
});

// Abrir carrito y desplazarse hasta él
document.getElementById("ver-carrito").addEventListener("click", () => {
  seccionCarrito.classList.remove("hidden");
  seccionCarrito.scrollIntoView({ behavior: "smooth", block: "start" });
});

// Cerrar carrito
document.getElementById("cerrar-carrito").addEventListener("click", () => {
  seccionCarrito.classList.add("hidden");
});

// Cambiar cantidades o quitar productos
listaCarrito.addEventListener("click", evento => {
  const botonCantidad = evento.target.closest(".cambiar");
  const botonQuitar = evento.target.closest(".quitar");

  if (botonCantidad) {
    const id = Number(botonCantidad.dataset.id);
    const cambio = Number(botonCantidad.dataset.cambio);
    const item = carrito.find(producto => producto.id === id);

    if (item) {
      item.cantidad += cambio;
      if (item.cantidad <= 0) {
        carrito = carrito.filter(producto => producto.id !== id);
      }
    }
    mostrarCarrito();
  }

  if (botonQuitar) {
    const id = Number(botonQuitar.dataset.id);
    carrito = carrito.filter(producto => producto.id !== id);
    mostrarCarrito();
  }
});

// Vaciar carrito
document.getElementById("vaciar-carrito").addEventListener("click", () => {
  carrito = [];
  mostrarCarrito();
  mensaje.textContent = "El carrito está vacío.";
  setTimeout(() => mensaje.textContent = "", 2000);
});

// Simular finalización de compra
document.getElementById("finalizar-compra").addEventListener("click", () => {
  if (carrito.length === 0) {
    mensaje.textContent = "Primero agrega un producto al carrito.";
  } else {
    mensaje.textContent = "Compra de demostración. No se realizó ningún pago.";
  }
  setTimeout(() => mensaje.textContent = "", 3000);
});

// Cargar productos al abrir la página
mostrarProductos();
mostrarCarrito();
