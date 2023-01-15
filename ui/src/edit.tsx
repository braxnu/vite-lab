import React, { useEffect, useState } from 'react'
import {
  Grid,
  Typography,
} from '@mui/material'
import { ExamMap, TestMap } from '../../shared/types'
import { ContentContainer } from './comp/content-container'
import { ExamEditor } from './comp/exam-editor'
import { getJSON } from './utils'
import { TestEditor } from './comp/test-editor'

export function Edit() {
  const [examMap, setExamMap] = useState<ExamMap>({})
  const [allExistingTestMap, setAllExistingTestMap] = useState<TestMap>({})

  const updateData = () => {
    getJSON<ExamMap>('/api/exams').then(setExamMap)
    getJSON<TestMap>('/api/tests').then(setAllExistingTestMap)
  }

  useEffect(updateData, [])

  const allAvailableTestList = Object.values(allExistingTestMap)
  const examList = Object.values(examMap)

  return (
    <Grid container
      direction='row'
      gap='16px'
      flexWrap='wrap'
    >
      <Grid item>
        <ContentContainer>
          <Grid item>
            <Typography
              variant='h5'
              sx={{
                paddingLeft: '8px',
                marginBottom: '-10px',
              }}
            >
              Tests
            </Typography>
          </Grid>

          <Grid item>
            <TestEditor
              t={{
                id: '',
                label: '',
              }}
              onDataUpdated={updateData}
              examList={examList}
            />
          </Grid>

          {Object.values(allExistingTestMap).map(t => (
            <Grid item key={t.id}>
              <TestEditor
                t={t}
                onDataUpdated={updateData}
                examList={examList}
                />
            </Grid>
          ))}
        </ContentContainer>
      </Grid>

      <Grid item>
        <ContentContainer>
          <Grid item>
            <Typography
              variant='h5'
              sx={{
                paddingLeft: '8px',
                marginBottom: '-10px',
              }}
            >
              Examinations
            </Typography>
          </Grid>

          <Grid item>
            <ExamEditor
              e={{
                id: '',
                name: '',
                price: 0,
                testList: [],
              }}
              allAvailableTestList={allAvailableTestList}
              allAvailableTestMap={allExistingTestMap}
              onDataUpdated={updateData}
            />
          </Grid>

          {Object.values(examMap).map(e => (
            <Grid item key={e.id}>
              <ExamEditor
                e={e}
                allAvailableTestList={allAvailableTestList}
                allAvailableTestMap={allExistingTestMap}
                onDataUpdated={updateData}
              />
            </Grid>
          ))}
        </ContentContainer>
      </Grid>
    </Grid>
  )
}
