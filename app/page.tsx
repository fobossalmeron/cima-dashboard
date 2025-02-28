import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cima Dashboards</h1>
      <p>
        Esta es una página provisional de home.
      </p>
      <h2 className="text-xl font-bold">EDT Drinks</h2>
      <p>
        El dashboard de EDT se encuentra en
        <Link href="/edt-drinks" className="text-blue-500 hover:text-blue-700">
        {" "}/edt-drinks
        </Link>
      </p>
      <p>
        Y la ruta para ver las embajadoras es
        <Link
          href="/edt-drinks/ambassadors"
          className="text-blue-500 hover:text-blue-700"
        >
          {" "}/edt-drinks/ambassadors
        </Link>, si entran a su dashboard no encontrarán pública la página de embajadoras
      </p>
      <h2 className="text-xl font-bold">Otros clientes</h2>
      <p>
        Cuando se cree otro dashboard se podrá ver en una ruta similar, como esta {" "}
        <Link href="/cliente2" className="text-blue-500 hover:text-blue-700">
          /cliente2
        </Link>
      </p>
    </div>
  );
}
