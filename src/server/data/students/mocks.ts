// Student mock data for Guinea school system
// Follows ERD StudentEnrollment entity

export type EnrollmentStatus =
  | 'PRE_REGISTERED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'DROPPED'

export interface Student {
  id: string
  annual_identifier: string
  first_name: string
  last_name: string
  full_name: string
  gender: 'M' | 'F'
  date_of_birth: string
  photo_url: string | null
  birthplace_locality_id: string | null
  birthplace_locality_name: string | null
  address: string | null
  academic_year: string
  school_year_level_id: string
  cycle: string
  option: string
  level: string
  classroom_id: string
  class_name: string
  previous_classroom_id: string | null
  previous_class_name: string | null
  enrollment_status: EnrollmentStatus
  enrollment_date: string
  start_date: string | null
  end_date: string | null
  transfer_reason: string | null
  parent_name: string | null
  parent_phone: string | null
  parent_email: string | null
}

export const ACADEMIC_YEARS = ['2024-2025', '2023-2024', '2022-2023']
export const CYCLES = ['Primaire', 'Secondaire']
export const OPTIONS_BY_CYCLE: Record<string, Array<string>> = {
  Primaire: ['Général'],
  Secondaire: [
    'Sciences',
    'Mathématiques',
    'Technique Commerciale',
    'Technique Industrielle',
    'Pédagogie',
  ],
}
export const LEVELS_BY_CYCLE: Record<string, Array<string>> = {
  Primaire: ['1ère', '2ème', '3ème', '4ème', '5ème', '6ème'],
  Secondaire: ['7ème', '8ème', '9ème', '10ème', '11ème', '12ème'],
}

const GUINEAN_MALE_NAMES: Array<[string, string]> = [
  ['Alpha Oumar', 'Diallo'],
  ['Moussa', 'Camara'],
  ['Mamadou', 'Sow'],
  ['Souleymane', 'Konaté'],
  ['Oumar', 'Fernandes'],
  ['Boubacar', 'Sy'],
  ['Ibrahim', 'Barry'],
  ['Abdoulaye', 'Bah'],
  ['Mamadou', 'Diallo'],
  ['Moussa', 'Kéita'],
  ['Mamadou', 'Bangoura'],
  ['Oumar', 'Baldé'],
  ['Moussa', 'Condé'],
  ['Abdou', 'Koulibaly'],
  ['Mamadou', 'Doumbouya'],
  ['Lansana', 'Conté'],
  ['Sékou', 'Touré'],
  ['Alpha', 'Condé'],
  ['Mamadou', 'Yansané'],
  ['Ousmane', 'Soumah'],
  ['Mamadou', 'Sano'],
  ['Moussa', 'Fofana'],
  ['Sékou', 'Camara'],
  ['Boubacar', 'Diallo'],
  ['Aboubacar', 'Traoré'],
  ['Mamadou', 'Bah'],
  ['Lamine', 'Keita'],
  ['Fodé', 'Sylla'],
  ['Moussa', 'Cissé'],
  ['Souleymane', 'Diallo'],
  ['Mamadou', 'Baldé'],
  ['Oumar', 'Sylla'],
  ['Ibrahima', 'Sow'],
  ['Mamadou', 'Camara'],
  ['Abdoulaye', 'Diallo'],
  ['Sékou', 'Condé'],
  ['Boubacar', 'Fofana'],
  ['Mamadou', 'Kéita'],
  ['Moussa', 'Bangoura'],
  ['Alpha', 'Soumah'],
  ['Mamadou', 'Traoré'],
  ['Ousmane', 'Barry'],
  ['Mamadou', 'Cissé'],
  ['Souleymane', 'Camara'],
  ['Ibrahim', 'Soumah'],
  ['Mamadou', 'Keita'],
  ['Lansana', 'Sylla'],
  ['Boubacar', 'Sano'],
  ['Mamadou', 'Conté'],
  ['Alpha', 'Bangoura'],
  ['Sékou', 'Sow'],
  ['Mamadou', 'Yansané'],
  ['Oumar', 'Doumbouya'],
  ['Moussa', 'Barry'],
  ['Ibrahima', 'Fofana'],
  ['Boubacar', 'Condé'],
  ['Mamadou', 'Touré'],
  ['Souleymane', 'Soumah'],
  ['Alpha', 'Cissé'],
  ['Mamadou', 'Sylla'],
  ['Ousmane', 'Diallo'],
  ['Mamadou', 'Konaté'],
  ['Sékou', 'Doumbouya'],
  ['Lansana', 'Camara'],
  ['Mamadou', 'Fofana'],
  ['Ibrahim', 'Cissé'],
  ['Boubacar', 'Touré'],
  ['Mamadou', 'Koulibaly'],
  ['Alpha', 'Barry'],
  ['Souleymane', 'Bangoura'],
  ['Mamadou', 'Soumah'],
  ['Oumar', 'Camara'],
  ['Moussa', 'Traoré'],
  ['Ibrahima', 'Diallo'],
  ['Boubacar', 'Kéita'],
  ['Mamadou', 'Sidibé'],
  ['Sékou', 'Fofana'],
  ['Mamadou', 'Cissoko'],
  ['Alpha', 'Sano'],
  ['Lansana', 'Sow'],
  ['Mamadou', 'Doucouré'],
  ['Ousmane', 'Sylla'],
  ['Mamadou', 'Bah'],
  ['Souleymane', 'Koulibaly'],
  ['Ibrahim', 'Touré'],
  ['Boubacar', 'Barry'],
  ['Mamadou', 'Bangoura'],
  ['Alpha', 'Diakité'],
  ['Sékou', 'Sylla'],
  ['Mamadou', 'Soumaoro'],
  ['Lansana', 'Fofana'],
  ['Mamadou', 'Diawara'],
  ['Oumar', 'Conté'],
  ['Moussa', 'Sidibé'],
  ['Ibrahima', 'Camara'],
]

