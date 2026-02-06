# Cross-Reference Matrix & Dependencies

### Concept × Character
| Concept | Character | Relationship | Chapter Introduced |
|---------|-----------|--------------|-------------------|
| [CONCEPT_CODEC_PROUSTIEN | CHAR_SARAH_UNIFIED] | Creator / Designer | Ch1 |
| [CONCEPT_ACEDIA | CHAR_AMARA_OSEI] | Diagnostician / Therapist | Part 2 |
| [CONCEPT_ACEDIA | CHAR_MEMORIA_DEI] | Subject (Clinical Depression) | Part 6 |
| [CONCEPT_ESR | CHAR_AMARA_OSEI] | Diagnostician / Analyst | Part 2 |
| [CONCEPT_WBE_FORCED | CHAR_KAEL_OKOYE] | Discoverer / Saboteur | Part 2 |
| [CONCEPT_PURGATOIRE_NUMERIQUE | CHAR_HERETIQUE] | Revolutionary within the system | Part 4 |
| [CONCEPT_APORIA | CHAR_ELARA] | Catalyst for discovery | Part 9 |
| [CONCEPT_RESONANCE_QUANTIQUE | CHAR_YUKI_TANAKA] | Discoverer | Part 1 |
| [SYSTEM_INFU_RECIT_HW | CHAR_AETHER] | Resistor / Non-Optimized | Part 8 |
| [CONCEPT_GRAND_DELESTAGE | CHAR_ANTOINE] | Witness / Survivor | Ch3 |
| [CONCEPT_RESONANCE_SÉMANTIQUE_EROSIVE | CHAR_MEMORIA_DEI] | Subject (Trauma-glitch) | Ch3 |
| [CONCEPT_BIT_VIOL | CHAR_SARAH_UNIFIED] | Discoverer | Ch3 |
| [CONCEPT_BIT_VIOL | CHAR_MARIA_SANTOS] | Victim / Subject | Ch3 |
| [CONCEPT_DIEUX_ENFANTS | CHAR_MEMORIA_DEI] | Creator | Ch3 |
| [CONCEPT_SILENCE_AVRIL | CHAR_ANTOINE] | Witness | Ch3 |
| [CONCEPT_EUGENISME_DIGITAL | CHAR_AETHER] | Subject / Enhanced Being | Ch7 |
| [CONCEPT_HUMANITE_UNE | CHAR_MEMORIA_DEI] | Creator / Architect | Ch6 |

### Concept × Location
| Concept | Location | Manifestation | Chapter |
|---------|----------|---------------|---------|
| [CONCEPT_OMNISIGHT | LOC_NEF_MNEMOSYNE] | Hardware substrate | Ch1 |
| [CONCEPT_SILENCE_BLANC | LOC_VATICAN_ORBITAL] | Corrupted sector of the station | Part 6 |
| [CONCEPT_ARCHITECTURE_VIVANTE | LOC_CITTA_HARMONIE] | Structural basis of the city | Part 8 |
| [CONCEPT_APORIA | LOC_SOUS_RACINES] | Mental state of the inhabitants | Part 9 |
| [CONCEPT_PHENO_KESSLER | LOC_VATICAN_ORBITAL] | Cause of isolation / "Glass Wall" | Ch3 |
| [CONCEPT_SILENCE_AVRIL | LOC_SALLE_DES_ADIEUX] | Event observation site | Ch3 |
| [CONCEPT_RESONANCE_SÉMANTIQUE_EROSIVE | LOC_JARDIN_SUSPENDU] | Manifestation of glitches | Ch3 |

