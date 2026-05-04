import type { Cycle, Level, Track, Subject, Period } from './types';

export const mockCycles: Cycle[] = [
  { id: 'CYC-01', name: 'Préscolaire', duration: '3 ans', status: 'Active' },
  { id: 'CYC-02', name: 'Primaire', duration: '6 ans', status: 'Active' },
  { id: 'CYC-03', name: 'Collège', duration: '4 ans', status: 'Active' },
  { id: 'CYC-04', name: 'Lycée', duration: '3 ans', status: 'Active' },
];

export const mockLevels: Level[] = [
  { id: 'LVL-01', cycle_id: 'CYC-02', name: 'Cours Préparatoire 1', code: 'CP1' },
  { id: 'LVL-02', cycle_id: 'CYC-02', name: 'Cours Préparatoire 2', code: 'CP2' },
  { id: 'LVL-03', cycle_id: 'CYC-03', name: '7ème Année', code: '7A' },
  { id: 'LVL-04', cycle_id: 'CYC-03', name: '8ème Année', code: '8A' },
  { id: 'LVL-05', cycle_id: 'CYC-04', name: '11ème Année', code: '11A' },
  { id: 'LVL-06', cycle_id: 'CYC-04', name: 'Terminale', code: 'TLE' },
];

export const mockTracks: Track[] = [
  { id: 'TRK-01', name: 'Sciences Mathématiques', description: 'Profil scientifique axé sur les mathématiques et la physique.', cycle_id: 'CYC-04', status: 'Active' },
  { id: 'TRK-02', name: 'Sciences Expérimentales', description: 'Profil scientifique axé sur la biologie et la chimie.', cycle_id: 'CYC-04', status: 'Active' },
  { id: 'TRK-03', name: 'Sciences Sociales', description: 'Profil littéraire et sciences humaines.', cycle_id: 'CYC-04', status: 'Active' },
  { id: 'TRK-04', name: 'Enseignement Général', description: 'Tronc commun pour le collège.', cycle_id: 'CYC-03', status: 'Active' },
];

export const mockSubjects: Subject[] = [
  { id: 'SUB-01', name: 'Mathématiques', code: 'MATH', coefficient: 5, cycle_ids: ['CYC-03', 'CYC-04'], track_id: 'TRK-01' },
  { id: 'SUB-02', name: 'Physique-Chimie', code: 'PC', coefficient: 4, cycle_ids: ['CYC-03', 'CYC-04'], track_id: 'TRK-02' },
  { id: 'SUB-03', name: 'Français', code: 'FR', coefficient: 3, cycle_ids: ['CYC-02', 'CYC-03', 'CYC-04'] },
  { id: 'SUB-04', name: 'Histoire-Géographie', code: 'HG', coefficient: 3, cycle_ids: ['CYC-03', 'CYC-04'], track_id: 'TRK-03' },
  { id: 'SUB-05', name: 'Biologie', code: 'BIO', coefficient: 4, cycle_ids: ['CYC-04'], track_id: 'TRK-02' },
];

export const mockPeriods: Period[] = [
  { id: 'PER-01', name: '1er Trimestre', type: 'Trimestre', start_date: '2024-10-01', end_date: '2024-12-31', status: 'Active' },
  { id: 'PER-02', name: '2ème Trimestre', type: 'Trimestre', start_date: '2025-01-01', end_date: '2025-03-31', status: 'Inactive' },
  { id: 'PER-03', name: '3ème Trimestre', type: 'Trimestre', start_date: '2025-04-01', end_date: '2025-06-30', status: 'Inactive' },
  { id: 'PER-04', name: '1er Semestre', type: 'Semestre', start_date: '2024-10-01', end_date: '2025-02-28', status: 'Active' },
];
