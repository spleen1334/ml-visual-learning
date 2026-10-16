export const CUSTOMERS = [
  { id: 'C1', start: 0, lag: 7 }, { id: 'C2', start: 2, lag: 10 }, { id: 'C3', start: 5, lag: 6 },
  { id: 'C4', start: 8, lag: 12 }, { id: 'C5', start: 11, lag: null }, { id: 'C6', start: 14, lag: 9 },
] as const

export function observationProfile(day: number) {
  const outcomes = CUSTOMERS.map(customer => {
    const eventDay = customer.lag === null ? null : customer.start + customer.lag
    return { ...customer, eventDay, observed: eventDay !== null && eventDay <= day, followup: day - customer.start }
  })
  const eligible = outcomes.filter(customer => customer.followup >= 30)
  const withinThirty = eligible.filter(customer => customer.lag !== null && customer.lag <= 30).length
  return { outcomes, eligible, withinThirty, rate: eligible.length ? withinThirty / eligible.length : null }
}
