function impimirAlerta(msg, tipo) {
        const classAlerta = document.querySelector('.alerta');
        if (!classAlerta) {
            const alerta = document.createElement('DIV');
            alerta.classList.add('py-3', 'text-center', 'rounded', 'mt-2', 'alerta');
            alerta.textContent = msg;
            formulario.appendChild(alerta)
            if (tipo == 'error') {
                alerta.classList.add('bg-red-400');
            } else {
                alerta.classList.add('bg-green-400');
            }

            setTimeout(() => {
                alerta.remove();
            }, 3000)
        }
    }

    