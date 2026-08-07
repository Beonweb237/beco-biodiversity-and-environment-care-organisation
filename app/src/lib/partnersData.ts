export interface PartnerData {
  name: string;
  abbr: string;
  logo: string;
}

export const partners: PartnerData[] = [
  { name: 'The Rufford Foundation', abbr: 'RUFFORD', logo: '/assets/partners/rufford.png' },
  { name: '1Wild Foundation', abbr: '1WILD', logo: '/assets/partners/1wild.jpg' },
  { name: 'The Mohamed bin Zayed Species Conservation Fund', abbr: 'MBZ', logo: '/assets/partners/mbz.png' },
  { name: 'IDEA WILD', abbr: 'IDEA WILD', logo: '/assets/partners/idea-wild.jpg' },
  { name: 'British Ecological Society', abbr: 'BES', logo: '/assets/partners/bes.png' },
];

/** Retrouve le logo d'un partenaire à partir de son sigle ou de son nom. */
export function getPartnerLogo(...keys: (string | undefined)[]): string | undefined {
  const normalize = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const key of keys) {
    if (!key) continue;
    const needle = normalize(key);
    const match = partners.find(
      (p) => normalize(p.abbr) === needle || normalize(p.name) === needle,
    );
    if (match) return match.logo;
  }
  return undefined;
}
