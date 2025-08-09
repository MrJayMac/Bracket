import React, { useMemo } from 'react'
import { groupTeams, generateGroupFixtures, groupTable } from '../lib/tournament'

export default function Groups({ teams, groupSize, fixtures, setFixtures }) {
  const groups = useMemo(()=>groupTeams(teams, groupSize), [teams, groupSize])
  const ensure = gi => {
    if (fixtures[gi]) return fixtures[gi]
    const f = generateGroupFixtures(groups[gi])
    const next = [...fixtures]
    next[gi] = f
    setFixtures(next)
    return f
  }

  const setWinner = (gi, id, winner) => {
    const next = [...fixtures]
    const g = ensure(gi).map(m => m.id === id ? { ...m, winner } : m)
    next[gi] = g
    setFixtures(next)
  }

  return (
    <div className="hscroll">
      {groups.map((g, gi)=>{
        const f = ensure(gi)
        const table = groupTable(g, f)
        return (
          <div key={gi} className="panel" style={{minWidth: 420}}>
            <div className="panel-header">
              <h3 className="h">Group {String.fromCharCode(65+gi)}</h3>
              <span className="subtle">{g.length} teams</span>
            </div>
            <div className="grid">
              <div className="card">
                <div className="subtle" style={{marginBottom:8}}>Matches</div>
                <div className="grid">
                  {f.map(m=>(
                    <div key={m.id} className="match">
                      <div className="row space"><div className="subtle">Match</div><div className="badge small">{m.id}</div></div>
                      <div className="teams">
                        <button className={m.winner==='a'?'team-btn active':'team-btn'} onClick={()=>setWinner(gi, m.id, 'a')}>
                          <div>{m.a.name}</div><div className="tag">Win</div>
                        </button>
                        <button className={m.winner==='b'?'team-btn active':'team-btn'} onClick={()=>setWinner(gi, m.id, 'b')}>
                          <div>{m.b.name}</div><div className="tag">Win</div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <div className="subtle" style={{marginBottom:8}}>Current Order</div>
                <div className="grid">
                  {table.map((r,i)=>(
                    <div key={r.team.id} className="row space">
                      <div>{i<2?'✓ ':''}{r.team.name}</div>
                      <div className="badge small">{r.wins} wins</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
