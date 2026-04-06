export function isValidDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value))
}
