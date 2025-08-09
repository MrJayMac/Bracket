import React, { useEffect, useMemo } from 'react'
import { qualifiersFromGroups, seedBracket } from '../lib/tournament'

export default function Bracket({ groupsConfig, fixtures, bracket, setBracket, config, teams }) {
  const qualifiers = useMemo(() => {
    if (config.format === 'direct') {
      return teams || []
    }
    return qualifiersFromGroups(groupsConfig.groups, fixtures, groupsConfig.perGroup)
  }, [config.format, teams, groupsConfig, fixtures])
  
  const seeded = useMemo(()=>seedBracket(qualifiers), [qualifiers])

  // Determine the bracket structure based on team count
  const bracketStructure = useMemo(() => {
    const n = qualifiers.length
    const rounds = []
    
    if (n >= 64) rounds.push({ key: 'r64', title: 'Round of 64' })
    if (n >= 32) rounds.push({ key: 'r32', title: 'Round of 32' })
    if (n >= 16) rounds.push({ key: 'r16', title: 'Round of 16' })
    if (n >= 8) rounds.push({ key: 'qf', title: 'Quarterfinals' })
    if (n >= 4) rounds.push({ key: 'sf', title: 'Semifinals' })
    if (n >= 2) rounds.push({ key: 'f', title: 'Final' })
    
    return rounds
  }, [qualifiers.length])

  const initialRoundKey = bracketStructure[0]?.key || 'f'

  useEffect(()=>{
    if (!bracket[initialRoundKey]?.length && seeded.length) {
      const newBracket = { ...bracket }
      // Initialize all rounds as empty arrays
      bracketStructure.forEach(round => {
        newBracket[round.key] = []
      })
      // Set the initial round with seeded teams
      newBracket[initialRoundKey] = seeded
      setBracket(newBracket)
    }
  }, [seeded, initialRoundKey, bracketStructure])

  const pick = (round, id, winner) => {
    const next = { ...bracket }
    next[round] = next[round].map(m => m.id === id ? { ...m, winner } : m)
    
    // Use dynamic bracket structure instead of hardcoded order
    const roundKeys = bracketStructure.map(r => r.key)
    const ri = roundKeys.indexOf(round)
    
    console.log('Pick called:', { round, id, winner, ri, roundKeys, currentRound: next[round] })
    
    if (ri !== -1 && ri < roundKeys.length - 1) {
      const mi = next[round].findIndex(m => m.id === id)
      const team = winner === 'a' ? next[round][mi].a : next[round][mi].b
      const target = roundKeys[ri + 1]
      const tmi = Math.floor(mi / 2)
      
      console.log('Advancing to next round:', { target, mi, tmi, team })
      
      if (!next[target] || !next[target].length) {
        const needed = Math.max(1, Math.floor(next[round].length / 2))
        next[target] = Array.from({length: needed}, (_,i)=>({ id: `${target.toUpperCase()}-${i+1}`, a: null, b: null, winner: null }))
        console.log('Created next round:', target, next[target])
      }
      
      if (mi % 2 === 0) {
        next[target][tmi].a = team
        console.log('Set team A:', team.name, 'in match', tmi)
      } else {
        next[target][tmi].b = team
        console.log('Set team B:', team.name, 'in match', tmi)
      }
    }
    
    console.log('Final bracket state:', next)
    setBracket(next)
  }

  const champ = () => {
    const finalMatch = bracket.f && bracket.f[0]
    // Only declare a champion if the final match exists, has both teams, and has a winner
    if (!finalMatch || !finalMatch.a || !finalMatch.b || !finalMatch.winner) {
      return null
    }
    return finalMatch.winner === 'a' ? finalMatch.a : finalMatch.b
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="h">Knockout Bracket</h3>
        <span className="subtle">
          {config.format === 'direct' ? `${qualifiers.length} teams` : `${qualifiers.length} qualifiers from groups`}
        </span>
      </div>
      <div className="bracket">
        {bracketStructure.map(r=>(
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
