import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import type {
  CardStyle,
  EffectType,
  HeroBrandCalibration,
  MenuVariant,
  SectionType,
  SiteConfig,
} from '../types/site'
import { HeroShelfAudit } from './HeroShelfAudit'
import './HeroShelfAudit.css'

const EFFECTS: EffectType[] = [
  'card effect',
  'rec_move_left',
  'rec_move_2x',
  'circle_move_left',
]

type Translator = (key: string, fallback: string) => string

const translate = (
  config: SiteConfig,
  language: string,
  key: string,
  fallback: string,
) => {
  if (language === (config.header.language.defaultLanguage || language)) {
    return fallback
  }
  return config.translations?.[key]?.[language] ?? fallback
}

const shadowValue = (shadow: CardStyle['shadow']) => {
  if (shadow === 'strong') return '0 24px 60px rgba(0,0,0,.20)'
  if (shadow === 'soft') return '0 14px 34px rgba(35,31,32,.12)'
  return 'none'
}

const cardStyleVars = (style: CardStyle) =>
  ({
    '--card-background': style.backgroundColor,
    '--card-color': style.fontColor,
    '--card-font-size': `${style.fontSize}px`,
    '--card-border-width': `${style.borderWidth}px`,
    '--card-border-color': style.borderColor,
    '--card-border-radius': `${style.borderRadius}px`,
    '--card-padding': `${style.padding}px`,
    '--card-shadow': shadowValue(style.shadow),
  }) as CSSProperties

