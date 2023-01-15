#!/usr/bin/env ts-node-esm

import { ExamMap, TestMap } from './shared/types'

const pairs = [
  'ąa',
  'ęe',
  'ćc',
  'śs',
  'łl',
  'ńn',
  'óo',
  'żz',
  'źz',
]

export const getSlug = (name: string): string => {
  name = name.toLowerCase()

  for (let i = 0; i < pairs.length; i++) {
    const [fromChar, toChar] = pairs[i].split('')

    name = name.replaceAll(fromChar, toChar)
  }

  name = name
    .replace(/_+/g, '-')
    .replace(/[^\w]+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '')

  return name
}


const input = `
BLOOD COLLECTION FEE£10
!NEW! BASIC VITAMIN SCREEN I (Vit. D3, Vit. B12)£92
!NEW! BASIC VITAMIN SCREEN II (Vit. D3, Vit. B12, Folate)£108
!NEW! ALLERGY PROFILE IX - FOOD£116
!NEW! ALLERGY PROFILE X - MILK + GLUTEN£86
!NEW! Coagulation Profile II (Coagulation Profile I + Fibrinogen)£84
!NEW! TESTICULAR TUMOR PROFILE (hCG+B, LDH, AFP)£105
!NEW! VIRAL SCREEN I (HBs Ag, HCV Ab, HIV Ab + p24 Ag)£134
!NEW! VIRAL SCREEN II (HBs Ag, HCV Ab, HIV Ab + p24 Ag, Syphillis Ab)£148
!NEW! VIRAL EARLY DETECTION (HBV PCR, HCV PCR, HIV PCR)£184
BONE PROFILE (Total protein, Albumin, Globulin, Calcium, Inorganic phosphate, ALP, Urea and electrolytes)£64
BORRELIA PROFILE (Borrelia IgG, IgM, Borrelia - western blot IgG, IgM)£275
CARDIAC PANEL PROFILE (AST, LDH, CPK, Magnesium, Sodium, Potassium, Lipid profile, Urea and creatinine)£71
COAGULATION PROFILE (aPTT, Prothrombin time (PT) + INR)£69
COELIAC PROFILE (Endomysial IgA, Reticulin IgA, Gliadin IgA IgG, Total IgA, Tissue transglutaminase IgA)£164
COMPREHENSIVE PROFILE (FULL BIOCHEMISTRY & HAEMATOLOGY, THYROID PROFILE III, Bilirubin direct, Bilirubin indirect, Alfa-amylase, CRP, LDH, Magnesium, Ferritin)£128
DIABETES PROFILE I (Glucose, HbA1c, Urea, Creatinine, Lipid profile)£86
DIABETES PROFILE II (Glucose HbA1c, Urea, Creatinine, Lipid profile, Urine total protein, Urine examination)£119
FULL BIOCHEMISTRY PROFILE (ALT, Albumin, ALP, AST, Calcium, CK, Creatinine, Total cholesterol, HDL-cholesterol, LDL-cholesterol, Non-HDL, Triglycerides, Iron, GGT, Total protein, Globulin, Glucose, Inorganic phosphate, Bilirubin total, Sodium, Potassium, Urea, Uric acid)£72
FULL BIOCHEMISTRY & HAEMATOLOGY (FULL BIOCHEMISTRY PROFILE & Full Blod Count + differential, ESR)£93
FULL BIOCHEMISTRY & HAEMATOLOGY & CRP£101
FULL HEALTH ASSESSMENT - MEN (COMPREHENSIVE PROFILE, FOB, PSA)£174
HAEMATOLOGY PROFILE (FBC + differential, ESR)£65
HEPATIC PROFILE (LFT) (Total protein, Albumin, Globumin, ALP, ALT, AST, GGT, Bilirubin total, Bilirubin direct, Bilirubin indirect, LDH)£64
IMPOTENCE PROFILE (SHBG, PRL, Testosterone, Testosterone free, TSH, Lipid profile, Glucose, FAI, Albumin)£128
IRON STATUS PROFILE (Iron, Ferritin, TIBC, UIBC, transferin, transferin saturation)£82
LIPID PROFILE (Cholesterol total, HDL-cholesterol, LDL-cholesterol, Triglycerides)£59
LIVER, PANCREAS & STOMACH (HEPATIC PROFILE - LFT), Lipase, Amylase, H. pylori IgG, Protein electrophoresis ,CEA)£182
PEDIATRIC PROFILE (HAEMATOLOGY PROFILE, ALT, ALP, AST, Calcium, Creatinine, Total cholesterol, Iron, GGT, Total protein, Glucose, Inorganic phosphate, Bilirubin total, Urea, Uric acid, CRP, Sodium, Potassium)£87
PEDIATRIC PROFILE II (PEDIATRIC PROFILE, IgE)£118
PRE-OPAREATION PROFILE (HAEMATOLOGY PROFILE, COAGULATION PROFILE I, Blood group + Rh, Glucose, Creatinine, Urea, Sodium, Potassium, Chloride, Anti-HCV, HBsAg, Anti-HIV 1&2 + HIV-1 p24 Ag)£222
PROSTATE PROFILE (PSA, PSA free, PSA ratio)£89
RHEUMATOID PROFILE I (FBC + differential, ESR, ANA, CRP, Rheumatoid factor, Uric acid)£94
RHEUMATOID PROFILE II (RHEUMATOID PROFILE I, RF, Anti-DNA, Anti-ENA, Anti-Sm, Anti-Ro (SS-A), Anti-La (SS-B), Anti-Jo-1, Anti-RNP, Centromere antibodies, Histones antibodies, Complement C3, Complement C4, Cardiolipin antibodies IgG IgM IgA)£227
ROMA TEST (CA 125, HE4, ROMA)£111
SHORT BIOCHEMISTRY PROFILE (ALT, ALP, AST, Calcium, Creatinine, Total cholesterol, Triglycerides, Iron, GGT, Total protein, Glucose, Inorganic phosphate, Bilirubin total, Urea, Uric acid)£63
SHORT BIOCHEMISTRY & HAEMATOLOGY PROFILE (SHORT BIOCHEMISTRY PROFILE + Full blood count + differential, ESR)£82
UREA & ELECTROLYTES PROFILE (Creatinine, Urea, Sodium, Potassium)£59
AMENORRHEA PROFILE (FSH, LH, E2, PRL)£114
ANDROPAUSE PROFILE (DHEA-S, FSH, Testosterone, Testosterone Free, Albumin, Oestradiol,FAI, LH, SHBG)£151
FSH - LH PROFILE£83
HIRSUTISM PROFILE (LH, PRL, FSH, Testosterone, fT4, SHBG)£140
INFERTILITY PROFILE - FEMALE (FSH, LH, E2, PRL, PRG)£127
INFERTILITY PROFILE - MALE (LH, PRL, FSH, Testosterone, SHBG)£127
LH, FSH PROFILE£83
MENOPAUSAL PROFILE (FSH, LH, E2, TSH)£116
THYROID PROFILE I (TSH, fT4, fT3)£89
THYROID PROFILE II (TSH ,fT4, fT3, Anti-TPO or Anti-TG)£108
THYROID PROFILE III (TSH, fT4)£74
THYROID PROFILE IV (TSH, fT4, fT3, Anti-TPO, Anti-TG, T3,T4)£164
THYROID PROFILE V (TSH, fT4, fT3, Anti-TPO, Anti-TG)£124
BLOODBORNE PATHOGENS (HCV Ab, HIV Ab+p24 Ag, HBs Ag, HBc Ab, Syphilis Ab, HAV Ab)£154
HEPATITIS A PROFILE (HAV IgM, HAV Ab)£98
HEPATITIS B PROFILE (HBsAg, HBeAg, HBc IgM, HBc Ab, HBe Ab, HBs Ab)£128
HEPATITIS PROFILE A, B, C (HAV IgM, HAV Ab, HBs Ag, HBc Ab, HBs Ab, HCV Ab)£132
HEAVY METALS SCREEN (Chromium, Arsenic, Lead, Mercury, Nickel, Selenium, Zinc, Cadmium, Copper)£259
MINERAL SCREEN (Calcium, Magnesium, Sodium, Potassium, Inorganic phosphates, Manganese, Zinc, Aluminium)£140
VITAMIN SCREEN (Vitamins: A (retinol), B6, B12, D 25-OH, E (tocopherol), Folate)£292
MINERAL & VITAMIN SCREEN£326
ALLERGY PROFILE I (IgE total, 11 individual allergens)£189
ALLERGY PROFILE II (20 individual allergens)£249
ALLERGY PROFILE III (40 individual allergens)£412
ANAEMIA PROFILE I (FBC + differential, ESR, Iron, Ferritin, TIBC, UIBC)£97
ANAEMIA PROFILE II (FBC + differential, ESR, Folate, Vitamin B12)£97
ANAEMIA PROFILE III (FBC + differential, ESR, Iron, Ferritin TIBC, UIBC, Folate, Vitamin B12)£125
ANTENATAL PROFILE (FBC + differential, Urine exam, Atypical Ab Screen, Blood group, Syphilis Ab, Iron, TSH, Glucose)£173
`

const rawExams = input.split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .map(l => {
    const match = l.match(/^(?<exam>[^(]+)(?<tests>\(.+\))?£(?<price>\d+)$/)

    const name = (match?.groups?.exam?.trim() || '')
      .replace('!NEW! ', '')

    const id = getSlug(name)
    const price = Number(match?.groups?.price) || 0

    const tests = (match?.groups?.tests || '')
      .replace(/^\(/, '')
      .replace(/\)$/, '')
      .split(',')
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => ({
        label: l,
        id: getSlug(l),
      }))

    return {
      id,
      name,
      price,
      tests,
    }
  })

const tests: TestMap = {}
const exams: ExamMap = {}

rawExams.forEach(r => {
  r.tests.forEach(t => {
    if (!tests[t.id]) {
      tests[t.id] = t
    }
  })

  const testList = r.tests.map(t => t.id)

  if (exams[r.id]) {
    console.error('THIS EXISTS', {r, e: exams[r.id]})
    process.exit()
  }

  exams[r.id] = {
    id: r.id,
    name: r.name,
    price: r.price,
    testList,
  }
})

console.log(JSON.stringify({tests, exams}))

export {}
