import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <main className="bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-5 flex items-center">
          <div className="w-1/2 pr-12">
            <h1 className="text-5xl font-bold mb-6 dark:text-white">
              Transforma tu <br/>
              Hidratación con <span className="text-blue-600 dark:text-blue-400">OZMMO</span>
            </h1>
            <p className="text-xl mb-8 dark:text-gray-300">Agua pura sin complicaciones</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600">
              Conoce Más
            </button>
          </div>
          <div className="w-1/2">
            <Image 
              src="/hero-family.png" 
              alt="Familia disfrutando agua purificada" 
              width={600} 
              height={400}
              className="rounded-lg [mask-image:linear-gradient(black_80%,transparent)] dark:[mask-image:linear-gradient(white_80%,transparent)]"
            />
          </div>
        </section>

        {/* Beneficios Section */}
        <section className="bg-background py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-blue-600 dark:text-blue-400 text-lg mb-2">Beneficios</h2>
            <div className="grid grid-cols-3 gap-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Pureza Inigualable</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sistema de purificación por ósmosis inversa que elimina impurezas, 
                  bacterias y microorganismos, proporcionando agua con sabor fresco y puro.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Máxima Comodidad</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Olvídate de cargar garrafones. Disfruta de agua purificada 
                  directamente desde tu llave, disponible en todo momento.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-bold mb-4 dark:text-white">Compromiso Ambiental</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reducimos el uso de plásticos y optimizamos los procesos 
                  de purificación para un futuro más sostenible.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparativa Section */}
        <section className="py-5 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-12 dark:text-white">
              ¿Por qué elegir OZMMO?
            </h2>
            <div className="grid grid-cols-2 gap-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-8">
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl">
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">Sistema OZMMO</h3>
                <ul className="space-y-4 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Sin garrafones
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Acceso inmediato al agua
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Menor impacto ambiental
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Ahorro a largo plazo
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-700 p-6 rounded-xl opacity-75">
                <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-6">Sistema Tradicional</h3>
                <ul className="space-y-4 text-gray-600 dark:text-gray-400">
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">×</span>
                    Uso constante de garrafones
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">×</span>
                    Generación de residuos
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">×</span>
                    Gasto recurrente
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-500">×</span>
                    Necesidad de almacenamiento
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 dark:bg-blue-700 text-white py-16 border border-border rounded-xl my-4">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Transforma tu manera de consumir agua
            </h2>
            <p className="text-xl mb-8">
              Únete a la revolución del agua purificada
            </p>
            <button className="bg-white text-blue-600 dark:bg-gray-800 dark:text-blue-400 px-8 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              Contrata Ahora
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 border border-border rounded-xl">
        <div className="container mx-auto px-4 grid grid-cols-3 gap-8">
          <div className="flex items-center gap-4">
            <div>
              <h4 className="font-bold mb-2">Contáctanos</h4>
              <p className="dark:text-gray-300">info@ozmmo.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <h4 className="font-bold mb-2">Llámanos</h4>
              <p className="dark:text-gray-300">33 3800 8571</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <h4 className="font-bold mb-2">Visítanos</h4>
              <p className="dark:text-gray-300">Zapopan, Jalisco</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
