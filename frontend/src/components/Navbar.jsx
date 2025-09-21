"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/" || pathname === "";

  // hauteur → variable CSS
  useEffect(() => {
    const applyHeight = () => {
      const h = document.querySelector("nav.site-nav")?.offsetHeight ?? 72;
      document.documentElement.style.setProperty("--nav-h", `${h}px`);
    };
    applyHeight();
    window.addEventListener("resize", applyHeight);
    return () => window.removeEventListener("resize", applyHeight);
  }, []);

  // état “scrolled” (uniquement utile pour la home overlay)
  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const links = [
    { label: "Covoiturage", href: "/covoiturage" },
    { label: "Photos", href: "/photos" },
    { label: "Hébergements", href: "/logements" },
    { label: "Infos", href: "/infos" },
    { label: "RSVP", href: "/rsvp" },
  ];

  return (
    <nav className={`site-nav ${isHome ? "overlay" : ""} ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">
        <a href="/" className="brand">
          <img src="/logo.png" alt="Logo" className="brand-logo" />
          <span className="brand-text">Charlotte &amp; Yanni</span>
        </a>

        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>

        <div className="nav-links">
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>
      </div>

      {open && (
        <div className="nav-mobile">
          {links.map(l => (
            <a key={l.href} href={l.href} className="nav-mobile-link" onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
