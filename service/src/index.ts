import Fastify from 'fastify'
import { Examination, Test } from '../../shared/types'

const fastify = Fastify({
  logger: true,
})

let exams: Examination[] = [
  {
    name: 'Krew A',
    price: 80,
    testList: [
      'hemo',
      'erytro',
    ],
  },
  {
    name: 'Krew Full',
    price: 120,
    testList: [
      'hemo',
      'erytro',
      'leuco',
    ],
  },
  {
    name: 'Krew Extra',
    price: 156,
    testList: [
      'hemo',
      'erytro',
      'leuco',
      'blood-sugar',
    ],
  },
]

let tests: Test[] = [
  {
    label: 'Hemoglobina',
    id: 'hemo',
  },
  {
    label: 'Erytrocyty',
    id: 'erytro',
  },
  {
    label: 'Leukocyty',
    id: 'leuco',
  },
  {
    label: 'Blood sugar',
    id: 'blood-sugar',
  },
  {
    label: 'Białko w moczu',
    id: 'urine-protein',
  },
  {
    label: 'Sód w moczu',
    id: 'urine-natrium',
  },
]

fastify.get('/api/exams', (request, reply) => {
  reply.send(exams)
})

fastify.get('/api/tests', (request, reply) => {
  reply.send(tests)
})

const start = async () => {
  try {
    await fastify.listen({ host: '127.0.0.1', port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(3)
  }
}

start()
