export const save = (k, v) => localStorage.setItem(k, JSON.stringify(v))
export const load = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } }
