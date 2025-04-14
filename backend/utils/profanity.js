// backend/utils/profanity.js

const customProfanityList = [
  'tits', 'dicks', 'pussy', 'cum', 'cock', 'cunt', 'asshole', 'fuck', 'fucking', 'fucked', 'shit', 'dildo', 'vagina', 'boobs',
  'murder', 'killing', 'slaughter', 'massacre', 'rape', 'raping', 'molest', 'abuse', 'torture',
  'drugs', 'meth', 'cocaine', 'crack', 'heroin', 'lsd', 'ecstasy', 'weed', 'pot', 'marijuana', 'snorting', 'overdose',
  'satan', 'devil', 'hell', 'demonic', 'pedophile', 'necrophilia',
  'nigger', 'faggot', 'tranny', 'retard', 'slut', 'whore', 'bitch', 'kike', 'spic', 'chink', 'dyke',
  'sh1t', 'fck', 'fuq', 'a$$', 'd1ck', 'p0rn', 'c0ck'
];

export function isProfane(text = '') {
  const regex = new RegExp(`\\b(${customProfanityList.join('|')})\\b`, 'i');
  return regex.test(text.toLowerCase());
}
