import Link from 'next/link'

import { CheckIcon } from './CheckIcon'
import { Container } from './Container'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pt-10 pb-16 sm:pb-20 md:pt-36 lg:py-32"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
          Hassle Free Automatic Trading
        </p>
        <p className="mt-4">
        You get hassle-free automated algorithmic-trading without worrying about any technical indicators or constantly watching the market status.
        </p>
       
        <ul role="list" className="mt-8 space-y-3">
          {[
            'Use CryptoBot securely with the full confidence of your exchange. Specify your limitations while connecting your Exchange API.',
            'Easily track your past positions and the performance of your trading bots. Always stay up to date about your CrytpoBot performance.',
            'Translating icons from an outline style to a solid style',
            'Identifying the characteristics that make an icon set cohesive',
            'Figma features and keyboard shortcuts to speed up your workflow',
          ].map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <span className="ml-4">{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          By the end of the book, you’ll have all the confidence you need to dig
          in and start creating beautiful icons that can hold their own against
          any of the sets you can find online.
        </p>
        <p className="mt-10">
          <Link
            href="/"
            className="text-base font-medium text-blue-600 hover:text-blue-800"
          >
           <> Get two free chapters straight to your inbox
            <span aria-hidden="true">&rarr;</span></>
          </Link>
        </p>
      </Container>
    </section>
  )
}
