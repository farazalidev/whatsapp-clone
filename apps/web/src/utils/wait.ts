// Define a function to wait for 5 seconds
/**
 * @param ms time in millisecond
 */
export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
