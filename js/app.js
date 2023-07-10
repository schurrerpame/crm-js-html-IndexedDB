// IIFE: Expresión de función ejecutada inmediatamente
//https://developer.mozilla.org/es/docs/Glossary/IIFE
//IIFE Las variables se quedan de forma local

(function () {
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();

        if (window.indexedDB.open('crmclientes', 1)) {
            obtenerClientes();
        }
        listadoClientes.addEventListener('click', eliminarCliente);
    });

    function crearDB() {
        const crearDB = window.indexedDB.open('crmclientes', 1);

        crearDB.onerror = function () {
            console.log('Error');
        };

        crearDB.onsuccess = function () {
            //SI la base se crea correctamente, se asigna a la variable DB
            DB = crearDB.result;
        };

        crearDB.onupgradeneeded = function (e) {
            const db = e.target.result;

            const objectStore = db.createObjectStore('crmclientes', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('base creada...')
        }

    }

    function obtenerClientes() {
        console.log('Si existe');

        const abrirConexion = window.indexedDB.open('crmclientes', 1);
        abrirConexion.onerror = function () {
            console.log('Error')
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crmclientes').objectStore('crmclientes');

            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result;

                if (cursor) {

                    const { nombre, empresa, telefono, email, id } = cursor.value;
                    listadoClientes.innerHTML += ` <tr>
                   <td>  ${nombre}                     
                   </td>
                   <td>    ${email} </td>
                   <td>
                       ${telefono}
                   </td>
                   <td>    
                      ${empresa}
                   </td>
                   <td>
                       <a href="editar-cliente.html?id=${id}" class="btn btn-modificar">Editar</a>
                       <a href="#" data-cliente="${id}" class="btn btn-eliminar  eliminar">Eliminar</a>
                   </td>
               </tr>
           `;
                    cursor.continue();
                } else {
                    console.log('no hay mas registros')
                }
            }
        }



    }

    function eliminarCliente(e) {

        if (e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);
            swal({
                title: "¿Estás seguro de eliminar al cliente?",
                text: "Una vez eliminado, no podrá recuperar este registro!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                buttons: ["Cancelar", "Eliminar"],
            })
                .then((willDelete) => {
                    if (willDelete) {
                        swal("Registro eliminado", {
                            icon: "success",
                        });

                        const transaction = DB.transaction(['crmclientes'], 'readwrite');
                        const objectStore = transaction.objectStore('crmclientes');
                        objectStore.delete(idEliminar);
                        transaction.oncomplete = function () {
                            console.log('eliminado')
                            e.target.parentElement.parentElement.remove();

                        };

                        transaction.onerror = function () {
                            console.log('error');
                        }

                    } else {
                        swal("¡El cliente no ha sido eliminado!");
                    }
                });

        }
    }

})();