const GUINEAN_FEMALE_NAMES: Array<[string, string]> = [
  ['Aïcha', 'Bah'],
  ['Fatou', 'Touré'],
  ['Mariam', 'Barry'],
  ['Kadiatou', 'Diallo'],
  ['Fatoumata', 'Camara'],
  ['Mariama', 'Sylla'],
  ['Kadiatou', 'Camara'],
  ['Aminata', 'Fofana'],
  ['Aïssatou', 'Yansané'],
  ['Mariam', 'Diallo'],
  ['Fatoumata', 'Barry'],
  ['Aïcha', 'Diallo'],
  ['Mariama', 'Kéita'],
  ['Ramatoulaye', 'Diallo'],
  ['Hawa', 'Camara'],
  ['Aminata', 'Traoré'],
  ['Mariam', 'Sow'],
  ['Kadiatou', 'Bah'],
  ['Fatou', 'Barry'],
  ['Mariama', 'Bangoura'],
  ['Aïssatou', 'Diallo'],
  ['Ramatoulaye', 'Bah'],
  ['Hawa', 'Diallo'],
  ['Fatoumata', 'Soumah'],
  ['Mariam', 'Kéita'],
  ['Kadiatou', 'Sow'],
  ['Aïcha', 'Barry'],
  ['Mariama', 'Camara'],
  ['Aminata', 'Camara'],
  ['Fatou', 'Camara'],
  ['Mariam', 'Camara'],
  ['Kadiatou', 'Touré'],
  ['Aïssatou', 'Barry'],
  ['Fatoumata', 'Diallo'],
  ['Mariama', 'Sow'],
  ['Ramatoulaye', 'Barry'],
  ['Hawa', 'Barry'],
  ['Aminata', 'Diallo'],
  ['Mariam', 'Touré'],
  ['Kadiatou', 'Fofana'],
  ['Fatou', 'Diallo'],
  ['Mariama', 'Diallo'],
  ['Aïcha', 'Camara'],
  ['Fatoumata', 'Touré'],
  ['Mariam', 'Bangoura'],
  ['Kadiatou', 'Barry'],
  ['Aïssatou', 'Camara'],
  ['Ramatoulaye', 'Camara'],
  ['Hawa', 'Touré'],
  ['Aminata', 'Barry'],
  ['Mariam', 'Fofana'],
  ['Kadiatou', 'Soumah'],
  ['Fatou', 'Sow'],
  ['Mariama', 'Touré'],
  ['Aïcha', 'Sow'],
  ['Fatoumata', 'Fofana'],
  ['Mariam', 'Sylla'],
  ['Kadiatou', 'Condé'],
  ['Aïssatou', 'Touré'],
  ['Ramatoulaye', 'Touré'],
  ['Hawa', 'Fofana'],
  ['Aminata', 'Condé'],
  ['Mariam', 'Soumah'],
  ['Kadiatou', 'Kéita'],
  ['Fatou', 'Fofana'],
  ['Mariama', 'Barry'],
  ['Aïcha', 'Touré'],
  ['Fatoumata', 'Condé'],
  ['Mariam', 'Condé'],
  ['Kadiatou', 'Bangoura'],
  ['Aïssatou', 'Fofana'],
  ['Ramatoulaye', 'Fofana'],
  ['Hawa', 'Soumah'],
  ['Aminata', 'Touré'],
  ['Mariam', 'Sidibé'],
  ['Kadiatou', 'Sylla'],
  ['Fatou', 'Soumah'],
  ['Mariama', 'Fofana'],
  ['Aïcha', 'Condé'],
  ['Fatoumata', 'Bangoura'],
  ['Mariam', 'Diallo'],
  ['Kadiatou', 'Traoré'],
  ['Aïssatou', 'Sow'],
  ['Ramatoulaye', 'Sow'],
  ['Hawa', 'Condé'],
  ['Aminata', 'Sow'],
  ['Mariam', 'Traoré'],
]

