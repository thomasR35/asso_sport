// ─────────────────────────────────────────────
//  Page d'accueil publique
//  Sémantique : <main> > <section> distinctes
//  Logique : aucune — que de l'affichage
// ─────────────────────────────────────────────
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Trophy, CalendarDays, Zap } from 'lucide-react';
import { Button } from '@/components/ui';

const STATS = [
  { value: '240+', label: 'Membres actifs'     },
  { value: '15',   label: 'Sports pratiqués'   },
  { value: '8',    label: "Années d'existence" },
  { value: '32',   label: 'Titres remportés'   },
];

const FEATURES = [
  {
    icon:  Users,
    title: 'Communauté soudée',
    desc:  'Rejoignez une famille de passionnés qui partagent votre amour du sport et du dépassement de soi.',
  },
  {
    icon:  CalendarDays,
    title: 'Agenda riche',
    desc:  "Entraînements, compétitions, sorties, événements sociaux — un programme varié toute l'année.",
  },
  {
    icon:  Trophy,
    title: 'Encadrement expert',
    desc:  'Des coaches diplômés et des bénévoles dévoués pour vous accompagner à chaque niveau.',
  },
];

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      {/* ── Section héro ── */}
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__grid" />
          <div className="hero__glow" />
          <div className="hero__stripe hero__stripe--top" />
          <div className="hero__stripe hero__stripe--bottom" />
        </div>

        <div className="hero__content">
          <p className="hero__badge" aria-label="Association sportive depuis 2016">
            <Zap size={12} fill="currentColor" aria-hidden="true" />
            Association sportive depuis 2016
          </p>

          <h1 id="hero-title" className="hero__title">
            L'énergie<br />
            <span>du sport.</span><br />
            La force<br />
            du collectif.
          </h1>

          <p className="hero__description">
            AS Dynamo réunit des athlètes passionnés de tous niveaux.<br />
            Rejoignez-nous et repoussez vos limites, ensemble.
          </p>

          <div className="hero__actions">
            <Button size="lg" onClick={() => navigate('/register')}>
              Adhérer maintenant <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/about')}>
              Découvrir l'asso
            </Button>
          </div>
        </div>
      </section>

      {/* ── Section statistiques ── */}
      <section className="stats-section" aria-label="Chiffres clés de l'association">
        <ul className="stats-list" role="list">
          {STATS.map((stat) => (
            <li key={stat.label} className="stats-item">
              <strong className="stats-item__value" aria-label={`${stat.value} ${stat.label}`}>
                {stat.value}
              </strong>
              <span className="stats-item__label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Section avantages ── */}
      <section className="features-section" aria-labelledby="features-title">
        <div className="features-section__inner">
          <header className="features-section__header">
            <p className="section-tag">Pourquoi nous rejoindre</p>
            <h2 id="features-title" className="section-title">Bien plus qu'un club</h2>
          </header>

          <ul className="features-grid" role="list">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="feature-card">
                <div className="feature-card__icon" aria-hidden="true">
                  <feature.icon size={22} />
                </div>
                <h3 className="feature-card__title">{feature.title}</h3>
                <p className="feature-card__description">{feature.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Bandeau appel à l'action ── */}
      <section className="cta-section" aria-labelledby="cta-title">
        <div className="cta-section__bg" aria-hidden="true" />
        <div className="cta-section__inner">
          <div className="cta-section__text">
            <h2 id="cta-title">Prêt(e) à nous rejoindre ?</h2>
            <p>Inscription en ligne en 2 minutes. Premier entraînement offert.</p>
          </div>
          <Button size="lg" onClick={() => navigate('/register')}>
            Créer mon compte <ArrowRight size={18} aria-hidden="true" />
          </Button>
        </div>
      </section>

      <style>{`
        /* ── Héro ── */
        .hero {
          position: relative; min-height: calc(100vh - 64px);
          display: flex; align-items: center; overflow: hidden;
        }
        .hero__bg { position: absolute; inset: 0; pointer-events: none; }
        .hero__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,106,0,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,106,0,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .hero__glow {
          position: absolute; top: -200px; right: -200px;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,106,0,0.12) 0%, transparent 70%);
        }
        .hero__stripe {
          position: absolute; height: 3px; width: 40%;
          background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
          opacity: 0.5;
        }
        .hero__stripe--top    { top: 30%;    left: 0;  transform: skewY(-3deg); }
        .hero__stripe--bottom { bottom: 30%; right: 0; transform: skewY(-3deg); }

        .hero__content {
          max-width: 1200px; margin: 0 auto; padding: 80px 24px;
          position: relative; z-index: 1;
          animation: fadeInUp 0.7s ease both;
        }
        .hero__badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 14px; border-radius: 999px;
          background: rgba(255,106,0,0.12); border: 1px solid rgba(255,106,0,0.3);
          color: var(--color-primary);
          font-family: var(--font-display); font-weight: 700; font-size: 0.75rem;
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 28px;
        }
        .hero__title {
          font-family: var(--font-display); font-weight: 900;
          font-size: clamp(3rem, 9vw, 7rem); line-height: 0.95;
          letter-spacing: -0.01em; text-transform: uppercase;
          color: var(--color-text); margin-bottom: 28px;
        }
        .hero__title span { color: var(--color-primary); }
        .hero__description {
          font-size: 1.1rem; color: var(--color-text-muted);
          max-width: 520px; line-height: 1.7; margin-bottom: 40px;
        }
        .hero__actions { display: flex; gap: 16px; flex-wrap: wrap; }

        /* ── Stats ── */
        .stats-section {
          background: var(--color-bg-2);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
        }
        .stats-list {
          max-width: 1200px; margin: 0 auto; padding: 48px 24px;
          display: grid; grid-template-columns: repeat(4, 1fr);
          list-style: none;
        }
        .stats-item {
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          padding: 16px; position: relative;
          animation: fadeInUp 0.5s ease both;
        }
        .stats-item + .stats-item::before {
          content: ''; position: absolute; left: 0; top: 20%; height: 60%;
          width: 1px; background: var(--color-border);
        }
        .stats-item__value {
          font-family: var(--font-display); font-weight: 900;
          font-size: 2.8rem; color: var(--color-primary); line-height: 1;
        }
        .stats-item__label {
          font-family: var(--font-display); font-weight: 700; font-size: 0.78rem;
          letter-spacing: 0.08em; text-transform: uppercase; color: var(--color-text-muted);
        }

        /* ── Avantages ── */
        .features-section { padding: 96px 24px; }
        .features-section__inner { max-width: 1200px; margin: 0 auto; }
        .features-section__header { text-align: center; margin-bottom: 56px; }
        .section-tag {
          display: inline-block;
          font-family: var(--font-display); font-weight: 700; font-size: 0.72rem;
          letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-primary);
          margin-bottom: 12px;
        }
        .section-title {
          font-family: var(--font-display); font-weight: 900; font-size: 2.5rem;
          text-transform: uppercase; letter-spacing: 0.02em;
        }
        .features-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;
          list-style: none; padding: 0; margin: 0;
        }
        .feature-card {
          background: var(--color-bg-card); border: 1px solid var(--color-border);
          border-radius: var(--radius-lg); padding: 32px;
          transition: all var(--transition-base);
          animation: fadeInUp 0.5s ease both;
        }
        .feature-card:hover {
          border-color: rgba(255,106,0,0.3);
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }
        .feature-card__icon {
          width: 48px; height: 48px; border-radius: var(--radius-md);
          background: rgba(255,106,0,0.12); color: var(--color-primary);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
        }
        .feature-card__title {
          font-family: var(--font-display); font-weight: 800; font-size: 1.1rem;
          text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 10px;
        }
        .feature-card__description { color: var(--color-text-muted); font-size: 0.92rem; line-height: 1.6; }

        /* ── CTA ── */
        .cta-section {
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dim) 100%);
          position: relative; overflow: hidden;
        }
        .cta-section__bg {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .cta-section__inner {
          max-width: 1200px; margin: 0 auto; padding: 64px 24px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 32px; position: relative; z-index: 1; flex-wrap: wrap;
        }
        .cta-section__text h2 {
          font-family: var(--font-display); font-weight: 900; font-size: 2rem;
          text-transform: uppercase; color: #fff; margin-bottom: 8px;
        }
        .cta-section__text p { color: rgba(255,255,255,0.8); font-size: 1rem; }
        .cta-section .btn--primary { background: #fff; color: var(--color-primary); }
        .cta-section .btn--primary:hover { background: #f5f5f5; }

        @media (max-width: 900px) {
          .stats-list      { grid-template-columns: repeat(2, 1fr); }
          .features-grid   { grid-template-columns: 1fr; }
          .cta-section__inner { flex-direction: column; text-align: center; }
        }
        @media (max-width: 480px) {
          .stats-list    { grid-template-columns: repeat(2, 1fr); }
          .hero__actions { flex-direction: column; }
        }
      `}</style>
    </>
  );
}
