# Plan des Portails EduVault pour la Guinée

## Vue d'ensemble

Système de gestion académique avec 5 portails distincts adaptés au système éducatif guinéen (basé sur le modèle français).

**Langue:** Français (UI principale)  
**Monnaie:** Franc Guinéen (GNF)  
**Système de notation:** 0-20  
**Trimestres:** 3 par année scolaire  

---

## 1. Portail Administrateur Système

### Navigation
```
Dashboard
├── Vue d'ensemble plateforme
├── Écoles
│   ├── Liste des écoles
│   ├── Créer école
│   └── Statistiques écoles
├── Utilisateurs
│   ├── Gestion globale
│   └── Audit des connexions
├── Configuration
│   ├── Paramètres système
│   └── Sécurité
└── Rapports
    ├── Analytiques plateforme
    └── Journaux d'audit
```

### Widgets Dashboard
1. **Santé de la plateforme**
   - Statut serveurs (vert/orange/rouge)
   - Uptime: 99.8%
   - Temps de réponse moyen: 120ms

2. **Statistiques écoles**
   - Total: 47 écoles
   - Actives: 45 écoles
   - En attente: 2 écoles

3. **Croissance utilisateurs**
   - Total: 28,450 utilisateurs
   - +380 ce mois
   - Graphique: Ligne de tendance

4. **Alertes système**
   - 3 alertes critiques
   - 12 avertissements
   - Liste déroulante

### Données factices
- **Écoles:** Lycée Donka (Conakry), Collège Coléah (Conakry), École Primaire Hamdallaye, Lycée Gamal Abdel Nasser (Conakry)
- **Administrateurs:** Mamadou Diallo, Fatoumata Bah, Ibrahima Sow

---

## 2. Portail Administrateur d'École (Chef d'Établissement)

### Navigation
```
Tableau de bord
├── Vue d'ensemble école
├── Personnel
│   ├── Enseignants
│   └── Personnel administratif
├── Élèves
│   ├── Liste des élèves
│   ├── Inscriptions
│   └── Promotions
├── Parents/Tuteurs
│   ├── Liste
│   └── Communications
├── Classes
│   ├── Emplois du temps
│   ├── Salles
│   └── Affectations
├── Finances
│   ├── Frais de scolarité
│   ├── Paiements
│   └── Rapports financiers
└── Rapports
    ├── Statistiques académiques
    └── Présence
```

### Widgets Dashboard
1. **Effectifs**
   - Total élèves: 850
   - Nouveaux inscrits: 45
   - Taux de présence: 92%

2. **Recouvrement des frais**
   - Attendu: 425,000,000 GNF
   - Collecté: 380,500,000 GNF (89.5%)
   - En retard: 44,500,000 GNF

3. **Personnel**
   - Enseignants: 42
   - Présents aujourd'hui: 40
   - En congé: 2

4. **Alertes école**
   - Paiements en retard: 85 élèves
   - Classes surchargées: 3
   - Matériel manquant: 2 salles

### Données factices
- **École:** Lycée Donka
- **Chef d'Établissement:** M. Mamadou Diallo
- **Classes:** 6ème A-D (4 classes), 5ème A-C, 4ème A-C, 3ème A-C, 2nde A-B, 1ère S-L, Terminale S-L
- **Frais annuels:** 500,000 GNF (Primaire), 750,000 GNF (Collège), 1,000,000 GNF (Lycée)

---

## 3. Portail Enseignant

### Navigation
```
Tableau de bord
├── Mes classes
│   ├── Liste des classes
│   └── Emploi du temps
├── Présence
│   ├── Saisir présence
│   └── Historique
├── Notes
│   ├── Saisir notes
│   ├── Bulletins
│   └── Statistiques
├── Devoirs
│   ├── Créer devoir
│   ├── Corrections
│   └── Historique
├── Communications
│   ├── Messages parents
│   └── Annonces classe
└── Ressources
    ├── Cours
    └── Documents
```

