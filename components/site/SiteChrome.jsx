"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  Factory,
  Gauge,
  Handshake,
  Menu,
  Network,
  Phone,
  Radar,
  Route,
  ShieldCheck,
  Target,
  Truck,
  Users,
  X,
} from "lucide-react";
import { content as allContent, site as siteInfo } from "../../content/site-content";
import styles from "./SiteChrome.module.css";

const icons = { truck: Truck, route: Route, radar: Radar, gauge: Gauge, network: Network, compass: Compass, target: Target, factory: Factory, users: Users };

const routeEquivalents = {
  nosotros: "about",
  about: "nosotros",
  servicios: "services",
  services: "servicios",
  cobertura: "coverage",
  coverage: "cobertura",
  clientes: "customers",
  customers: "clientes",
  cotizar: "request-a-quote",
  "request-a-quote": "cotizar",
  proveedores: "carriers",
  carriers: "proveedores",
  contacto: "contact",
  contact: "contacto",
  "preguntas-frecuentes": "faq",
  faq: "preguntas-frecuentes",
  registro: "register",
  register: "registro",
};

const serviceEquivalents = {
  transporte: "freight-transportation",
  "freight-transportation": "transporte",
  "planeacion-logistica": "logistics-planning",
  "logistics-planning": "planeacion-logistica",
  "gestion-seguimiento": "operations-management",
  "operations-management": "gestion-seguimiento",
  "optimizacion-costos": "cost-optimization",
  "cost-optimization": "optimizacion-costos",
  "red-proveedores": "carrier-network",
  "carrier-network": "red-proveedores",
  "consultoria-logistica": "logistics-consulting",
  "logistics-consulting": "consultoria-logistica",
  "soluciones-personalizadas": "tailored-solutions",
  "tailored-solutions": "soluciones-personalizadas",
};

const footerRoutes = {
  es: { Nosotros: "/es/nosotros", Historia: "/es/nosotros", Cobertura: "/es/cobertura", Clientes: "/es/clientes", Transporte: "/es/servicios", Planeación: "/es/servicios", Seguimiento: "/es/servicios", Optimización: "/es/servicios", Consultoría: "/es/servicios", Cotización: "/es/cotizar", Contacto: "/es/contacto", "Trabaja con nosotros": "/es/proveedores", Requisitos: "/es/proveedores", Registro: "/es/proveedores/registro" },
  en: { "About Us": "/en/about", "Our Story": "/en/about", Coverage: "/en/coverage", Customers: "/en/customers", Transportation: "/en/services", Planning: "/en/services", Tracking: "/en/services", Optimization: "/en/services", Consulting: "/en/services", "Request a quote": "/en/request-a-quote", Contact: "/en/contact", "Work with us": "/en/carriers", Requirements: "/en/carriers", Registration: "/en/carriers/register" },
};

function localizedPath(locale, segments) {
  const nextLocale = locale === "es" ? "en" : "es";
  if (!segments.length) return `/${nextLocale}`;
  const nextSegments = segments.map((segment, index) => {
    if (index === 0) return routeEquivalents[segment] || segment;
    return serviceEquivalents[segment] || segment;
  });
  return `/${nextLocale}/${nextSegments.join("/")}`;
}

function Icon({ name, size = 22, strokeWidth = 1.8 }) {
  const Component = icons[name] || Target;
  return <Component aria-hidden="true" size={size} strokeWidth={strokeWidth} />;
}

function Button({ href, children, variant = "primary", className = "", onClick, type = "button" }) {
  const classes = `button button-${variant} ${className}`.trim();
  if (href) return <Link className={classes} href={href}>{children}<ArrowUpRight aria-hidden="true" size={16} /></Link>;
  return <button className={classes} onClick={onClick} type={type}>{children}</button>;
}

function SectionHeading({ kicker, title, body, align = "left" }) {
  return <div className={`section-heading section-heading-${align}`}>
    <p className="eyebrow">{kicker}</p>
    <h2>{title}</h2>
    {body && <p className="section-lead">{body}</p>}
  </div>;
}

function LanguageSwitcher({ locale, otherPath }) {
  const isSpanish = locale === "es";
  return <div className="language-switcher" aria-label={isSpanish ? "Seleccionar idioma" : "Select language"}>
    {isSpanish ? <span className="active" aria-current="page">ES</span> : <Link href={otherPath} aria-label="Cambiar a español">ES</Link>}
    {isSpanish ? <Link href={otherPath} aria-label="Cambiar a inglés">EN</Link> : <span className="active" aria-current="page">EN</span>}
  </div>;
}

function Header({ locale, data, segments, profile, setProfile, profilePanelOpen, setProfilePanelOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const copy = data;
  const otherPath = localizedPath(locale, segments);
  const currentPath = `/${locale}${segments.length ? `/${segments.join("/")}` : ""}`;
  const customerHref = locale === "es" ? "/es/cotizar" : "/en/request-a-quote";
  const carrierHref = locale === "es" ? "/es/proveedores" : "/en/carriers";

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY.current;
        if (currentScrollY <= 0 || scrollDelta < 0) {
          setHeaderVisible(true);
        } else if (scrollDelta > 0) {
          setHeaderVisible(false);
          setMenuOpen(false);
          setProfilePanelOpen(false);
        }
        lastScrollY.current = currentScrollY;
        frame = 0;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [setProfilePanelOpen]);

  function selectProfile(next) {
    setProfile(next);
    setProfilePanelOpen(false);
    setMenuOpen(false);
    if (typeof window !== "undefined") window.localStorage.setItem("bl-user-type", next);
  }

  return <header className={`site-header ${headerVisible ? "is-visible" : "is-hidden"}`}>
    <div className="topbar">
      <Link className="brand" href={`/${locale}`} aria-label="Bajío Logistics, inicio">
        <Image src="/images/logo-text.png" alt="Bajío Logistics" width={168} height={56} priority />
      </Link>
      <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
        {copy.nav.map(([label, href]) => <Link key={href} className={href === currentPath ? "active" : ""} href={href} onClick={() => setMenuOpen(false)} aria-current={href === currentPath ? "page" : undefined}>{label}</Link>)}
        <div className="nav-mobile-actions">
          <LanguageSwitcher locale={locale} otherPath={otherPath} />
          <button className="profile-link" onClick={() => setProfilePanelOpen(!profilePanelOpen)} type="button">{copy.profile[profile]} <ChevronDown size={14} /></button>
          {profilePanelOpen && <div className="mobile-profile-options">{Object.entries(copy.profile).map(([key, label]) => <button key={key} className={profile === key ? "selected" : ""} onClick={() => selectProfile(key)} type="button"><span>{label}</span>{profile === key && <Check size={15} />}</button>)}</div>}
        </div>
      </nav>
      <div className="header-actions">
        <LanguageSwitcher locale={locale} otherPath={otherPath} />
        <div className="profile-switcher">
          <button className="profile-link" onClick={() => setProfilePanelOpen(!profilePanelOpen)} type="button" aria-expanded={profilePanelOpen}>
            <span className="profile-dot" />{copy.profile[profile]}<ChevronDown size={14} />
          </button>
          {profilePanelOpen && <div className="profile-popover" role="menu">
            <p>{locale === "es" ? "Ver el sitio como" : "View the site as"}</p>
            {Object.entries(copy.profile).map(([key, label]) => <button key={key} className={profile === key ? "selected" : ""} onClick={() => selectProfile(key)} type="button"><span>{label}</span>{profile === key && <Check size={15} />}</button>)}
          </div>}
        </div>
        <Button href={profile === "carrier" ? carrierHref : customerHref}>{copy.headerCta[profile === "carrier" ? "carrier" : "customer"]}</Button>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} type="button" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </div>
  </header>;
}