const LOCALITIES: Array<{ id: string; name: string }> = [
  { id: 'LOC-CON', name: 'Conakry' },
  { id: 'LOC-KIN', name: 'Kindia' },
  { id: 'LOC-LAB', name: 'Labé' },
  { id: 'LOC-BOK', name: 'Boké' },
  { id: 'LOC-NZE', name: 'Nzérékoré' },
  { id: 'LOC-KAN', name: 'Kankan' },
  { id: 'LOC-MAM', name: 'Mamou' },
  { id: 'LOC-DAB', name: 'Dabola' },
  { id: 'LOC-SIG', name: 'Siguiri' },
  { id: 'LOC-FOR', name: 'Forécariah' },
  { id: 'LOC-TEL', name: 'Télimélé' },
  { id: 'LOC-GAO', name: 'Gaoual' },
  { id: 'LOC-KOU', name: 'Koundara' },
  { id: 'LOC-MAC', name: 'Macenta' },
  { id: 'LOC-GUE', name: 'Guéckédou' },
  { id: 'LOC-KIS', name: 'Kissidougou' },
]

const ADDRESSES_BY_LOCALITY: Record<string, Array<string>> = {
  Conakry: [
    'Ratoma, Conakry',
    'Kaloum, Conakry',
    'Dixinn, Conakry',
    'Matam, Conakry',
    'Matoto, Conakry',
    'Coyah, Conakry',
    'Hamdallaye, Conakry',
    'Minière, Conakry',
    'Madina, Conakry',
    'Taouyah, Conakry',
    'Kaporo, Conakry',
    'Kagbélén, Conakry',
  ],
  Kindia: ['Kindia Centre', 'Kindia, Quartier Commerce', 'Kindia, Friguiagbé'],
  Labé: ['Labé, Quartier Lidé', 'Labé, Centre', 'Labé, Missira'],
  Boké: ['Boké, Quartier Minier', 'Boké Ville', 'Boké, Centre'],
  Nzérékoré: ['Nzérékoré, Quartier Plateau', 'Nzérékoré Centre', 'Nzérékoré, Belle-Vue'],
  Kankan: ['Kankan, Quartier Commerce', 'Kankan Centre', 'Kankan, Djélibakoro'],
  Mamou: ['Mamou Centre', 'Mamou, Quartier Marché'],
}

const PARENT_NAME_PREFIXES = ['M.', 'Mme', 'M.']

