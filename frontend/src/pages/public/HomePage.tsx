// ─────────────────────────────────────────────
//  Page d'accueil — styles dans pages/_home.scss
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
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__grid" />
          <div className="hero__glow" />
          <div className="hero__stripe hero__stripe--top" />
          <div className="hero__stripe hero__stripe--bottom" />
        </div>

        <div className="hero__content">
          <p className="hero__badge">
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

      <section className="stats-section" aria-label="Chiffres clés">
        <ul className="stats-list" role="list">
          {STATS.map((stat) => (
            <li key={stat.label} className="stats-item">
              <strong className="stats-item__value">{stat.value}</strong>
              <span  className="stats-item__label">{stat.label}</span>
            </li>
          ))}
        </ul>
      </section>

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
    </>
  );
}
