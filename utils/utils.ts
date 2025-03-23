
/**
 * Pauses execution for the specified amount of time.
 * @param {number} ms - The amount of time to sleep, in milliseconds.
 * @returns {Promise<void>} A Promise that resolves after the specified amount of time.
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Retrieves the value of an environment variable.
 * @param {string | string[]} name - The name of the environment variable.
 * @returns {string} The value of the environment variable.
 * @throws Will throw an error if runtime does not support `process.env`.
 */
export const retrieveEnv = (code: string | string[]): string | undefined => {
  if (typeof code === 'string' && code.includes('.')) {
    return retrieveEnv(code.split('.'))
  }

  const name = Array.isArray(code) ? code.join('_').toLocaleUpperCase() : code

  if (typeof process === 'undefined' || !('env' in process)) {
    throw new Error(`Runtime does not support 'process.env'`)
  }

  return process.env[name]
}

/**
 * Retrieves the value of an environment variable. Throws an error if the value is not set.
 * @param {string} name - The name of the environment variable.
 * @returns {string} The value of the environment variable.
 * @throws Will throw an error if the environment variable is not set.
 */
export const requireEnv = (name: Parameters<typeof retrieveEnv>[0]): string => {
  return requireValue(retrieveEnv(name), `process.env[${JSON.stringify(name)}]`)
}

/**
 * Checks that a value is defined. Throws an error if the value is not defined.
 * @param {any} value - The value to check.
 * @param {string} name - The name of the value (optional).
 * @returns {string} The value, if it is defined.
 * @throws Will throw an error if the value is not defined.
 */
export const requireValue = (value: any, name: string): string => {
  if (value === undefined) {
    throw new Error(`Missing value${name ? ` for '${name}'` : ''}`)
  }

  return value
}

type Keys<T> = keyof T | readonly (keyof T)[]

type EnsureArray<T> = T extends any[] ? T : T[]

export function ensureArray<T>(input: T): EnsureArray<T> {
  return (Array.isArray(input) ? input : [input]) as EnsureArray<T>
}

export const pick = <T extends object, K extends Keys<T>>(obj: T, keys: K) =>
  Object.fromEntries(
    Object.entries(obj).filter(([key]) =>
      ensureArray(keys).includes(key as K extends readonly (keyof T)[] ? K[number] : K),
    ),
  ) as Pick<T, K extends readonly (keyof T)[] ? K[number] : K>

export const omit = <T extends object, K extends Keys<T>>(obj: T, keys: K) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([key]) => !ensureArray(keys).includes(key as K extends readonly (keyof T)[] ? K[number] : K),
    ),
  ) as Omit<T, K extends readonly (keyof T)[] ? K[number] : K>
  

/**
 * Recursively flattens an object into a single level object
 * with dotted keys representing the original nested structure.
 * @param obj The object to be flattened.
 * @param prefix The prefix for the keys in the flattened object.
 * This is used to avoid key collisions when flattening nested objects.
 * @returns The flattened object.
 */
export function flattenObject(obj: object, prefix = ''): Record<string, string | number | boolean> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      if (typeof value === 'object' && value !== null) {
        if (value instanceof Date) {
          acc[fullKey] = value.toISOString()
        } else {
          Object.assign(acc, flattenObject(value, fullKey))
        }
      } else {
        acc[fullKey] = value
      }
      return acc
    },
    {} as Record<string, any>,
  )
}