function ProfileSelector({ locale, data, onSelect }) {
  return <div className="profile-overlay" role="dialog" aria-modal="true" aria-labelledby="profile-title">
    <div className="profile-dialog">
      <div className="dialog-mark"><span>BL</span></div>
      <p className="eyebrow">BAJÍO LOGISTICS</p>
      <h1 id="profile-title">{locale === "es" ? "¿Cómo podemos ayudarte?" : "How can we help you?"}</h1>
      <p>{locale === "es" ? "Selecciona tu perfil para mostrarte información relevante." : "Select your profile to see information relevant to you."}</p>
      <div className="profile-options">
        <button onClick={() => onSelect("customer")} type="button"><span className="profile-option-icon"><Truck size={23} /></span><span><strong>{locale === "es" ? "Soy Cliente" : "I'm a Customer"}</strong><small>{locale === "es" ? "Necesito transporte o soluciones logísticas." : "I need transportation or logistics solutions."}</small></span><ArrowRight size={18} /></button>
        <button onClick={() => onSelect("carrier")} type="button"><span className="profile-option-icon"><Handshake size={23} /></span><span><strong>{locale === "es" ? "Soy Proveedor" : "I'm a Carrier"}</strong><small>{locale === "es" ? "Quiero trabajar o prestar servicios a Bajío Logistics." : "I want to work with Bajío Logistics."}</small></span><ArrowRight size={18} /></button>
        <button onClick={() => onSelect("visitor")} type="button"><span className="profile-option-icon"><CircleHelp size={23} /></span><span><strong>{locale === "es" ? "Solo quiero conocer Bajío Logistics" : "I just want to learn about Bajío Logistics"}</strong></span><ArrowRight size={18} /></button>
      </div>
      <p className="dialog-note">{data.footer.placeholder}</p>
    </div>
  </div>;
}

function HeroRoleCard({ href, icon, title, body, featured = false }) {
  const IconComponent = icon;
  return <Link className={`hero-role-card ${featured ? "hero-role-card-featured" : ""}`} href={href}><span className="hero-role-icon"><IconComponent aria-hidden="true" size={31} strokeWidth={1.7} /></span><span className="hero-role-copy"><strong>{title}</strong><small>{body}</small></span><ArrowRight aria-hidden="true" size={22} /></Link>;
}

function Hero({ locale, data, profile }) {
  const hero = data.hero[profile];
  const customerHref = locale === "es" ? "/es/cotizar" : "/en/request-a-quote";
  const carrierHref = locale === "es" ? "/es/proveedores/registro" : "/en/carriers/register";
  const features = locale === "es" ? [
    ["truck", "Transporte", "de carga"],
    ["route", "Almacenamiento", "y distribución"],
    ["gauge", "Soluciones", "en cadena de suministro"],
    ["compass", "Cobertura", "nacional"],
    ["radar", "Tecnología", "y trazabilidad"],
    ["target", "Logística", "sustentable"],
  ] : [
    ["truck", "Freight", "transportation"],
    ["route", "Storage", "and distribution"],
    ["gauge", "Supply chain", "solutions"],
    ["compass", "Nationwide", "coverage"],
    ["radar", "Technology", "and traceability"],
    ["target", "Sustainable", "logistics"],
  ];
  return <section className={`hero hero-${profile}`}>
    <div className="hero-grid">
      <div className="hero-copy">
        <p className="eyebrow">{profile === "customer" && locale === "es" ? <>SOLUCIONES LOGÍSTICAS<br />CON COBERTURA NACIONAL</> : hero.eyebrow}</p>
        <h1>{profile === "customer" && locale === "es" ? <>Más que<br />transporte,<span>soluciones<br />que mueven<br />tu negocio</span></> : <>{hero.title}<span>{hero.accent}</span></>}</h1>
        <p className="hero-body">{profile === "customer" && locale === "es" ? <>Coordinamos transporte, almacenamiento<br />y logística integral para que tu cadena<br />de suministro llegue más lejos.</> : hero.body}</p>
        <div className="hero-role-cards"><HeroRoleCard href={customerHref} icon={Factory} title={locale === "es" ? "Soy cliente" : "I'm a customer"} body={locale === "es" ? "Quiero cotizar o conocer nuestros servicios" : "I want a quote or to learn about services"} featured /><HeroRoleCard href={carrierHref} icon={Users} title={locale === "es" ? "Soy proveedor" : "I'm a carrier"} body={locale === "es" ? "Quiero formar parte de la red" : "I want to join the network"} /></div>
      </div>
      <div className={`${styles.heroMedia} hero-media`}>
        <Image className={styles.heroImage} src="/images/hero-operations.png" alt={locale === "es" ? "Camión de carga en carretera con cobertura nacional" : "Freight truck on the road with nationwide coverage"} fill priority sizes="100vw" />
        <div className="hero-image-shade" />
        <div className="hero-image-label"><span>{locale === "es" ? "DE MÉXICO" : "FROM MEXICO"}</span><strong>{locale === "es" ? "HACIA EL MUNDO" : "TO THE WORLD"}</strong></div>
        <div className="hero-script">{locale === "es" ? <>Logística<br />sin límites</> : <>Logistics<br />without limits</>}<span /></div>
      </div>
    </div>
    <div className="hero-feature-strip">{features.map(([icon, title, subtitle]) => <div className="hero-feature-item" key={title}><Icon name={icon} size={29} /><span>{title}<small>{subtitle}</small></span></div>)}</div>
  </section>;
}

const clientLogoItems = [
  ["tomeiko-country.png", "Tomeiko Country"],
  ["kimberly-clark.svg", "Kimberly-Clark"],
  ["femsa.svg", "FEMSA"],
  ["sabritas-full.png", "Sabritas"],
  ["coppel.svg", "Coppel"],
  ["mabe.svg", "Mabe"],
  ["lg.svg", "LG"],
  ["bhtc.svg", "BHTC"],
  ["auo.svg", "AUO"],
  ["parker.svg", "Parker"],
  ["cemex.svg", "CEMEX"],
];

