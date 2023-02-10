import React from 'react'
import { Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HelpIcon from '@mui/icons-material/Help'
import { Examination, Test, TestMap } from '../../../shared/types'

const selectedTestIcon = (
  <CheckCircleIcon
    sx={{
      color: 'green',
      fontSize: '18px',
    }}
  />
)

const addCircleIcon = (
  <AddCircleIcon
    sx={{
      color: 'gray',
      fontSize: '18px',
    }}
  />
)

const testRequiredIcon = (
  <HelpIcon
    sx={{
      color: '#d9381c',
      fontSize: '18px',
    }}
  />
)

export const ExamResult: React.FC<{
  e: Examination,
  requiredTestList: Test[],
  allExistingTestMap: TestMap,
  isSelected: boolean,
  setSelected: (v: boolean) => void,
  allTestsFromSelectedExamsMap: Record<Test['id'], true>,
}> = ({
  e,
  requiredTestList,
  allExistingTestMap,
  isSelected,
  setSelected,
  allTestsFromSelectedExamsMap,
}) => {
  const isTestRequired = (t: Test): boolean =>
    Boolean(requiredTestList.find(sel => sel.id === t.id))

  const isTestCovered = (t: Test): boolean =>
    isTestRequired(t) &&
    Boolean(allTestsFromSelectedExamsMap[t.id])

  const testsInThisExam: Test[] = e.testList
    .map(id => allExistingTestMap[id])
    .sort((a, b) => {
      const A: number = isTestRequired(a) ? 1 : -1
      const B: number = isTestRequired(b) ? 1 : -1

      return B - A
    })

  return (
    <Paper sx={{padding: 1}}>
      <Grid container direction="column">
        <Grid item container
          sx={{
            alignItems: 'center',
            gap: 2,
            flexWrap: 'nowrap',
          }}
        >
          <Grid item
            sx={{
              flexGrow: 1,
              justifySelf: 'start',
            }}
          >
            <Typography variant="h6">
              {e.name}
            </Typography>
          </Grid>

          <Grid item
            sx={{
              justifySelf: 'end',
            }}
          >
            <Typography
              variant="h6"
              sx={{
              }}
            >
              {e.price.toFixed(2)}
            </Typography>
          </Grid>

          <Grid item
            sx={{
              justifySelf: 'end',
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isSelected}
                  onChange={ev => {
                    setSelected(ev.target.checked)
                  }}
                />
              }
              label="Selected"
              sx={{
                userSelect: 'none',
                marginRight: 1,
              }}
            />
          </Grid>
        </Grid>

        <Grid container gap={1}>
          {testsInThisExam
            .map(t => (
              <Typography
                key={t.id}
                variant="body1"
                sx={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}
              >
                {isTestCovered(t)
                  ? selectedTestIcon
                  : isTestRequired(t)
                    ? testRequiredIcon
                    : addCircleIcon
                }
                {t.label}
              </Typography>
            ))
          }
        </Grid>
      </Grid>
    </Paper>
  )
}