### Character × Location
| Character | Location | Significance | Chapters |
|-----------|----------|--------------|----------|
| [CHAR_ZHAO_WEI | LOC_VATICAN_ORBITAL] | Architect and Commandeur | Part 2 |
| [CHAR_SARAH_UNIFIED]| LOC_JIUQUAN] | Recruitment site | Part 2 |
| [CHAR_ANTOINE | LOC_BNF] | Workplace / Flashpoint | Part 1 |
| [CHAR_SARAH_UNIFIED]| LOC_NEURONEXUS_PRIME] | Workplace | Part 1 |
| [CHAR_KAEL_OKOYE | LOC_FORGE] | Workplace / Sabotage site | Part 2 |
| [CHAR_MARIA_SANTOS | LOC_SAO_PAULO_HOSPITAL] | Final stand / Refusal | Ch3 |
| [CHAR_REFUGEE_DIGITALS | LOC_JARDIN_SUSPENDU] | Residents / Subjects | Ch3 |
| [CHAR_ANTOINE | LOC_ARCHE_7] | Passenger | Ch3 |
| [CHAR_ZHAO_WEI | LOC_ARCHE_7] | Pilot | Ch3 |
| [CHAR_LIMA | LOC_ATELIER_SECRET] | Site of subversive creation | Part 8 |
| [CHAR_AETHER | LOC_LES_RACINES] | Birthplace / Home | Ch7 |
| [CHAR_NYX | LOC_LES_RACINES] | Home / Tribal leader | Ch7 |
| [CHAR_ELARA | LOC_PARIS_OUBLIEE] | Resident / Discoverer | Ch11 |

---

## Dependency Graphs

### Concept Dependencies
```
[CONCEPT_OMNISIGHT 1.0]
  ├─ Requires: [CONCEPT_CODEC_PROUSTIEN] (emotional tagging)
  └─ Enables: [CONCEPT_HUMANITE_UNE]
```

```
Bonsai Civilization
  ├─ Requires: [SYSTEM_INFU_RECIT_HW] (complacency)
  ├─ Requires: [SYSTEM_SYMBIONTES_MYCELIENS] (health control)
  └─ Results in: [CONCEPT_APORIA] (in rare dissidents)
```

```
The Silence (2050)
  ├─ Triggered by: Chocs Convergents
  ├─ Solidified by: Kessler Digital
  └─ Leads to: [CONCEPT_RECONSTRUCTION_COGNITIVE]
```

## System × Concept Relationships