function ClientLogoSet({ hidden = false }) {
  return <div className="client-logo-set" aria-hidden={hidden}>
    {clientLogoItems.map(([src, alt]) => <div className="client-logo" key={`${src}-${hidden ? "duplicate" : "primary"}`}><Image src={`/images/clients/${src}`} alt={hidden ? "" : alt} width={160} height={46} /></div>)}
  </div>;
}

function ClientLogoCarousel({ locale }) {
  return <section className="client-logos" aria-labelledby="client-logos-title">
    <div className="client-logos-inner">
      <p className="client-logos-label" id="client-logos-title">{locale === "es" ? "Algunos de nuestros clientes" : "Some of our customers"}</p>
      <div className="client-logos-viewport">
        <div className="client-logos-track">
          <ClientLogoSet />
          <ClientLogoSet hidden />
        </div>
      </div>
      <Link className="client-logos-link" href={`/${locale}/${locale === "es" ? "clientes" : "customers"}`}>
        {locale === "es" ? "Ver más clientes" : "See more customers"}
        <ArrowRight aria-hidden="true" size={17} />
      </Link>
    </div>
  </section>;
}

function ServiceHighlightGrid({ locale }) {
  const items = locale === "es" ? [
    ["truck", "Transporte terrestre", "Tu carga en movimiento."],
    ["factory", "Almacenamiento", "Espacio que impulsa tu negocio."],
    ["users", "Atención personalizada", "Un equipo siempre contigo."],
    ["gauge", "Soluciones a la medida", "Logística que se adapta a ti."],
    ["radar", "Trazabilidad", "Visibilidad en todo momento."],
  ] : [
    ["truck", "Ground transportation", "Your cargo in motion."],
    ["factory", "Storage", "Space that moves your business forward."],
    ["users", "Personalized attention", "A team that stays with you."],
    ["gauge", "Tailored solutions", "Logistics adapted to you."],
    ["radar", "Traceability", "Visibility at every moment."],
  ];
  return <div className="service-highlight-grid">
    {items.map(([icon, title, body]) => <article className="service-highlight-card" key={title}><span className="service-highlight-icon"><Icon name={icon} size={25} /></span><div><h3>{title}</h3><p>{body}</p></div></article>)}
  </div>;
}

