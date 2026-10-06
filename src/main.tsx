import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import { defaultConfig } from './data/defaultConfig'
import type { SiteConfig } from './types/site'
import { PublicSite } from './components/PublicSite'
import { AdminLogin } from './components/AdminLogin'

const KEY = 'reusable-site-cms-config'

function hydrate(raw: Partial<SiteConfig> | null): SiteConfig {
  if (!raw) return defaultConfig

  const savedFooterAppearance = (raw.sections || []).find(
    item => item.id === 'footer' || item.type === 'footer',
  )?.appearance

  const headerFooterColor =
    raw.theme?.headerFooter ||
    savedFooterAppearance?.backgroundColor ||
    defaultConfig.theme.headerFooter

  const legacyPrimaryLabel = raw.hero?.primaryCta || defaultConfig.hero.primaryButton.label
  const legacySecondaryLabel = raw.hero?.secondaryCta || defaultConfig.hero.secondaryButton.label

  return {
    ...defaultConfig,
    ...raw,
    brand: {
      ...defaultConfig.brand,
      ...(raw.brand || {}),
    },
    admin: {
      ...defaultConfig.admin,
      ...(raw.admin || {}),
    },
    header: {
      ...defaultConfig.header,
      ...(raw.header || {}),
      login: {
        ...defaultConfig.header.login,
        ...(raw.header?.login || {}),
      },
      language: {
        ...defaultConfig.header.language,
        ...(raw.header?.language || {}),
        options:
          raw.header?.language?.options?.length
            ? raw.header.language.options
            : defaultConfig.header.language.options,
      },
    },
    translations: {
      ...defaultConfig.translations,
      ...(raw.translations || {}),
    },
    theme: {
      ...defaultConfig.theme,
      ...(raw.theme || {}),
      headerFooter: headerFooterColor,
    },
    hero: {
      ...defaultConfig.hero,
      ...(raw.hero || {}),
      primaryButton: {
        ...defaultConfig.hero.primaryButton,
        ...(raw.hero?.primaryButton || {}),
        label:
          raw.hero?.primaryButton?.label || legacyPrimaryLabel,
      },
      secondaryButton: {
        ...defaultConfig.hero.secondaryButton,
        ...(raw.hero?.secondaryButton || {}),
        label:
          raw.hero?.secondaryButton?.label || legacySecondaryLabel,
      },
      calibration: (raw.hero?.calibration || defaultConfig.hero.calibration).map((brand, brandIndex) => ({
        ...defaultConfig.hero.calibration[brandIndex % defaultConfig.hero.calibration.length],
        ...brand,
        area: {
          ...defaultConfig.hero.calibration[brandIndex % defaultConfig.hero.calibration.length].area,
          ...(brand.area || {}),
        },
        products: (brand.products || defaultConfig.hero.calibration[brandIndex % defaultConfig.hero.calibration.length].products || []).map((product, productIndex) => ({
          ...defaultConfig.hero.calibration[brandIndex % defaultConfig.hero.calibration.length].products[productIndex % Math.max(1, defaultConfig.hero.calibration[brandIndex % defaultConfig.hero.calibration.length].products.length)],
          ...product,
        })),
      })),
    },
    steps: (raw.steps || defaultConfig.steps).map((item, index) => ({
      ...defaultConfig.steps[index % defaultConfig.steps.length],
      ...item,
      icon:
        item.icon || defaultConfig.steps[index % defaultConfig.steps.length].icon,
    })),
    segments: (raw.segments || defaultConfig.segments).map((item, index) => ({
      ...defaultConfig.segments[index % defaultConfig.segments.length],
      ...item,
      icon:
        item.icon || defaultConfig.segments[index % defaultConfig.segments.length].icon,
      bullets: item.bullets || [],
    })),
    articles: {
      ...defaultConfig.articles,
      ...(raw.articles || {}),
      viewAllHref:
        raw.articles?.viewAllHref || defaultConfig.articles.viewAllHref,
      cardStyle: {
        ...defaultConfig.articles.cardStyle,
        ...(raw.articles?.cardStyle || {}),
      },
      items: raw.articles?.items || defaultConfig.articles.items,
    },
    news: {
      ...defaultConfig.news,
      ...(raw.news || {}),
      viewAllHref:
        raw.news?.viewAllHref || defaultConfig.news.viewAllHref,
      cardStyle: {
        ...defaultConfig.news.cardStyle,
        ...(raw.news?.cardStyle || {}),
      },
      items: raw.news?.items || defaultConfig.news.items,
    },
    people: {
      ...defaultConfig.people,
      ...(raw.people || {}),
      pageHref:
        raw.people?.pageHref || defaultConfig.people.pageHref,
      cardStyle: {
        ...defaultConfig.people.cardStyle,
        ...(raw.people?.cardStyle || {}),
      },
      items: raw.people?.items || defaultConfig.people.items,
    },
    sections: defaultConfig.sections.map(section => {
      const saved = (raw.sections || []).find(item => item.id === section.id)
      return {
        ...section,
        ...(saved || {}),
        appearance: {
          ...section.appearance,
          ...(saved?.appearance || {}),
          ...(section.type === 'footer'
            ? { backgroundColor: headerFooterColor }
            : {}),
        },
        menu: {
          ...section.menu,
          ...(saved?.menu || {}),
        },
      }
    }),
  }
}

function App() {
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      return hydrate(
        JSON.parse(localStorage.getItem(KEY) || 'null') as
          | Partial<SiteConfig>
          | null,
      )
    } catch {
      return defaultConfig
    }
  })

  const [admin, setAdmin] = useState(location.hash === '#admin')

  useEffect(() => {
    const handleHashChange = () =>
      setAdmin(location.hash === '#admin')

    addEventListener('hashchange', handleHashChange)
    return () => removeEventListener('hashchange', handleHashChange)
  }, [])

  const save = (nextConfig: SiteConfig) => {
    const next = hydrate(nextConfig)
    setConfig(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  return admin ? (
    <AdminLogin
      config={config}
      onChange={save}
      onPublic={() => {
        location.hash = ''
      }}
    />
  ) : (
    <PublicSite
      config={config}
      onAdmin={() => {
        location.hash = 'admin'
      }}
    />
  )
}

createRoot(document.getElementById('root')!).render(<App />)
