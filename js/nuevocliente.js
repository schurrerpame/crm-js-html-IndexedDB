(function () {
    let DB;

    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', validarCliente);

    })


    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crmclientes', 1);
        abrirConexion.onerror = function () {
            console.log('error')
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }


    function validarCliente(e) {
        e.preventDefault();
        console.log('creando...');

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;
        if (nombre == '' || email == '' || telefono == '' || empresa == '') {
            impimirAlerta('Campos obligatorios', 'error');
            return;
        }

        //crear objeto cliente

        const cliente = {
            nombre,
            telefono,
            email,
            empresa
        }

        cliente.id = Date.now();
        crearNuevoCliente(cliente);
    }


    function crearNuevoCliente(cliente) {

        const transaction = DB.transaction(['crmclientes'], 'readwrite');
        const objectStore = transaction.objectStore('crmclientes');
        objectStore.add(cliente);

        transaction.onerror = function () {
            impimirAlerta('Error');
        }

        transaction.oncomplete = function () {
            impimirAlerta('Cliente agregado correctamente');
           setTimeout(()=>{
            window.location.href='index.html'
           },2000)
        }
    }

    function impimirAlerta(msg, tipo) {
        const classAlerta = document.querySelector('.alerta');
        if (!classAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('alert', 'alerta');
            alerta.textContent = msg;
            formulario.appendChild(alerta)
            if (tipo == 'error') {
                alerta.classList.add('error');
            }
            setTimeout(() => {
                alerta.remove();
            }, 3000)
        }
    }



})();