/**
 * MediExplain AI - Fictional Demo Datasets
 * Pre-loaded realistic sample medical reports for demo mode testing.
 * Strictly fictional patient data; no real patient records.
 */

export const DEMO_DOCUMENTS = [
  {
    id: 'demo_blood_report',
    title: 'Complete Blood Count (CBC) Report',
    documentType: 'Blood Report',
    confidenceScore: 98,
    patientName: 'Rahul Sharma',
    doctorName: 'Dr. Anita Roy, MD',
    hospitalName: 'Apollo Diagnostics Laboratory',
    date: '2026-10-02',
    overview: 'The report shows mild anemia with lower hemoglobin levels and slightly elevated WBC count indicating a mild immune response.',
    explanations: {
      verySimple: '🟢 VERY SIMPLE: Your blood test shows your red blood cells (hemoglobin) are a bit lower than normal, which means you might feel a little tired. Your white blood cells are slightly high, showing your body is fighting off a minor infection or inflammation.',
      simple: '🔵 SIMPLE: Hemoglobin is 10.8 g/dL (normal 13.0 - 17.0). This indicates mild anemia. White blood cell count is 11,500 /uL (normal 4,000 - 11,000), which is mildly elevated.',
      detailed: '🟣 DETAILED: Complete Blood Count analysis demonstrates normocytic normochromic anemia with Hemoglobin at 10.8 g/dL and Hematocrit at 33.5%. Mild leukocytosis observed at 11,500/uL with neutrophilic predominance, suggesting mild acute inflammation or resolving infection.'
    },
    tests: [
      {
        name: 'Hemoglobin (Hb)',
        result: '10.8',
        unit: 'g/dL',
        referenceRange: '13.0 - 17.0',
        status: 'Outside Range',
        whatItMeasures: 'Measures the oxygen-carrying protein in your red blood cells.',
        simpleExplanation: 'Low hemoglobin means less oxygen is delivered to your body, causing mild fatigue.',
        confidence: 99
      },
      {
        name: 'Total Leucocyte Count (WBC)',
        result: '11,500',
        unit: '/uL',
        referenceRange: '4,000 - 11,000',
        status: 'Outside Range',
        whatItMeasures: 'Measures white blood cells responsible for immune defense.',
        simpleExplanation: 'Slightly high white cells show your immune system is active.',
        confidence: 97
      },
      {
        name: 'Platelet Count',
        result: '240,000',
        unit: '/uL',
        referenceRange: '150,000 - 450,000',
        status: 'Normal',
        whatItMeasures: 'Measures cells that help your blood clot.',
        simpleExplanation: 'Platelet levels are completely normal.',
        confidence: 99
      },
      {
        name: 'Fasting Blood Sugar',
        result: '98',
        unit: 'mg/dL',
        referenceRange: '70 - 100',
        status: 'Normal',
        whatItMeasures: 'Measures blood glucose levels after fasting.',
        simpleExplanation: 'Glucose control is well within normal limits.',
        confidence: 98
      }
    ],
    medicines: [
      {
        name: 'Autrin Iron Supplement',
        genericName: 'Ferrous Fumarate + Folic Acid',
        purpose: 'Helps increase iron and red blood cell production to treat anemia.',
        dosage: '1 Capsule',
        frequency: 'Once daily after lunch',
        duration: '30 Days',
        precautions: 'Take after meals to prevent mild nausea. May cause harmless dark stool.',
        confidence: 95,
        ocrWarning: false
      }
    ],
    medicalTerms: [
      {
        term: 'Anemia',
        simpleMeaning: 'A condition where you lack enough healthy red blood cells to carry adequate oxygen.',
        pronunciation: 'uh-NEE-mee-uh',
        example: 'Like having fewer delivery trucks on the highway carrying oxygen cargo.'
      },
      {
        term: 'Leukocytosis',
        simpleMeaning: 'An elevated white blood cell count in the bloodstream.',
        pronunciation: 'loo-koh-sy-TOE-sis',
        example: 'Like your body deploying extra bodyguards when a threat is detected.'
      }
    ],
    doctorQuestions: [
      'What type of iron supplement is best suited for my anemia?',
      'Do I need any additional tests like Serum Ferritin or Vitamin B12?',
      'Should I repeat the CBC blood test after 4 weeks?',
      'What dietary changes will help boost my hemoglobin level?'
    ],
    followUp: {
      recommended: true,
      timeframe: '4 Weeks',
      notes: 'Repeat Complete Blood Count test in 1 month.'
    },
    uncertainties: []
  },
  {
    id: 'demo_prescription',
    title: 'Outpatient Prescription - Hypertension & Lipid Management',
    documentType: 'Prescription',
    confidenceScore: 92,
    patientName: 'Rahul Sharma',
    doctorName: 'Dr. Suresh Mehta, MD (Cardiology)',
    hospitalName: 'Fortis Heart & Wellness Center',
    date: '2026-09-28',
    overview: 'Prescription for blood pressure management and cholesterol control along with diet modifications.',
    explanations: {
      verySimple: '🟢 VERY SIMPLE: The doctor prescribed two daily medicines: one to keep your blood pressure steady and another to lower your cholesterol levels.',
      simple: '🔵 SIMPLE: Telmisartan 40mg is prescribed for high blood pressure (hypertension), taken every morning. Atorvastatin 10mg is prescribed for cholesterol management, taken at bedtime.',
      detailed: '🟣 DETAILED: Pharmacotherapy plan targeting Stage 1 Essential Hypertension and mild hyperlipidemia. Includes Angiotensin II Receptor Blocker (Telmisartan 40mg q.d.) and HMG-CoA reductase inhibitor (Atorvastatin 10mg h.s.).'
    },
    tests: [],
    medicines: [
      {
        name: 'Telmisartan 40mg',
        genericName: 'Telmisartan',
        purpose: 'Lowers high blood pressure by relaxing blood vessels.',
        dosage: '40mg Tablet',
        frequency: '1 Tablet once daily in the morning',
        duration: 'Continuous / 90 Days',
        precautions: 'Do not stop abruptly without doctor consultation. Monitor blood pressure weekly.',
        confidence: 96,
        ocrWarning: false
      },
      {
        name: 'Atorva 10',
        genericName: 'Atorvastatin',
        purpose: 'Lowers LDL cholesterol and protects blood vessel walls.',
        dosage: '10mg Tablet',
        frequency: '1 Tablet at night after dinner',
        duration: '90 Days',
        precautions: 'Avoid excessive grapefruit juice. Inform doctor if severe muscle aches occur.',
        confidence: 90,
        ocrWarning: false
      }
    ],
    medicalTerms: [
      {
        term: 'Hypertension',
        simpleMeaning: 'High blood pressure in the arteries.',
        pronunciation: 'hy-per-TEN-shun',
        example: 'Like extra water pressure pushing against household plumbing pipes.'
      },
      {
        term: 'Statins',
        simpleMeaning: 'A class of medicines that reduce cholesterol production in the liver.',
        pronunciation: 'STAT-inz',
        example: 'Like cleaners reducing grease buildup inside your water pipes.'
      }
    ],
    doctorQuestions: [
      'What target blood pressure reading should I aim for at home?',
      'When should I perform my next Lipid Profile blood test?',
      'Are there specific foods I should avoid while taking Telmisartan or Atorvastatin?'
    ],
    followUp: {
      recommended: true,
      timeframe: '2 Months',
      notes: 'Return with blood pressure log sheet.'
    },
    uncertainties: []
  },
  {
    id: 'demo_discharge_summary',
    title: 'Hospital Discharge Summary',
    documentType: 'Discharge Summary',
    confidenceScore: 94,
    patientName: 'Rahul Sharma',
    doctorName: 'Dr. V. K. Nambiar',
    hospitalName: 'Manipal Multi-Specialty Hospital',
    date: '2026-09-15',
    overview: 'Discharge summary following successful management of acute gastroenteritis and dehydration.',
    explanations: {
      verySimple: '🟢 VERY SIMPLE: You were treated in the hospital for stomach infection and fluid loss. You are now recovered and discharged with oral rehydration and gut recovery medication.',
      simple: '🔵 SIMPLE: Admitted with severe vomiting, stomach cramps, and dehydration. Treated with IV fluids and antiemetics. Patient stabilized with normal vitals at discharge.',
      detailed: '🟣 DETAILED: Hospitalization course for Acute Gastroenteritis with moderate dehydration. Treated conservatively with intravenous Ringer Lactate, Ondansetron IV, and probiotics. Patient hemodynamically stable upon discharge.'
    },
    tests: [],
    medicines: [
      {
        name: 'Vizylac Probiotic',
        genericName: 'Lactic Acid Bacillus',
        purpose: 'Restores beneficial healthy bacteria in the digestive tract.',
        dosage: '1 Capsule',
        frequency: 'Twice daily after meals',
        duration: '7 Days',
        precautions: 'Store in a cool dry place.',
        confidence: 94,
        ocrWarning: false
      }
    ],
    medicalTerms: [
      {
        term: 'Gastroenteritis',
        simpleMeaning: 'Stomach and intestinal inflammation causing upset stomach, vomiting or diarrhea.',
        pronunciation: 'gas-troh-en-ter-EYE-tis',
        example: 'Like a sudden bad weather storm inside your digestive system.'
      }
    ],
    doctorQuestions: [
      'How soon can I resume my normal regular diet?',
      'What signs of dehydration should I watch out for at home?'
    ],
    followUp: {
      recommended: true,
      timeframe: '1 Week',
      notes: 'Review with outpatient gastroenterology OPD.'
    },
    uncertainties: []
  }
];
