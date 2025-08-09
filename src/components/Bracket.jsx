import React, { useEffect, useMemo } from 'react'
import { qualifiersFromGroups, seedBracket } from '../lib/tournament'

export default function Bracket({ groupsConfig, fixtures, bracket, setBracket }) {
  const qualifiers = useMemo(()=>qualifiersFromGroups(groupsConfig.groups, fixtures, groupsConfig.perGroup), [groupsConfig, fixtures])
  const seeded = useMemo(()=>seedBracket(qualifiers), [qualifiers])

  useEffect(()=>{
    if (!bracket.r16.length && seeded.length) setBracket({ ...bracket, r16: seeded })
  }, [seeded])

  const pick = (round, id, winner) => {
    const next = { ...bracket }
    next[round] = next[round].map(m => m.id === id ? { ...m, winner } : m)
    const order = ['r16','qf','sf','f']
    const ri = order.indexOf(round)
    if (ri !== -1 && ri < order.length - 1) {
      const mi = next[round].findIndex(m => m.id === id)
      const team = winner === 'a' ? next[round][mi].a : next[round][mi].b
      const target = order[ri+1]
      const tmi = Math.floor(mi / 2)
      if (!next[target] || !next[target].length) {
        const needed = Math.max(1, Math.floor(next[round].length / 2))
        next[target] = Array.from({length: needed}, (_,i)=>({ id: `${target.toUpperCase()}-${i+1}`, a: null, b: null, winner: null }))
      }
      if (mi % 2 === 0) next[target][tmi].a = team
      else next[target][tmi].b = team
    }
    setBracket(next)
  }

  const champ = () => {
    const m = bracket.f[0]
    if (!m || !m.winner) return null
    return m.winner === 'a' ? m.a : m.b
  }

  const rounds = [
    { key: 'r16', title: 'Round of 16' },
    { key: 'qf', title: 'Quarterfinals' },
    { key: 'sf', title: 'Semifinals' },
    { key: 'f', title: 'Final' }
  ]

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="h">Knockout Bracket</h3>
      </div>
      <div className="bracket">
        {rounds.map(r=>(
          <div key={r.key} className="round">
            <div className="subtle">{r.title}</div>
            {(bracket[r.key] || []).map(m=>(
              <div key={m.id} className="match">
                <div className="teams">
                  <button className={m.winner==='a'?'team-btn active':'team-btn'} onClick={()=>pick(r.key, m.id, 'a')}>
                    <div>{m.a?m.a.name:'TBD'}</div><div className="tag">Win</div>
                  </button>
                  <button className={m.winner==='b'?'team-btn active':'team-btn'} onClick={()=>pick(r.key, m.id, 'b')}>
                    <div>{m.b?m.b.name:'TBD'}</div><div className="tag">Win</div>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="panel" style={{marginTop:12}}>
        <div className="row space">
          <div className="h">Champion</div>
          <div className="badge">{champ()?.name || 'TBD'}</div>
        </div>
      </div>
    </div>
  )
}
