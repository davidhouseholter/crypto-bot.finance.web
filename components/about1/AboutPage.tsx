import Head from 'next/head'

import { Footer } from './components/Footer'
import { FreeChapters } from './components/FreeChapters'
import { Hero } from './components/Hero'
import { Introduction } from './components/Introduction'
import { NavBar } from './components/NavBar'
import { Pricing } from './components/Pricing'
import { Resources } from './components/Resources'
import { Screencasts } from './components/Screencasts'
import { TableOfContents } from './components/TableOfContents'
import { Testimonial } from './components/Testimonial'
import avatarImage1 from './images/avatar-3.png'
import avatarImage2 from './images/avatar-4.png'

export default function AboutPageComponent() {
  return (
    <>
      <Head>
        <title>
         Cryoto Bot Finance
        </title>
        <meta
          name="description"
          content="A hands free of a trading "
        />
      </Head>
      <Hero />


      <NavBar />
      <Introduction />
      <NavBar />
      <Testimonial
        id="testimonial-from-tommy-stroman"
        author={{
          name: 'Tommy Stroman',
          role: 'Front-end developer',
          image: avatarImage1,
        }}
      >
        <p>
          “I didn’t know a thing about icon design until I read this book. Now I
          can create any icon I need in no time. Great resource!”
        </p>
      </Testimonial>
      <Screencasts />
      <Testimonial
        id="testimonial-from-gerardo-stark"
        author={{
          name: 'Gerardo Stark',
          role: 'Creator of Pandemicons',
          image: avatarImage2,
        }}
      >
        <p>
          “I’ve tried to create my own icons in the past but quickly got
          frustrated and gave up. Now I sell my own custom icon sets online.”
        </p>
      </Testimonial>
      <Resources />
      <FreeChapters />
      <Pricing />
    
      <Footer />
    </>
  )
}
