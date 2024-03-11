export function omitObject<T extends Record<string, any>, K extends keyof T>(obj: T, keysToOmit: K[]): Omit<T, K> {
  return Object?.keys(obj)?.reduce(
    (acc, key) => {
      if (!keysToOmit.includes(key as K)) {
        acc[key as keyof Omit<T, K>] = obj[key];
      }
      return acc;
    },
    {} as Omit<T, K>,
  );
}
