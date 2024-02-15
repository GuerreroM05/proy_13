// Importando módulos necesarios
const readline = require('readline');
const fs = require('fs');
require('colors');

// Interfaz para lectura de la consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Definición de la clase Producto
class Producto {
  #codigoProducto;
  #nombreProducto;
  #inventarioProducto;
  #precioProducto;

  constructor() {
    // Inicialización de propiedades
    this.#codigoProducto = 0;
    this.#inventarioProducto = 0;
    this.#nombreProducto = '';
    this.#precioProducto = 0;
  }

  // Métodos de acceso a las propiedades
  set setCodigoProducto(value) {
    this.#codigoProducto = value;
  }
  get getCodigoProducto() {
    return this.#codigoProducto;
  }

  set setInventarioProducto(value) {
    this.#inventarioProducto = value;
  }
  get getInventarioProducto() {
    return this.#inventarioProducto;
  }

  set setNombreProducto(value) {
    this.#nombreProducto = value;
  }
  get getNombreProducto() {
    return this.#nombreProducto;
  }

  set setPrecioProducto(value) {
    this.#precioProducto = value;
  }
  get getPrecioProducto() {
    return this.#precioProducto;
  }
}

// Definición de la clase ProductosTienda
class ProductosTienda {
  #listaProducto;

  constructor() {
    this.#listaProducto = [];
  }

  // Métodos de acceso a la lista de productos
  get getListaProductos() {
    return this.#listaProducto;
  }

  // Método para agregar un producto y grabar en archivo
  agregarProducto(producto) {
    this.#listaProducto.push(producto);
    this.grabarArchivoProductos();
  }

  // Método para cargar productos desde el archivo JSON
  cargarArchivosProductos() {
    let datosArchivo = [];

    try {
      const data = fs.readFileSync('datos.json', 'utf8');
      datosArchivo = JSON.parse(data);
    } catch (error) {
      console.error(error);
    }

    let contador = 0;
    if (datosArchivo.length > 0) {
      datosArchivo.forEach(objeto => {
        contador++;

        let producto = new Producto();

        producto.setCodigoProducto = objeto.codigoProducto;
        producto.setNombreProducto = objeto.nombreProducto;
        producto.setInventarioProducto = objeto.inventarioProducto;
        producto.setPrecioProducto = objeto.precioProducto;

        this.#listaProducto.push(producto);
      });
    }

    console.log(`Total de productos cargados`.bgRed, ` ==>`.bgYellow, ` ${contador}`.bgRed);
  }

  // Método para grabar productos en el archivo JSON
  grabarArchivoProductos() {
    const instanciaClaseAObjetos = this.getListaProductos.map(producto => {
      return {
        codigoProducto: producto.getCodigoProducto,
        nombreProducto: producto.getNombreProducto,
        inventarioProducto: producto.getInventarioProducto,
        precioProducto: producto.getPrecioProducto
      };
    });

    const cadenaJson = JSON.stringify(instanciaClaseAObjetos, null, 2);
    const nombreArchivo = 'datos.json';

    fs.writeFileSync(nombreArchivo, cadenaJson, 'UTF-8');
    console.log(`DATOS GUARDADOS EN ${nombreArchivo}`);
  }

  // Método para mostrar la lista de productos en la consola
  mostrarProductos() {
    this.getListaProductos.forEach(producto => {
      console.log(`│ Código: ${producto.getCodigoProducto} │ Nombre: ${producto.getNombreProducto} │ Inventario: ${producto.getInventarioProducto} │ Precio: ${producto.getPrecioProducto} │`);
    });
  }
}

// Creación de una instancia de la clase ProductosTienda
let productosTienda = new ProductosTienda;

// Función para agregar productos desde la consola
function agregarProductoDesdeConsola() {
  rl.question('Ingrese el código del producto: ', (codigo) => {
    rl.question('Ingrese el nombre del producto: ', (nombre) => {
      rl.question('Ingrese el inventario del producto: ', (inventario) => {
        rl.question('Ingrese el precio del producto: ', (precio) => {
          // Creación de un nuevo producto y asignación de valores
          const nuevoProducto = new Producto();
          nuevoProducto.setCodigoProducto = codigo;
          nuevoProducto.setNombreProducto = nombre;
          nuevoProducto.setInventarioProducto = inventario;
          nuevoProducto.setPrecioProducto = precio;

          // Agregar el producto a la lista y grabar en archivo
          productosTienda.agregarProducto(nuevoProducto);

          console.clear();
          console.log('Producto agregado exitosamente.'.bgGreen);

          // Mostrar el menú después de agregar un producto
          mostrarMenu();
        });
      });
    });
  });
}

