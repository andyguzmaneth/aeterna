import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aeterna - Creaciones para la Gloria de Dios",
  description: "Empresas, sitios web, aplicaciones y creaciones de una pareja católica que busca glorificar a Dios con su trabajo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
