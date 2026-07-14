import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import { useGetGlobalAnnotationCountsQuery } from '../../services/sparql'
import { useEffect } from 'react'

export const GlobalStatsModal = ({ isOpen, onClose, scoreTitle }) => {
  const { data, refetch, isLoading } = useGetGlobalAnnotationCountsQuery()

  useEffect(() => {
    isOpen && refetch()
  }, [isOpen, refetch])
  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <DialogTitle>Tonalities contributions</DialogTitle>
      <DialogContent>
        <Backdrop open={isLoading}>
          <CircularProgress />
        </Backdrop>
        <BarChart
          yAxis={[{ data: [' '] }]}
          xAxis={[{ data: [' '] }]}
          series={[
            { label: 'Analytical projects', data: [data?.projects || 0] },
            { label: 'User annotations', data: [data?.annotations || 0] },
            { label: 'Comments', data: [data?.comments || 0] },
            { label: 'Concepts', data: [data?.concepts || 0] },
          ]}
          layout="horizontal"
          width={500}
          height={200}
          borderRadius={10}
          grid={{ vertical: false, horizontal: false }}
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
