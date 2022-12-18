import React, { useEffect } from 'react'
import { Autocomplete, Box, Chip, Grid, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { Examination, Test } from '../../shared/types'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import './App.css'

function App() {
  const [examList, setExamList] = useState<Examination[]>([])
  const [allExistingTestList, setAllExistingTestList] = useState<Test[]>([])
  const [selectedTestList, setSelectedTestList] = useState<Test[]>([])
  const [inputValue, setInputValue] = useState<string>('')
  const [searchValue, setSearchValue] = useState<Test | null>(null)

  useEffect(() => {
    fetch('/api/exams')
      .then(r => r.json())
      .then(setExamList)

    fetch('/api/tests')
      .then(r => r.json())
      .then(setAllExistingTestList)
  }, [])

  return (
    <Grid container
      direction="column"
      spacing={2}
      columns={1}
      sx={{
        // margin: 0,
        alignItems: 'stretch',
        justifyItems: 'stretch',
      }}
    >
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

      <Grid item
        sx={{
          display: 'flex',
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

      <Grid item>
        <pre>
          {JSON.stringify(selectedTestList, null, 4)}
        </pre>

        <pre>
          {JSON.stringify(examList
            .filter(e => selectedTestList.some(t => e.testList.includes(t.id)))
            .sort((a, b) => a.price - b.price)
            .sort((a, b) => {
              const aCount = selectedTestList.filter(t => a.testList.includes(t.id)).length
              const bCount = selectedTestList.filter(t => b.testList.includes(t.id)).length

              return bCount - aCount
            }), null, 4)}
        </pre>

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
              <Grid item key={e.name}>



                <Paper sx={{padding: 1}}>
                  <Grid container direction="column">
                    <Grid container>
                      <Grid item xs={11}>
                        <Typography variant="h6">
                          {e.name}
                        </Typography>
                      </Grid>

                      <Grid item xs={1}>
                        <Typography
                          variant="h6"
                          sx={{
                            textAlign: 'right',
                          }}
                        >
                          {e.price}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Grid container gap={1}>
                      {selectedTestList
                        .filter(t => e.testList.includes(t.id))
                        .map(t => (
                          <Typography variant="body1" key={t.id}>
                            <CheckCircleOutlineIcon />
                            {t.label}
                          </Typography>
                        ))
                      }
                    </Grid>
                  </Grid>
                </Paper>



              </Grid>
            ))}
        </Grid>

      </Grid>
    </Grid>
  )
}

export default App