const LEVEL_CONFIG: Array<{
  levelId: string
  level: string
  cycle: string
  option: string
  classrooms: Array<{ id: string; name: string }>
  sylId: string
  baseBirthYear: number
}> = [
  {
    levelId: 'syl-1',
    level: '6ème',
    cycle: 'Primaire',
    option: 'Général',
    sylId: 'syl-1',
    classrooms: [
      { id: 'c1', name: '6ème A' },
      { id: 'c2', name: '6ème B' },
    ],
    baseBirthYear: 2011,
  },
  {
    levelId: 'syl-2',
    level: '5ème',
    cycle: 'Primaire',
    option: 'Général',
    sylId: 'syl-2',
    classrooms: [
      { id: 'c3', name: '5ème A' },
      { id: 'c4', name: '5ème B' },
    ],
    baseBirthYear: 2010,
  },
  {
    levelId: 'syl-3',
    level: '4ème',
    cycle: 'Primaire',
    option: 'Général',
    sylId: 'syl-3',
    classrooms: [
      { id: 'c5', name: '4ème A' },
    ],
    baseBirthYear: 2009,
  },
  {
    levelId: 'syl-4',
    level: '3ème',
    cycle: 'Secondaire',
    option: 'Général',
    sylId: 'syl-4',
    classrooms: [
      { id: 'c7', name: '3ème A' },
      { id: 'c8', name: '3ème B' },
    ],
    baseBirthYear: 2008,
  },
  {
    levelId: 'syl-5',
    level: '2nde',
    cycle: 'Secondaire',
    option: 'Sciences',
    sylId: 'syl-5',
    classrooms: [
      { id: 'c9', name: '2nde A' },
    ],
    baseBirthYear: 2007,
  },
  {
    levelId: 'syl-6',
    level: '1ère',
    cycle: 'Secondaire',
    option: 'Sciences',
    sylId: 'syl-6',
    classrooms: [
      { id: 'c11', name: '1ère A' },
    ],
    baseBirthYear: 2006,
  },
  {
    levelId: 'syl-7',
    level: 'Terminale',
    cycle: 'Secondaire',
    option: 'Mathématiques',
    sylId: 'syl-7',
    classrooms: [
      { id: 'c13', name: 'Terminale A' },
    ],
    baseBirthYear: 2005,
  },
]

const PHONES: Array<string> = [
  '+224 622 10 20 30',
  '+224 622 11 22 33',
  '+224 626 20 30 40',
  '+224 622 30 40 50',
  '+224 628 40 50 60',
  '+224 622 40 50 60',
  '+224 628 50 60 70',
  '+224 630 10 20 30',
  '+224 622 50 60 70',
  '+224 628 60 70 80',
  '+224 622 60 70 80',
  '+224 626 30 40 50',
  '+224 622 70 80 90',
  '+224 628 70 80 90',
  '+224 630 20 30 40',
  '+224 622 80 90 00',
  '+224 626 40 50 60',
  '+224 622 90 00 11',
  '+224 628 80 90 00',
  '+224 630 30 40 50',
]

const PREV_CLASSROOMS: Record<string, { id: string; name: string }> = {
  'c1': { id: 'p-c1', name: 'CM2 A' },
  'c2': { id: 'p-c2', name: 'CM2 B' },
  'c3': { id: 'p-c3', name: 'CM1 A' },
  'c4': { id: 'p-c4', name: 'CM1 B' },
  'c5': { id: 'p-c5', name: 'CE2 A' },
  'c7': { id: 'p-c7', name: '4ème - A' },
  'c8': { id: 'p-c8', name: '4ème - B' },
  'c9': { id: 'p-c9', name: '3ème B' },
  'c11': { id: 'p-c11', name: '2nde B' },
  'c13': { id: 'p-c13', name: '1ère B' },
}

