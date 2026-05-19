import { useState, useEffect } from 'react'

// ============================================================
// Card definitions
// ============================================================

const CARDS = {
  csp: { name: 'Sapphire Preferred',   short: 'CSP', color: '#1d3a5f' },
  cfu: { name: 'Freedom Unlimited',    short: 'CFU', color: '#2d5d3a' },
  ue:  { name: 'United Explorer',      short: 'UE',  color: '#b8431f' },
  nfa: { name: 'NavFed More Rewards',  short: 'NFA', color: '#5c2c8a' },
}

const CATEGORIES = [
  { id: 'groceries_store',  label: 'Groceries (in-store)',  rates: { csp: 1,    cfu: 1.5, ue: 1, nfa: 3   } },
  { id: 'groceries_online', label: 'Groceries (online)',    rates: { csp: 3,    cfu: 1.5, ue: 1, nfa: 3   } },
  { id: 'gas',              label: 'Gas',                   rates: { csp: 1,    cfu: 1.5, ue: 1, nfa: 3   } },
  { id: 'dining',           label: 'Dining / restaurants',  rates: { csp: 3,    cfu: 3,   ue: 2, nfa: 3   } },
  { id: 'transit',          label: 'Transit / rideshare',   rates: { csp: 2,    cfu: 1.5, ue: 1, nfa: 3   } },
  { id: 'united',           label: 'United Airlines',       rates: { csp: 2,    cfu: 1.5, ue: 9, nfa: 1   } },
  { id: 'hotels_direct',    label: 'Hotels (direct)',       rates: { csp: 2,    cfu: 1.5, ue: 2, nfa: 1   } },
  { id: 'other_travel',     label: 'Other travel',          rates: { csp: 2,    cfu: 1.5, ue: 1, nfa: 1   } },
  { id: 'chase_travel',     label: 'Chase Travel portal',   rates: { csp: 5,    cfu: 5,   ue: 1, nfa: 1   } },
  { id: 'streaming',        label: 'Streaming services',    rates: { csp: 3,    cfu: 1.5, ue: 1, nfa: 1   } },
  { id: 'drugstores',       label: 'Drugstores',            rates: { csp: 1,    cfu: 3,   ue: 1, nfa: 1   } },
  { id: 'foreign',          label: 'Abroad (foreign txn)',  rates: { csp: 1,    cfu: -1.5,ue: 1, nfa: 1   }, note: 'CFU has 3% FTX fee — effective -1.5% net' },
  { id: 'other',            label: 'Everything else',       rates: { csp: 1,    cfu: 1.5, ue: 1, nfa: 1   } },
]

function bestCardFor(catId) {
  const cat = CATEGORIES.find(c => c.id === catId)
  if (!cat) return null
  let best = 'cfu', bestRate = cat.rates.cfu
  for (const k of Object.keys(cat.rates)) {
    if (cat.rates[k] > bestRate) { bestRate = cat.rates[k]; best = k }
  }
  return { card: best, rate: bestRate }
}

