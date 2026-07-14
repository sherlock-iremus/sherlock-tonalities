import { Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import { BarChart } from '@mui/x-charts/BarChart'
import { useGetAnnotationCountsQuery, useGetGlobalAnnotationCountsQuery } from '../../services/sparql'
import { useEffect } from 'react'

export const StatsModal = ({ isOpen, onClose, projectIri, scoreTitle }) => {
  const { data, refetch } = useGetAnnotationCountsQuery(projectIri, { skip: !projectIri })
  const { data: globalData, refetch: globalRefetch, isLoading } = useGetGlobalAnnotationCountsQuery()

  useEffect(() => {
    projectIri && isOpen && refetch()
    !projectIri && isOpen && globalRefetch()
  }, [projectIri, isOpen, refetch, globalRefetch])
  return (
    <Dialog open={isOpen} onClose={onClose} sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <DialogTitle>{scoreTitle ? `Analytical project <i>${scoreTitle}</i>` : 'Global stats'}</DialogTitle>
      <DialogContent>
        {data ? (
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
        ) : (
          <>
            <Backdrop open={isLoading}>
              <CircularProgress />
            </Backdrop>
            <BarChart
              yAxis={[{ data: [' '] }]}
              xAxis={[{ data: [' '] }]}
              series={[
                { label: 'Analytical projects', data: [globalData?.projects || 0] },
                { label: 'User annotations', data: [globalData?.annotations || 0] },
                { label: 'Comments', data: [globalData?.comments || 0] },
                { label: 'Concepts', data: [globalData?.concepts || 0] },
              ]}
              layout="horizontal"
              width={500}
              height={200}
              borderRadius={10}
              grid={{ vertical: false, horizontal: false }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">
          Go back
        </Button>
      </DialogActions>
    </Dialog>
  )
}
