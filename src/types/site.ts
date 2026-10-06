export type EffectType = 'card effect' | 'rec_move_left' | 'rec_move_2x' | 'circle_move_left'
export type SectionType = 'hero' | 'stats' | 'steps' | 'ticker' | 'report' | 'segments' | 'blocks' | 'articles' | 'news' | 'people' | 'philosophy' | 'cta' | 'footer'
export type MenuPlacement = 'normal' | 'bottom'
export type MenuVariant = 'link' | 'button'
export type CardShadow = 'none' | 'soft' | 'strong'

/**
 * Translation storage is keyed by a stable-ish content path and then by language code.
 * The base value remains in the normal config field for the configured default language.
 */
export type TranslationMap = Record<string, Record<string, string>>

export interface SectionAppearance {
  backgroundColor: string
  fontColor: string
}

export interface SectionMenu {
  enabled: boolean
  label: string
  placement: MenuPlacement
  variant: MenuVariant
}

export interface Section {
  id: string
  type: SectionType
  label: string
  enabled: boolean
  appearance: SectionAppearance
  menu: SectionMenu
}

export interface Stat { value: string; label: string }
export interface Step { title: string; body: string; icon: string }
export interface Finding { category: string; finding: string; status: 'ok' | 'warn' | 'critical'; statusText: string }
export interface Segment { title: string; description: string; bullets: string[]; icon: string }
export interface ContentBlock { title: string; eyebrow: string; body: string; image: string; layout: 'left' | 'right' | 'none'; background: 'white' | 'paper' | 'dark' }
export interface Article { title: string; category: string; excerpt: string; date: string }
export interface Person { name: string; role: string; region: string; bio: string }
export interface PrincipleLine { text: string; highlighted: boolean }

export interface HeroProductCalibration {
  variant: string
  x: number
  y: number
  w: number
  h: number
}

export interface HeroBrandCalibration {
  name: string
  facing: number
  color: string
  area: { x: number; y: number; w: number; h: number }
  products: HeroProductCalibration[]
}

export interface CardStyle {
  backgroundColor: string
  fontColor: string
  fontSize: number
  borderWidth: number
  borderColor: string
  borderRadius: number
  padding: number
  shadow: CardShadow
}

export interface HeroButton {
  enabled: boolean
  label: string
  href: string
}

export interface HeaderLogin {
  enabled: boolean
  label: string
  href: string
  variant: MenuVariant
}

export interface HeaderLanguage {
  enabled: boolean
  options: string[]
  defaultLanguage: string
}

export interface HeaderConfig {
  login: HeaderLogin
  language: HeaderLanguage
}

export interface AdminConfig {
  enabled: boolean
  showCtaButton: boolean
  showFooterButton: boolean
  requireLogin: boolean
}

export interface SiteConfig {
  brand: { name: string; tagline: string; logo: string }
  theme: { primary: string; secondary: string; ink: string; paper: string; grey: string; accent: string; dark: string; headerFooter: string }
  nav: { label: string; href: string }[]
  header: HeaderConfig
  admin: AdminConfig
  translations: TranslationMap
  sections: Section[]
  hero: {
    eyebrow: string
    title: string
    subtitle: string
    primaryButton: HeroButton
    secondaryButton: HeroButton
    /** Legacy string fields retained so older JSON can still be hydrated. */
    primaryCta?: string
    secondaryCta?: string
    image: string
    imageSize: number
    titleSize: number
    textColor: string
    textY: number
    calibration: HeroBrandCalibration[]
  }
  stats: Stat[]
  steps: Step[]
  findings: Finding[]
  report: { title: string; store: string; category: string; metrics: { label: string; value: string }[] }
  segments: Segment[]
  blocks: ContentBlock[]
  articles: { heading: string; subtitle: string; effect: EffectType; cardStyle: CardStyle; viewAllHref: string; items: Article[] }
  news: { heading: string; subtitle: string; effect: EffectType; cardStyle: CardStyle; viewAllHref: string; items: Article[] }
  people: { heading: string; subtitle: string; effect: EffectType; cardStyle: CardStyle; pageHref: string; items: Person[] }
  philosophy: { eyebrow: string; title: string; body: string; lines: PrincipleLine[] }
  cta: { title: string; body: string; button: string }
  footer: string
}