function HomePage({ locale, data, profile }) {
  const copy = data.home;
  return <>
    <Hero locale={locale} data={data} profile={profile} />
    <ClientLogoCarousel locale={locale} />
    <main>
      <section className="intro-section section container two-col">
        <div><p className="eyebrow">{copy.introKicker}</p><h2>{copy.introTitle}</h2></div>
        <div><p className="section-lead">{copy.introBody}</p><Link className="text-link" href={`/${locale}/${locale === "es" ? "nosotros" : "about"}`}>{copy.introLink}<ArrowUpRight size={17} /></Link></div>
      </section>
      <section className="section capabilities-section">
        <div className="container"><SectionHeading kicker={locale === "es" ? "Coordinación con propósito" : "Purposeful coordination"} title={copy.capabilitiesTitle} body={copy.capabilitiesBody} /></div>
        <div className="container capability-grid">{copy.capabilities.map((item) => <article className="capability-card" key={item.title}><span className="icon-disc"><Icon name={item.icon} /></span><h3>{item.title}</h3><p>{item.body}</p><span className="card-rule" /></article>)}</div>
      </section>
      <section className="section services-preview container">
        <SectionHeading kicker={copy.servicesKicker} title={copy.servicesTitle} body={copy.servicesBody} />
        <div className="service-feature"><div className="service-feature-image"><Image src="/images/servicios.png" alt={locale === "es" ? "Camión de Bajío Logistics en movimiento" : "Bajío Logistics truck in motion"} fill sizes="(max-width: 800px) 100vw, 65vw" /></div><div className="service-feature-content"><h3>{locale === "es" ? "Una red que se coordina contigo" : "A network that coordinates with you"}</h3><p>{locale === "es" ? "Conoce cómo podemos trabajar juntos para mover operaciones con orden y comunicación." : "See how we can work together to move operations with order and communication."}</p><Button href={`/${locale}/${locale === "es" ? "servicios" : "services"}`}>{copy.servicesLink}</Button></div></div>
        <ServiceHighlightGrid locale={locale} />
      </section>
      <section className="section dark-section process-section"><div className="container"><SectionHeading kicker={copy.processKicker} title={copy.processTitle} /><div className="process-grid">{copy.process.map(([number, title, body]) => <article key={number} className="process-step"><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
      <section className="section why-section"><div className="container two-col why-grid"><div><SectionHeading kicker={copy.whyKicker} title={copy.whyTitle} body={copy.whyBody} /><Button href={`/${locale}/${locale === "es" ? "contacto" : "contact"}`} variant="outline">{locale === "es" ? "Conversemos" : "Let's talk"}</Button></div><div className="check-list">{copy.why.map((item) => <div key={item}><span><Check size={16} /></span><p>{item}</p></div>)}<div className="stamp"><ShieldCheck size={30} /><span>{locale === "es" ? "Atención" : "Personal"}<strong>{locale === "es" ? "que sí acompaña" : "attention"}</strong></span></div></div></div></section>
      <section className="section coverage-teaser"><div className="container coverage-teaser-grid"><div><SectionHeading kicker={copy.coverageKicker} title={copy.coverageTitle} body={copy.coverageBody} /><Link className="text-link light-link" href={`/${locale}/${locale === "es" ? "cobertura" : "coverage"}`}>{copy.coverageLink}<ArrowUpRight size={17} /></Link></div><CoverageMap locale={locale} /></div></section>
      <CTASection locale={locale} data={data} />
    </main>
  </>;
}

function CoverageMap({ locale, large = false }) {
  return <div className={`coverage-map ${large ? "coverage-map-large" : ""}`} role="img" aria-label={locale === "es" ? "Representación de cobertura nacional con sede en San Juan del Río" : "Representation of nationwide coverage with headquarters in San Juan del Río"}><div className="map-grid" /><svg viewBox="0 0 560 270" aria-hidden="true"><path className="map-land" d="M94 38 155 18l63 19 50-11 43 32 51-6 43 33 42 6 26 37-25 28-20 45-61 21-53-20-52 12-51-27-45 6-20-34-51-19-23-42Z" /><path className="map-route route-one" d="M233 150C284 108 340 105 423 76" /><path className="map-route route-two" d="M233 150C304 160 357 177 451 185" /><path className="map-route route-three" d="M233 150C200 110 166 92 131 79" /><circle className="map-pin" cx="233" cy="150" r="8" /><circle className="map-pin-halo" cx="233" cy="150" r="17" /></svg><div className="map-label"><span>QRO</span><strong>{locale === "es" ? "Sede" : "HQ"}</strong></div></div>;
}

function CTASection({ locale, data }) {
  const copy = data.home;
  return <section className="cta-section"><div className="cta-lines" /><div className="container cta-content"><p className="eyebrow">{locale === "es" ? "El siguiente paso" : "The next step"}</p><h2>{copy.finalTitle}</h2><p>{copy.finalBody}</p><div className="hero-actions"><Button href={`/${locale}/${locale === "es" ? "cotizar" : "request-a-quote"}`}>{copy.finalPrimary}</Button><Button href={`/${locale}/${locale === "es" ? "contacto" : "contact"}`} variant="ghost-light">{copy.finalSecondary}</Button></div></div></section>;
}

function PageHero({ kicker, title, body, action, actionHref }) {
  return <section className="page-hero"><div className="container page-hero-inner"><div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p className="hero-body">{body}</p>{action && <Button href={actionHref}>{action}</Button>}</div><div className="page-hero-mark"><Image className="page-hero-logo" src="/images/logo_blanco.png" alt="Bajío Logistics" width={180} height={180} /></div></div></section>;
}

function ServicesPage({ locale, data }) {
  const copy = data.services;
  const [openService, setOpenService] = useState(null);

  return <><PageHero kicker={copy.kicker} title={copy.title} body={copy.body} action={locale === "es" ? "Solicitar cotización" : "Request a quote"} actionHref={`/${locale}/${locale === "es" ? "cotizar" : "request-a-quote"}`} /><main><section className="section container"><div className="service-list">{copy.list.map((item, index) => {
    const isOpen = openService === item.slug;
    const detailsId = `service-details-${item.slug}`;
    return <article className={`service-row ${isOpen ? "is-open" : ""}`} key={item.slug}>
      <button className="service-row-trigger" type="button" aria-expanded={isOpen} aria-controls={detailsId} onClick={() => setOpenService(isOpen ? null : item.slug)}>
        <span className="service-row-number">0{index + 1}</span>
        <span className="service-row-icon"><Icon name={item.icon} size={25} /></span>
        <span className="service-row-copy"><span className="service-row-title">{item.title}</span><span className="service-row-short">{item.short}</span></span>
        <ChevronDown className="service-row-toggle" aria-hidden="true" size={22} />
      </button>
      <div className="service-row-details" id={detailsId} hidden={!isOpen}>
        <p className="service-row-details-label">{locale === "es" ? "Cómo lo hacemos" : "How we do it"}</p>
        <p className="service-row-details-copy">{item.body}</p>
      </div>
    </article>;
  })}</div></section><CTASection locale={locale} data={data} /></main></>;
}

function StrategyIcon({ type }) {
  const commonProps = { className: "about-strategy-icon", viewBox: "0 0 72 72", fill: "none", role: "img", "aria-hidden": "true" };
  if (type === "vision") return <svg {...commonProps}><rect x="13" y="43" width="9" height="17" rx="1" fill="currentColor" /><rect x="28" y="34" width="9" height="26" rx="1" fill="currentColor" /><rect x="43" y="23" width="9" height="37" rx="1" fill="currentColor" /><path d="m12 34 17-15 10 7 21-18" stroke="#F36C21" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d="M50 8h10v10" stroke="#F36C21" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /></svg>;
  if (type === "work") return <svg {...commonProps}><path d="m9 29 12-12 13 4 8-5 21 13-11 21-14-8-9 8L9 35Z" stroke="currentColor" strokeWidth="3.4" strokeLinejoin="round" /><path d="m10 29 11 3 9 10c2 2 5 2 7 0l4-4m-5-14 6 11c1 2 4 3 6 1l3-3m-9-9 7 9c1 2 4 2 6 0l2-2m-19-9-7 7c-2 2-2 5 0 7l3 3" stroke="#F36C21" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /><path d="m42 16 9 6" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" /></svg>;
  return <svg {...commonProps}><circle cx="36" cy="36" r="23" stroke="currentColor" strokeWidth="3.4" /><circle cx="36" cy="36" r="12" stroke="currentColor" strokeWidth="3.4" /><circle cx="36" cy="36" r="4" fill="currentColor" /><path d="M36 8v10M36 54v10M8 36h10M54 36h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity=".42" /><path d="m42 30 15-15m0 0H46m11-1v11" stroke="#F36C21" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function AboutPage({ locale, data }) {
  const copy = data.about;
  const iconTypes = ["mission", "vision", "work"];
  return <main>
    <section className="about-strategy-section">
      <section className="about-strategy" aria-labelledby="about-strategy-title">
        <div className="about-strategy-main">
          <div className="about-strategy-heading">
            <p className="eyebrow">{copy.kicker}</p>
            <h1 id="about-strategy-title">{copy.title}</h1>
            <p className="about-strategy-intro">{copy.body}</p>
          </div>
          <div className="about-strategy-photo">
            <Image src="/images/nosotros.png" alt={locale === "es" ? "Trailer de Bajío Logistics frente a un centro logístico" : "Bajío Logistics trailer outside a logistics center"} fill sizes="(max-width: 800px) 100vw, 56vw" priority />
          </div>
          <div className="about-strategy-cta-row">
            <Link className="about-strategy-cta" href={`/${locale}/${locale === "es" ? "contacto" : "contact"}`}>
              {copy.cta}
              <ArrowRight aria-hidden="true" size={24} />
            </Link>
            <span className="about-strategy-tag">{copy.adapted}</span>
          </div>
        </div>
        <div className="about-strategy-cards">
          {copy.sections.map(([title, body], index) => <article className="about-strategy-card" key={title}>
            <span className="about-strategy-number">0{index + 1}</span>
            <span className="about-strategy-icon-wrap"><StrategyIcon type={iconTypes[index]} /></span>
            <div className="about-strategy-card-copy">
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </article>)}
        </div>
      </section>
    </section>
    <section className="section timeline-section">
      <div className="container">
        <SectionHeading kicker={locale === "es" ? "Nuestra historia" : "Our story"} title={copy.timelineTitle} body={copy.timelineBody} />
        <div className="timeline">
          {copy.timeline.map(([number, title, body]) => <article key={number}>
            <span>{number}</span>
            <i />
            <h3>{title}</h3>
            <p>{body}</p>
          </article>)}
        </div>
      </div>
    </section>
    <section className="section container values-section">
      <SectionHeading kicker={locale === "es" ? "Valores" : "Values"} title={copy.valuesTitle} />
      <div className="values-grid">
        {copy.values.map(([title, body]) => <article key={title}>
          <span className="value-icon"><Handshake size={22} /></span>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>)}
      </div>
      <div className="location-bar">
        <span><Factory size={22} /></span>
        <div>
          <p className="eyebrow">{copy.headquarters}</p>
          <strong>{copy.headquartersBody}</strong>
        </div>
        <MapPinMark />
      </div>
    </section>
  </main>;
}

function MapPinMark() { return <svg className="location-lines" viewBox="0 0 190 45" aria-hidden="true"><path d="M4 39C48 10 85 44 129 13c18-13 36-10 57-4" /><circle cx="128" cy="14" r="4" /></svg>; }

function CoveragePage({ locale, data }) {
  const copy = data.coverage;
  return <><PageHero kicker={copy.kicker} title={copy.title} body={copy.body} action={copy.cta} actionHref={`/${locale}/${locale === "es" ? "cotizar" : "request-a-quote"}`} /><main><section className="section container coverage-page-grid"><div className="coverage-copy"><SectionHeading kicker={locale === "es" ? "Una operación más amplia" : "A wider operation"} title={locale === "es" ? "Conectamos puntos con una mirada nacional" : "We connect points with a nationwide view"} body={copy.body} /><div className="coverage-cards">{copy.cards.map(([title, body]) => <div key={title}><span><Check size={15} /></span><p><strong>{title}</strong>{body}</p></div>)}</div></div><CoverageMap locale={locale} large /></section><section className="section orange-band"><div className="container orange-band-inner"><div><p className="eyebrow">{locale === "es" ? "Disponibilidad por ruta" : "Availability by route"}</p><h2>{copy.cta}</h2></div><Button href={`/${locale}/${locale === "es" ? "contacto" : "contact"}`} variant="dark">{locale === "es" ? "Hablar con el equipo" : "Talk to the team"}</Button></div></section></main></>;
}

function CustomersPage({ locale, data }) {
  const copy = data.customers;
  return <><PageHero kicker={copy.kicker} title={copy.title} body={copy.body} action={locale === "es" ? "Hablemos de tu operación" : "Let's talk about your operation"} actionHref={`/${locale}/${locale === "es" ? "contacto" : "contact"}`} /><main><section className="section container logo-section"><SectionHeading kicker={copy.logoTitle} title={locale === "es" ? "Relaciones que todavía están por contarse" : "Relationships still waiting to be told"} body={copy.logoBody} /><div className="empty-logos"><div><Users size={30} /><span>{locale === "es" ? "Clientes" : "Customers"}</span></div><div><Factory size={30} /><span>{locale === "es" ? "Sectores" : "Industries"}</span></div><div><Handshake size={30} /><span>{locale === "es" ? "Alianzas" : "Partnerships"}</span></div></div></section><section className="section light-gray-section"><div className="container two-col"><SectionHeading kicker={copy.sectorsTitle} title={locale === "es" ? "Espacio listo para crecer" : "Space ready to grow"} body={copy.sectorsBody} /><div className="case-card"><p className="eyebrow">{copy.caseTitle}</p><h3>{copy.caseBody}</h3><div className="case-labels">{copy.caseLabels.map((label, i) => <span key={label}><b>0{i + 1}</b>{label}</span>)}</div></div></div></section><CTASection locale={locale} data={data} /></main></>;
}

function CarriersPage({ locale, data }) {
  const copy = data.carriers;
  const registerHref = `/${locale}/${locale === "es" ? "proveedores/registro" : "carriers/register"}`;
  return <><PageHero kicker={copy.kicker} title={copy.title} body={copy.body} action={copy.primary} actionHref={registerHref} /><main><section className="section container"><SectionHeading kicker={copy.benefitTitle} title={locale === "es" ? "Una relación operativa que puede crecer" : "An operating relationship that can grow"} /><div className="benefit-grid">{copy.benefits.map(([title, body], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{body}</p></article>)}</div></section><section className="section dark-section carrier-section"><div className="container carrier-grid"><div><SectionHeading kicker={copy.lookingTitle} title={copy.lookingBody} /><div className="equipment-list">{copy.equipment.map((item) => <span key={item}>{item}</span>)}</div></div><div className="carrier-side-card"><Network size={34} /><p className="eyebrow">{copy.equipmentTitle}</p><h3>{copy.equipmentBody}</h3><Button href={registerHref} variant="light">{copy.primary}</Button></div></div></section><section className="section container"><SectionHeading kicker={copy.processTitle} title={locale === "es" ? "Cinco pasos para iniciar" : "Five steps to get started"} /><div className="process-list">{copy.process.map(([number, title, body]) => <article key={number}><span>{number}</span><div><h3>{title}</h3><p>{body}</p></div></article>)}</div></section><section className="section light-gray-section"><div className="container requirements-row"><div><p className="eyebrow">{copy.requirementsTitle}</p><h2>{copy.requirementsBody}</h2></div><Button href={registerHref}>{copy.primary}</Button></div></section></main></>;
}

const countryCodes = [
  { value: "+52", es: "México (+52)", en: "Mexico (+52)" },
  { value: "+1", es: "Estados Unidos / Canadá (+1)", en: "United States / Canada (+1)" },
  { value: "+34", es: "España (+34)", en: "Spain (+34)" },
  { value: "+54", es: "Argentina (+54)", en: "Argentina (+54)" },
  { value: "+55", es: "Brasil (+55)", en: "Brazil (+55)" },
  { value: "+56", es: "Chile (+56)", en: "Chile (+56)" },
  { value: "+57", es: "Colombia (+57)", en: "Colombia (+57)" },
  { value: "+51", es: "Perú (+51)", en: "Peru (+51)" },
];

function formatPhone(form, name) {
  const number = form[name];
  return number ? `${form[`${name}CountryCode`] || "+52"} ${number}` : "";
}

function PhoneField({ label, name, value, countryCode, onChange, locale, required = false }) {
  const updateNumber = (event) => onChange({ target: { name, value: event.target.value.replace(/\D/g, "").slice(0, 10) } });
  return <div className="field phone-field"><span>{label}{required && " *"}</span><div className="phone-input"><select name={`${name}CountryCode`} value={countryCode || "+52"} onChange={onChange} aria-label={`${label} ${locale === "es" ? "lada" : "country code"}`}>{countryCodes.map((country) => <option key={country.value} value={country.value}>{country[locale === "es" ? "es" : "en"]}</option>)}</select><input name={name} type="tel" inputMode="numeric" pattern="[0-9]{10}" minLength={10} maxLength={10} value={value || ""} onChange={updateNumber} placeholder="4141234567" required={required} /></div></div>;
}

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) { return <label className="field"><span>{label}{required && " *"}</span><input name={name} type={type} value={value || ""} onChange={onChange} placeholder={placeholder} required={required} /></label>; }
function TextField({ label, name, value, onChange, required = false, rows = 4 }) { return <label className="field field-full"><span>{label}{required && " *"}</span><textarea name={name} value={value || ""} onChange={onChange} rows={rows} required={required} /></label>; }

function buildQuoteMessage(locale, copy, form) {
  const labels = locale === "es" ? {
    title: "Solicitud de cotización · Bajío Logistics",
    route: "Ruta",
    cargo: "Mercancía",
    equipment: "Unidad requerida",
    schedule: "Fechas y horario",
    contact: "Contacto",
    additional: "Información adicional",
    sentFrom: "Enviado desde el sitio web de Bajío Logistics.",
  } : {
    title: "Quote request · Bajío Logistics",
    route: "Route",
    cargo: "Cargo",
    equipment: "Equipment needed",
    schedule: "Dates and time",
    contact: "Contact",
    additional: "Additional information",
    sentFrom: "Sent from the Bajío Logistics website.",
  };
  const groups = [
    [labels.route, [[copy.fields.origin, form.origin], [copy.fields.destination, form.destination], [copy.fields.postal, form.postal], [copy.fields.stops, form.stops]]],
    [labels.cargo, [[copy.fields.goods, form.goods], [copy.fields.weight, form.weight], [copy.fields.dimensions, form.dimensions], [copy.fields.pallets, form.pallets], [copy.fields.notes, form.notes]]],
    [labels.equipment, [[copy.fields.unit, form.unit]]],
    [labels.schedule, [[copy.fields.pickupDate, form.pickupDate], [copy.fields.pickupTime, form.pickupTime], [copy.fields.deliveryDate, form.deliveryDate]]],
    [labels.contact, [[copy.fields.company, form.company], [copy.fields.name, form.name], [copy.fields.role, form.role], [copy.fields.phone, formatPhone(form, "phone")], [copy.fields.whatsapp, formatPhone(form, "whatsapp")], [copy.fields.email, form.email]]],
    [labels.additional, [[copy.fields.comments, form.comments]]],
  ];
  const lines = [labels.title, ""];
  groups.forEach(([group, entries]) => {
    const present = entries.filter(([, value]) => value);
    if (!present.length) return;
    lines.push(`${group}:`);
    present.forEach(([label, value]) => lines.push(`- ${label}: ${value}`));
    lines.push("");
  });
  lines.push(labels.sentFrom);
  return lines.join("\n");
}

function QuoteForm({ locale, copy }) {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({});
  const [privacy, setPrivacy] = useState(false);
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const stepFields = [[<Fragment key="route"><Field label={copy.fields.origin} name="origin" value={form.origin} onChange={update} required /><Field label={copy.fields.destination} name="destination" value={form.destination} onChange={update} required /><Field label={copy.fields.postal} name="postal" value={form.postal} onChange={update} /><Field label={copy.fields.stops} name="stops" value={form.stops} onChange={update} type="number" /></Fragment>], [<Fragment key="cargo"><Field label={copy.fields.goods} name="goods" value={form.goods} onChange={update} required /><Field label={copy.fields.weight} name="weight" value={form.weight} onChange={update} /><Field label={copy.fields.dimensions} name="dimensions" value={form.dimensions} onChange={update} /><Field label={copy.fields.pallets} name="pallets" value={form.pallets} onChange={update} type="number" /><TextField label={copy.fields.notes} name="notes" value={form.notes} onChange={update} /></Fragment>], [<div className="unit-options" key="equipment">{copy.units.map((unit) => <label className={`unit-option ${form.unit === unit ? "active" : ""}`} key={unit}><input type="radio" name="unit" value={unit} checked={form.unit === unit} onChange={update} /><span>{unit}</span></label>)}</div>], [<Fragment key="date"><Field label={copy.fields.pickupDate} name="pickupDate" value={form.pickupDate} onChange={update} type="date" required /><Field label={copy.fields.pickupTime} name="pickupTime" value={form.pickupTime} onChange={update} type="time" /><Field label={copy.fields.deliveryDate} name="deliveryDate" value={form.deliveryDate} onChange={update} type="date" /></Fragment>], [<Fragment key="contact"><Field label={copy.fields.company} name="company" value={form.company} onChange={update} required /><Field label={copy.fields.name} name="name" value={form.name} onChange={update} required /><Field label={copy.fields.role} name="role" value={form.role} onChange={update} /><PhoneField label={copy.fields.phone} name="phone" value={form.phone} countryCode={form.phoneCountryCode} onChange={update} locale={locale} /><PhoneField label={copy.fields.whatsapp} name="whatsapp" value={form.whatsapp} countryCode={form.whatsappCountryCode} onChange={update} locale={locale} /><Field label={copy.fields.email} name="email" value={form.email} onChange={update} type="email" required /></Fragment>], [<Fragment key="comments"><TextField label={copy.fields.comments} name="comments" value={form.comments} onChange={update} rows={7} /><label className="privacy-check"><input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} /><span>{copy.fields.privacy}</span></label></Fragment>]];
  function next(event) {
    event.preventDefault();
    if (step < copy.steps.length - 1) {
      setStep(step + 1);
      return;
    }
    if (!privacy) return;
    const message = buildQuoteMessage(locale, copy, form);
    const whatsappNumber = siteInfo.whatsapp || "527711318149";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!popup) window.location.assign(whatsappUrl);
    setSubmitted(true);
  }
  const whatsappCopy = locale === "es" ? {
    success: "Cotización lista para WhatsApp.",
    successBody: "Se abrió WhatsApp con la información cargada. Revisa el mensaje y presiona Enviar.",
    submit: "Enviar cotización por WhatsApp",
  } : {
    success: "Quote ready for WhatsApp.",
    successBody: "WhatsApp opened with your information loaded. Review the message and press Send.",
    submit: "Send quote on WhatsApp",
  };
  if (submitted) return <div className="form-success"><span><Check size={25} /></span><h2>{whatsappCopy.success}</h2><p>{whatsappCopy.successBody}</p><button onClick={() => { setSubmitted(false); setStep(0); setForm({}); setPrivacy(false); }} type="button">{copy.fields.startOver}</button></div>;
  return <form className="multi-form" onSubmit={next}><div className="form-progress">{copy.steps.map((label, index) => <div className={index <= step ? "active" : ""} key={label}><span>{index + 1}</span><small>{label}</small></div>)}</div><div className="form-step-title"><p className="eyebrow">{copy.steps[step]}</p><h2>{locale === "es" ? `Paso ${step + 1} de ${copy.steps.length}` : `Step ${step + 1} of ${copy.steps.length}`}</h2></div><div className="fields-grid">{stepFields[step]}</div><div className="form-actions">{step > 0 && <button className="text-button" onClick={() => setStep(step - 1)} type="button">{copy.fields.back}</button>}<button className="button button-primary" disabled={step === copy.steps.length - 1 && !privacy} type="submit">{step === copy.steps.length - 1 ? whatsappCopy.submit : copy.fields.next}<ArrowRight size={17} /></button></div></form>;
}