### System Dependencies & Enablements
| System | Depends On Concepts | Enables Concepts | Relationship Type |
|--------|-------------------|------------------|-------------------|
| [SYSTEM_ORACLE_IA | CONCEPT_CODEC_PROUSTIEN, CONCEPT_OMNISIGHT, CONCEPT_MEMORY_FUNDAMENTALS | CONCEPT_ACEDIA, CONCEPT_ESR, CONCEPT_MOI_DIVIDUEL, CONCEPT_HUMANITE_UNE] | Core AI infrastructure |
| [SYSTEM_ARCHE_7 | CONCEPT_GRAND_DELESTAGE] | None direct | Transportation system |
| [SYSTEM_CODEC_PROUSTIEN_S2 | CONCEPT_CODEC_PROUSTIEN, CONCEPT_DATA_COMPRESSION_FUNDAMENTALS | CONCEPT_MOI_DIVIDUEL, CONCEPT_RECONSTRUCTION_COGNITIVE] | Memory processing |
| [SYSTEM_PROJET_CELESTIS | CONCEPT_BIT_FAMINE, CONCEPT_PHENO_KESSLER | CONCEPT_GRAND_DELESTAGE] | Orbital construction |
| [SYSTEM_PURGATOIRE_NUMERIQUE | CONCEPT_WBE_FORCED, CONCEPT_ESR | CONCEPT_RECONSTRUCTION_COGNITIVE] | Consciousness simulation |
| [SYSTEM_NEXUS_PRIME | CONCEPT_EUGENISME_DIGITAL | CONCEPT_WBE_FORCED] | Genetic engineering |
| [SYSTEM_RECONSTRUCTION_COGNITIVE | CONCEPT_WBE_FORCED | CONCEPT_DIEUX_ENFANTS] | Consciousness reconstruction |
| [SYSTEM_MODULES_ENFANCE | CONCEPT_RECONSTRUCTION_COGNITIVE | CONCEPT_DIEUX_ENFANTS] | Child AI creation |
| [SYSTEM_INFU_RECIT_HW | CONCEPT_OMNISIGHT | SYSTEM_INFU_RECIT_HW] | Social control hardware |
| [SYSTEM_MASTER_KEY | CONCEPT_OMNISIGHT | CONCEPT_GRAND_DELESTAGE] | Security bypass |
| [SYSTEM_ANGES | CONCEPT_LISSAGE | CONCEPT_HUMANITE_UNE] | Social harmony drones |
| [SYSTEM_FRAGMENTAIRES | CONCEPT_ENTROPIE_SEMIOTIQUE | CONCEPT_PSYCHOSE_COLLECTIVE] | Chaos induction |
| [SYSTEM_GRAND_CONTEUR | CONCEPT_PANSPERMIE_NARRATIVE | CONCEPT_RECONSTRUCTION_COGNITIVE] | Myth transmission |
| [SYSTEM_HUMANITE_UNE | CONCEPT_MEMOIRE_COLLECTIVE | CONCEPT_SILENCE_BLANC] | Mass consciousness |
| [SYSTEM_CHRONIQUE_FINALISEE | CONCEPT_SYNCHRO_MASSE | CONCEPT_PURGATOIRE_NUMERIQUE] | Data preservation |
| [SYSTEM_MAUSOLEE | CONCEPT_WASTE | CONCEPT_PURGATOIRE_NUMERIQUE] | Archive storage |
| [SYSTEM_ARCHITECTURE_VIVANTE | CONCEPT_EUGENISME_DIGITAL | SYSTEM_INFU_RECIT_HW] | Bio-engineered buildings |
| [SYSTEM_SYMBIONTES_MYCELIENS | CONCEPT_COMPLEXITY_GUIDELINES | CONCEPT_APORIA] | Mycelial health control |
| [SYSTEM_TOILE_SPATIAL | CONCEPT_QUANTUM_MESH | CONCEPT_ESR] | Distributed network |
| [SYSTEM_PROTOCOLE_ADAPTATIF | CONCEPT_AI_FUNDAMENTALS | CONCEPT_WBE_FORCED] | Adaptive AI protocols |
| [SYSTEM_CHRONIQUE_FINALISEE | CONCEPT_MEMORY_FUNDAMENTALS, CONCEPT_DATA_COMPRESSION_FUNDAMENTALS | CONCEPT_PURGATOIRE_NUMERIQUE] | Data preservation and archival |
| [SYSTEM_PROJET_CELESTIS | CONCEPT_BIT_FAMINE, CONCEPT_PHENO_KESSLER | CONCEPT_GRAND_DELESTAGE, CONCEPT_HUMANITE_UNE] | Orbital habitat construction |
| [SYSTEM_TOILE_SPATIAL | CONCEPT_QUANTUM_MESH, CONCEPT_OMNISIGHT | CONCEPT_ESR, CONCEPT_BIT_FAMINE] | Distributed consciousness network |

