import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { useGetAnnotationCountsQuery } from '../../services/sparql'
import { useEffect } from 'react'

export const StatsModal = ({ isOpen, onClose, projectIri, scoreTitle }) => {
  const { data, refetch } = useGetAnnotationCountsQuery(projectIri, { skip: !projectIri })

  useEffect(() => {
    isOpen && refetch()
  }, [isOpen, refetch])

  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <DialogTitle>
        Analytical project <i>{scoreTitle}</i>
      </DialogTitle>
      <DialogContent>
        <PieChart
          series={[
            {
              data: [
                { id: 0, value: data?.rootAnnotationsCount || 0, label: 'Root annotations' },
                { id: 1, value: data?.subAnnotationsCount || 0, label: 'Sub-annotations' },
              ],
              outerRadius: 100,
              innerRadius: 30,
              paddingAngle: 5,
              cornerRadius: 5,
            },
          ]}
          width={200}
          height={200}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">
          Go back
        </Button>
      </DialogActions>
    </Dialog>
  )
}