function QuotePage({ locale, data }) { const copy = data.quote; return <><PageHero kicker={copy.kicker} title={copy.title} body={copy.body} /><main><section className="section quote-section container"><QuoteForm locale={locale} copy={copy} /><aside className="quote-aside"><div className="quote-aside-mark"><Route size={28} /></div><p className="eyebrow">{locale === "es" ? "La información primero" : "Information first"}</p><h2>{locale === "es" ? "Una buena propuesta empieza por entender la ruta" : "A good proposal starts by understanding the route"}</h2><p>{locale === "es" ? "No necesitas tener todas las respuestas. Comparte lo que sabes y lo revisamos contigo." : "You do not need to have every answer. Share what you know and we will review it with you."}</p></aside></section></main></>; }

function buildRegisterMessage(locale, copy, form) {
  const labels = locale === "es" ? {
    title: "Registro de proveedor · Bajío Logistics",
    company: "Empresa",
    contact: "Contacto",
    operation: "Operación",
    documentation: "Documentación y experiencia",
    driverInfo: "Información de operadores",
    sentFrom: "Enviado desde el sitio web de Bajío Logistics.",
  } : {
    title: "Carrier registration · Bajío Logistics",
    company: "Company",
    contact: "Contact",
    operation: "Operation",
    documentation: "Documentation and experience",
    driverInfo: "Driver information",
    sentFrom: "Sent from the Bajío Logistics website.",
  };
  const groups = [
    [labels.company, [[copy.fields.company, form.company], [copy.fields.legalName, form.legalName], [copy.fields.taxId, form.taxId]]],
    [labels.contact, [[copy.fields.name, form.name], [copy.fields.email, form.email], [copy.fields.phone, formatPhone(form, "phone")]]],
    [labels.operation, [[copy.fields.coverage, form.coverage], [copy.fields.fleet, form.fleet], [copy.fields.drivers, form.drivers], [labels.driverInfo, form.driversInfo]]],
    [labels.documentation, [[copy.fields.documents, form.documents], [copy.fields.experience, form.experience], [copy.fields.comments, form.comments]]],
  ];
  const lines = [labels.title, ""];
  groups.forEach(([group, entries]) => {
    const present = entries.filter(([, value]) => value);
    if (!present.length) return;
    lines.push(`${group}:`);
    present.forEach(([label, value]) => lines.push(`- ${label}: ${value}`));
    lines.push("");
  });
  lines.push(labels.sentFrom);
  return lines.join("\n");
}

