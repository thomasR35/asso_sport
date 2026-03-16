// ─────────────────────────────────────────────
//  Pied de page
//  Sémantique : <footer> + <nav> + <address>
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <>
      <footer className="site-footer" role="contentinfo">
        <div className="footer__inner">

          {/* Identité et contact */}
          <div className="footer__brand">
            <p className="footer__logo">
              <span className="footer__logo-icon" aria-hidden="true"><Zap size={18} fill="currentColor" /></span>
              AS <strong>DYNAMO</strong>
            </p>
            <p className="footer__tagline">L'énergie du sport,<br />la force du collectif.</p>

            <address className="footer__contact">
              <a href="mailto:contact@asdynamo.fr" className="footer__contact-item">
                <Mail size={14} aria-hidden="true" /> contact@asdynamo.fr
              </a>
              <a href="tel:+33600000000" className="footer__contact-item">
                <Phone size={14} aria-hidden="true" /> 06 00 00 00 00
              </a>
              <span className="footer__contact-item">
                <MapPin size={14} aria-hidden="true" /> 12 rue du Stade, 35000 Rennes
              </span>
            </address>
          </div>

          {/* Navigation secondaire */}
          <nav aria-label="À propos de l'asso">
            <h2 className="footer__nav-title">L'asso</h2>
            <ul className="footer__nav-list" role="list">
              <li><Link to="/about"      className="footer__link">Notre histoire</Link></li>
              <li><Link to="/activities" className="footer__link">Activités</Link></li>
              <li><Link to="/contact"    className="footer__link">Nous contacter</Link></li>
            </ul>
          </nav>

          <nav aria-label="Espace membres">
            <h2 className="footer__nav-title">Membres</h2>
            <ul className="footer__nav-list" role="list">
              <li><Link to="/register"         className="footer__link">Adhérer</Link></li>
              <li><Link to="/login"            className="footer__link">Se connecter</Link></li>
              <li><Link to="/member/calendar"  className="footer__link">Calendrier</Link></li>
            </ul>
          </nav>

          <nav aria-label="Informations légales">
            <h2 className="footer__nav-title">Légal</h2>
            <ul className="footer__nav-list" role="list">
              <li><Link to="/legal"   className="footer__link">Mentions légales</Link></li>
              <li><Link to="/privacy" className="footer__link">Confidentialité</Link></li>
              <li><Link to="/terms"   className="footer__link">CGU</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer__bottom">
          <small>© {new Date().getFullYear()} AS Dynamo — Tous droits réservés</small>
          <small>Association loi 1901</small>
        </div>
      </footer>

      <style>{`
        .site-footer { background: var(--color-bg-2); border-top: 1px solid var(--color-border); margin-top: auto; }
        .footer__inner {
          max-width: 1200px; margin: 0 auto; padding: 56px 24px 40px;
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px;
        }
        .footer__logo {
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-display); font-weight: 800; font-size: 1.1rem;
          letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-text);
          margin-bottom: 12px;
        }
        .footer__logo-icon {
          width: 30px; height: 30px; background: var(--color-primary);
          border-radius: var(--radius-sm); display: flex; align-items: center;
          justify-content: center; color: #fff;
        }
        .footer__tagline { color: var(--color-text-muted); font-size: 0.9rem; line-height: 1.5; margin-bottom: 20px; }
        .footer__contact { display: flex; flex-direction: column; gap: 8px; font-style: normal; }
        .footer__contact-item {
          display: flex; align-items: center; gap: 8px;
          color: var(--color-text-dim); font-size: 0.82rem; text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer__contact-item:hover { color: var(--color-primary); }
        .footer__nav-title {
          font-family: var(--font-display); font-weight: 800; font-size: 0.75rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-primary);
          margin-bottom: 16px;
        }
        .footer__nav-list { display: flex; flex-direction: column; gap: 8px; list-style: none; padding: 0; margin: 0; }
        .footer__link {
          color: var(--color-text-muted); font-size: 0.88rem; text-decoration: none;
          transition: color var(--transition-fast);
        }
        .footer__link:hover, .footer__link:focus-visible { color: var(--color-text); }
        .footer__bottom {
          max-width: 1200px; margin: 0 auto; padding: 20px 24px;
          border-top: 1px solid var(--color-border);
          display: flex; justify-content: space-between; align-items: center;
          color: var(--color-text-dim); font-size: 0.78rem;
        }
        @media (max-width: 768px) {
          .footer__inner { grid-template-columns: 1fr 1fr; gap: 32px; }
          .footer__brand { grid-column: 1 / -1; }
          .footer__bottom { flex-direction: column; gap: 6px; text-align: center; }
        }
        @media (max-width: 480px) {
          .footer__inner { grid-template-columns: 1fr; gap: 20px; padding: 28px 16px; }
          .footer__nav-title { margin-bottom: 10px; }
        }
      `}</style>
    </>
  );
}
