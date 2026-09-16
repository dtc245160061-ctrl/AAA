// Curated Library of 50+ Verified Real-World 3D Matterport Digital Twins
// Photogrammetry 3D scans of real apartments, studios, condos, suites, and penthouses.

export interface MatterportTourItem {
  id: string;
  name: string;
  category: 'studio' | '1bed' | '2bed' | '3bed' | '4bed' | 'penthouse' | 'villa' | 'condo' | 'suite' | 'apartment';
  categoryLabel: string;
  bedroomCount: number;
  description: string;
  embedUrl: string;
}

export const VERIFIED_MATTERPORT_TOURS: MatterportTourItem[] = [
  {
    id: 'ZjoCKLFLCjR',
    name: 'One Bedroom Apartment',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=ZjoCKLFLCjR&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'BGLy9K8hLRs',
    name: 'Matterport Real Estate Sample',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=BGLy9K8hLRs&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'rstxHqbetab',
    name: 'Caesars Palace Julius Penthouse',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=rstxHqbetab&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '33U2gf2XK4c',
    name: 'Studio Corner',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=33U2gf2XK4c&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'jmpZ9WHagkV',
    name: '8500 Sq Foot Full-Floor Residence - Upper West Side, NYC',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=jmpZ9WHagkV&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'YY3q35PZ8BQ',
    name: 'The Studios',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=YY3q35PZ8BQ&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'fpvnoTeJbGe',
    name: 'Mandarin Oriental Palace, Luzern - Lake View Junior Suite',
    category: 'suite',
    categoryLabel: 'Suite Hạng Sang',
    bedroomCount: 2,
    description: 'Không gian thực tế Suite Hạng Sang với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=fpvnoTeJbGe&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'C5FLRF8mCNR',
    name: 'RM 1C+ - 1 Bedroom Plus Den',
    category: '1bed',
    categoryLabel: '1 Phòng ngủ',
    bedroomCount: 1,
    description: 'Không gian thực tế 1 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=C5FLRF8mCNR&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'ZqLCAYubbXu',
    name: 'Springleaf Residence 3BR',
    category: '3bed',
    categoryLabel: '3 Phòng ngủ',
    bedroomCount: 3,
    description: 'Không gian thực tế 3 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=ZqLCAYubbXu&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'eeRXMd4ijdi',
    name: 'Valle Romano Apartment - Type C - Penthouse',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=eeRXMd4ijdi&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '2Zq1bupQ8ii',
    name: '2 Bedroom, 2 Bathroom Model',
    category: '2bed',
    categoryLabel: '2 Phòng ngủ',
    bedroomCount: 2,
    description: 'Không gian thực tế 2 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=2Zq1bupQ8ii&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'zqyaPXkGzEb',
    name: 'Five Bedroom Penthouse',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=zqyaPXkGzEb&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'i5heaa1n7JA',
    name: 'Parc Terrace - Studio',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=i5heaa1n7JA&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'wtncDbuzoEi',
    name: 'European Honeymoon Suite',
    category: 'suite',
    categoryLabel: 'Suite Hạng Sang',
    bedroomCount: 2,
    description: 'Không gian thực tế Suite Hạng Sang với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=wtncDbuzoEi&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'fmrDnzN3D1g',
    name: 'DWTC - 0412A One Bedroom Deluxe Apartment',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=fmrDnzN3D1g&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'odWSTDUfeUx',
    name: 'Residence 2 at Hillside Meadows',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=odWSTDUfeUx&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'JGPnGQ6hosj',
    name: 'Southern California Luxury Home',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=JGPnGQ6hosj&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'pzS1iSC6jwk',
    name: 'Two-Bed Apartment',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=pzS1iSC6jwk&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'szg59cJmCu4',
    name: '4 BEDROOM (MODERN)',
    category: '4bed',
    categoryLabel: '4 Phòng ngủ',
    bedroomCount: 4,
    description: 'Không gian thực tế 4 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=szg59cJmCu4&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'RUDdYFQMZCX',
    name: 'Caesars Palace Tiberius Penthouse - Three Bedrooms',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=RUDdYFQMZCX&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'HCMvDW15VXu',
    name: 'TOTO SHOWROOM',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=HCMvDW15VXu&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'KSvqvRiXnX7',
    name: 'Studio Apartment',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=KSvqvRiXnX7&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'CsLtCHubxpX',
    name: 'Windsor Park – Studio – Featured Suite 2',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=CsLtCHubxpX&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'uxEBa1z5uNC',
    name: 'Luxury One Bedroom (with cloakroom)',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=uxEBa1z5uNC&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'a6sVjZKSKvB',
    name: '2 Bedroom Apartment',
    category: '2bed',
    categoryLabel: '2 Phòng ngủ',
    bedroomCount: 2,
    description: 'Không gian thực tế 2 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=a6sVjZKSKvB&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'jzHMFBpx7ae',
    name: '1 Bedroom Apartment',
    category: '1bed',
    categoryLabel: '1 Phòng ngủ',
    bedroomCount: 1,
    description: 'Không gian thực tế 1 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=jzHMFBpx7ae&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'zsCyFPqKdiW',
    name: 'Giorgetti Atelier New York, Penthouse',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=zsCyFPqKdiW&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'PPkASThKxX8',
    name: 'Tiny Home ( 1 Bedroom | 1 Bathroom ) Modular',
    category: '1bed',
    categoryLabel: '1 Phòng ngủ',
    bedroomCount: 1,
    description: 'Không gian thực tế 1 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=PPkASThKxX8&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'P6zNyprD9tt',
    name: '5001 Pacific Ave | 1 Bedroom',
    category: '1bed',
    categoryLabel: '1 Phòng ngủ',
    bedroomCount: 1,
    description: 'Không gian thực tế 1 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=P6zNyprD9tt&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'xVpxW6KSznc',
    name: 'Brattlebrook Village 1 Bedroom Unit',
    category: 'villa',
    categoryLabel: 'Biệt Thự / Villa',
    bedroomCount: 4,
    description: 'Không gian thực tế Biệt Thự / Villa với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=xVpxW6KSznc&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'KcMMo7EW5mz',
    name: 'Jucy Condo',
    category: 'condo',
    categoryLabel: 'Căn hộ Chung cư',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ Chung cư với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=KcMMo7EW5mz&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'Mb7agvjaDHd',
    name: '2 Bedroom 1st Floor',
    category: '2bed',
    categoryLabel: '2 Phòng ngủ',
    bedroomCount: 2,
    description: 'Không gian thực tế 2 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=Mb7agvjaDHd&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'DAjtvbwvVQx',
    name: 'The British Library - Boardroom Suite',
    category: 'suite',
    categoryLabel: 'Suite Hạng Sang',
    bedroomCount: 2,
    description: 'Không gian thực tế Suite Hạng Sang với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=DAjtvbwvVQx&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'D95R7QhTXMw',
    name: '2 Bedroom Show Apartment Virtual tour',
    category: '2bed',
    categoryLabel: '2 Phòng ngủ',
    bedroomCount: 2,
    description: 'Không gian thực tế 2 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=D95R7QhTXMw&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'aLo59YSDMpj',
    name: 'Studio Apartment',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=aLo59YSDMpj&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '1mMDs1rwKXF',
    name: '1 Bedroom / 1 Bath Unit',
    category: '1bed',
    categoryLabel: '1 Phòng ngủ',
    bedroomCount: 1,
    description: 'Không gian thực tế 1 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=1mMDs1rwKXF&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '7DRvGbDcBGk',
    name: '1 Bedroom Suite',
    category: 'suite',
    categoryLabel: 'Suite Hạng Sang',
    bedroomCount: 2,
    description: 'Không gian thực tế Suite Hạng Sang với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=7DRvGbDcBGk&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'u99LJgcWmKv',
    name: '2 Bedroom 2 Bath D',
    category: '2bed',
    categoryLabel: '2 Phòng ngủ',
    bedroomCount: 2,
    description: 'Không gian thực tế 2 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=u99LJgcWmKv&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'Nht3tDPvPx3',
    name: 'Penthouse',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=Nht3tDPvPx3&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '2Ug7bJ9FADx',
    name: 'The Indeed Condo Bang Phli - Type 1 : 1 Bed (24.00 sqm.)',
    category: 'condo',
    categoryLabel: 'Căn hộ Chung cư',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ Chung cư với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=2Ug7bJ9FADx&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'dqzBYdhrvwg',
    name: 'CASA Residence (110 Lawton Blvd)',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=dqzBYdhrvwg&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'Jm9LrHgZX2N',
    name: 'ORI - Penthouse (Rainy Day)',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=Jm9LrHgZX2N&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'XtEH6qJzUXp',
    name: 'Superior Villa / Rixos Tekirova Premium',
    category: 'villa',
    categoryLabel: 'Biệt Thự / Villa',
    bedroomCount: 4,
    description: 'Không gian thực tế Biệt Thự / Villa với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=XtEH6qJzUXp&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'Sy5yqprDxN9',
    name: '2026 Catalina Destination 43CONDO',
    category: 'condo',
    categoryLabel: 'Căn hộ Chung cư',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ Chung cư với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=Sy5yqprDxN9&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'B27ZdaFQ4ds',
    name: 'Executive Lodge Studio 480 Sq. Ft',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=B27ZdaFQ4ds&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'q9P5DK5t8rZ',
    name: 'Main Home',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=q9P5DK5t8rZ&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'KoGS7bhfyjc',
    name: 'The Strand Indeed Condo | Type-8 : 2 Bed',
    category: 'condo',
    categoryLabel: 'Căn hộ Chung cư',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ Chung cư với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=KoGS7bhfyjc&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'oeoaWcap9dY',
    name: '1 Bedroom, 1 Bath Designer Overlook',
    category: '1bed',
    categoryLabel: '1 Phòng ngủ',
    bedroomCount: 1,
    description: 'Không gian thực tế 1 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=oeoaWcap9dY&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'tNBW3LDhSfu',
    name: 'Model Apartment - DUO',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=tNBW3LDhSfu&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'gXkAScckiMF',
    name: 'Signature Studio Suite | King  (STK)',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=gXkAScckiMF&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'C7usijyrPxn',
    name: 'Studio- (All units will be fully furnished)',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=C7usijyrPxn&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '7DWv3YD6S85',
    name: 'Swissôtel Residence 2811/ 2818',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=7DWv3YD6S85&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'dT49dihZSBd',
    name: 'Two Bedroom Apartment ​with Balcony',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=dT49dihZSBd&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '7QA7vSNj6sg',
    name: 'Studio Apartment With Ensuite',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=7QA7vSNj6sg&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'HyFCbixL5vj',
    name: '35 Hudson Yards, Penthouse 90',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=HyFCbixL5vj&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'VWFj83cB2mY',
    name: 'Penthouse 1',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=VWFj83cB2mY&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'P6LHS4H8zrA',
    name: 'Sage (Deluxe)',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=P6LHS4H8zrA&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'JELY7RQFQ6Y',
    name: 'Lionfish, Coral, Seahorse & Tortuga Condos',
    category: 'condo',
    categoryLabel: 'Căn hộ Chung cư',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ Chung cư với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=JELY7RQFQ6Y&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'DqjiSgWZWyz',
    name: '2026 Salem Villa 40FDEN',
    category: 'villa',
    categoryLabel: 'Biệt Thự / Villa',
    bedroomCount: 4,
    description: 'Không gian thực tế Biệt Thự / Villa với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=DqjiSgWZWyz&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'ooEi3t13ysM',
    name: 'Studio',
    category: 'studio',
    categoryLabel: 'Studio',
    bedroomCount: 1,
    description: 'Không gian thực tế Studio với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=ooEi3t13ysM&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '59WEGb7VGG9',
    name: 'Marshall Hall, 4 Bedroom Apartment',
    category: '4bed',
    categoryLabel: '4 Phòng ngủ',
    bedroomCount: 4,
    description: 'Không gian thực tế 4 Phòng ngủ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=59WEGb7VGG9&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'FeCGTdcJ8iu',
    name: 'Westgate Branson Lakes Resort Two Bedroom Lake View Deluxe Villa',
    category: 'villa',
    categoryLabel: 'Biệt Thự / Villa',
    bedroomCount: 4,
    description: 'Không gian thực tế Biệt Thự / Villa với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=FeCGTdcJ8iu&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '3rbDfSCMBco',
    name: 'VILLA CERRUTI',
    category: 'villa',
    categoryLabel: 'Biệt Thự / Villa',
    bedroomCount: 4,
    description: 'Không gian thực tế Biệt Thự / Villa với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=3rbDfSCMBco&play=1&qs=1&brand=0&title=0'
  },
  {
    id: '8pmJUNKdwoU',
    name: 'Pinnacle',
    category: 'apartment',
    categoryLabel: 'Căn hộ',
    bedroomCount: 2,
    description: 'Không gian thực tế Căn hộ với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=8pmJUNKdwoU&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'K8pHJKvgQJM',
    name: 'Premier Penthouse - The Standard, Bangkok Mahanakhon',
    category: 'penthouse',
    categoryLabel: 'Penthouse Cao Cấp',
    bedroomCount: 4,
    description: 'Không gian thực tế Penthouse Cao Cấp với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=K8pHJKvgQJM&play=1&qs=1&brand=0&title=0'
  },
  {
    id: 'wtsDLAKpEEv',
    name: 'Holiday Village #P2',
    category: 'villa',
    categoryLabel: 'Biệt Thự / Villa',
    bedroomCount: 4,
    description: 'Không gian thực tế Biệt Thự / Villa với đầy đủ nội thất, ánh sáng tự nhiên và công cụ đo đạc laser 3D.',
    embedUrl: 'https://my.matterport.com/show/?m=wtsDLAKpEEv&play=1&qs=1&brand=0&title=0'
  },
];

// Sequential assignment tracking so consecutive previewed units always get the next distinct 3D tour
let sequentialCounter = 0;
const unitToTourMap = new Map<string, MatterportTourItem>();

export function getMatterportTourForUnit(unit: { id: string; bedrooms?: number; sqm?: number; priceVND?: number; type?: string }): MatterportTourItem {
  if (!unit || !unit.id) return VERIFIED_MATTERPORT_TOURS[0];

  // If this unit was already assigned a tour in this session, return it
  if (unitToTourMap.has(unit.id)) {
    return unitToTourMap.get(unit.id)!;
  }

  // Assign the NEXT tour sequentially: 0, 1, 2, 3, 4, 5...
  const tour = VERIFIED_MATTERPORT_TOURS[sequentialCounter % VERIFIED_MATTERPORT_TOURS.length];
  sequentialCounter++;
  unitToTourMap.set(unit.id, tour);
  return tour;
}

export function getTourIndex(tourId: string): number {
  const idx = VERIFIED_MATTERPORT_TOURS.findIndex(t => t.id === tourId);
  return idx >= 0 ? idx + 1 : 1;
}