function fmt(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

const STORAGE_KEY = 'cards_dashboard_transactions'

// ============================================================
// Styles
// ============================================================

const S = {
  body: {
    fontFamily: '"Fraunces", Georgia, serif',
    background: '#f4efe6',
    color: '#1a1614',
    minHeight: '100vh',
    padding: '24px 16px 80px',
  },
  wrap: { maxWidth: '720px', margin: '0 auto' },
  header: {
    borderTop: '4px double #2a2420',
    borderBottom: '1px solid #2a2420',
    padding: '20px 0 16px',
    marginBottom: '24px',
    position: 'relative',
  },
  eyebrow: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color: '#6b6259',
    marginBottom: '10px',
  },
  h1: {
    fontFamily: '"Fraunces", serif',
    fontWeight: 800,
    fontSize: 'clamp(28px, 8vw, 48px)',
    lineHeight: 0.95,
    letterSpacing: '-0.02em',
    fontStyle: 'italic',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    marginBottom: '24px',
    borderBottom: '1px solid #2a2420',
    flexWrap: 'wrap',
  },
  tab: (active) => ({
    flex: '1 1 auto',
    padding: '10px 12px',
    background: active ? '#1a1614' : 'transparent',
    color: active ? '#f4efe6' : '#1a1614',
    border: 'none',
    borderBottom: active ? '3px solid #b8431f' : '3px solid transparent',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: 500,
    minWidth: '70px',
    marginBottom: '-1px',
  }),
  card: {
    background: '#ebe4d6',
    border: '1px solid #2a2420',
    borderRadius: '2px',
    padding: '20px',
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#6b6259',
    marginBottom: '6px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #2a2420',
    background: '#f4efe6',
    borderRadius: '2px',
    fontFamily: '"Fraunces", serif',
    fontSize: '16px',
    marginBottom: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    border: '1px solid #2a2420',
    background: '#f4efe6',
    borderRadius: '2px',
    fontFamily: '"Fraunces", serif',
    fontSize: '16px',
    marginBottom: '14px',
    boxSizing: 'border-box',
    cursor: 'pointer',
    outline: 'none',
  },
  btn: {
    width: '100%',
    padding: '14px',
    background: '#1a1614',
    color: '#f4efe6',
    border: 'none',
    borderRadius: '2px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: 600,
  },
  btnDanger: {
    width: '100%',
    padding: '14px',
    background: '#b8431f',
    color: '#f4efe6',
    border: 'none',
    borderRadius: '2px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: 600,
    marginTop: '12px',
  },
  suggestion: {
    background: 'rgba(184,67,31,0.08)',
    borderLeft: '3px solid #b8431f',
    padding: '12px 16px',
    marginBottom: '14px',
    borderRadius: '2px',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  suggLabel: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#b8431f',
    display: 'block',
    marginBottom: '4px',
  },
  txnRow: {
    borderBottom: '1px solid rgba(42,36,32,0.1)',
    padding: '14px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },
  txnAmt: {
    fontFamily: '"Fraunces", serif',
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '18px',
  },
  txnMeta: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    color: '#6b6259',
    letterSpacing: '0.05em',
    marginTop: '4px',
  },
  earned: { color: '#2d5d3a', fontFamily: '"JetBrains Mono", monospace', fontWeight: 700 },
  missed: { color: '#b8431f', fontFamily: '"JetBrains Mono", monospace', fontSize: '11px' },
  delBtn: {
    background: 'none',
    border: 'none',
    color: '#6b6259',
    cursor: 'pointer',
    padding: '4px 8px',
    fontSize: '11px',
    fontFamily: '"JetBrains Mono", monospace',
    letterSpacing: '0.1em',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '20px',
  },
  statBox: {
    background: '#1a1614',
    color: '#f4efe6',
    padding: '16px',
    borderRadius: '2px',
  },
  statLabel: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: '6px',
  },
  statValue: {
    fontFamily: '"Fraunces", serif',
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '24px',
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid rgba(42,36,32,0.1)',
  },
  chip: (color) => ({
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    marginRight: '8px',
    verticalAlign: 'middle',
  }),
  empty: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#6b6259',
    fontStyle: 'italic',
  },
  lookupResult: {
    background: '#1a1614',
    borderLeft: '3px solid #c89211',
    color: '#f4efe6',
    padding: '16px',
    marginBottom: '14px',
    borderRadius: '2px',
  },
  lookupLabel: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '10px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#c89211',
    display: 'block',
    marginBottom: '6px',
  },
  lookupCard: {
    fontFamily: '"Fraunces", serif',
    fontStyle: 'italic',
    fontWeight: 600,
    fontSize: '26px',
    margin: '4px 0',
  },
  lookupRate: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '12px',
    opacity: 0.75,
  },
  note: {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    color: '#c89211',
    marginTop: '8px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '36px',
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '10px',
    color: '#6b6259',
    letterSpacing: '0.1em',
  },
}

// ============================================================
// Component
// ============================================================