function RegisterForm({ copy, locale }) {
  const [submitted, setSubmitted] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [form, setForm] = useState({});
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  function submit(event) {
    event.preventDefault();
    if (!privacy) return;
    const message = buildRegisterMessage(locale, copy, form);
    const whatsappNumber = siteInfo.whatsapp || "527711318149";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!popup) window.location.assign(whatsappUrl);
    setSubmitted(true);
  }
  const whatsappCopy = locale === "es" ? {
    success: "Registro listo para WhatsApp.",
    successBody: "Se abrió WhatsApp con tu información cargada. Revisa el mensaje y presiona Enviar.",
    submit: "Enviar registro por WhatsApp",
    startOver: "Llenar otro registro",
  } : {
    success: "Registration ready for WhatsApp.",
    successBody: "WhatsApp opened with your information loaded. Review the message and press Send.",
    submit: "Send registration on WhatsApp",
    startOver: "Start another registration",
  };
  if (submitted) return <div className="form-success"><span><Check size={25} /></span><h2>{whatsappCopy.success}</h2><p>{whatsappCopy.successBody}</p><button onClick={() => { setSubmitted(false); setForm({}); setPrivacy(false); }} type="button">{whatsappCopy.startOver}</button></div>;
  return <form className="registration-form" onSubmit={submit}><div className="registration-grid">{copy.sections.map((section, index) => <fieldset key={section} className={index === 8 ? "field-full" : ""}><legend><span>0{index + 1}</span>{section}</legend>{index === 0 && <div className="fields-grid"><Field label={copy.fields.company} name="company" value={form.company} onChange={update} required /><Field label={copy.fields.legalName} name="legalName" value={form.legalName} onChange={update} /></div>}{index === 1 && <div className="fields-grid"><Field label={copy.fields.name} name="name" value={form.name} onChange={update} required /><Field label={copy.fields.email} name="email" value={form.email} onChange={update} type="email" required /><PhoneField label={copy.fields.phone} name="phone" value={form.phone} countryCode={form.phoneCountryCode} onChange={update} locale={locale} /></div>}{index === 2 && <div className="fields-grid"><Field label={copy.fields.taxId} name="taxId" value={form.taxId} onChange={update} /></div>}{index === 3 && <div className="fields-grid"><TextField label={copy.fields.coverage} name="coverage" value={form.coverage} onChange={update} /></div>}{index === 4 && <div className="fields-grid"><TextField label={copy.fields.fleet} name="fleet" value={form.fleet} onChange={update} /><Field label={copy.fields.drivers} name="drivers" value={form.drivers} onChange={update} type="number" /></div>}{index === 5 && <div className="fields-grid"><TextField label={locale === "es" ? "Información de operadores" : "Driver information"} name="driversInfo" value={form.driversInfo} onChange={update} /></div>}{index === 6 && <div className="fields-grid"><TextField label={copy.fields.documents} name="documents" value={form.documents} onChange={update} /></div>}{index === 7 && <div className="fields-grid"><TextField label={copy.fields.experience} name="experience" value={form.experience} onChange={update} /></div>}{index === 8 && <div className="fields-grid"><TextField label={copy.fields.comments} name="comments" value={form.comments} onChange={update} rows={5} /></div>}</fieldset>)}</div><div className="registration-submit"><label className="privacy-check"><input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} /><span>{copy.fields.privacy}</span></label><button className="button button-primary" disabled={!privacy} type="submit">{whatsappCopy.submit}<ArrowRight size={17} /></button></div></form>;
}

