import React, { useEffect, useState } from 'react'
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from '@mui/material'
import { Examination, ExamMap, Test, TestMap } from '../../shared/types'
import { ExamResult } from './comp/exam-result'
import { ContentContainer } from './comp/content-container'
import { getJSON } from './utils'
import CheckCircle from '@mui/icons-material/CheckCircle'

export function Search() {
  const [examMap, setExamMap] = useState<ExamMap>({})
  const [examList, setExamList] = useState<Examination[]>([])
  const [allExistingTestList, setAllExistingTestList] = useState<Test[]>([])
  const [allExistingTestMap, setAllExistingTestMap] = useState<TestMap>({})
  const [selectedTestList, setSelectedTestList] = useState<Test[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [searchValue, setSearchValue] = useState<Test | null>(null)
  const [selectedExams, setSelectedExams] = useState<Record<Examination['id'], boolean>>({})
  const [isSummaryView, setSummaryView] = useState<boolean>(false)

  useEffect(() => {
    getJSON<ExamMap>('/api/exams')
      .then(m => {
        setExamMap(m)
        setExamList(Object.values(m))
      })

    getJSON<TestMap>('/api/tests')
      .then(m => {
        setAllExistingTestMap(m)
        setAllExistingTestList(Object.values(m))
      })
  }, [])

  const visibleExamList = examList
    .filter(e => selectedTestList.some(t => e.testList.includes(t.id)))
    .filter(e => !isSummaryView || selectedExams[e.id])
    .sort((a, b) => a.price - b.price)
    .sort((a, b) => {
      const aCount = selectedTestList.filter(t => a.testList.includes(t.id)).length
      const bCount = selectedTestList.filter(t => b.testList.includes(t.id)).length

      return bCount - aCount
    })

  const totalPrice = visibleExamList
    .filter(ve => selectedExams[ve.id])
    .reduce((acc, e) => acc + e.price, 0)

  const allTestsFromSelectedExamsMap: Record<Test['id'], true> = Object.entries(selectedExams)
    .filter(([k, v]) => v)
    .map(([seid]) => examMap[seid].testList)
    .flat()
    .reduce((acc, tid) => {
      acc[tid] = true
      return acc
    }, {} as Record<Test['id'], true>)

  return (
    <ContentContainer>
      {/* Search row */}
      <Grid item>
        <Grid container
          sx={{
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Grid item
            sx={{
              flexGrow: 1,
            }}
          >
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

          <Grid item>
            <Typography variant='h6'>
              Total: {totalPrice.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item>
            <Button
              variant='contained'
              onClick={() => {
                setSelectedTestList([])
                setSearchValue(null)
                setInputValue('')
                setSelectedExams({})
              }}
            >
              Reset
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {/* Selected test chips */}
      <Grid item container
        sx={{
          // backgroundColor: 'yellow',
          flexWrap: 'nowrap',
        }}
      >
        <Grid item container
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            flexBasis: '100%',
            // backgroundColor: 'green',
          }}
        >
          {selectedTestList.map(t => {
            let icon

            if (allTestsFromSelectedExamsMap[t.id]) {
              icon = (
                <CheckCircle color='success' />
              )
            }

            return (
              <Chip
                key={t.id}
                label={t.label}
                onDelete={() => {
                  setSelectedTestList(selectedTestList.filter(({id}) => id !== t.id))
                }}
                icon={icon}
              />
            )})
          }
        </Grid>

        <Grid item
          sx={{
            // flexBasis: 1,
            whiteSpace: 'nowrap'
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={isSummaryView}
                onChange={ev => {
                  setSummaryView(ev.target.checked)
                }}
              />
            }
            sx={{
              userSelect: 'none',
              marginRight: 1,
            }}
            label="Summary view"
          />
        </Grid>
      </Grid>

      {/* Found exam list */}
      <Grid item>
        <Grid container direction="column" gap={1}>
          {visibleExamList
            .map(e => (
              <Grid item key={e.id}>
                <ExamResult
                  e={e}
                  selectedTestList={selectedTestList}
                  allExistingTestMap={allExistingTestMap}
                  isSelected={Boolean(selectedExams[e.id])}
                  setSelected={v => {
                    setSelectedExams({
                      ...selectedExams,
                      [e.id]: v,
                    })
                  }}
                />
              </Grid>
            ))}
        </Grid>
      </Grid>
    </ContentContainer>
  )
}
