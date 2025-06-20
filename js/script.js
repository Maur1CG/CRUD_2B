//URL de la API - Endpoint
const API_URL = "https://retoolapi.dev/BuWOdF/Expo";

//Funcion para llamara a la API y traer el JSON
async function ObtenerPersonas() {
    //Obtener la respuesta del servidor 
    const res = await fetch(API_URL); //Obtener datos de la API

    //Convertir la respuesta del servidor a formato JSON
    const data = await res.json();

    CrearTabla(data); //Enviamos el JSON a la funcion "CrearTabla"
}

//Funcion que creara las filas de las tablas en base a los reguistros de la API

function CrearTabla(datos){//"Datos" respresenta al JSON que viene de la api
    //se llama "tbody" dentro de la tabla con id "tabla"
    const tabla = document.querySelector("#tabla tbody");

    //Para inyectar codigo HTML usamos "innerHTML"
    tabla.innerHTML = ""; //Vaciamos el contenido de la tabla
    
    datos.forEach(persona => {
        tabla.innerHTML += `
        <tr>
            <td>${persona.id}</td>
            <td>${persona.nombre}</td>
            <td>${persona.apellido}</td>
            <td>${persona.edad}</td>
            <td>${persona.correo}</td>
        <td> 
            <button onclick = "AbrirModalEditar(${persona.id}, '${persona.nombre}', '${persona.apellido}', '${persona.correo}', '${persona.edad}')">Editar</button>
            <button onClick = "EliminarRegistro(${persona.id})">Eliminar</button>
        </td>
        </tr>
        `
    });
}

ObtenerPersonas();




//Proceso para agregar un nuevo registro
const modal = document.getElementById("modalAgregar"); //Cuadro del dialogo
const btnAgregar = document.getElementById("btnAbrirModal"); //+ para abrir
const btnCerrar = document.getElementById("btnCerrarModal"); //X para cerrar

btnAgregar.addEventListener("click", ()=>{
    modal.showModal();
});

btnCerrar.addEventListener("click", ()=>{
    modal.close(); //Cerrar Modal
})

//Agregar nuevo integrante desde el formulario
document.getElementById("frmAgregarIntegrante").addEventListener("submit", async e => {
    e.preventDefault(); //"e" representa el eventp submit - Evita que el formulario se envie

    //Capturamos los valores del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    const edad = document.getElementById("edad").value.trim();
    const correo = document.getElementById("email").value.trim();

    //Validacion basica
    if(!nombre || !apellido || !edad || !correo){
        alert("Complete todos los campos");
        return; //Evita que el codigo siga ejecutandose
    }

    //Llamar ala API para enviar el usuario
    const respuesta = await fetch(API_URL, {
        method: "POST" , 
        headers : {'Content-Type':'application/json'},
        body: JSON.stringify({nombre, apellido, edad, correo})
    });

    if(respuesta.ok){
        alert("El registro fue agregado correctamente");

        //Limpiar el formulario
        document.getElementById("frmAgregarIntegrante").reset();

        //Cerrar el formulario
        modal.close();

        //Recargar la tabla

        ObtenerPersonas();
    }
    else{
        alert("Hubo un error al agregar");
    }

});//Fin del formulario


//Para eliminar registros
async function EliminarRegistro(id){//Se pide id para borrar
    if(confirm("¿Esta seguro de que desea eliminar el registro")){
        await fetch(`${API_URL}/${id}`, {method: 'DELETE'});
        ObtenerPersonas(); //Para obtener la vista actualizada (Refrescar)

    }
}

//Proceso para editar registros
const modalEditar = document.getElementById("modalEditar"); //Para modal
const btnCerrarEditar = document.getElementById("btnCerrarEditar"); //X para cerrar

//EvesnListener para cerrar el modal de Editar

btnCerrarEditar.addEventListener("click", ()=>{
    modalEditar.close();
});

function AbrirModalEditar(id, nombre, apellido, correo, edad){
    document.getElementById("nombreEditar").value = nombre;
    document.getElementById("apellidoEditar").value = apellido;
    document.getElementById("emailEditar").value = correo;
    document.getElementById("edadEditar").value = edad;
    document.getElementById("Editar").value = id;

    modalEditar.showModal(); //El modal se abre cuando ya tienen los valores ingresados
    
}

document.getElementById("frmEditarIntegrante").addEventListener("submit", async e =>{
    e.preventDefault(); //Evitamos que el formulario se envie

    const id = document.getElementById("Editar").value;
    const nombre = document.getElementById("nombreEditar").value.trim();
    const apellido = document.getElementById("apellidoEditar").value.trim();
    const edad = document.getElementById("edadEditar").value.trim();
    const correo = document.getElementById("emailEditar").value.trim();

    //Validar que los campos esten bien
    if(!nombre || !apellido || !edad  || !correo || !id){
        alert("Complete todos los campos");
        return;
    }

    const respuesta = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({edad, correo, nombre, apellido})
    });

    if(respuesta.ok){
        alert("Registro actualizado correctamente ");
        modalEditar.close(); //Cerramos el modal
        ObtenerPersonas(); //Recargamos la lsita
    }

    else{
        alert("Error al actualizar")
    }

});