function RegisterPage({ locale, data }) { const copy = data.register; return <><PageHero kicker={copy.kicker} title={copy.title} body={copy.body} /><main><section className="section container"><RegisterForm copy={copy} locale={locale} /></section></main></>; }

function buildContactMessage(locale, copy, form) {
  const title = locale === "es" ? "Mensaje de contacto · Bajío Logistics" : "Contact message · Bajío Logistics";
  const reasonLabel = locale === "es" ? "Motivo" : "Reason";
  const sentFrom = locale === "es" ? "Enviado desde el sitio web de Bajío Logistics." : "Sent from the Bajío Logistics website.";
  const entries = [
    [copy.fields.name, form.name],
    [copy.fields.company, form.company],
    [copy.fields.email, form.email],
    [copy.fields.phone, formatPhone(form, "phone")],
    [copy.fields.subject, form.subject],
    [reasonLabel, form.reason],
    [copy.fields.message, form.message],
  ].filter(([, value]) => value);
  return [title, "", ...entries.map(([label, value]) => `${label}: ${value}`), "", sentFrom].join("\n");
}

function ContactForm({ locale, copy }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({});
  const update = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  function submit(event) {
    event.preventDefault();
    const message = buildContactMessage(locale, copy, form);
    const whatsappNumber = siteInfo.whatsapp || "527711318149";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    const popup = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!popup) window.location.assign(whatsappUrl);
    setSubmitted(true);
  }
  const whatsappCopy = locale === "es" ? {
    success: "Mensaje listo para WhatsApp.",
    successBody: "Se abrió WhatsApp con tu información cargada. Revisa el mensaje y presiona Enviar.",
    submit: "Enviar por WhatsApp",
  } : {
    success: "Message ready for WhatsApp.",
    successBody: "WhatsApp opened with your information loaded. Review the message and press Send.",
    submit: "Send on WhatsApp",
  };
  if (submitted) return <div className="form-success"><span><Check size={25} /></span><h2>{whatsappCopy.success}</h2><p>{whatsappCopy.successBody}</p><button onClick={() => { setSubmitted(false); setForm({}); }} type="button">{whatsappCopy.submit}</button></div>;
  return <form className="contact-form" onSubmit={submit}><div className="fields-grid"><Field label={copy.fields.name} name="name" value={form.name} onChange={update} required /><Field label={copy.fields.company} name="company" value={form.company} onChange={update} /><Field label={copy.fields.email} name="email" value={form.email} onChange={update} type="email" required /><PhoneField label={copy.fields.phone} name="phone" value={form.phone} countryCode={form.phoneCountryCode} onChange={update} locale={locale} /><Field label={copy.fields.subject} name="subject" value={form.subject} onChange={update} required /><label className="field"><span>{locale === "es" ? "Motivo" : "Reason"}</span><select name="reason" value={form.reason || ""} onChange={update} required><option value="">—</option>{copy.reasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}</select></label><TextField label={copy.fields.message} name="message" value={form.message} onChange={update} required rows={7} /></div><div className="form-actions"><button className="button button-primary" type="submit">{whatsappCopy.submit}<ArrowRight size={17} /></button></div></form>;
}

