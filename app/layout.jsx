export const metadata = {
  metadataBase: new URL("https://bajio-logistics.stable-hawk-5749.chatgpt.site"),
  title: "Bajío Logistics | Tu carga en movimiento",
  description: "Soluciones logísticas, transporte y coordinación de operaciones con cobertura nacional.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return <html lang="es"><body>{children}</body></html>;
}
