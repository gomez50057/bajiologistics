const routes = ["", "nosotros", "servicios", "cobertura", "clientes", "cotizar", "proveedores", "contacto", "preguntas-frecuentes"];
const english = { nosotros: "about", servicios: "services", cobertura: "coverage", clientes: "customers", cotizar: "request-a-quote", proveedores: "carriers", contacto: "contact", "preguntas-frecuentes": "faq" };

export default function sitemap() {
  const base = "https://bajio-logistics.stable-hawk-5749.chatgpt.site";
  return routes.flatMap((route) => [{ url: `${base}/es${route ? `/${route}` : ""}`, alternates: { languages: { es: `${base}/es${route ? `/${route}` : ""}`, en: `${base}/en${route ? `/${english[route] || route}` : ""}` } } }, { url: `${base}/en${route ? `/${english[route] || route}` : ""}` }]);
}
