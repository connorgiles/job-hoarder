/**
 * Gets the first match from a string and regex or null
 * @param {String} text text to search from
 * @param {RegEx} pattern regex pattern to match
 */
export default (text: string | undefined, pattern: RegExp): string | undefined => {
  if (!text) return undefined;
  const match = text.match(pattern);
  return match && match.length > 1 ? match[1] : undefined;
};
