export const defaultTeams = Array.from({length: 32}, (_, i) => ({ id: i+1, name: `Team ${i+1}` }))

export const groupTeams = (teams, groupSize = 4) => {
  const groups = []
  for (let i = 0; i < teams.length; i += groupSize) groups.push(teams.slice(i, i + groupSize))
  return groups
}

export const generateGroupFixtures = group => {
  const fixtures = []
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      fixtures.push({ a: group[i], b: group[j], winner: null, id: `${group[i].id}-${group[j].id}` })
    }
  }
  return fixtures
}

export const groupTable = (group, fixtures) => {
  const table = group.map(t => ({ team: t, wins: 0 }))
  const idx = id => table.findIndex(r => r.team.id === id)
  fixtures.forEach(m => {
    if (!m.winner) return
    const w = m.winner === 'a' ? m.a.id : m.b.id
    table[idx(w)].wins += 1
  })
  table.sort((x, y) => y.wins - x.wins || x.team.name.localeCompare(y.team.name))
  return table
}

export const qualifiersFromGroups = (groups, allFixtures, perGroup = 2) => {
  const q = []
  groups.forEach((g, gi) => {
    const fixtures = allFixtures[gi] || []
    const table = groupTable(g, fixtures)
    q.push(...table.slice(0, perGroup).map(r => r.team))
  })
  return q
}

export const seedBracket = teams => {
  const n = teams.length
  const slots = []
  for (let i = 0; i < n/2; i++) slots.push([teams[i], teams[n-1-i]])
  
  // Determine the round name based on team count
  let roundName = 'R16'
  if (n >= 64) roundName = 'R64'
  else if (n >= 32) roundName = 'R32'
  else if (n >= 16) roundName = 'R16'
  else if (n >= 8) roundName = 'R8'
  else if (n >= 4) roundName = 'R4'
  else roundName = 'R2'
  
  return slots.map((pair, i) => ({ id: `${roundName}-${i+1}`, a: pair[0] || null, b: pair[1] || null, winner: null }))
}
