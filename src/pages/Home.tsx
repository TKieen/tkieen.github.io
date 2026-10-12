import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import glyphClaude from '../assets/icons/glyph-claude.svg'
import glyphCodex from '../assets/icons/glyph-codex.svg'
import { BackToTop } from '../components/BackToTop'
import { Icon } from '../components/Icon'
import { Navigation } from '../components/Navigation'
import { ProjectCarousel } from '../components/ProjectCarousel'
import { ScrambleText } from '../components/ScrambleText'
import { WaveField } from '../components/WaveField'
import { contactLinks, owner, practice, quickDetails, sections, skillTags, tools, type SectionId } from '../data/site'
import { scrollToSection } from '../lib/scroll'
import '../styles/home.css'

/** Tracks which section of the page is currently being read. */
function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('home')

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.4
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      let current: SectionId = 'home'
      for (const { id } of sections) {
        const top = document.getElementById(id)?.getBoundingClientRect().top
        if (top !== undefined && top <= line) current = id
      }
      setActive(atBottom ? 'contact' : current)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return active
}

export function Home() {
  const active = useActiveSection()
  const { hash } = useLocation()

  // Arriving from another page with /#section
  useEffect(() => {
    document.title = `${owner.name} — UX/UI designer`
    const id = hash.slice(1)
    if (sections.some((section) => section.id === id)) document.getElementById(id)?.scrollIntoView({ behavior: 'instant' })
  }, [hash])

  return (
    <>
      <Navigation active={active} />

      <main className="home">
        <section className="hero" id="home">
          <div className="container">
            <div className="hero__content">
              <div className="hero__copy">
                <div className="hero__intro">
                  <p className="eyebrow">
                    <span className="mono eyebrow__index">00 / 05</span>
                    <span className="eyebrow__line" />
                    <span className="eyebrow__label">{owner.role}</span>
                  </p>
                  <h1 className="hero__name" aria-label={owner.name}>
                    <ScrambleText text="Nguyen" />
                    <br />
                    <ScrambleText text="The Kien" delay={150} />
                    <WaveField lines={5} spread={1} />
                  </h1>
                </div>
                <div className="hero__summary">
                  <p>UI/UX and web designer with a software-engineering background.</p>
                  <div className="hero__actions">
                    <a
                      className="button"
                      href="#portfolio"
                      onClick={(event) => {
                        event.preventDefault()
                        scrollToSection('portfolio')
                      }}
                    >
                      View selected work
                      <Icon name="arrow-up-right" />
                    </a>
                    <a
                      className="button button--light"
                      href="#about"
                      onClick={(event) => {
                        event.preventDefault()
                        scrollToSection('about')
                      }}
                    >
                      About me
                      <Icon name="arrow-down" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="profile-panel" aria-hidden="true">
                <WaveField lines={5} spread={0.62} />
                <span className="profile-panel__field" />
                <span className="profile-panel__initials">NK</span>
                <div className="profile-panel__meta">
                  <p>
                    <span className="mono">Focus</span>
                    Interface · Identity
                  </p>
                  <Icon name="arrow-down-right" size={22} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section section--white" id="about">
          <div className="container section__inner">
            <header className="section-header">
              <h2 className="section-header__title">
                <span className="section-header__index">01</span>
                <span className="section-header__name">About me</span>
              </h2>
              <p className="section-header__note">Designing for clarity — from first principle to final pixel.</p>
            </header>
            <div className="divider" />

            <div className="about">
              <div className="about__bio">
                <div className="about__copy">
                  <h3>A designer with a software engineering foundation.</h3>
                  <p>
                    I'm an Information Technology student majoring in Software Engineering, with 4 years of
                    hands-on design experience. My technical background helps me understand how products are built,
                    so I can design interfaces that are both user-friendly and feasible to implement. I'm looking
                    for an opportunity to learn and grow in UI/UX, where I can combine design thinking with my
                    knowledge of software to create meaningful experiences.
                  </p>
                </div>
                <dl className="about__details">
                  {quickDetails.map(({ label, value }) => (
                    <div key={label}>
                      <dt className="mono">{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="about__profile">
                <article className="education">
                  <header className="education__heading">
                    <h3>Education</h3>
                    <span className="mono">In progress</span>
                  </header>
                  <div className="divider" />
                  <div className="education__row education__row--school">
                    <div>
                      <h4>Saigon University</h4>
                      <p>Engineer’s Degree — Software Engineer</p>
                    </div>
                    <div className="education__date mono">
                      <span>AUG 2022 — MAY 2027</span>
                      <strong>Expected graduation 2027</strong>
                    </div>
                  </div>
                  <div className="education__row education__row--certificate">
                    <div>
                      <h4>TOEIC Certificate</h4>
                      <p>Listening &amp; Reading · July 2026</p>
                    </div>
                    <span className="education__score mono">900/990</span>
                  </div>
                </article>

                <div className="capabilities">
                  <h3 className="mono">Core toolkit &amp; capabilities</h3>
                  <ul>
                    {skillTags.map(({ label, tone }) => (
                      <li key={label} className={tone ? `tag tag--${tone}` : 'tag'}>
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="container section__inner section__inner--tight">
            <header className="section-header">
              <h2 className="section-header__title">
                <span className="section-header__index">02</span>
                <span className="section-header__name">Experience</span>
              </h2>
              <p className="section-header__note">A cross-disciplinary practice across brand, product, and motion.</p>
            </header>
            <div className="divider" />

            <div className="experience">
              <ul className="tool-grid">
                {tools.map(({ code, tone, icon, iconSize, title, meta, note, emphasis }) => (
                  <li key={code} className={`tool-card tool-card--${tone}${emphasis ? ' is-emphasis' : ''}`}>
                    <div className="tool-card__top">
                      <span className="mono">{code}</span>
                      <img src={icon} width={iconSize} height={iconSize} alt="" />
                    </div>
                    <div className="tool-card__copy">
                      <h3>{title}</h3>
                      <p className="tool-card__meta mono">{meta}</p>
                      <p className="tool-card__note">{note}</p>
                    </div>
                  </li>
                ))}
                <li className="tool-card tool-card--wide tool-card--ai">
                  <div className="tool-card__top">
                    <span className="mono">AI</span>
                    <span className="tool-card__glyphs">
                      <span style={{ background: '#d97757' }}>
                        <img src={glyphClaude} alt="" />
                      </span>
                      <span style={{ background: '#111' }}>
                        <img src={glyphCodex} alt="" />
                      </span>
                    </span>
                  </div>
                  <div className="tool-card__copy">
                    <h3>Claude &amp; Codex</h3>
                    <div className="tool-card__split">
                      <p className="tool-card__meta mono">AI-assisted</p>
                      <p className="tool-card__note">Design &amp; code</p>
                    </div>
                  </div>
                </li>
              </ul>

              <div className="practice">
                <header className="practice__heading">
                  <h3>Selected practice</h3>
                  <span className="mono">COMMUNITY · PRODUCT · SYSTEMS</span>
                </header>
                {practice.map(({ years, title, role, description, client, tools: usedTools }) => (
                  <article key={title} className="practice__entry">
                    <p className="practice__years mono">{years}</p>
                    <h4 className="practice__title">{title}</h4>
                    <p className="practice__role mono">{role}</p>
                    <div className="practice__body">
                      <p className="practice__description">{description}</p>
                      <p>
                        For: {client}
                        <br />
                        Tools: {usedTools}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section section--white section--portfolio" id="portfolio">
          <div className="container section__inner section__inner--tight">
            <header className="section-header">
              <h2 className="section-header__title">
                <span className="section-header__index">03</span>
                <span className="section-header__name">Portfolio</span>
              </h2>
              <p className="section-header__note">Three projects. Each built as a system, not a single screen.</p>
            </header>
            <div className="divider" />
            <ProjectCarousel />
            <div className="section__cta">
              <Link className="button" to="/portfolio">
                View full project
                <Icon name="arrow-up-right" />
              </Link>
            </div>
          </div>
        </section>

        <section className="contact" id="contact">
          <WaveField lines={7} spread={0.56} />
          <div className="container">
            <div className="contact__content">
              <div className="contact__statement">
                <p className="eyebrow eyebrow--dark">
                  <span className="mono eyebrow__index">04</span>
                  <span className="eyebrow__line" />
                  <span className="eyebrow__label">Contact</span>
                </p>
                <h2>
                  Let’s make the
                  <br />
                  next thing clear.
                </h2>
                <p className="contact__lead">
                  Have a product, identity, or community project in mind? Send a short note about the challenge and
                  where design can help.
                </p>
              </div>

              <ul className="contact-card">
                {contactLinks.map(({ label, value, href, icon }) => (
                  <li key={label}>
                    <a href={href} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>
                      <span>
                        <span className="mono">{label}</span>
                        {value}
                      </span>
                      <Icon name={icon} size={20} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <footer className="contact__footer footer-row">
              <Link className="wordmark" to="/" onClick={() => scrollToSection('home')}>
                {owner.name}
              </Link>
              <p className="footer-row__copyright">{owner.copyright}</p>
            </footer>
          </div>
        </section>
      </main>

      <BackToTop />
    </>
  )
}