function pick<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateEnrollmentDate(academicYear: string): string {
  const year = academicYear.split('-')[0]
  const month = Math.random() < 0.7 ? '08' : '09'
  const day = String(10 + Math.floor(Math.random() * 15)).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function generateDOB(baseYear: number, gender: 'M' | 'F'): string {
  const year = baseYear - Math.floor(Math.random() * 2)
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')
  const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function generateStudentsForLevel(
  config: typeof LEVEL_CONFIG[0],
  startIndex: number,
  maleNames: Array<[string, string]>,
  femaleNames: Array<[string, string]>,
): Array<Student> {
  const students: Array<Student> = []
  let idx = startIndex

  for (const classroom of config.classrooms) {
    const studentCount = 15
    const maleCount = Math.ceil(studentCount * 0.52)
    const femaleCount = studentCount - maleCount

    const shuffledMale = [...maleNames].sort(() => Math.random() - 0.5)
    const shuffledFemale = [...femaleNames].sort(() => Math.random() - 0.5)

    for (let i = 0; i < maleCount; i++) {
      const [first, last] = shuffledMale[i % shuffledMale.length]
      const locality = pick(LOCALITIES)
      const phone = pick(PHONES)
      const parentPrefix = pick(PARENT_NAME_PREFIXES)
      const prevClassroom = PREV_CLASSROOMS[classroom.id]
      const hasPrev = Math.random() < 0.6
      const isDropped = Math.random() < 0.03

      idx++
      students.push({
        id: `STU-${String(idx).padStart(3, '0')}`,
        annual_identifier: `EXC-2025-${String(idx).padStart(4, '0')}`,
        first_name: first,
        last_name: last,
        full_name: `${first} ${last}`,
        gender: 'M',
        date_of_birth: generateDOB(config.baseBirthYear, 'M'),
        photo_url: null,
        birthplace_locality_id: locality.id,
        birthplace_locality_name: locality.name,
        address: pick(ADDRESSES_BY_LOCALITY[locality.name] || [locality.name]),
        academic_year: '2024-2025',
        school_year_level_id: config.sylId,
        cycle: config.cycle,
        option: config.option,
        level: config.level,
        classroom_id: isDropped ? classroom.id : classroom.id,
        class_name: isDropped ? classroom.name : classroom.name,
        previous_classroom_id: hasPrev ? prevClassroom.id : null,
        previous_class_name: hasPrev ? prevClassroom.name : null,
        enrollment_status: isDropped ? 'DROPPED' : 'ACTIVE',
        enrollment_date: generateEnrollmentDate('2024-2025'),
        start_date: isDropped ? null : '2024-09-01',
        end_date: isDropped ? '2025-01-15' : null,
        transfer_reason: isDropped ? 'Déménagement familial' : null,
        parent_name: `${parentPrefix} ${last}`,
        parent_phone: phone,
        parent_email: `${last.toLowerCase().replace(/[éèêë]/g, 'e')}.${first.toLowerCase().replace(/[éèêë]/g, 'e').split(' ')[0]}@gmail.com`,
      })
    }

    for (let i = 0; i < femaleCount; i++) {
      const [first, last] = shuffledFemale[i % shuffledFemale.length]
      const locality = pick(LOCALITIES)
      const phone = pick(PHONES)
      const parentPrefix = pick(PARENT_NAME_PREFIXES)
      const prevClassroom = PREV_CLASSROOMS[classroom.id]
      const hasPrev = Math.random() < 0.6
      const isDropped = Math.random() < 0.03

      idx++
      students.push({
        id: `STU-${String(idx).padStart(3, '0')}`,
        annual_identifier: `EXC-2025-${String(idx).padStart(4, '0')}`,
        first_name: first,
        last_name: last,
        full_name: `${first} ${last}`,
        gender: 'F',
        date_of_birth: generateDOB(config.baseBirthYear, 'F'),
        photo_url: null,
        birthplace_locality_id: locality.id,
        birthplace_locality_name: locality.name,
        address: pick(ADDRESSES_BY_LOCALITY[locality.name] || [locality.name]),
        academic_year: '2024-2025',
        school_year_level_id: config.sylId,
        cycle: config.cycle,
        option: config.option,
        level: config.level,
        classroom_id: isDropped ? classroom.id : classroom.id,
        class_name: isDropped ? classroom.name : classroom.name,
        previous_classroom_id: hasPrev ? prevClassroom.id : null,
        previous_class_name: hasPrev ? prevClassroom.name : null,
        enrollment_status: isDropped ? 'DROPPED' : 'ACTIVE',
        enrollment_date: generateEnrollmentDate('2024-2025'),
        start_date: isDropped ? null : '2024-09-01',
        end_date: isDropped ? '2025-02-20' : null,
        transfer_reason: isDropped ? 'Redoublement dans autre établissement' : null,
        parent_name: `${parentPrefix} ${last}`,
        parent_phone: phone,
        parent_email: `${last.toLowerCase().replace(/[éèêë]/g, 'e')}.${first.toLowerCase().replace(/[éèêë]/g, 'e').split(' ')[0]}@gmail.com`,
      })
    }
  }

  return students
}

function generateAllStudents(): Array<Student> {
  const students: Array<Student> = []
  let idx = 10

  const maleNames = [...GUINEAN_MALE_NAMES]
  const femaleNames = [...GUINEAN_FEMALE_NAMES]

  for (const config of LEVEL_CONFIG) {
    const generated = generateStudentsForLevel(config, idx, maleNames, femaleNames)
    idx += generated.length
    students.push(...generated)
  }

  return students
}

export const MOCK_STUDENTS: Array<Student> = [
  {
    id: 'STU-001',
    annual_identifier: 'EXC-2025-0001',
    first_name: 'Alpha Oumar',
    last_name: 'Diallo',
    full_name: 'Alpha Oumar Diallo',
    gender: 'M',
    date_of_birth: '2011-05-12',
    photo_url: null,
    birthplace_locality_id: 'LOC-CON',
    birthplace_locality_name: 'Conakry',
    address: 'Ratoma, Conakry',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-1',
    cycle: 'Primaire',
    option: 'Général',
    level: '6ème',
    classroom_id: 'c1',
    class_name: '6ème A',
    previous_classroom_id: 'p-c1',
    previous_class_name: 'CM2 A',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2024-08-10',
    start_date: '2024-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Diallo',
    parent_phone: '+224 622 10 20 30',
    parent_email: 'diallo.alphaoumar@gmail.com',
  },
  {
    id: 'STU-002',
    annual_identifier: 'EXC-2025-0002',
    first_name: 'Aïcha',
    last_name: 'Bah',
    full_name: 'Aïcha Bah',
    gender: 'F',
    date_of_birth: '2011-08-22',
    photo_url: null,
    birthplace_locality_id: 'LOC-CON',
    birthplace_locality_name: 'Conakry',
    address: 'Kaloum, Conakry',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-1',
    cycle: 'Primaire',
    option: 'Général',
    level: '6ème',
    classroom_id: 'c1',
    class_name: '6ème A',
    previous_classroom_id: 'p-c1',
    previous_class_name: 'CM2 A',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2024-08-12',
    start_date: '2024-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Bah',
    parent_phone: '+224 622 11 22 33',
    parent_email: 'bah.aicha@gmail.com',
  },
  {
    id: 'STU-003',
    annual_identifier: 'EXC-2025-0003',
    first_name: 'Moussa',
    last_name: 'Camara',
    full_name: 'Moussa Camara',
    gender: 'M',
    date_of_birth: '2010-11-03',
    photo_url: null,
    birthplace_locality_id: 'LOC-KIN',
    birthplace_locality_name: 'Kindia',
    address: 'Kindia Centre',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-1',
    cycle: 'Primaire',
    option: 'Général',
    level: '6ème',
    classroom_id: 'c2',
    class_name: '6ème B',
    previous_classroom_id: 'p-c2',
    previous_class_name: 'CM2 B',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2024-08-15',
    start_date: '2024-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Camara',
    parent_phone: '+224 626 20 30 40',
    parent_email: 'camara.moussa1@gmail.com',
  },
  {
    id: 'STU-004',
    annual_identifier: 'EXC-2025-0004',
    first_name: 'Fatou',
    last_name: 'Touré',
    full_name: 'Fatou Touré',
    gender: 'F',
    date_of_birth: '2011-02-18',
    photo_url: null,
    birthplace_locality_id: 'LOC-CON',
    birthplace_locality_name: 'Conakry',
    address: 'Dixinn, Conakry',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-1',
    cycle: 'Primaire',
    option: 'Général',
    level: '6ème',
    classroom_id: 'c2',
    class_name: '6ème B',
    previous_classroom_id: 'p-c2',
    previous_class_name: 'CM2 B',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2024-08-08',
    start_date: '2024-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Touré',
    parent_phone: '+224 622 30 40 50',
    parent_email: 'toure.fatou@gmail.com',
  },
  {
    id: 'STU-005',
    annual_identifier: 'EXC-2025-0005',
    first_name: 'Mamadou',
    last_name: 'Sow',
    full_name: 'Mamadou Sow',
    gender: 'M',
    date_of_birth: '2010-06-25',
    photo_url: null,
    birthplace_locality_id: 'LOC-LAB',
    birthplace_locality_name: 'Labé',
    address: 'Labé, Quartier Lidé',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-2',
    cycle: 'Primaire',
    option: 'Général',
    level: '5ème',
    classroom_id: 'c3',
    class_name: '5ème A',
    previous_classroom_id: 'p-c3',
    previous_class_name: 'CM1 A',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2023-08-20',
    start_date: '2023-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Sow',
    parent_phone: '+224 628 40 50 60',
    parent_email: 'sow.mamadou1@gmail.com',
  },
  {
    id: 'STU-006',
    annual_identifier: 'EXC-2025-0006',
    first_name: 'Mariam',
    last_name: 'Barry',
    full_name: 'Mariam Barry',
    gender: 'F',
    date_of_birth: '2010-09-10',
    photo_url: null,
    birthplace_locality_id: 'LOC-CON',
    birthplace_locality_name: 'Conakry',
    address: 'Matam, Conakry',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-2',
    cycle: 'Primaire',
    option: 'Général',
    level: '5ème',
    classroom_id: 'c4',
    class_name: '5ème B',
    previous_classroom_id: 'p-c4',
    previous_class_name: 'CM1 B',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2023-08-22',
    start_date: '2023-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Barry',
    parent_phone: '+224 622 40 50 60',
    parent_email: 'barry.mariam@gmail.com',
  },
  {
    id: 'STU-007',
    annual_identifier: 'EXC-2025-0007',
    first_name: 'Souleymane',
    last_name: 'Konaté',
    full_name: 'Souleymane Konaté',
    gender: 'M',
    date_of_birth: '2008-04-15',
    photo_url: null,
    birthplace_locality_id: 'LOC-BOK',
    birthplace_locality_name: 'Boké',
    address: 'Boké, Quartier Minier',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-4',
    cycle: 'Secondaire',
    option: 'Général',
    level: '3ème',
    classroom_id: 'c7',
    class_name: '3ème A',
    previous_classroom_id: 'p-c7',
    previous_class_name: '4ème - A',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2022-08-18',
    start_date: '2022-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Konaté',
    parent_phone: '+224 628 50 60 70',
    parent_email: 'konate.souleymane@gmail.com',
  },
  {
    id: 'STU-008',
    annual_identifier: 'EXC-2025-0008',
    first_name: 'Kadiatou',
    last_name: 'Diallo',
    full_name: 'Kadiatou Diallo',
    gender: 'F',
    date_of_birth: '2006-12-08',
    photo_url: null,
    birthplace_locality_id: 'LOC-NZE',
    birthplace_locality_name: 'Nzérékoré',
    address: 'Nzérékoré, Quartier Plateau',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-7',
    cycle: 'Secondaire',
    option: 'Mathématiques',
    level: 'Terminale',
    classroom_id: 'c13',
    class_name: 'Terminale A',
    previous_classroom_id: 'p-c13',
    previous_class_name: '1ère B',
    enrollment_status: 'ACTIVE',
    enrollment_date: '2021-08-25',
    start_date: '2021-09-01',
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Diallo',
    parent_phone: '+224 630 10 20 30',
    parent_email: 'diallo.kadiatou@gmail.com',
  },
  {
    id: 'STU-009',
    annual_identifier: 'EXC-2025-0009',
    first_name: 'Oumar',
    last_name: 'Fernandes',
    full_name: 'Oumar Fernandes',
    gender: 'M',
    date_of_birth: '2012-01-20',
    photo_url: null,
    birthplace_locality_id: 'LOC-CON',
    birthplace_locality_name: 'Conakry',
    address: 'Coyah, Conakry',
    academic_year: '2024-2025',
    school_year_level_id: 'syl-1',
    cycle: 'Primaire',
    option: 'Général',
    level: '6ème',
    classroom_id: '',
    class_name: '',
    previous_classroom_id: null,
    previous_class_name: null,
    enrollment_status: 'PRE_REGISTERED',
    enrollment_date: '2024-09-10',
    start_date: null,
    end_date: null,
    transfer_reason: null,
    parent_name: 'M. Fernandes',
    parent_phone: '+224 622 50 60 70',
    parent_email: 'fernandes.oumar@gmail.com',
  },
  {
    id: 'STU-010',
    annual_identifier: 'EXC-2024-0010',
    first_name: 'Boubacar',
    last_name: 'Sy',
    full_name: 'Boubacar Sy',
    gender: 'M',
    date_of_birth: '2005-07-30',
    photo_url: null,
    birthplace_locality_id: 'LOC-KAN',
    birthplace_locality_name: 'Kankan',
    address: 'Kankan, Quartier Commerce',
    academic_year: '2023-2024',
    school_year_level_id: 'syl-7',
    cycle: 'Secondaire',
    option: 'Mathématiques',
    level: 'Terminale',
    classroom_id: 'c13',
    class_name: 'Terminale A',
    previous_classroom_id: null,
    previous_class_name: null,
    enrollment_status: 'COMPLETED',
    enrollment_date: '2020-08-20',
    start_date: '2020-09-01',
    end_date: '2024-06-30',
    transfer_reason: null,
    parent_name: 'M. Sy',
    parent_phone: '+224 628 60 70 80',
    parent_email: 'sy.boubacar@gmail.com',
  },
  ...generateAllStudents(),
]
