import { useMemo, useState } from 'react'
import { projects, standbySections } from './data/site'

import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Discovery from './components/Discovery'
import About from './components/About'
import WhatICreate from './components/WhatICreate'
import Statement from './components/Statement'
import SelectedWork from './components/SelectedWork'
import CtaBand from './components/CtaBand'
import CreativeRange from './components/CreativeRange'
import WhyMe from './components/WhyMe'
import Stats from './components/Stats'
import SpecWork from './components/SpecWork'
import Services from './components/Services'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ProjectModal from './components/ProjectModal'

/* A section in standby keeps its code and its content — it just isn't rendered. */
const live = (id) => !standbySections.includes(id)

export default function App() {
  /* `focus` is the discovery-bar selection. It is passed down rather than kept
     in a context because exactly five sections care about it. */
  const [focus, setFocus] = useState(null)
  const [openProject, setOpenProject] = useState(null)

  const matchCount = useMemo(
    () => (focus ? projects.filter((p) => p.tags.includes(focus)).length : projects.length),
    [focus]
  )

  return (
    <>
      <Cursor />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Discovery focus={focus} onFocus={setFocus} matchCount={matchCount} />
        <About />
        <WhatICreate focus={focus} />
        <Statement />
        <SelectedWork focus={focus} onOpen={setOpenProject} />

        <div className="pb-[var(--section-y-sm)]">
          <CtaBand
            eyebrow="Next step"
            title="Have a brand or destination"
            italic="in mind?"
            label="Let's talk"
          />
        </div>

        {live('range') ? <CreativeRange focus={focus} /> : null}
        <WhyMe />
        <Stats />
        {live('spec') ? <SpecWork focus={focus} /> : null}
        <Services focus={focus} />

        <div className="py-[var(--section-y-sm)]">
          <CtaBand
            eyebrow="Ready when you are"
            title="Create something people"
            italic="want to experience."
            label="Start a project"
          />
        </div>

        <Contact />
      </main>

      <Footer />

      <ProjectModal project={openProject} onClose={() => setOpenProject(null)} />
    </>
  )
}
