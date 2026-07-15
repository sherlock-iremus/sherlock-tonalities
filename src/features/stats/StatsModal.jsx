import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { useGetAnnotationCountsQuery, useGetProjectStatsQuery } from '../../services/sparql'
import { useEffect } from 'react'

export const StatsModal = ({ isOpen, onClose, projectIri, scoreTitle }) => {
  const { data, refetch } = useGetAnnotationCountsQuery(projectIri, { skip: !projectIri })
  const { data: projectData, refetch: projectRefetch } = useGetProjectStatsQuery(projectIri, { skip: !projectIri })

  useEffect(() => {
    isOpen && refetch() && projectRefetch()
  }, [isOpen, refetch, projectRefetch])
  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <DialogTitle>Contributions for ${scoreTitle}</DialogTitle>
      <DialogContent>
        <BarChart
          yAxis={[{ data: [' '] }]}
          xAxis={[{ data: [' '] }]}
          series={[
            { label: 'Annotations', data: [projectData?.annotations || 0] },
            { label: 'Comments', data: [projectData?.comments || 0] },
            { label: 'Concepts', data: [projectData?.concepts || 0] },
          ]}
          layout="horizontal"
          width={500}
          height={200}
          borderRadius={10}
          grid={{ vertical: false, horizontal: false }}
        />
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
