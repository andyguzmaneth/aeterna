import Link from "next/link";
import Image from "next/image";

interface Project {
  name: string;
  description: string;
  href: string;
  image: string;
}

const projects: Project[] = [
  {
    name: "Terazan",
    description: "Bienes raíces",
    href: "#",
    image: "/terazan.jpg",
  },
  {
    name: "Luz de Luz",
    description: "Estudio de diseño y arte católico",
    href: "#",
    image: "/luz-de-luz.jpg",
  },
  {
    name: "Cyclica",
    description: "App para planificación familiar natural",
    href: "#",
    image: "/cyclica.jpg",
  },
  {
    name: "Himnos",
    description: "Explorar belleza de los himnos",
    href: "#",
    image: "/himnos.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-light mb-4 text-gray-900">
            Aeterna
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Proyectos de la familia de Andrés y Mari
          </p>
        </header>

        {/* Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.name}
              href={project.href}
              className="group block"
            >
              <div className="h-full bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden">
                {/* Image */}
                <div className="relative w-full h-64 bg-gray-100">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-2xl font-light mb-2 text-gray-900">
                    {project.name}
                  </h2>
                  <p className="text-gray-600">
                    {project.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
