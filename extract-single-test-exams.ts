#!/usr/bin/env ts-node-esm

import { Examination, ExamMap, Test, TestMap } from './shared/types'
import fs from 'node:fs'
import jsonfile from 'jsonfile'

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

const dbData: { tests: TestMap, exams: ExamMap } = jsonfile.readFileSync('./data.json')
const input = fs.readFileSync('./single.tsv', 'utf-8')

const rawExams = input.split('\n')
  .map(l => l.trim())
  .filter(Boolean)
  .map(l => {
    const chunks = l.split('\t').map(s => s.trim()).slice(1)

    const match = chunks[0]
      .match(/^(?<exam>[^(]+)(?<tests>\(.+\))?$/)

    const name = (match?.groups?.exam?.trim() || '')
      .replace('!NEW! ', '')

    const isExam = Boolean(
      chunks[0].match(/screen|full|profile|swab test/i)
    )

    const id = getSlug(name)
    const price = Number(chunks[1].replace('£', '')) || 0

    return {
      id,
      name,
      price,
      isExam,
    }
  })

const tests: (Test & {price: Examination['price']})[] = rawExams
  .filter(e => !e.isExam)
  .map(e => ({
    id: e.id,
    label: e.name,
    price: e.price,
  }))

const exams: Examination[] = rawExams
  .filter(e => e.isExam)
  .map(e => ({
    id: e.id,
    name: e.name,
    price: e.price,
    testList: [],
  }))

for (const t of tests) {
  if (!dbData.tests[t.id]) {
    // console.log('adding test', {t})
    dbData.tests[t.id] = {
      id: t.id,
      label: t.label,
    }
  }

  if (!dbData.exams[t.id]) {
    const e = {
      id: t.id,
      name: t.label,
      price: t.price,
      testList: [t.id],
    }

    // console.log('adding exam', {e})
    dbData.exams[t.id] = e
  }

  console.log('')
}

for (const e of exams) {
  if (!dbData.exams[e.id]) {
    // console.log('adding exam', {e})
    dbData.exams[e.id] = e
  }
}

jsonfile.writeFileSync('./data-upd.json', dbData)