// Función para mostrar productos desde la consola
function mostrarProductosDesdeConsola() {
  console.log('******************************************************************'.blue);
  console.log(`***********************`.blue,  `INVENTÁRIO`.bgGreen,`  *****************************`.blue);
  console.log('******************************************************************\n'.blue);
  productosTienda.mostrarProductos();
  mostrarMenu();
}

// Función para borrar un producto
function borrarProducto() {
  rl.question('Ingrese el código del producto a borrar: ', (codigo) => {
    const productos = productosTienda.getListaProductos;
    const indiceProductoABorrar = productos.findIndex(producto => producto.getCodigoProducto === codigo);

    if (indiceProductoABorrar !== -1) {
      productos.splice(indiceProductoABorrar, 1);

      // Grabar en archivo después de borrar un producto
      productosTienda.grabarArchivoProductos();

      console.clear();
      console.log('Producto borrado exitosamente.'.bgGreen);
    } else {
      console.clear();
      console.log('No se encontró un producto con ese código.'.bgRed);
    }

    // Mostrar el menú después de borrar un producto
    mostrarMenu();
  });
}

// Función para realizar una copia de respaldo
function copiaRespaldo() {
  console.log('NO UTILIZAR CARACTERES ESPECIALES'.bgRed);
  rl.question('Ingrese el nombre de su nueva copia de respaldo : ', (nombreCopia) => {
    const rutaOriginal = 'datos.json';
    const rutaCopia = `${nombreCopia}.json`;

    if (fs.existsSync(rutaOriginal)) {
      fs.copyFileSync(rutaOriginal, rutaCopia);
      console.log(`Copia de respaldo realizada correctamente: ${rutaCopia}`);
    } else {
      console.error(`Error al hacer la copia de respaldo: Archivo original no encontrado`);
    }

    // Mostrar el menú después de realizar una copia de respaldo
    mostrarMenu();
  });
}

// Función para realizar reparación de datos
function reparacionDatos() {
  console.log('NO UTILIZAR CARACTERES ESPECIALES'.bgRed);
  rl.question('Nombre del archivo a copiar : ', (archivo) => {
    rl.question('Nombre del nuevo o existente archivo : ', (nuevo) => {
      const rutaOriginal = `${archivo}.json`;
      const rutaCopia = `${nuevo}.json`;

      if (fs.existsSync(rutaOriginal)) {
        fs.copyFileSync(rutaOriginal, rutaCopia);
        console.log(`Copia de respaldo realizada correctamente: ${rutaCopia}`);
      } else {
        console.error(`Error al hacer la copia de respaldo: Archivo original no encontrado`);
      }

      // Mostrar el menú después de realizar la reparación de datos
      mostrarMenu();
    });
  });
}

// Definición de la clase Factura
class Factura {
  constructor() {
    this.cliente = {
      nombre: '',
      cedula: '',
      telefono: '',
    };
    this.productos = [];
  }

  // Método para agregar un producto a la factura
  agregarProducto(producto) {
    this.productos.push(producto);
  }

  // Método para asignar datos del cliente
  setCliente(nombre, cedula, telefono) {
    this.cliente.nombre = nombre;
    this.cliente.cedula = cedula;
    this.cliente.telefono = telefono;
  }

  // Método para imprimir la factura en la consola
  imprimirFactura() {
    console.log("**************Factura:*************".bgBlue);
    console.log(`*   Cliente: ${this.cliente.nombre}     *`.bgRed);
    console.log(`*    Cédula: ${this.cliente.cedula}     *`.bgRed);
    console.log(`*   Teléfono: ${this.cliente.telefono}  *`.bgRed);
    let total = 0;

    this.productos.forEach((producto, index) => {
      const subtotal = producto.getPrecioProducto * producto.getInventarioProducto;
      total += subtotal;
      console.log(`${index + 1}. Código: ${producto.getCodigoProducto}, Nombre: ${producto.getNombreProducto}, Cantidad: ${producto.getInventarioProducto}, Precio unitario: ${producto.getPrecioProducto}, Subtotal: ${subtotal}`.bgGreen);
    });
    console.log(`Total: ${total}`.bgYellow);
  }
}

let facturaGlobal = null;