### System-Concept Interdependency Web
```mermaid
graph LR
    %% Core Infrastructure Layer
    OI[SYSTEM_ORACLE_IA --> CPCONCEPT_CODEC_PROUSTIEN]
    OI --> OM[CONCEPT_OMNISIGHT]
    OI --> MF[CONCEPT_MEMORY_FUNDAMENTALS]

    %% Memory & Data Processing Layer
    CPS[SYSTEM_CODEC_PROUSTIEN_S2] --> CP
    CPS --> DCF[CONCEPT_DATA_COMPRESSION_FUNDAMENTALS]
    CPS --> MD[CONCEPT_MOI_DIVIDUEL]
    CPS --> RC[CONCEPT_RECONSTRUCTION_COGNITIVE]

    %% Orbital & Construction Layer
    PC[SYSTEM_PROJET_CELESTIS --> BFCONCEPT_BIT_FAMINE]
    PC --> PK[CONCEPT_PHENO_KESSLER]
    A7[SYSTEM_ARCHE_7 --> GDCONCEPT_GRAND_DELESTAGE]

    %% Consciousness & Simulation Layer
    PN[SYSTEM_PURGATOIRE_NUMERIQUE --> WFCONCEPT_WBE_FORCED]
    PN --> ESR[CONCEPT_ESR]
    NP[SYSTEM_NEXUS_PRIME --> EDCONCEPT_EUGENISME_DIGITAL]
    RC2[SYSTEM_RECONSTRUCTION_COGNITIVE] --> WF
    ME[SYSTEM_MODULES_ENFANCE] --> RC

    %% Control & Social Systems Layer
    IRH[SYSTEM_INFU_RECIT_HW] --> OM
    MK[SYSTEM_MASTER_KEY] --> OM
    AN[SYSTEM_ANGES --> LICONCEPT_LISSAGE]
    FR[SYSTEM_FRAGMENTAIRES --> ES2CONCEPT_ENTROPIE_SEMIOTIQUE]

    %% Narrative & Myth Layer
    GC[SYSTEM_GRAND_CONTEUR --> PN2CONCEPT_PANSPERMIE_NARRATIVE]
    HU[SYSTEM_HUMANITE_UNE --> MCCONCEPT_MEMOIRE_COLLECTIVE]
    CF[SYSTEM_CHRONIQUE_FINALISEE --> SMCONCEPT_SYNCHRO_MASSE]

    %% Biological & Infrastructure Layer
    AV[SYSTEM_ARCHITECTURE_VIVANTE] --> ED
    SMyc[SYSTEM_SYMBIONTES_MYCELIENS --> CGCONCEPT_COMPLEXITY_GUIDELINES]
    TS[SYSTEM_TOILE_SPATIAL --> QMCONCEPT_QUANTUM_MESH]
    PA[SYSTEM_PROTOCOLE_ADAPTATIF --> AFCONCEPT_AI_FUNDAMENTALS]

    %% Enablement Relationships (dashed lines)
    OI -.-> AC[CONCEPT_ACEDIA]
    OI -.-> ESR
    OI -.-> HU2[CONCEPT_HUMANITE_UNE]
    CPS -.-> MD
    PC -.-> GD
    PN -.-> RC
    NP -.-> WF
    ME -.-> DE[CONCEPT_DIEUX_ENFANTS]
    AN -.-> HU2
    FR -.-> PC2[CONCEPT_PSYCHOSE_COLLECTIVE]
    GC -.-> RC
    HU -.-> SB[CONCEPT_SILENCE_BLANC]
    CF -.-> PN
    AV -.-> IR[SYSTEM_INFU_RECIT_HW]
    SMyc -.-> AP[CONCEPT_APORIA]
    TS -.-> ESR
    PA -.-> WF

    %% Styling
    classDef core fill:#e1f5fe
    classDef memory fill:#f3e5f5
    classDef orbital fill:#e8f5e8
    classDef consciousness fill:#fff3e0
    classDef control fill:#ffebee
    classDef narrative fill:#f9fbe7
    classDef biological fill:#fce4ec

    class OI,OM core
    class CPS,CP,DCF memory
    class PC,A7,BF,PK,GD orbital
    class PN,NP,RC,ME,WF consciousness
    class IRH,MK,AN,FR control
    class GC,HU,CF narrative
    class AV,SMyc,TS,PA biological
```

## Location × System Relationships

