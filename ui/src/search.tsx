import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Chip,
  Grid,
  TextField,
} from '@mui/material'
import { Examination, ExamMap, Test, TestMap } from '../../shared/types'
import { ExamResult } from './comp/exam-result'
import { ContentContainer } from './comp/content-container'
import { getJSON } from './utils'

export function Search() {
  const [examList, setExamList] = useState<Examination[]>([])
  const [allExistingTestList, setAllExistingTestList] = useState<Test[]>([])
  const [selectedTestList, setSelectedTestList] = useState<Test[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [searchValue, setSearchValue] = useState<Test | null>(null)

  useEffect(() => {
    getJSON<ExamMap>('/api/exams')
      .then(l => setExamList(Object.values(l)))

    getJSON<TestMap>('/api/tests')
      .then(l => setAllExistingTestList(Object.values(l)))
  }, [])

  return (
    <ContentContainer>
      {/* Search field */}
      <Grid item>
        <Autocomplete
          disablePortal
          id="test-search-field"
          options={allExistingTestList
            .filter(et => !selectedTestList.some(st => st.id === et.id))
          }
          value={searchValue}
          inputValue={inputValue}
          onInputChange={(ev, val) => {
            setInputValue(val)
          }}
          sx={{
            margin: 0,
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Test name search"
            />
          )}
          onChange={(ev, v, r, d) => {
            if (!v) {
              return
            }

            setSelectedTestList([...selectedTestList, v])
            setInputValue('')
            setSearchValue(null)
          }}
        />
      </Grid>

      {/* Selected test chips */}
      <Grid item
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px',
        }}
      >
        {selectedTestList.map(t => (
          <Chip
            key={t.id}
            label={t.label}
            onDelete={() => {
              setSelectedTestList(selectedTestList.filter(({id}) => id !== t.id))
            }}
          />
        ))}
      </Grid>

      {/* Found exam list */}
      <Grid item>
        <Grid container direction="column" gap={1}>
          {examList
            .filter(e => selectedTestList.some(t => e.testList.includes(t.id)))
            .sort((a, b) => a.price - b.price)
            .sort((a, b) => {
              const aCount = selectedTestList.filter(t => a.testList.includes(t.id)).length
              const bCount = selectedTestList.filter(t => b.testList.includes(t.id)).length

              return bCount - aCount
            })
            .map(e => (
              <Grid item>
                <ExamResult
                  e={e}
                  selectedTestList={selectedTestList}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </ContentContainer>
  )
}