### Widgets Dashboard
1. **Aujourd'hui**
   - Cours suivant: 10h00 - Mathématiques - 3ème A
   - Présence à saisir: 2 classes
   - Devoirs à corriger: 28

2. **Mes classes**
   - 3ème A: 35 élèves (Mathématiques)
   - 3ème B: 32 élèves (Mathématiques)
   - 3ème C: 30 élèves (Mathématiques)
   - Total: 97 élèves

3. **Évaluations à venir**
   - Devoir surveillé: 15/01 - 3ème A
   - Composition: 25/01 - Toutes les 3èmes
   - Oral: 18/01 - 3ème B

4. **Alertes élèves**
   - Absences répétées: 3 élèves
   - Notes en baisse: 5 élèves
   - Retards fréquents: 2 élèves

### Données factices
- **Enseignant:** M. Ibrahima Sow (Professeur de Mathématiques)
- **Matières:** Mathématiques
- **Classes:** 3ème A, 3ème B, 3ème C
- **Élèves notables:** Mamadou Camara (1er), Fatoumata Sylla (2e), Aïssatou Diallo (3e)

---

## 4. Portail Élève

### Navigation
```
Tableau de bord
├── Mon emploi du temps
├── Mes notes
│   ├── Notes par matière
│   ├── Moyennes
│   └── Bulletins
├── Présence
│   └── Mon historique
├── Devoirs
│   ├── À faire
│   ├── Rendus
│   └── Corrections
├── Communications
│   ├── Messages professeurs
│   └── Annonces
└── Ressources
    └── Cours disponibles
```

### Widgets Dashboard
1. **Aujourd'hui (Lundi 13 Janvier)**
   - 8h00-9h00: Mathématiques - Salle 12 - M. Sow
   - 9h00-10h00: Français - Salle 8 - Mme Diallo
   - 10h30-11h30: Anglais - Salle 15 - M. Barry
   - 11h30-12h30: Histoire-Géo - Salle 10 - Mme Camara

2. **Mes notes récentes**
   - Mathématiques: 16/20 (Devoir)
   - Français: 14/20 (Composition)
   - SVT: 15/20 (TP)
   - Moyenne générale: 14.8/20

3. **Devoirs en cours**
   - Mathématiques: Ex 12-15 p.45 - À rendre: 15/01
   - Français: Dissertation - À rendre: 18/01
   - Anglais: Exercices - À rendre: 14/01

4. **Présence ce mois**
   - Présent: 18 jours
   - Absent: 1 jour
   - Retards: 0
   - Taux: 94.7%

### Données factices
- **Élève:** Mamadou Camara
- **Classe:** 3ème A
- **Rang:** 1er/35
- **Moyenne:** 16.5/20
- **Matières:** Mathématiques, Français, Anglais, Histoire-Géo, SVT, Physique-Chimie, EPS, Arts

---

## 5. Portail Parent/Tuteur

### Navigation
```
Tableau de bord
├── Mes enfants
│   └── Vue par enfant
├── Scolarité
│   ├── Notes et bulletins
│   ├── Présence
│   └── Emploi du temps
├── Finances
│   ├── Frais de scolarité
│   ├── Paiements
│   └── Reçus
├── Communications
│   ├── Messages professeurs
│   └── Notifications école
└── Réunions
    └── Rendez-vous parents
```

### Widgets Dashboard
1. **Mes enfants**
   - **Mamadou Camara** (3ème A)
     - Moyenne: 16.5/20 - Rang: 1er
     - Présence: 94.7%
     - Statut: Excellent
   
   - **Aïssatou Camara** (5ème B)
     - Moyenne: 13.2/20 - Rang: 8e
     - Présence: 96%
     - Statut: Bien

2. **Frais de scolarité**
   - Total annuel: 1,500,000 GNF (2 enfants)
   - Payé: 1,000,000 GNF
   - Reste: 500,000 GNF
   - Échéance: 28/02/2025

3. **Messages récents**
   - M. Sow: "Excellent travail de Mamadou" - 10/01
   - Mme Diallo: "Réunion parents 20/01" - 08/01
   - Administration: "Rappel paiement 2e trimestre" - 05/01

