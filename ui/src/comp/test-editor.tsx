import React, { useState } from 'react'
import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import {
  Examination,
  Test,
} from '../../../shared/types'
import { deleteJSON, postJSON } from '../utils'

export const TestEditor: React.FC<{
  t: Test,
  examList: Examination[],
  onDataUpdated: () => void,
}> = ({
  t,
  onDataUpdated,
  examList,
}) => {
  const [label, setLabel] = useState<Test['label']>(t.label)

  const useCount = t.id
    ? examList.filter(e => e.testList.includes(t.id)).length
    : 0

  return (
    <Paper sx={{padding: 1}}>
      <Grid container
        sx={{
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Grid item>
          <TextField
            required
            label="Test name"
            value={label}
            InputProps={{
              readOnly: Boolean(t.id),
            }}
            onChange={ev => {
              setLabel(ev.target.value)
            }}
          />
        </Grid>

        {t.id && (
          <>
            <Grid item>
              <Button
                disabled={Boolean(useCount)}
                variant='contained'
                color='error'
                onClick={async ev => {
                  ev.preventDefault()

                  if (!confirm('Are you sure you want to delete this test?')) {
                    return
                  }

                  await deleteJSON('/api/tests/' + t.id)
                  onDataUpdated()
                }}
              >
                Delete
              </Button>
            </Grid>

            {Boolean(useCount) && (
              <Grid item>
                <Typography>
                  Used in {useCount} examinations
                </Typography>
              </Grid>
            )}
          </>
        )}

        {!t.id && (
          <Grid item>
            <Button
              variant='contained'
              onClick={async ev => {
                ev.preventDefault()

                const payload: Omit<Test, 'id'> = {
                  label,
                }

                await postJSON('/api/exams', payload)
                setLabel('')
                onDataUpdated()
              }}
            >
              {t.id ? 'Save' : 'Add new'}
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  )
}
