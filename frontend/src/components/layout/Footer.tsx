// ─────────────────────────────────────────────
//  Footer — styles dans layout/_footer.scss
// ─────────────────────────────────────────────
import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer__inner">

        <div className="footer__brand">
          <p className="footer__logo" aria-label="AS Dynamo">
            <span className="footer__logo-icon" aria-hidden="true">
              <Zap size={18} fill="currentColor" />
            </span>
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
            <li><Link to="/register"        className="footer__link">Adhérer</Link></li>
            <li><Link to="/login"           className="footer__link">Se connecter</Link></li>
            <li><Link to="/member/calendar" className="footer__link">Calendrier</Link></li>
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
  );
}
