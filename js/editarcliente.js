(function () {
    let DB;
    let idCliente;

    const nombreInput = document.querySelector('#nombre');
    const telefonoInput = document.querySelector('#telefono');
    const emailInput = document.querySelector('#email');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');


    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        const parameterURL = new URLSearchParams(window.location.search);
        formulario.addEventListener('submit', acturlizarCliente);

         idCliente = parameterURL.get('id');
        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 500);

        }
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crmclientes', 1);
        abrirConexion.onerror = function () {
            console.log('error');
        }

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }

    function obtenerCliente(idCliente) {

        const transaction = DB.transaction(['crmclientes'], 'readwrite');
        const objectStore = transaction.objectStore('crmclientes');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;
            if (cursor) {

                if (cursor.value.id === Number(idCliente)) {
                    llenarFormulario(cursor.value);
                }

                cursor.continue();
            }
        }
    }

    function llenarFormulario(cliente) {

        const { nombre, telefono, email, empresa } = cliente;

        nombreInput.value = nombre;
        telefonoInput.value = telefono;
        emailInput.value = email;
        empresaInput.value = empresa;
    }


    function acturlizarCliente(e) {
        e.preventDefault();


        if( nombreInput.value ==='' || emailInput.value ==='' || empresaInput.value ==='' || telefonoInput.value ==='' ){
            impimirAlerta('Todos los campos son obligatorios', 'error');
        return;
        }

        const clienteActualizado = {
            nombre: nombreInput.value,
            telefono:telefonoInput.value,
            email: emailInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crmclientes'], 'readwrite');
        const objectStore = transaction.objectStore('crmclientes');

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){

            impimirAlerta('Cliente actualizado');

            setTimeout(()=>{
                window.location.href='index.html'
               },2000)            
        }

        transaction.onerror= function(){
            impimirAlerta('No se actualizo el cliente', 'error');
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
            }, 2000)
        }
    }


    

})();