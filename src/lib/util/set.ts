export function set(
  incomingData: any,
  path: string,
  value: any,
  delimiter: string = '.'
): any {
  const [key, ...restKeys] = path.split(delimiter)

  if (restKeys.length > 0) {
    incomingData[key] = set(
      incomingData[key] ?? {},
      restKeys.join(delimiter),
      value,
      delimiter
    )
  } else {
    incomingData[key] = value
  }

  return incomingData
}
