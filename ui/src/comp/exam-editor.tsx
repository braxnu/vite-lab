import React, { useState } from 'react'
import {
  Autocomplete,
  Button,
  Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import { Examination, Test, TestMap } from '../../../shared/types'
import { deleteJSON, postJSON, putJSON } from '../utils'
import { byField } from '../../../shared/utils'

export const ExamEditor: React.FC<{
  e: Examination,
  allAvailableTestList: Test[],
  allAvailableTestMap: TestMap,
  onDataUpdated: () => void,
}> = ({
  e,
  allAvailableTestList,
  allAvailableTestMap,
  onDataUpdated,
}) => {
  const [name, setName] = useState<Examination['name']>(e.name)
  const [price, setPrice] = useState<Examination['price']>(e.price)
  const [testList, setTestList] = useState<Examination['testList']>(e.testList)
  const [testSearchInputVal, setTestSearchInputVal] = useState<string>('')
  const [testSearchVal, setTestSearchVal] = useState<Test | null>(null)

  return (
    <Paper sx={{padding: 1}}>
      <Grid container
        direction="column"
        gap='10px'
      >
        <Grid container
          sx={{
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <Grid item>
            <TextField
              required
              label="Examination name"
              value={name}
              onChange={ev => {
                setName(ev.target.value)
              }}
            />
          </Grid>

          <Grid item>
            <TextField
              required
              type='number'
              inputProps={{
                min: 0,
                step: 0.01,
              }}
              label="Examination price"
              value={price}
              onChange={ev => {
                const num = Number(ev.target.value)

                if (!isNaN(num)) {
                  setPrice(num)
                }
              }}
            />
          </Grid>
        </Grid>

        <Grid item>
          <Autocomplete
            disablePortal
            options={allAvailableTestList
              .filter(at => !testList.some(st => st === at.id))
            }
            value={testSearchVal}
            inputValue={testSearchInputVal}
            onInputChange={(ev, val) => {
              setTestSearchInputVal(val)
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

              setTestList([...testList, v.id])
              setTestSearchInputVal('')
              setTestSearchVal(null)
            }}
          />
        </Grid>

        {testList
          .map(id => allAvailableTestMap[id])
          .filter(Boolean)
          .sort(byField('label'))
          .map(t => (
            <Grid item container
              direction='row'
              key={t.id}
              sx={{
                alignItems: 'center',
              }}
            >
              <Grid item>
                <Typography
                  variant="body1"
                  sx={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center',
                  }}
                >
                  {t.label}
                </Typography>
              </Grid>

              <Grid item>
                <Button
                  variant='text'
                  onClick={ev => {
                    ev.preventDefault()

                    setTestList(
                      testList.filter(tid => tid !== t.id)
                    )
                  }}
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))
        }

        <Grid container
          sx={{
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {e.id && (
            <Grid item>
              <Button
                variant='contained'
                color='error'
                onClick={async ev => {
                  ev.preventDefault()

                  if (!confirm('Are you sure you want to delete this Examination')) {
                    return
                  }

                  await deleteJSON('/api/exams/' + e.id)
                  onDataUpdated()
                }}
              >
                Delete
              </Button>
            </Grid>
          )}

          <Grid item>
            <Button
              variant='contained'
              onClick={async ev => {
                ev.preventDefault()

                const payload: Omit<Examination, 'id'> = {
                  name,
                  price,
                  testList,
                }

                if (e.id) {
                  await putJSON('/api/exams/' + e.id, payload)
                } else {
                  await postJSON('/api/exams', payload)
                }

                if (!e.id) {
                  setName('')
                  setPrice(0)
                  setTestList([])
                }

                onDataUpdated()
              }}
            >
              {e.id ? 'Save' : 'Add new'}
            </Button>
          </Grid>
        </Grid>

      </Grid>
    </Paper>
  )
}
