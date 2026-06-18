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
    href: "https://www.facebook.com/profile.php?id=61559578655513",
    image: "/terazan.png",
  },
  {
    name: "Luz de Luz",
    description: "Estudio de diseño y arte católico",
    href: "https://www.instagram.com/luzdeluz.studio/",
    image: "/luzdeluz.png",
  },
  {
    name: "Cyclica",
    description: "App para planificación familiar natural",
    href: "https://apps.apple.com/us/app/cyclica/id6752114124",
    image: "/cyclica.png",
  },
  {
    name: "Himnos",
    description: "Explorar belleza de los himnos",
    href: "https://himnos.aeterna.network/",
    image: "/himnos.png",
  },
  {
    name: "Relics of Legend",
    description: "Reliquias católicas famosas: historia, leyenda y dónde encontrarlas",
    href: "https://relics-of-legend.vercel.app/",
    image: "/relics.png",
  },
];

export default function Home() {
  // Create array with projects and empty placeholders
  const gridItems = [
    ...projects,
    ...Array(1).fill(null), // 1 empty placeholder → clean 2×3 grid
  ];

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <div className="container mx-auto px-4 pt-12 max-w-5xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-light mb-3 text-gray-900">
            Aeterna
          </h1>
          <p className="text-base text-gray-600 max-w-xl mx-auto">
            Proyectos de una familia católica que busca glorificar a Dios con su trabajo.
          </p>
        </header>
      </div>

      {/* Grid of Projects - Centered vertically */}
      <div className="flex-1 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gridItems.map((project, index) => {
            if (!project) {
              // Empty placeholder
              return (
                <div key={`placeholder-${index}`} className="h-full bg-transparent">
                  {/* Empty space */}
                </div>
              );
            }

            return (
              <Link
                key={project.name}
                href={project.href}
                className="group block"
              >
                <div className="h-full bg-white border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden">
                  {/* Image */}
                  <div className="relative w-full h-48 bg-gray-100">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h2 className="text-xl font-light mb-2 text-gray-900">
                      {project.name}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {project.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
          </div>
        </div>
      </div>
    </main>
  );
}
