import React from 'react'
import { Checkbox, FormControlLabel, Grid, Paper, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { Examination, Test } from '../../../shared/types'

export const ExamResult: React.FC<{
  e: Examination,
  selectedTestList: Test[],
  isSelected: boolean,
  setSelected: (v: boolean) => void,
}> = ({
  e,
  selectedTestList,
  isSelected,
  setSelected,
}) => (
  <Paper sx={{padding: 1}}>
    <Grid container direction="column">
      <Grid container
        sx={{
          alignItems: 'center',
          gap: 1,
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
          <FormControlLabel control={
            <Checkbox
              checked={isSelected}
              onChange={ev => {
                setSelected(ev.target.checked)
              }}
            />
          } label="Selected" />
        </Grid>
      </Grid>

      <Grid container gap={1}>
        {selectedTestList
          .filter(t => e.testList.includes(t.id))
          .map(t => (
            <Typography
              variant="body1"
              key={t.id}
              sx={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
              }}
            >
              <CheckCircleIcon
                sx={{
                  color: 'green',
                  fontSize: '18px',
                }}
              />
              {t.label}
            </Typography>
          ))
        }
      </Grid>
    </Grid>
  </Paper>
)
