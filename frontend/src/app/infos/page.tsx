export default function Infos() {
  return (
    <div className="container" style={{padding:"36px 0 80px"}}>
      <h1 className="section-title">Infos pratiques</h1>

      {/* Bloc 1 */}
      <section className="section">
        <div className="section-grid">
          <div>
            <h2 className="section-title">Accès</h2>
            <p className="section-text">
              Domaine de Camboyer — Parking sur place.  
              Gares TGV les plus proches : Aix-en-Provence & Marseille.
            </p>
          </div>
          <img className="section-img" src="/images/plan.jpg" alt="" />
        </div>
      </section>

      {/* Bloc 2 */}
      <section className="section section-alt">
        <h2 className="section-title center">Dress code & météo</h2>
        <p className="section-text" style={{textAlign:"center", maxWidth:760, margin:"0 auto"}}>
          Élégant & confortable (talons déconseillés pour le jardin).  
          La soirée se déroulera en extérieur — prévoir une petite veste.
        </p>
      </section>

      {/* Bloc 3 */}
      <section className="section">
        <div className="cards">
          <div className="card">
            <h3>Enfants</h3>
            <p className="section-text">Espace kids & nounou sur place.</p>
          </div>
          <div className="card">
            <h3>Liste de mariage</h3>
            <p className="section-text">Votre présence est notre plus beau cadeau ❤️</p>
          </div>
          <div className="card">
            <h3>Contact</h3>
            <p className="section-text">charlotte+yanni@mail.com</p>
          </div>
        </div>
      </section>
    </div>
  );
}
