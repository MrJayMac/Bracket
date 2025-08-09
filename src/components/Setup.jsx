import React, { useState, useMemo } from 'react'
import { defaultTeams, groupTeams } from '../lib/tournament'

export default function Setup({ config, setConfig, setTeams, teams }) {
  const [teamCount, setTeamCount] = useState(config.teamCount || 32)
  const [groupSize, setGroupSize] = useState(config.groupSize || 4)
  const [perGroup, setPerGroup] = useState(config.perGroup || 2)
  const [format, setFormat] = useState(config.format || 'groups')
  const canUse = [16, 24, 32, 40, 48, 64]
  const list = useMemo(()=>{
    if (teams.length === teamCount) return teams
    return defaultTeams.slice(0, teamCount)
  }, [teamCount, teams])

  const apply = () => {
    const t = list.map((t,i)=>({ id: i+1, name: t.name }))
    setTeams(t)
    setConfig({ teamCount, groupSize, perGroup, format })
  }

  const updateTeam = (i, name) => {
    const next = [...list]
    next[i] = { ...next[i], name }
    setTeams(next)
  }

  const groups = groupTeams(list, groupSize)

  return (
    <div className="panel">
      <div className="panel-header">
        <h3 className="h">Tournament Setup</h3>
        <span className="subtle">Configure teams and grouping</span>
      </div>
      <div className="grid cols-3">
        <div className="card">
          <div className="row">
            <label className="subtle">Tournament Format</label>
            <select className="select" value={format} onChange={e=>setFormat(e.target.value)}>
              <option value="groups">Group Stage + Bracket</option>
              <option value="direct">Direct Bracket</option>
            </select>
          </div>
          <div className="row">
            <label className="subtle">Teams</label>
            <select className="select" value={teamCount} onChange={e=>setTeamCount(Number(e.target.value))}>
              {canUse.map(n=><option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          {format === 'groups' && (
            <>
              <div className="row">
                <label className="subtle">Group Size</label>
                <select className="select" value={groupSize} onChange={e=>setGroupSize(Number(e.target.value))}>
                  {[4,5,6,8].map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="row">
                <label className="subtle">Qualifiers / Group</label>
                <select className="select" value={perGroup} onChange={e=>setPerGroup(Number(e.target.value))}>
                  {[1,2,3,4].map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </>
          )}
          <button className="btn" onClick={apply}>Apply</button>
        </div>
        <div className="card">
          {format === 'groups' ? (
            <>
              <div className="row space">
                <div className="subtle">Groups</div>
                <div className="badge">{groups.length} groups</div>
              </div>
              <div className="grid cols-2">
                {groups.map((g, i)=>(
                  <div key={i} className="panel">
                    <div className="row space"><div className="h">Group {String.fromCharCode(65+i)}</div><div className="badge">{g.length}</div></div>
                    <div className="grid">
                      {g.map((t, idx)=>(
                        <input key={t.id} className="input" value={t.name} onChange={e=>updateTeam((i*groupSize)+idx, e.target.value)} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="row space">
                <div className="subtle">Teams</div>
                <div className="badge">{list.length} teams</div>
              </div>
              <div className="grid cols-2" style={{maxHeight: '400px', overflowY: 'auto'}}>
                {list.map((t, i)=>(
                  <input key={t.id} className="input" value={t.name} onChange={e=>updateTeam(i, e.target.value)} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="card">
          <div className="subtle">Shortcuts</div>
          <div className="grid">
            <button className="btn ghost" onClick={()=>{ setTeams(defaultTeams.slice(0, teamCount)); }}>Fill Default Names</button>
            <button className="btn ghost" onClick={()=>{ setTeams(Array.from({length: teamCount}, (_,i)=>({id:i+1, name:''}))); }}>Clear All Names</button>
            <div className="helper">{format === 'groups' ? 'Order determines initial group assignment' : 'Order determines bracket seeding'}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
