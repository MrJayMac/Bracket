import React from 'react'

export default function Header({ tab, setTab, onReset }) {
  return (
    <div className="header">
      <div className="brand"><span className="brand-dot"></span> Bracket App</div>
      <div className="tabs">
        <button className={tab==='setup'?'tab active':'tab'} onClick={()=>setTab('setup')}>Setup</button>
        <button className={tab==='groups'?'tab active':'tab'} onClick={()=>setTab('groups')}>Group Stage</button>
        <button className={tab==='bracket'?'tab active':'tab'} onClick={()=>setTab('bracket')}>Bracket</button>
      </div>
      <div className="footer">
        <kbd className="kbd">⌘</kbd><span className="helper">+</span><kbd className="kbd">S</kbd><span className="helper">to save</span>
        <button className="btn ghost" onClick={onReset}>Reset</button>
      </div>
    </div>
  )
}
