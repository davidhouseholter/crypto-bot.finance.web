import Image from 'next/image'

import { Container } from './Container'
import { ShieldExclamationIcon } from '@heroicons/react/outline'
import { GridPattern } from '../../about1/components/GridPattern'
const testimonials = [
  [
    {
      content:
        'Connected to any supported exchanges including: Coinbase, KuiCoin, AlpachaFinance, and more.',
      author: {
        name: 'Add Exchange',
        role: 'or just use the test bots',
        image: ShieldExclamationIcon,
      },
    },
   
  ],

  [
    {
      content:
        'Get started quickly by selecting from a list of recommendations or from any of the supported pairs.',
      author: {
        name: 'Create Trade Bot',
        role: 'we support any pairs that the exchange supports.',
        image: ShieldExclamationIcon,
      },
    },
   
  ],
  [
    {
      content:
        'You trade bot do al the hard work while you sleep and earn on average x% of profit.',
      author: {
        name: 'Earn Passive Income Automatically',
        role: 'watch your profit grow',
        image: ShieldExclamationIcon,
      },
    },
   
  ],

]


export function GetStarted() {
  return (
    <section
      id="get-started"
      aria-label="What our customers are saying"
      className="bg-slate-50 py-20 sm:py-32 relative"
    >
        <div className="text-slate-900/10">
        <GridPattern x="50%" patternTransform="translate(0 80)" />
      </div>
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Getting started with a few easy steps.
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Our software is simple that people can’t help but fall in love
            with it.
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <li key={testimonialIndex}>
                    <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                      <blockquote className="relative">
                        <p className="text-lg tracking-tight text-slate-900">
                          {testimonial.content}
                        </p>
                      </blockquote>
                      <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                        <div>
                          <div className="font-display text-base text-slate-900">
                            {testimonial.author.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {testimonial.author.role}
                          </div>
                        </div>
                        <div className="overflow-hidden rounded-full bg-slate-50">
                          {testimonial.image}
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
