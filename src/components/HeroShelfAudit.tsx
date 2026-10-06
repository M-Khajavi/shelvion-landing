import { useEffect, useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import type { HeroBrandCalibration } from '../types/site'

const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export function HeroShelfAudit({
  image,
  brands,
  imageSize,
}: {
  image: string
  brands: HeroBrandCalibration[]
  imageSize: number
}) {
  const [brandIndex, setBrandIndex] = useState(0)
  const [stage, setStage] = useState<'scanning' | 'brand'>('scanning')
  const [productIndex, setProductIndex] = useState(-1)
  const [brandText, setBrandText] = useState('')
  const [productText, setProductText] = useState('')

  const safeBrandIndex =
    brands.length > 0
      ? Math.min(brandIndex, brands.length - 1)
      : 0

  const brand = brands[safeBrandIndex]
  const product = brand?.products[productIndex]

  const spotStyle = useMemo<CSSProperties>(() => {
    if (!brand) return {}

    return {
      '--spot-x': `${brand.area.x}%`,
      '--spot-y': `${brand.area.y}%`,
      '--spot-r': `${100 - brand.area.x - brand.area.w}%`,
      '--spot-b': `${100 - brand.area.y - brand.area.h}%`,
    } as CSSProperties
  }, [brand])

  useEffect(() => {
    if (!brand || brands.length === 0) return

    let cancelled = false

    const typeLines = async (
      lines: string[],
      setter: (value: string) => void,
      speed: number,
    ) => {
      const output: string[] = []

      for (const line of lines) {
        let current = ''

        for (let i = 1; i <= line.length; i += 1) {
          if (cancelled) return

          current = line.slice(0, i)
          setter([...output, current].join('\n'))

          await sleep(speed)
        }

        output.push(line)
      }

      setter(output.join('\n'))
    }

    const run = async () => {
      setStage('scanning')
      setProductIndex(-1)
      setBrandText('')
      setProductText('')

      await sleep(1900)
      if (cancelled) return

      setStage('brand')

      await Promise.all([
        typeLines(
          [`Brand: ${brand.name}`, `Facing(s): ${brand.facing}`],
          setBrandText,
          28,
        ),
        sleep(1300),
      ])

      if (cancelled) return

      for (let i = 0; i < brand.products.length; i += 1) {
        if (cancelled) return

        setProductIndex(i)
        setProductText('')

        await typeLines(
          [
            `Brand: ${brand.name}`,
            `Name/Variant: ${brand.products[i].variant}`,
            'Facing(s): 1',
          ],
          setProductText,
          22,
        )

        await sleep(1120)

        setProductIndex(-1)
        setProductText('')
        await sleep(140)
      }

      if (cancelled) return

      /*
        No total report here.
        After the current brand finishes, move directly to
        the next brand. After the last brand, this wraps to
        the first brand and starts the cycle again.
      */
      setStage('scanning')
      await sleep(760)

      if (cancelled) return

      const next = (safeBrandIndex + 1) % brands.length
      setBrandIndex(next)
    }

    void run()

    return () => {
      cancelled = true
    }
  }, [brand, brands, safeBrandIndex])

  if (!brand) return null

  return (
    <div
      className="hero-audit-wrap"
      style={{
        width: `${imageSize}%`,
        height: 'auto',
        aspectRatio: '16 / 9',
      }}
    >
      <div
        className={`hero-audit-frame ${stage === 'scanning' ? 'scanning' : ''}`}
        style={{
          '--brand-color': brand.color,
          ...spotStyle,
        } as CSSProperties}
      >
        <img
          className="hero-audit-img"
          src={image}
          alt=""
        />

        <div className="hero-audit-dim" />

        <div className="hero-audit-spotlight">
          <img src={image} alt="" />
        </div>

        <div className="hero-audit-scan" />

        <div className="hero-audit-status">
          {stage === 'scanning'
            ? 'SCANNING SHELF...'
            : 'ANALYSING PRODUCTS...'}
        </div>

        <div
          className={`hero-audit-box ${stage === 'brand' ? 'active' : ''}`}
          style={{
            left: `${brand.area.x}%`,
            top: `${brand.area.y}%`,
            width: `${brand.area.w}%`,
            height: `${brand.area.h}%`,
          }}
        >
          <span className="corner-tr" />
          <span className="corner-bl" />
        </div>

        <div
          className={`hero-audit-brand-card ${stage === 'brand' ? 'show' : ''}`}
        >
          <div className="hero-audit-card-label">
            Detected brand
          </div>

          <div className="hero-audit-card-value">
            {(brandText || `Brand: ${brand.name}`)
              .split('\n')
              .map((line, i) => (
                <div key={i}>{line}</div>
              ))}
          </div>
        </div>

        {product && stage === 'brand' && (
          <>
            <div
              className="hero-audit-product-marker show"
              style={{
                left: `${product.x}%`,
                top: `${product.y}%`,
                width: `${product.w}%`,
                height: `${product.h}%`,
              }}
            />

            <div
              className="hero-audit-product-card show"
              style={{
                left: `${Math.min(
                  64,
                  Math.max(2, product.x + product.w + 1),
                )}%`,
                top: `${Math.min(
                  76,
                  Math.max(5, product.y - 2),
                )}%`,
              }}
            >
              {productText.split('\n').map((line, i) => (
                <div key={i}>{line}</div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
