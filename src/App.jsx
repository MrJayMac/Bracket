import React, { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Setup from './components/Setup'
import Groups from './components/Groups'
import Bracket from './components/Bracket'
import { groupTeams } from './lib/tournament'
import { save, load } from './lib/storage'

export default function App() {
  const [tab, setTab] = useState('setup')
  const [config, setConfig] = useState(load('cfg', { teamCount: 32, groupSize: 4, perGroup: 2 }))
  const [teams, setTeams] = useState(load('teams', Array.from({length: config.teamCount}, (_,i)=>({id:i+1, name:`Team ${i+1}`}))))
  const [fixtures, setFixtures] = useState(load('fixtures', []))
  const [bracket, setBracket] = useState(load('bracket', { r16: [], qf: [], sf: [], f: [] }))

  const groups = useMemo(()=>groupTeams(teams, config.groupSize), [teams, config])

  useEffect(()=>{
    const onKey = e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        save('cfg', config); save('teams', teams); save('fixtures', fixtures); save('bracket', bracket)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [config, teams, fixtures, bracket])

  const reset = () => {
    setConfig({ teamCount: 32, groupSize: 4, perGroup: 2 })
    setTeams(Array.from({length: 32}, (_,i)=>({id:i+1, name:`Team ${i+1}`})))
    setFixtures([])
    setBracket({ r16: [], qf: [], sf: [], f: [] })
    localStorage.clear()
    setTab('setup')
  }

  useEffect(()=>{
    setBracket({ r16: [], qf: [], sf: [], f: [] })
  }, [fixtures, config.perGroup])

  const groupsConfig = useMemo(()=>({ groups, perGroup: config.perGroup }), [groups, config])

  return (
    <div className="app">
      <Header tab={tab} setTab={setTab} onReset={reset} />
      <div className="container">
        {tab === 'setup' && <Setup config={config} setConfig={setConfig} setTeams={setTeams} teams={teams} />}
        {tab === 'groups' && <Groups teams={teams} groupSize={config.groupSize} fixtures={fixtures} setFixtures={setFixtures} />}
        {tab === 'bracket' && <Bracket groupsConfig={groupsConfig} fixtures={fixtures} bracket={bracket} setBracket={setBracket} />}
      </div>
    </div>
  )
}