export default function Tracker() {
  const [txns, setTxns] = useState([])
  const [view, setView] = useState('log')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('groceries_store')
  const [cardUsed, setCardUsed] = useState('nfa')
  const [note, setNote] = useState('')
  const [lookupCat, setLookupCat] = useState('groceries_store')

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setTxns(JSON.parse(raw))
    } catch (e) {
      // fresh start
    }
  }, [])

  function save(updated) {
    setTxns(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error('localStorage save failed:', e)
    }
  }

  function addTxn() {
    const amt = parseFloat(amount)
    if (isNaN(amt) || amt <= 0) return
    const cat = CATEGORIES.find(c => c.id === category)
    const earned = (amt * cat.rates[cardUsed]) / 100
    const best = bestCardFor(category)
    const optimal = (amt * best.rate) / 100
    const txn = {
      id: Date.now(),
      date: new Date().toISOString(),
      amount: amt,
      category,
      cardUsed,
      earned,
      optimalCard: best.card,
      optimalEarned: optimal,
      missed: optimal - earned,
      note: note.trim(),
    }
    save([txn, ...txns])
    setAmount('')
    setNote('')
  }

  function deleteTxn(id) {
    save(txns.filter(t => t.id !== id))
  }

  function clearAll() {
    if (window.confirm('Delete all transactions? This cannot be undone.')) {
      save([])
    }
  }

  // Live suggestion while filling form
  const liveBest = bestCardFor(category)
  const currentCat = CATEGORIES.find(c => c.id === category)
  const amt = parseFloat(amount)
  const wouldEarn = (!isNaN(amt) && amt > 0) ? (amt * currentCat.rates[cardUsed]) / 100 : 0
  const couldEarn = (!isNaN(amt) && amt > 0) ? (amt * liveBest.rate) / 100 : 0
  const wouldMiss = couldEarn - wouldEarn

  // Stats
  const totalSpent   = txns.reduce((s, t) => s + t.amount, 0)
  const totalEarned  = txns.reduce((s, t) => s + t.earned, 0)
  const totalOptimal = txns.reduce((s, t) => s + t.optimalEarned, 0)
  const totalMissed  = totalOptimal - totalEarned

  const byCard = {}
  Object.keys(CARDS).forEach(k => { byCard[k] = { spent: 0, earned: 0, count: 0 } })
  txns.forEach(t => {
    byCard[t.cardUsed].spent  += t.amount
    byCard[t.cardUsed].earned += t.earned
    byCard[t.cardUsed].count  += 1
  })

  const byCat = {}
  txns.forEach(t => {
    if (!byCat[t.category]) byCat[t.category] = { spent: 0, earned: 0, missed: 0, count: 0 }
    byCat[t.category].spent  += t.amount
    byCat[t.category].earned += t.earned
    byCat[t.category].missed += t.missed
    byCat[t.category].count  += 1
  })

  // Lookup
  const lkBest = bestCardFor(lookupCat)
  const lkCat  = CATEGORIES.find(c => c.id === lookupCat)

  return (
    <div style={S.body}>
      <div style={S.wrap}>

        <div style={S.header}>
          <div style={S.eyebrow}>Spend Tracker · 4-Card System</div>
          <div style={S.h1}>Did you use<br/>the right card?</div>
        </div>

        {/* TABS */}
        <div style={S.tabs}>
          {[['log','Log'],['lookup','Which Card?'],['history','History'],['stats','Stats']].map(([id, label]) => (
            <button key={id} style={S.tab(view===id)} onClick={() => setView(id)}>{label}</button>
          ))}
        </div>

        {/* ===== LOG ===== */}
        {view === 'log' && (
          <div style={S.card}>
            <label style={S.label}>Amount ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={S.input}
            />

            <label style={S.label}>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} style={S.select}>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <label style={S.label}>Card Used</label>
            <select value={cardUsed} onChange={e => setCardUsed(e.target.value)} style={S.select}>
              {Object.entries(CARDS).map(([k, c]) => (
                <option key={k} value={k}>{c.name}</option>
              ))}
            </select>

            <label style={S.label}>Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. Trader Joe's, dinner w/ Adam"
              value={note}
              onChange={e => setNote(e.target.value)}
              style={S.input}
            />

            {!isNaN(amt) && amt > 0 && (
              <div style={S.suggestion}>
                <span style={S.suggLabel}>Optimal card for this category</span>
                {liveBest.card === cardUsed ? (
                  <span>✓ You're using the best card. Earning <strong>{fmt(wouldEarn * 100)}</strong>.</span>
                ) : (
                  <>
                    Best: <strong>{CARDS[liveBest.card].name}</strong> ({liveBest.rate}x) → earns <strong>{fmt(couldEarn * 100)}</strong><br />
                    {CARDS[cardUsed].name} earns <strong>{fmt(wouldEarn * 100)}</strong>
                    {wouldMiss > 0.005 && (
                      <> — leaving <span style={{color:'#b8431f', fontWeight:700}}>{fmt(wouldMiss * 100)}</span> on the table.</>
                    )}
                  </>
                )}
              </div>
            )}

            <button onClick={addTxn} style={S.btn}>Log Transaction</button>
          </div>
        )}

        {/* ===== LOOKUP ===== */}
        {view === 'lookup' && (
          <div style={S.card}>
            <label style={S.label}>What are you buying?</label>
            <select value={lookupCat} onChange={e => setLookupCat(e.target.value)} style={S.select}>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>

            <div style={S.lookupResult}>
              <span style={S.lookupLabel}>Use this card</span>
              <div style={S.lookupCard}>{CARDS[lkBest.card].name}</div>
              <div style={S.lookupRate}>Earns {lkBest.rate}x ({lkBest.rate}% effective cash value)</div>
              {lkCat.note && <div style={S.note}>{lkCat.note}</div>}
            </div>

            <div style={S.label}>All rates for this category</div>
            {Object.entries(CARDS).map(([k, c]) => (
              <div key={k} style={S.row}>
                <span>
                  <span style={S.chip(c.color)} />
                  {c.name}
                </span>
                <span style={{
                  fontFamily: '"JetBrains Mono", monospace',
                  fontWeight: 700,
                  color: k === lkBest.card ? '#b8431f' : '#1a1614',
                }}>
                  {lkCat.rates[k] < 0 ? `${lkCat.rates[k]}% (fee)` : `${lkCat.rates[k]}x`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* ===== HISTORY ===== */}
        {view === 'history' && (
          <div>
            {txns.length === 0 ? (
              <div style={S.card}><div style={S.empty}>No transactions yet. Log one to start.</div></div>
            ) : (
              <>
                <div style={S.card}>
                  {txns.map(t => {
                    const cat = CATEGORIES.find(c => c.id === t.category)
                    const usedBest = t.cardUsed === t.optimalCard
                    const d = new Date(t.date)
                    return (
                      <div key={t.id} style={S.txnRow}>
                        <div style={{flex:1}}>
                          <div style={S.txnAmt}>{fmt(t.amount * 100)}</div>
                          <div style={S.txnMeta}>
                            {cat?.label} · {CARDS[t.cardUsed].short}
                            {t.note ? ` · ${t.note}` : ''}
                          </div>
                          <div style={S.txnMeta}>
                            {d.toLocaleDateString()} {d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
                          </div>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <div style={S.earned}>+{fmt(t.earned * 100)}</div>
                          {!usedBest && t.missed > 0.005 && (
                            <div style={S.missed}>
                              missed {fmt(t.missed * 100)}<br/>
                              use {CARDS[t.optimalCard].short}
                            </div>
                          )}
                          <button onClick={() => deleteTxn(t.id)} style={S.delBtn}>×</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <button onClick={clearAll} style={S.btnDanger}>Clear All History</button>
              </>
            )}
          </div>
        )}

        {/* ===== STATS ===== */}
        {view === 'stats' && (
          <div>
            {txns.length === 0 ? (
              <div style={S.card}><div style={S.empty}>No transactions yet.</div></div>
            ) : (
              <>
                <div style={S.statGrid}>
                  <div style={S.statBox}>
                    <div style={S.statLabel}>Total Spent</div>
                    <div style={S.statValue}>{fmt(totalSpent * 100)}</div>
                  </div>
                  <div style={S.statBox}>
                    <div style={S.statLabel}>Total Earned</div>
                    <div style={{...S.statValue, color:'#5d9c6e'}}>{fmt(totalEarned * 100)}</div>
                  </div>
                  <div style={S.statBox}>
                    <div style={S.statLabel}>If Optimized</div>
                    <div style={{...S.statValue, color:'#c89211'}}>{fmt(totalOptimal * 100)}</div>
                  </div>
                  <div style={S.statBox}>
                    <div style={S.statLabel}>Left on Table</div>
                    <div style={{...S.statValue, color:'#d9603a'}}>{fmt(totalMissed * 100)}</div>
                  </div>
                </div>

                <div style={S.card}>
                  <div style={S.label}>Spend by Card</div>
                  {Object.entries(CARDS).map(([k, c]) => (
                    <div key={k} style={S.row}>
                      <span>
                        <span style={S.chip(c.color)} />
                        {c.name}
                        <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:'10px',color:'#6b6259',marginLeft:'18px',marginTop:'2px'}}>
                          {byCard[k].count} txn{byCard[k].count !== 1 ? 's' : ''}
                        </div>
                      </span>
                      <span style={{textAlign:'right'}}>
                        <div style={{fontFamily:'"JetBrains Mono",monospace',fontWeight:700}}>{fmt(byCard[k].spent * 100)}</div>
                        <div style={{fontSize:'11px',color:'#2d5d3a',fontFamily:'"JetBrains Mono",monospace'}}>+{fmt(byCard[k].earned * 100)}</div>
                      </span>
                    </div>
                  ))}
                </div>

                <div style={S.card}>
                  <div style={S.label}>Top Missed-Value Categories</div>
                  {Object.entries(byCat)
                    .sort((a,b) => b[1].missed - a[1].missed)
                    .filter(([,v]) => v.missed > 0.005)
                    .slice(0, 6)
                    .map(([catId, v]) => {
                      const cat = CATEGORIES.find(c => c.id === catId)
                      return (
                        <div key={catId} style={S.row}>
                          <span style={{flex:1}}>
                            <div>{cat?.label}</div>
                            <div style={{fontFamily:'"JetBrains Mono",monospace',fontSize:'10px',color:'#6b6259'}}>
                              {v.count} txn{v.count!==1?'s':''} · {fmt(v.spent * 100)} spent
                            </div>
                          </span>
                          <span style={{color:'#b8431f',fontFamily:'"JetBrains Mono",monospace',fontWeight:700}}>
                            −{fmt(v.missed * 100)}
                          </span>
                        </div>
                      )
                    })}
                  {Object.values(byCat).every(v => v.missed < 0.005) && (
                    <div style={S.empty}>Fully optimized. Well done.</div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <div style={S.footer}>
          Data stored in browser · Earn rates verified May 2026
        </div>

      </div>
    </div>
  )
}