4. **Présence cette semaine**
   - Mamadou: 5/5 jours
   - Aïssatou: 5/5 jours
   - Aucune absence

### Données factices
- **Parent:** Mme Fatoumata Bah
- **Enfants:** Mamadou Camara (3ème A), Aïssatou Camara (5ème B)
- **Contact:** +224 621 234 567

---

## Système de couleurs & priorités

### Code couleur des alertes
- 🔴 **Rouge (Critique):** Absences prolongées, échec imminent, paiements très en retard
- 🟠 **Orange (Attention):** Notes en baisse, retards fréquents, paiements en retard
- 🟢 **Vert (Info):** Succès, félicitations, paiements à jour
- 🔵 **Bleu (Neutre):** Informations générales, annonces

### Indicateurs visuels
- **Badges:** Nombre de notifications non lues
- **Graphiques:** Évolution des notes, taux de présence
- **Barres de progression:** Recouvrement des frais, complétion des devoirs
- **Icônes:** Statut en un coup d'œil

---

## Données factices complètes

### Écoles (Guinée)
1. **Lycée Donka** (Conakry) - 850 élèves
2. **Collège Coléah** (Conakry) - 620 élèves
3. **École Primaire Hamdallaye** (Conakry) - 450 élèves
4. **Lycée Gamal Abdel Nasser** (Conakry) - 780 élèves
5. **Collège Kissidougou** (Kissidougou) - 420 élèves

### Noms guinéens courants
**Garçons:** Mamadou, Ibrahima, Abdoulaye, Thierno, Ousmane, Alpha, Sékou, Souleymane  
**Filles:** Fatoumata, Aïssatou, Mariama, Kadiatou, Hawa, Aminata, Djénabou

**Noms de famille:** Diallo, Bah, Barry, Camara, Sow, Sylla, Touré, Condé

### Matières par niveau

**Collège (6ème-3ème):**
- Mathématiques
- Français
- Anglais
- Histoire-Géographie
- Sciences de la Vie et de la Terre (SVT)
- Physique-Chimie
- Éducation Physique et Sportive (EPS)
- Arts Plastiques
- Éducation Civique

**Lycée (2nde-Terminale):**
- **Série S (Scientifique):** Math, Physique-Chimie, SVT
- **Série L (Littéraire):** Français, Philosophie, Langues, Histoire-Géo

### Structure des frais (GNF)
- **École Primaire:** 300,000 - 500,000 GNF/an
- **Collège:** 500,000 - 750,000 GNF/an
- **Lycée:** 750,000 - 1,200,000 GNF/an

*(Frais incluent: Inscription, scolarité, cantine, activités)*

---

## Considérations techniques

### Mobile-first
- Interface responsive (mobile < tablet < desktop)
- Navigation simplifiée sur mobile
- Gestes tactiles (swipe, pull-to-refresh)

### Performance (faible bande passante)
- Images compressées
- Chargement progressif
- Mode hors ligne (cache local)
- Synchronisation différée

### Notifications
- **SMS:** Pour alertes critiques (absences, paiements, urgences)
- **Push web:** Pour utilisateurs avec internet
- **Email:** Récapitulatifs hebdomadaires

### Langue
- Interface principale: Français
- Support futur: Pular, Malinké, Soussou (phases ultérieures)

---

## Prochaines étapes d'implémentation

1. **Phase 1:** Structures de données & API
   - Modèles de base de données
   - Endpoints REST pour chaque portail
   - Authentification & autorisation par rôle

2. **Phase 2:** Portails administrateurs
   - Admin système
   - Admin école
   - Données factices de test

3. **Phase 3:** Portails utilisateurs finaux
   - Enseignant
   - Élève
   - Parent

4. **Phase 4:** Fonctionnalités avancées
   - Notifications SMS
   - Rapports PDF
   - Analytics avancés
   - Mobile app (optionnel)

---

**Document créé le:** 2025-01-05  
**Version:** 1.0  
**Statut:** Plan initial - En attente de validation