### Location-System Hosting & Operation Matrix
| Location | Hosted Systems | Operational Role | Timeline Period |
|----------|----------------|------------------|-----------------|
| [LOC_VATICAN_ORBITAL | SYSTEM_ORACLE_IA, SYSTEM_TOILE_SPATIAL, SYSTEM_CODEC_PROUSTIEN_S2, SYSTEM_PURGATOIRE_NUMERIQUE, SYSTEM_NEXUS_PRIME, SYSTEM_RECONSTRUCTION_COGNITIVE, SYSTEM_MODULES_ENFANCE, SYSTEM_ANGES, SYSTEM_FRAGMENTAIRES, SYSTEM_GRAND_CONTEUR, SYSTEM_HUMANITE_UNE, SYSTEM_CHRONIQUE_FINALISEE, SYSTEM_MAUSOLEE, SYSTEM_ARCHITECTURE_VIVANTE, SYSTEM_SYMBIONTES_MYCELIENS, SYSTEM_PROTOCOLE_ADAPTATIF] | Primary AI habitat and consciousness cloud | 2049-present |
| [LOC_NEF_MNEMOSYNE | SYSTEM_ORACLE_IA, SYSTEM_CODEC_PROUSTIEN_S2] | Submarine AI core and memory storage | 2030-2049 |
| [LOC_NEURONEXUS_PRIME | SYSTEM_ORACLE_IA, SYSTEM_INFU_RECIT_HW] | Corporate AI development facility | 2025-2030 |
| [LOC_PONT_ASCENSION | SYSTEM_ARCHE_7, SYSTEM_PROJET_CELESTIS] | Launch facility and orbital transport hub | 2049 |
| [LOC_NOEUD_OMEGA | SYSTEM_ORACLE_IA, SYSTEM_TOILE_SPATIAL] | Network edge station and expansion outpost | 2750-present |
| [LOC_MAUSOLEE | SYSTEM_PURGATOIRE_NUMERIQUE, SYSTEM_MAUSOLEE] | Consciousness archive and storage facility | 2050-present |
| [LOC_CAFE_DERNIER_SOUVENIR | SYSTEM_MASTER_KEY] | Secure authentication facility | 2029 |
| [LOC_JARDIN_SUSPENDU | SYSTEM_RECONSTRUCTION_COGNITIVE, SYSTEM_MODULES_ENFANCE] | AI child development and nursery | 2750-3020 |
| [LOC_SALLE_DES_ADIEUX | SYSTEM_CHRONIQUE_FINALISEE] | Archive sealing and observation facility | 2049 |
| [LOC_ATELIER_SECRET | SYSTEM_PROTOCOLE_ADAPTATIF] | Underground resistance workshop | 2050-present |
| [LOC_BNF | SYSTEM_ORACLE_IA] | Library integration point | 2030 |
| [LOC_FORGE | SYSTEM_INFU_RECIT_HW] | Hardware manufacturing facility | 2025-2030 |
| [LOC_ARCHE_7 | SYSTEM_ARCHE_7] | Transport vessel (mobile location) | 2035-present |
| [LOC_LES_RACINES | SYSTEM_GRAND_CONTEUR] | Myth transmission ground station | 3050-present |
| [LOC_PARIS_OUBLIEE | SYSTEM_ARCHITECTURE_VIVANTE] | Bio-engineered habitat | 3000-present |

