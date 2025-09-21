export default function Home() {
  return (
    <main id="app-main" className="no-offset">
      {/* HERO */}
      <section className="hero">
        <video
          className="hero-video"
          src="/video/hero.mp4" /* remplace par ton mp4 */
          autoPlay
          playsInline
          muted
          loop
          poster="/diapo/1.jpg"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div>
            <h1 className="hero-title h-script lg">Charlotte &amp; Yanni</h1>
            <p className="hero-sub">22 août 2026 — Domaine de Camboyer</p>
            <div className="hero-cta">
              <a href="/rsvp" className="btn">Répondre à l’invitation</a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 */}
      <section id="infos" className="section">
        <div className="container section-grid">
          <div>
            <h2 className="section-title">Notre Histoire</h2>
            <p className="section-text">
              Quelques lignes douces pour introduire votre histoire, le lieu
              et l’esprit de la journée.
            </p>
          </div>
          <img src="/diapo/2.jpg" className="section-img" alt="nous" />
        </div>
      </section>

      {/* SECTION 2 (script titre) */}
      <section className="section section-alt">
        <div className="container center">
          <h2 className="h-script md">Week-end Itinerary</h2>
          <ul className="timeline">
            <li><span className="time">11:00</span> Brunch d’accueil au domaine</li>
            <li><span className="time">15:00</span> Cérémonie</li>
            <li><span className="time">19:30</span> Dîner & Soirée</li>
          </ul>
        </div>
      </section>

      {/* SECTION 3 — cartes */}
      <section className="section">
        <div className="container">
          <h2 className="section-title center">Infos utiles</h2>
          <div className="cards">
            <a href="/logements" className="card">
              <h3>Hébergements</h3>
              <p>Nos recommandations autour du domaine.</p>
            </a>
            <a href="/covoiturage" className="card">
              <h3>Covoiturage</h3>
              <p>Proposez une place ou trouvez un trajet.</p>
            </a>
            <a href="/photos" className="card">
              <h3>Galerie</h3>
              <p>Partagez et likez les photos du jour J.</p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