function ContactPage({ locale, data }) { const copy = data.contact; return <><PageHero kicker={copy.kicker} title={copy.title} body={copy.body} /><main><section className="section container contact-grid"><ContactForm copy={copy} locale={locale} /><aside className="contact-aside"><div className="contact-icon"><Phone size={24} /></div><p className="eyebrow">{copy.availabilityTitle}</p><h2>{locale === "es" ? "Información oficial, cuando esté lista" : "Official information, when ready"}</h2><p>{copy.availabilityBody}</p><div className="contact-placeholder"><span>+52 · · · · · · · · · ·</span><small>{locale === "es" ? "Teléfono y correo por confirmar" : "Phone and email to be confirmed"}</small></div></aside></section></main></>; }

function FAQGroup({ title, items, prefix, open, setOpen }) { return <div className="faq-group"><h2>{title}</h2>{items.map(([question, answer], index) => { const key = `${prefix}-${index}`; return <div className={`faq-item ${open === key ? "open" : ""}`} key={question}><button onClick={() => setOpen(open === key ? "" : key)} type="button" aria-expanded={open === key}><span>{question}</span><span>{open === key ? "−" : "+"}</span></button>{open === key && <p>{answer}</p>}</div>; })}</div>; }
function FAQPage({ data }) { const copy = data.faq; const [open, setOpen] = useState("customer-0"); return <><PageHero kicker={copy.kicker} title={copy.title} body={data.home.whyBody} /><main><section className="section container faq-grid"><FAQGroup title={copy.customerTitle} items={copy.customer} prefix="customer" open={open} setOpen={setOpen} /><FAQGroup title={copy.carrierTitle} items={copy.carrier} prefix="carrier" open={open} setOpen={setOpen} /></section></main></>; }

function Footer({ locale, data }) {
  const copy = data.footer;
  const routes = footerRoutes[locale];
  return <footer className="site-footer"><div className="container footer-main"><div className="footer-brand"><Link className="brand footer-logo" href={`/${locale}`}><Image src="/images/logo_blanco.png" alt="Bajío Logistics" width={150} height={123} /></Link><p>{locale === "es" ? "Tu carga en movimiento." : "Your cargo in motion."}</p><div className="footer-location"><span>HQ</span>{siteInfo.location}</div></div><div className="footer-columns">{copy.columns.map(([title, links]) => <div key={title}><p className="footer-title">{title}</p>{links.map((link) => <Link key={link} href={routes[link] || `/${locale}`}>{link}</Link>)}</div>)}</div><div className="footer-contact"><p className="footer-title">{copy.contact}</p><p>{siteInfo.location}</p><p className="footer-placeholder">{copy.placeholder}</p></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Bajío Logistics</span><div>{copy.legal.map((item) => <Link key={item} href={`/${locale}`}>{item}</Link>)}</div><span className="footer-slogan">{locale === "es" ? "Tu carga en movimiento" : "Your cargo in motion"}</span></div></footer>;
}

export default function SiteChrome({ locale, page, segments = [] }) {
  const data = useMemo(() => allContent[locale] || allContent.es, [locale]);
  const [profile, setProfile] = useState("visitor");
  const [profileChosen, setProfileChosen] = useState(false);
  const [profilePanelOpen, setProfilePanelOpen] = useState(false);
  useEffect(() => { const timeout = window.setTimeout(() => { const saved = window.localStorage.getItem("bl-user-type"); if (saved && ["customer", "carrier", "visitor"].includes(saved)) { setProfile(saved); setProfileChosen(true); } }, 0); return () => window.clearTimeout(timeout); }, []);
  function selectProfile(next) { setProfile(next); setProfileChosen(true); window.localStorage.setItem("bl-user-type", next); }
  const renderPage = () => {
    if (page === "home") return <HomePage locale={locale} data={data} profile={profile} />;
    if (page === "services") return <ServicesPage locale={locale} data={data} />;
    if (page === "about") return <AboutPage locale={locale} data={data} />;
    if (page === "coverage") return <CoveragePage locale={locale} data={data} />;
    if (page === "customers") return <CustomersPage locale={locale} data={data} />;
    if (page === "carriers") return <CarriersPage locale={locale} data={data} />;
    if (page === "register") return <RegisterPage locale={locale} data={data} />;
    if (page === "quote") return <QuotePage locale={locale} data={data} />;
    if (page === "contact") return <ContactPage locale={locale} data={data} />;
    return <FAQPage locale={locale} data={data} />;
  };
  return <div className="site-shell"><Header locale={locale} data={data} segments={segments} profile={profile} setProfile={selectProfile} profilePanelOpen={profilePanelOpen} setProfilePanelOpen={setProfilePanelOpen} />{renderPage()}<Footer locale={locale} data={data} />{!profileChosen && <ProfileSelector locale={locale} data={data} onSelect={selectProfile} />}</div>;
}