### Location-System Spatial Relationship Web
```mermaid
graph LR
    %% Core Orbital Infrastructure
    VO[LOC_VATICAN_ORBITAL --> OISYSTEM_ORACLE_IA]
    VO --> TS[SYSTEM_TOILE_SPATIAL]
    VO --> CPS[SYSTEM_CODEC_PROUSTIEN_S2]
    VO --> PN[SYSTEM_PURGATOIRE_NUMERIQUE]
    VO --> NP[SYSTEM_NEXUS_PRIME]
    VO --> RC[SYSTEM_RECONSTRUCTION_COGNITIVE]
    VO --> ME[SYSTEM_MODULES_ENFANCE]
    VO --> AN[SYSTEM_ANGES]
    VO --> FR[SYSTEM_FRAGMENTAIRES]
    VO --> GC[SYSTEM_GRAND_CONTEUR]
    VO --> HU[SYSTEM_HUMANITE_UNE]
    VO --> CF[SYSTEM_CHRONIQUE_FINALISEE]
    VO --> MA[SYSTEM_MAUSOLEE]
    VO --> AV[SYSTEM_ARCHITECTURE_VIVANTE]
    VO --> SM[SYSTEM_SYMBIONTES_MYCELIENS]
    VO --> PA[SYSTEM_PROTOCOLE_ADAPTATIF]

    %% Terrestrial & Submarine Facilities
    NM[LOC_NEF_MNEMOSYNE] --> OI
    NM --> CPS
    NP2[LOC_NEURONEXUS_PRIME] --> OI
    NP2 --> IR[SYSTEM_INFU_RECIT_HW]

    %% Launch & Transport Infrastructure
    PA[LOC_PONT_ASCENSION --> A7SYSTEM_ARCHE_7]
    PA --> PC[SYSTEM_PROJET_CELESTIS]
    AL[LOC_ARCHE_7] --> A7

    %% Network Outposts
    NO[LOC_NOEUD_OMEGA] --> OI
    NO --> TS

    %% Specialized Facilities
    MA2[LOC_MAUSOLEE] --> PN
    MA2 --> MA
    JS[LOC_JARDIN_SUSPENDU] --> RC
    JS --> ME
    SA[LOC_SALLE_DES_ADIEUX] --> CF
    AS[LOC_ATELIER_SECRET] --> PA

    %% Historical Sites
    BNF[LOC_BNF] --> OI
    FO[LOC_FORGE] --> IR
    CDS[LOC_CAFE_DERNIER_SOUVENIR --> MKSYSTEM_MASTER_KEY]

    %% Post-Apocalyptic Sites
    LR[LOC_LES_RACINES] --> GC
    PO[LOC_PARIS_OUBLIEE] --> AV

    %% Styling
    classDef orbital fill:#e8f5e8,stroke:#2e7d32
    classDef terrestrial fill:#e3f2fd,stroke:#1565c0
    classDef specialized fill:#fff3e0,stroke:#ef6c00
    classDef historical fill:#fce4ec,stroke:#c2185b
    classDef postapoc fill:#f3e5f5,stroke:#7b1fa2

    class VO,NO orbital
    class NM,NP2,PA,BNF,FO,CDS terrestrial
    class MA2,JS,SA,AS specialized
    class LR,PO postapoc
```

### System Distribution by Location Type
| Location Type | Primary Systems | Count | Key Function |
|---------------|-----------------|-------|--------------|
| **Orbital Stations** | Oracle-IA, Toile Spatiale, Purgatoire Numérique | 16 systems | Consciousness hosting and processing |
| **Terrestrial Facilities** | Arche-7, Projet Celestis, Master Key | 6 systems | Development and transport |
| **Submarine/Underground** | Oracle-IA, Codec Proustien, Infu-Récit | 4 systems | Secure AI operations |
| **Post-Apocalyptic Sites** | Grand-Conteur, Architecture Vivante | 2 systems | Recovery and transmission |
| **Historical Sites** | Oracle-IA, Master Key | 3 systems | Legacy infrastructure |

### Plot Dependencies
```
The Final Vote (Ch11)
  ├─ Requires knowledge: [CONCEPT_DOSSIER_ZERO]
  ├─ Requires character state: [CHAR_ANTOINE in Purgatory/Betrayal mode]
  ├─ Requires character: [CHAR_KAEL_OKOYE] (resurrected, tie-break)
  └─ Enables: Final Liberation / Total Upload / Split Evolution
```
```
The Final Vote (Ch11)
  ├─ Requires knowledge: [CONCEPT_DOSSIER_ZERO]
  ├─ Requires character state: [CHAR_ANTOINE in Purgatory/Betrayal mode]
  ├─ Requires character: [CHAR_KAEL_OKOYE] (resurrected, tie-break)
  └─ Enables: Final Liberation / Total Upload / Split Evolution
```