export function PublicSite({
  config,
  onAdmin,
}: {
  config: SiteConfig
  onAdmin: () => void
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState(
    config.header.language.defaultLanguage ||
      config.header.language.options[0] ||
      'EN',
  )

  useEffect(() => {
    const available = config.header.language.options || []
    if (!available.includes(language)) {
      setLanguage(
        config.header.language.defaultLanguage ||
          available[0] ||
          'EN',
      )
    }
  }, [config.header.language.defaultLanguage, config.header.language.options, language])

  const t: Translator = (key, fallback) =>
    translate(config, language, key, fallback)

  const enabled = (id: string) =>
    config.sections.find(section => section.id === id)?.enabled

  const sectionConfig = (type: SectionType) =>
    config.sections.find(section => section.type === type)

  const sectionStyle = (type: SectionType) => {
    const appearance = sectionConfig(type)?.appearance

    return {
      '--section-background': appearance?.backgroundColor || '#FFFFFF',
      '--section-color': appearance?.fontColor || '#231F20',
    } as CSSProperties
  }

  const normalMenuItems = config.sections.filter(
    section =>
      section.enabled &&
      section.menu.enabled &&
      section.menu.placement === 'normal',
  )

  const bottomMenuItems = config.sections.filter(
    section =>
      section.enabled &&
      section.menu.enabled &&
      section.menu.placement === 'bottom',
  )

  const footerAppearance = sectionConfig('footer')?.appearance
  const headerColor =
    config.theme.headerFooter ||
    footerAppearance?.backgroundColor ||
    '#231F20'
  const headerTextColor = footerAppearance?.fontColor || '#FFFFFF'

  const localizedBrands: HeroBrandCalibration[] = (config.hero.calibration ?? []).map(
    (brand, brandIndex) => ({
      ...brand,
      name: t(`hero.calibration.${brandIndex}.name`, brand.name),
      products: brand.products.map((product, productIndex) => ({
        ...product,
        variant: t(
          `hero.calibration.${brandIndex}.products.${productIndex}.variant`,
          product.variant,
        ),
      })),
    }),
  )

  const renderMenuLink = (
    item: {
      label: string
      href: string
      variant: MenuVariant
    },
    mobile = false,
    onClick?: () => void,
  ) => (
    <a
      href={item.href}
      className={`menu-item ${
        item.variant === 'button' ? 'menu-item-button' : ''
      } ${mobile ? 'mobile-menu-item' : ''}`}
      onClick={onClick}
    >
      {item.label}
    </a>
  )

  const renderSectionMenuItem = (
    section: SiteConfig['sections'][number],
    mobile = false,
    onClick?: () => void,
  ) =>
    renderMenuLink(
      {
        label: t(
          `sections.${section.id}.menu.label`,
          section.menu.label || section.label,
        ),
        href: `#${section.id}`,
        variant: section.menu.variant,
      },
      mobile,
      onClick,
    )

  return (
    <div
      className="site"
      style={
        {
          '--header-color': headerColor,
          '--header-text-color': headerTextColor,
        } as CSSProperties
      }
    >
      <nav className="nav">
        <a className="brand" href="#">
          {config.brand.logo ? (
            <img
              className="brand-logo"
              src={config.brand.logo}
              alt={t('brand.name', config.brand.name)}
            />
          ) : (
            t('brand.name', config.brand.name)
          )}
        </a>

        <div className="nav-desktop">
          <div className="navlinks navlinks-normal">
            {normalMenuItems.map(section => (
              <span key={section.id}>
                {renderSectionMenuItem(section)}
              </span>
            ))}

            {config.header.login.enabled &&
              renderMenuLink({
                label: t('header.login.label', config.header.login.label),
                href: config.header.login.href,
                variant: config.header.login.variant,
              })}

            {config.header.language.enabled &&
              config.header.language.options.length > 0 && (
                <select
                  className="language-selector"
                  aria-label="Language"
                  value={language}
                  onChange={event => setLanguage(event.target.value)}
                >
                  {config.header.language.options.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
          </div>

          {bottomMenuItems.length > 0 && (
            <div className="navlinks navlinks-bottom">
              {bottomMenuItems.map(section => (
                <span key={section.id}>
                  {renderSectionMenuItem(section)}
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          type="button"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(value => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <div className="mobile-menu-list">
              {[...normalMenuItems, ...bottomMenuItems].map(section => (
                <span key={section.id}>
                  {renderSectionMenuItem(section, true, () =>
                    setMobileMenuOpen(false),
                  )}
                </span>
              ))}

              {config.header.login.enabled && (
                <span>
                  {renderMenuLink(
                    {
                      label: t('header.login.label', config.header.login.label),
                      href: config.header.login.href,
                      variant: config.header.login.variant,
                    },
                    true,
                    () => setMobileMenuOpen(false),
                  )}
                </span>
              )}

              {config.header.language.enabled &&
                config.header.language.options.length > 0 && (
                  <label className="mobile-language">
                    <span>Language</span>
                    <select
                      value={language}
                      onChange={event => setLanguage(event.target.value)}
                    >
                      {config.header.language.options.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                )}
            </div>
          </div>
        )}
      </nav>

      {enabled('hero') && (
        <section
          id="hero"
          className="hero cms-section"
          style={sectionStyle('hero')}
        >
          <div
            className="hero-copy"
            style={
              {
                '--hero-title-size': `${config.hero.titleSize ?? 100}px`,
                '--hero-text-color': config.hero.textColor ?? '#FFFFFF',
                '--hero-text-y': `${config.hero.textY ?? 50}%`,
              } as CSSProperties
            }
          >
            <span className="eyebrow">{t('hero.eyebrow', config.hero.eyebrow)}</span>
            <h1>{t('hero.title', config.hero.title)}</h1>
            <p>{t('hero.subtitle', config.hero.subtitle)}</p>

            <div className="buttons">
              {config.hero.primaryButton.enabled && (
                <a
                  className="primary"
                  href={config.hero.primaryButton.href || '#cta'}
                >
                  {t('hero.primaryButton.label', config.hero.primaryButton.label)}
                </a>
              )}
              {config.hero.secondaryButton.enabled && (
                <a
                  className="outline"
                  href={config.hero.secondaryButton.href || '#steps'}
                >
                  {t(
                    'hero.secondaryButton.label',
                    config.hero.secondaryButton.label,
                  )}
                </a>
              )}
            </div>
          </div>

          {config.hero.image ? (
            <HeroShelfAudit
              image={config.hero.image}
              brands={localizedBrands}
              imageSize={heroSize(config.hero.imageSize)}
            />
          ) : (
            <div
              className="hero-visual hero-image-placeholder"
              aria-label="Hero image"
            >
              Upload a Hero image in Admin
            </div>
          )}
        </section>
      )}

      {enabled('stats') && (
        <section
          id="stats"
          className="stats cms-section"
          style={sectionStyle('stats')}
        >
          {config.stats.map((stat, index) => (
            <div key={stat.label + index}>
              <strong>{t(`stats.${index}.value`, stat.value)}</strong>
              <span>{t(`stats.${index}.label`, stat.label)}</span>
            </div>
          ))}
        </section>
      )}

      {enabled('steps') && (
        <section
          id="steps"
          className="section cms-section"
          style={sectionStyle('steps')}
        >
          <Header eyebrow="The process" title="Three steps. Zero friction." />
          <div className="stepgrid">
            {config.steps.map((step, index) => (
              <article className="card" key={index}>
                {step.icon ? (
                  <img
                    className="section-card-icon"
                    src={step.icon}
                    alt=""
                    width={64}
                    height={64}
                  />
                ) : null}
                <h3>{t(`steps.${index}.title`, step.title)}</h3>
                <p>{t(`steps.${index}.body`, step.body)}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {enabled('ticker') && (
        <section
          id="ticker"
          className="ticker cms-section"
          style={sectionStyle('ticker')}
        >
          {config.findings.map((finding, index) => (
            <div key={finding.finding + index}>
              <small>{t(`findings.${index}.category`, finding.category)}</small>
              <span>{t(`findings.${index}.finding`, finding.finding)}</span>
              <em className={finding.status}>
                {t(`findings.${index}.statusText`, finding.statusText)}
              </em>
            </div>
          ))}
        </section>
      )}

      {enabled('report') && (
        <section
          id="report"
          className="section soft cms-section"
          style={sectionStyle('report')}
        >
          <Header eyebrow="Preview" title={t('report.title', config.report.title)} />
          <div className="report">
            <h3>{t('report.store', config.report.store)}</h3>
            <p>{t('report.category', config.report.category)}</p>
            <div className="metrics">
              {config.report.metrics.map((metric, index) => (
                <div key={metric.label + index}>
                  <strong>{t(`report.metrics.${index}.value`, metric.value)}</strong>
                  <span>{t(`report.metrics.${index}.label`, metric.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {enabled('segments') && (
        <section
          id="segments"
          className="section cms-section"
          style={sectionStyle('segments')}
        >
          <Header
            eyebrow="Who it's for"
            title="Built for different kinds of teams."
          />
          <div className="three">
            {config.segments.map((segment, index) => (
              <article className="card segment-card" key={index}>
                {segment.icon ? (
                  <img
                    className="section-card-icon"
                    src={segment.icon}
                    alt=""
                    width={64}
                    height={64}
                  />
                ) : null}
                <h3>{t(`segments.${index}.title`, segment.title)}</h3>
                <p>{t(`segments.${index}.description`, segment.description)}</p>
                <ul>
                  {t(
                    `segments.${index}.bullets`,
                    segment.bullets.join('\n'),
                  )
                    .split('\n')
                    .filter(Boolean)
                    .map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {enabled('blocks') &&
        config.blocks.map((block, index) => (
          <section
            id={index === 0 ? 'blocks' : `block-${index + 1}`}
            className={`section block ${block.background} cms-section`}
            style={sectionStyle('blocks')}
            key={`${block.title}-${index}`}
          >
            <div className={`blockgrid ${block.layout}`}>
              <div>
                <Header
                  eyebrow={t(`blocks.${index}.eyebrow`, block.eyebrow)}
                  title={t(`blocks.${index}.title`, block.title)}
                />
                <p className="lead">
                  {t(`blocks.${index}.body`, block.body)}
                </p>
              </div>
              {block.layout !== 'none' && (
                <div className="visual">
                  {block.image ? (
                    <img src={block.image} alt="" />
                  ) : (
                    <div className="placeholder">IMAGE / MEDIA</div>
                  )}
                </div>
              )}
            </div>
          </section>
        ))}

      {enabled('articles') && (
        <ArticleCollection
          id="articles"
          eyebrow="Insights"
          config={config.articles}
          sectionStyle={sectionStyle('articles')}
          t={t}
        />
      )}

      {enabled('news') && (
        <ArticleCollection
          id="news"
          eyebrow="Updates"
          config={config.news}
          sectionStyle={sectionStyle('news')}
          t={t}
        />
      )}

      {enabled('people') && (
        <NetworkSection
          config={config.people}
          sectionStyle={sectionStyle('people')}
          t={t}
        />
      )}

      {enabled('philosophy') && (
        <PrincipleSection
          config={config.philosophy}
          sectionStyle={sectionStyle('philosophy')}
          t={t}
        />
      )}

      {enabled('cta') && (
        <section
          id="cta"
          className="cta cms-section"
          style={sectionStyle('cta')}
        >
          <div>
            <h2>{t('cta.title', config.cta.title)}</h2>
            <p>{t('cta.body', config.cta.body)}</p>
            {config.admin.enabled && config.admin.showCtaButton && (
              <button onClick={onAdmin}>{t('cta.button', config.cta.button)}</button>
            )}
          </div>
        </section>
      )}

      {enabled('footer') && (
        <footer
          id="footer"
          className="cms-section"
          style={sectionStyle('footer')}
        >
          {t('footer', config.footer)}
          {config.admin.enabled && config.admin.showFooterButton && (
            <button onClick={onAdmin}>Admin</button>
          )}
        </footer>
      )}
    </div>
  )
}

function heroSize(value: number | undefined) {
  return Math.min(100, Math.max(25, Number(value || 48)))
}

function Header({
  eyebrow,
  title,
}: {
  eyebrow: string
  title: string
}) {
  return (
    <>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
    </>
  )
}

function EffectRail({
  items,
  effect,
  dark,
  cardStyle,
  t,
  kind,
}: {
  items: SiteConfig['articles']['items']
  effect: EffectType
  dark?: boolean
  cardStyle: CardStyle
  t: Translator
  kind: 'articles' | 'news'
}) {
  const safe = EFFECTS.includes(effect) ? effect : 'rec_move_left'
  const doubled = [...items, ...items]

  const textFor = (
    article: SiteConfig['articles']['items'][number],
    fallback: string,
    field: 'title' | 'category' | 'excerpt' | 'date',
  ) => {
    const index = items.indexOf(article)
    return t(`${kind}.items.${Math.max(0, index)}.${field}`, fallback)
  }

  if (safe === 'card effect') {
    return (
      <div
        className={`effect-card-row ${
          dark ? 'effect-card-row-dark' : ''
        }`}
      >
        {items.map((article, index) => (
          <article
            className="effect-card"
            key={article.title + '-' + index}
            style={cardStyleVars(cardStyle)}
          >
            <small>{textFor(article, article.category, 'category')}</small>
            <h3>{textFor(article, article.title, 'title')}</h3>
            <p>{textFor(article, article.excerpt, 'excerpt')}</p>
            <span>{textFor(article, article.date, 'date')} · Read →</span>
          </article>
        ))}
      </div>
    )
  }

  if (safe === 'circle_move_left') {
    return (
      <div
        className={`network-circle-mask article-circle-mask ${
          dark ? 'effect-circle-dark' : ''
        }`}
      >
        <div className="network-circle-track">
          {doubled.map((article, index) => (
            <div
              className="network-circle"
              key={article.title + '-' + index}
              style={cardStyleVars(cardStyle)}
            >
              <div className="article-circle-badge">
                {textFor(article, article.category, 'category')}
              </div>
              <div className="network-name">
                {textFor(article, article.title, 'title')}
              </div>
              <div className="network-region">
                {textFor(article, article.date, 'date')}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (safe === 'rec_move_2x') {
    return (
      <div className="marquee-stack">
        <MarqueeRow
          items={doubled}
          sourceItems={items}
          direction="left"
          dark={dark}
          cardStyle={cardStyle}
          t={t}
          kind={kind}
        />
        <MarqueeRow
          items={[...items.slice().reverse(), ...items.slice().reverse()]}
          sourceItems={items}
          direction="right"
          dark={dark}
          cardStyle={cardStyle}
          t={t}
          kind={kind}
        />
      </div>
    )
  }

  return (
    <MarqueeRow
      items={doubled}
      sourceItems={items}
      direction="left"
      dark={dark}
      cardStyle={cardStyle}
      t={t}
      kind={kind}
    />
  )
}

function MarqueeRow({
  items,
  sourceItems,
  direction,
  dark,
  cardStyle,
  t,
  kind,
}: {
  items: SiteConfig['articles']['items']
  sourceItems: SiteConfig['articles']['items']
  direction: 'left' | 'right'
  dark?: boolean
  cardStyle: CardStyle
  t: Translator
  kind: 'articles' | 'news'
}) {
  return (
    <div className="marquee-mask">
      <div
        className={
          'marquee-track ' +
          (dark ? 'marquee-dark ' : '') +
          (direction === 'right' ? 'move-right' : 'move-left')
        }
      >
        {items.map((article, index) => {
          const sourceIndex = sourceItems.indexOf(article)
          const safeIndex = sourceIndex < 0 ? index % Math.max(1, sourceItems.length) : sourceIndex
          return (
            <article
              className="marquee-card"
              key={article.title + '-' + index}
              style={cardStyleVars(cardStyle)}
            >
              <small>{t(`${kind}.items.${safeIndex}.category`, article.category)}</small>
              <h3>{t(`${kind}.items.${safeIndex}.title`, article.title)}</h3>
              <p>{t(`${kind}.items.${safeIndex}.excerpt`, article.excerpt)}</p>
              <span>{t(`${kind}.items.${safeIndex}.date`, article.date)} · Read →</span>
            </article>
          )
        })}
      </div>
    </div>
  )
}

function ArticleCollection({
  id,
  eyebrow,
  config,
  sectionStyle,
  t,
}: {
  id: 'articles' | 'news'
  eyebrow: string
  config: SiteConfig['articles'] | SiteConfig['news']
  sectionStyle: CSSProperties
  t: Translator
}) {
  const dark = id === 'news'

  return (
    <section
      id={id}
      className={`section collection cms-section ${
        dark ? 'collection-dark' : ''
      }`}
      style={sectionStyle}
    >
      <div className="collection-head">
        <div>
          <Header
            eyebrow={eyebrow}
            title={t(`${id}.heading`, config.heading)}
          />
          <p className="lead">{t(`${id}.subtitle`, config.subtitle)}</p>
        </div>
        <a
          className="collection-link"
          href={config.viewAllHref || (id === 'news' ? '#news' : '#articles')}
        >
          View all {id}
        </a>
      </div>

      <EffectRail
        items={config.items}
        effect={config.effect || 'rec_move_left'}
        dark={dark}
        cardStyle={config.cardStyle}
        t={t}
        kind={id}
      />
    </section>
  )
}

function NetworkSection({
  config,
  sectionStyle,
  t,
}: {
  config: SiteConfig['people']
  sectionStyle: CSSProperties
  t: Translator
}) {
  const effect = config.effect || 'card effect'

  if (effect === 'circle_move_left') {
    const items = [...config.items, ...config.items]

    return (
      <section
        id="people"
        className="section soft network-section cms-section"
        style={sectionStyle}
      >
        <div className="collection-head">
          <div>
            <Header
              eyebrow="Our network"
              title={t('people.heading', config.heading)}
            />
            <p className="lead">{t('people.subtitle', config.subtitle)}</p>
          </div>
          <a className="collection-link" href={config.pageHref || '#cta'}>
            network page
          </a>
        </div>

        <div className="network-circle-mask">
          <div className="network-circle-track">
            {items.map((person, index) => {
              const sourceIndex = index % Math.max(1, config.items.length)
              return (
                <div
                  className="network-circle"
                  key={person.name + '-' + index}
                  style={cardStyleVars(config.cardStyle)}
                >
                  <div className="network-avatar">
                    {t(`people.items.${sourceIndex}.name`, person.name)
                      .split(' ')
                      .map(part => part[0])
                      .join('')}
                  </div>
                  <div className="network-name">
                    {t(`people.items.${sourceIndex}.name`, person.name)}
                  </div>
                  <div className="network-role">
                    {t(`people.items.${sourceIndex}.role`, person.role)}
                  </div>
                  <div className="network-region">
                    {t(`people.items.${sourceIndex}.region`, person.region)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section
      id="people"
      className="section soft network-section cms-section"
      style={sectionStyle}
    >
      <div className="collection-head">
        <div>
          <Header
            eyebrow="Our network"
            title={t('people.heading', config.heading)}
          />
          <p className="lead">{t('people.subtitle', config.subtitle)}</p>
        </div>
        <a className="collection-link" href={config.pageHref || '#cta'}>
          network page
        </a>
      </div>

      <div className="network-rail">
        {config.items.map((person, index) => (
          <article
            className="network-card"
            key={person.name + '-' + index}
            style={
              {
                '--card-index': index,
                ...cardStyleVars(config.cardStyle),
              } as CSSProperties
            }
          >
            <div className="network-card-number">
              {String(index + 1).padStart(2, '0')}
            </div>
            <div className="network-card-content">
              <span className="network-region">
                {t(`people.items.${index}.region`, person.region)}
              </span>
              <h3>{t(`people.items.${index}.name`, person.name)}</h3>
              <strong>{t(`people.items.${index}.role`, person.role)}</strong>
              <p>{t(`people.items.${index}.bio`, person.bio)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function PrincipleSection({
  config,
  sectionStyle,
  t,
}: {
  config: SiteConfig['philosophy']
  sectionStyle: CSSProperties
  t: Translator
}) {
  const lines = config.lines?.length
    ? config.lines
    : [
        { text: 'Principle line one', highlighted: false },
        { text: 'Principle line two', highlighted: false },
        { text: 'Principle line three', highlighted: true },
      ]

  return (
    <section
      id="philosophy"
      className="philosophy cms-section"
      style={sectionStyle}
    >
      <div className="principle-inner">
        <span className="eyebrow">
          {t('philosophy.eyebrow', config.eyebrow || 'the shelvion principle')}
        </span>
        <h2>{t('philosophy.title', config.title)}</h2>
        <div className="principle-lines">
          {lines.map((line, index) => (
            <div
              className={`principle-line ${
                line.highlighted ? 'highlighted' : ''
              }`}
              key={index}
            >
              {t(`philosophy.lines.${index}.text`, line.text)}
            </div>
          ))}
        </div>
        <p>{t('philosophy.body', config.body)}</p>
      </div>
    </section>
  )
}