// Función para iniciar el proceso de compra
async function comprarProductos() {
  const factura = new Factura();
  facturaGlobal = factura;

  rl.question("Ingrese el nombre del cliente: ", (nombre) => {
    rl.question("Ingrese la cédula del cliente: ", (cedula) => {
      rl.question("Ingrese el teléfono del cliente: ", async (telefono) => {
        factura.setCliente(nombre, cedula, telefono);

        // Llamada a la función que maneja el proceso de compra
        realizarCompra();
      });
    });
  });
}

// Función para realizar la compra de productos
function realizarCompra() {
  rl.question("Ingrese el código del producto: ", (codigoProducto) => {
    const datosInventario = JSON.parse(fs.readFileSync('datos.json', 'utf8'));
    const productoEnInventario = datosInventario.find(producto => producto.codigoProducto === codigoProducto);

    if (productoEnInventario) {
      rl.question("Ingrese el precio del producto: ", (precioInput) => {
        const precioProducto = parseFloat(precioInput);

        rl.question(`Ingrese la cantidad de ${productoEnInventario.nombreProducto}: `, (cantidadInput) => {
          const cantidadComprada = parseInt(cantidadInput);

          if (cantidadComprada <= productoEnInventario.inventarioProducto) {
            // Actualizar el inventario del producto en el archivo datos.json
            productoEnInventario.inventarioProducto -= cantidadComprada;
            fs.writeFileSync('datos.json', JSON.stringify(datosInventario, null, 2));

            // Crear un nuevo objeto Producto para agregarlo a la factura
            const productoFactura = new Producto();
            productoFactura.setCodigoProducto = codigoProducto;
            productoFactura.setNombreProducto = productoEnInventario.nombreProducto; // Agregar el nombre del producto
            productoFactura.setPrecioProducto = precioProducto;
            productoFactura.setInventarioProducto = cantidadComprada;

            // Agregar el producto a la factura
            facturaGlobal.agregarProducto(productoFactura);

            console.log(`Producto ${productoFactura.getNombreProducto} agregado a la factura.`);

            // Continuar con el proceso de compra o realizar otras operaciones según sea necesario...
          } else {
            console.log(`No hay suficiente inventario disponible para el producto con código ${codigoProducto}.`);
          }

          // Mostrar el menú después del proceso de compra
          mostrarMenu();
        });
      });
    } else {
      console.log(`El producto con código ${codigoProducto} no fue encontrado en el inventario.`);
      // Mostrar el menú después de informar sobre el error
      mostrarMenu();
    }
  });
}

// Función para imprimir la factura en la consola
function imprimirFactura() {
  if (facturaGlobal) {
    facturaGlobal.imprimirFactura();
  } else {
    console.log("No hay una factura para imprimir. Realiza una compra primero.");
  }
  // Mostrar el menú después de imprimir la factura
  mostrarMenu();
}

// Función para mostrar el menú principal
function mostrarMenu() {
  console.log('******************************************************************'.blue);
  console.log(`***********************`.blue,  `TIENDA`.bgGreen,`  *****************************`.blue);
  console.log('******************************************************************\n'.blue);

  rl.question(`1. Apertura tienda\n2. Copia de Respaldo\n3. Reparación Datos\n4. Grabar Nuevos Producto\n5. Borrar Producto\n6. Comprar Productos\n7. Imprimir factura\n0. Cerar APP\n` , (opcion) => {
    switch (opcion) {
      case '1':
        mostrarProductosDesdeConsola();
        break;
      case '2':
        copiaRespaldo();
        break;
      case '3':
        reparacionDatos();
        break;
      case '4':
        agregarProductoDesdeConsola();
        break;
      case '5':
        borrarProducto();
        break;
      case '6':
        comprarProductos();
        break;
      case '7':
        imprimirFactura();
        break;
      case '0':
        rl.close();
        break;
      default:
        console.log('Opción no válida. Por favor, seleccione una opción válida.'.bgRed);
        mostrarMenu();
        break;
    }
  });
}

// Función para limpiar la consola
/*function Limpiar() {
  console.clear();
  console.log(`Total de productos cargados`.bgRed,` ==>`.bgYellow,` ${productosTienda.getListaProductos.length}`.bgRed);
  mostrarMenu();
  
}*/


function main() {
  console.clear();
  productosTienda.cargarArchivosProductos();
  mostrarMenu();
}



// Llamar a la función principal para iniciar el programa
main();