/**
 * Utility functions for searching
 */

// The values in the map are the characters which the key character can match (i.e. Örsted matches Ørsted, but not Orsted)
const REGIONAL_CHAR_MAP: Record<string, string> = {
  a: "àáâãäåæāăą",
  c: "çćĉċč",
  d: "đď",
  e: "èéêëēĕėęě",
  g: "ĝğġģ",
  h: "ĥħ",
  i: "ìíîïĩīĭįı",
  j: "ĵ",
  k: "ķĸ",
  l: "ĺļľŀł",
  n: "ñńņňŉŋ",
  o: "òóôõöøōŏőœ",
  r: "ŕŗř",
  s: "śŝşšșß",
  t: "ţťŧț",
  u: "ùúûüũūŭůűų",
  w: "ŵ",
  y: "ýÿŷ",
  z: "źżž",
  ä: "æ",
  æ: "ä",
  ö: "ø",
  ø: "ö"
};

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, (match) => `\\${match}`);
}

export function buildSearchRegex(term: string): RegExp {
  const pattern = term
    .toLowerCase()
    .split("")
    .map((char) =>
      REGIONAL_CHAR_MAP[char] ? `[${char}${REGIONAL_CHAR_MAP[char]}]` : escapeRegExp(char),
    )
    .join("[\\W_]*");

  return new RegExp(`(?:^|\\s)${pattern}`, "i");
}
