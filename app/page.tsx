import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cima Dashboards</h1>
      <p>
        Esta es una página provisional de home, que cuando hagamos el despliegue
        será{" "}
        <Link href="/login" className="text-blue-500 hover:text-blue-700">
          este login
        </Link>{" "}
        y nos llevará a la..
      </p>
      <h2 className="text-xl font-bold">Vista de administrador</h2>
      <p>
        Esta sería la vista de{" "}
        <Link href="/admin" className="text-blue-500 hover:text-blue-700">
          administrador
        </Link>{" "}
        donde podrán agregar nuevos clientes
      </p>
      <h2 className="text-xl font-bold">EDT Drinks</h2>
      <p>
        El dashboard de EDT se encuentra en
        <Link href="/edt-drinks" className="text-blue-500 hover:text-blue-700">
          {" "}
          /edt-drinks
        </Link>
      </p>
      <p>
        Y la ruta para ver las embajadoras es
        <Link
          href="/edt-drinks/ambassadors"
          className="text-blue-500 hover:text-blue-700"
        >
          {" "}
          /edt-drinks/ambassadors
        </Link>
        , si entran a su dashboard no encontrarán pública la página de
        embajadoras
      </p>
      <h2 className="text-xl font-bold">Otros clientes</h2>
      <p>
        Cuando se cree otro dashboard se podrá ver en una ruta similar, pusimos
        a{" "}
        <Link href="/san-marcos" className="text-blue-500 hover:text-blue-700">
          San Marcos
        </Link>{" "}
        de ejemplo
      </p>
    </div>
  );
}
