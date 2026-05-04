# Guinean Educational System Context (Domain Knowledge)

> This skill provides the exact domain knowledge, taxonomy, and mock data parameters required when building features for the School Management System. Whenever you generate mock data, forms, or structures, you MUST adhere strictly to the Guinean reality defined below.

---

## 1. Administrative Structure (Hiérarchie)

When structuring school networks, use these Guinean administrative levels:

- **MENA**: Ministère de l'Éducation Nationale et de l'Alphabétisation (The governing body).
- **IRE (Inspection Régionale de l'Éducation)**: 
  - *Mock Values*: Conakry, Kindia, Labé, Kankan, Mamou, Faranah, Nzérékoré, Boké.
- **DPE / DCE (Direction Préfectorale / Communale de l'Éducation)**: 
  - *Mock Values (Conakry)*: Ratoma, Dixinn, Matoto, Matam, Kaloum.
  - *Mock Values (Regions)*: Coyah, Dubréka, Pita, Dalaba, Kouroussa, etc.
- **DSEE**: Délégation Scolaire de l'Enseignement Élémentaire (Sub-division for primary schools).

---

## 2. Types of Schools

- **Public**: State-owned schools (e.g., *Lycée Donka, Lycée 28 Septembre, Collège Château d'Eau*).
- **Privé**: Private institutions (e.g., *Complexe Scolaire Saint-Georges, Groupe Scolaire Ousmane Camara*).
- **Franco-Arabe**: Schools teaching the general curriculum alongside Islamic/Arabic education.

---

## 3. Educational Cycles & Levels (Niveaux d'Enseignement)

Use these exact terms for cycles and levels. **Do not use French (France) or American terms** (no Sixième, Cinquième, Freshman, Sophomore).

### A. Primaire (6 years)
- **Levels**: 1ère Année, 2ème Année, 3ème Année, 4ème Année, 5ème Année, 6ème Année.
- **Final Exam**: CEE (Certificat d'Études Élémentaires) or "Examen d'Entrée en 7ème".

### B. Collège (4 years)
- **Levels**: 7ème Année, 8ème Année, 9ème Année, 10ème Année.
- **Final Exam**: BEPC (Brevet d'Études du Premier Cycle).

### C. Lycée (3 years)
- **Levels**: 11ème Année, 12ème Année, Terminale.
- **Final Exam**: Baccalauréat Unique.

---

## 4. Profils / Séries (High School Tracks)

Starting from the 11ème Année (Lycée), students must choose a specific track. 
When creating track/options data, strictly use these 3 main profiles:

1. **Sciences Mathématiques (SM)**: Heavy focus on Maths, Physics, and Chemistry.
2. **Sciences Expérimentales (SE)**: Heavy focus on Biology, Chemistry, and Physics.
3. **Sciences Sociales (SS)**: Focus on History, Geography, Philosophy, Economics, and French.

*(Note: Collège has no specific tracks, it is considered "Enseignement Général").*

---

## 5. Standard Subjects (Matières)

When seeding subjects or building report cards, use these standard names:

- **Scientifiques**: Mathématiques, Physique, Chimie, Biologie.
- **Littéraires & Humaines**: Français, Philosophie (Lycée), Histoire, Géographie, ECM (Éducation Civique et Morale - Collège).
- **Langues**: Anglais (mandatory), sometimes Arabe (in Franco-Arabe schools).
- **Autres**: EPS (Éducation Physique et Sportive).

---

## 6. Grading System (Notation)

- **Scale**: All grades are out of 20 (e.g., 14/20).
- **Passing Grade**: 10/20 (La moyenne).
- **Terms**: The academic year is typically divided into **Trimestres** (1er, 2ème, 3ème Trimestre) or **Semestres** depending on the school's internal policy, but Trimestres are the most common in the public system.

---

## Example Usage for AI Agents
When the user asks to "Create a student profile", the AI should generate:
> "Mamadou Diallo, student in 12ème Année, Profil: Sciences Expérimentales, at Lycée Albert Camus (IRE Conakry, DCE Ratoma)."
*Instead of: "John Doe, Grade 11, Science Major, High School."*
