export const roundToTwoDecimals = (num: number): number => {
  return Number(num.toFixed(2))
}

export const calculatePercentage = (partialValue: number, totalValue: number): number => {
  return roundToTwoDecimals((partialValue / totalValue) * 100)
}

export const calculatePercentageDifference = (current: number, previous: number): number => {
  const difference = current - previous
  return previous > 0 ? calculatePercentage(difference, previous) : 0
}
