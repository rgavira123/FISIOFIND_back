'use client';


export default function GestionarTerminos() {

  return (
    <>
      <h1>Página de administración de términos</h1>
      <a href="/gestion-admin/terminos/create"><button>Crear</button></a>
      <div>
        <div>
            <h3>Termino 1</h3>
            <p>Fecha de creación: 01-01-01</p>
            <p>Última de actualización: 01-01-01</p>
            <a href="/gestion-admin/terminos/view/"><button>Ver</button></a>
            <a href="/gestion-admin/terminos/edit/"><button>Editar</button></a>
        </div>
      </div>
    </>
  );
}
