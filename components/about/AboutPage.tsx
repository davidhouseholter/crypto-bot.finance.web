import Head from 'next/head'
import {Hero} from './components/Hero'
import {Header} from './components/Header'

import {PrimaryFeatures} from './components/PrimaryFeatures'
import {SecondaryFeatures} from './components/SecondaryFeatures'
import {CallToAction} from './components/CallToAction'
import {GetStarted} from './components/GetStarted'
import {Pricing} from './components/Pricing'
import {Faqs} from './components/Faqs'

import {Footer} from './components/Footer'
import { NavBar } from './components/NavBar'

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>Crypot Bot - Passive income made simple for everyone</title>
        <meta
          name="description"
          content="Most trading requires user to understand technical indicators and market trends. We make the opposite approach for daily profit."
        />
      </Head>
      <main>
        <div  id="home-hero">
        <Hero />
        </div>
       
        <NavBar />

        <PrimaryFeatures />
        {/* <SecondaryFeatures />
        <CallToAction /> */}
        <GetStarted />
        <Pricing />
        {/* <Faqs /> */}
      </main>
      <Footer />
    </>
  )
}
