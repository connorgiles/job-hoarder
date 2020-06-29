/**
 * Promise-ified setTimeout
 */
export default (timeout: number): Promise<any> =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
