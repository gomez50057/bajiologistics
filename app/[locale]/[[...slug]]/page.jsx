import { notFound } from "next/navigation";
import SiteChrome from "../../../components/site/SiteChrome";
import { locales } from "../../../content/site-content";

const pageDefinitions = {
  es: { "": "home", nosotros: "about", servicios: "services", cobertura: "coverage", clientes: "customers", cotizar: "quote", proveedores: "carriers", contacto: "contact", "preguntas-frecuentes": "faq" },
  en: { "": "home", about: "about", services: "services", coverage: "coverage", customers: "customers", "request-a-quote": "quote", carriers: "carriers", contact: "contact", faq: "faq" },
};

function getPage(locale, segments) {
  if (!locales.includes(locale)) return null;
  if (!segments.length) return "home";
  const root = segments[0];
  const isCarriers = locale === "es" ? root === "proveedores" : root === "carriers";
  const register = locale === "es" ? segments[1] === "registro" : segments[1] === "register";
  if (isCarriers && register) return "register";
  if (segments.length === 1 && pageDefinitions[locale][root]) return pageDefinitions[locale][root];
  return null;
}

export function generateStaticParams() {
  const paths = [];
  Object.entries(pageDefinitions).forEach(([locale, pages]) => Object.keys(pages).forEach((path) => paths.push({ locale, slug: path ? path.split("/") : [] })));
  paths.push({ locale: "es", slug: ["proveedores", "registro"] }, { locale: "en", slug: ["carriers", "register"] });
  return paths;
}

export async function generateMetadata({ params }) {
  const { locale, slug = [] } = await params;
  const page = getPage(locale, slug);
  if (!page) return {};
  const isEnglish = locale === "en";
  const titleMap = isEnglish ? { home: "Freight Transportation & Logistics Solutions in Mexico", about: "About Bajío Logistics", services: "Logistics Services", coverage: "Nationwide Coverage", customers: "Customers & Relationships", quote: "Request a Quote", carriers: "Carrier Network", register: "Carrier Registration", contact: "Contact Bajío Logistics", faq: "Frequently Asked Questions" } : { home: "Soluciones de Transporte y Logística en México", about: "Nosotros | Bajío Logistics", services: "Servicios logísticos", coverage: "Cobertura nacional", customers: "Clientes y relaciones", quote: "Solicitar cotización", carriers: "Red de proveedores", register: "Registro de proveedor", contact: "Contacto | Bajío Logistics", faq: "Preguntas frecuentes" };
  const title = `${titleMap[page]} | Bajío Logistics`;
  const description = isEnglish ? "Transportation, logistics planning and operations coordination with nationwide coverage in Mexico." : "Transporte, planeación logística y coordinación de operaciones con cobertura nacional en México.";
  const currentPath = `/${locale}${slug.length ? `/${slug.join("/")}` : ""}`;
  const alternatePath = localizedEquivalentForMetadata(locale, slug);
  const languages = locale === "es" ? { es: currentPath, en: alternatePath } : { en: currentPath, es: alternatePath };
  return { title, description, alternates: { canonical: currentPath, languages }, openGraph: { title, description, siteName: "Bajío Logistics", type: "website" } };
}

function localizedEquivalentForMetadata(locale, segments) {
  const mappings = { nosotros: "about", about: "nosotros", servicios: "services", services: "servicios", cobertura: "coverage", coverage: "cobertura", clientes: "customers", customers: "clientes", cotizar: "request-a-quote", "request-a-quote": "cotizar", proveedores: "carriers", carriers: "proveedores", contacto: "contact", contact: "contacto", "preguntas-frecuentes": "faq", faq: "preguntas-frecuentes", registro: "register", register: "registro" };
  if (!segments.length) return "/en";
  const next = segments.map((segment) => mappings[segment] || segment);
  return `/${locale === "es" ? "en" : "es"}/${next.join("/")}`;
}

export default async function LocalePage({ params }) {
  const { locale, slug = [] } = await params;
  const page = getPage(locale, slug);
  if (!page) notFound();
  return <SiteChrome locale={locale} page={page} segments={slug} />;
}
