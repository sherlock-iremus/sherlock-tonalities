/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Menu } from '../components/Menu'
import { List, ListItemButton, ListItemText } from '@mui/material'
import { useExportProjectQuery, useExportProjectToMetaQuery } from '../services/sparql'
import { useSelector } from 'react-redux'

export const ExportMenu = ({ filename, contextMenu, setContextMenu }) => {
  const [isDownloadingCidoc, setIsDownloadingCidoc] = useState(false)
  const [isDownloadingMeta, setIsDownloadingMeta] = useState(false)
  const { projectIri, scoreIri } = useSelector(state => state.globals)
  const { data: cidocData } = useExportProjectQuery({ projectIri, scoreIri }, { skip: !isDownloadingCidoc })
  const { data: metaData } = useExportProjectToMetaQuery(projectIri, { skip: !isDownloadingMeta })

  const downloadFile = async data => {
    try {
      const blob = new Blob([data], { type: 'text/turtle' })
      const file = new File([blob], filename + '.ttl', {
        type: 'text/turtle',
      })
      const downloadLink = document.createElement('a')
      downloadLink.href = URL.createObjectURL(file)
      downloadLink.download = `${filename}_${
        isDownloadingCidoc ? 'CIDOC' : 'POLIFONIA'
      }_${new Date().toLocaleDateString('en-GB')}.ttl`
      downloadLink.click()
      setIsDownloadingCidoc(false)
      setIsDownloadingMeta(false)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (cidocData && isDownloadingCidoc) downloadFile(cidocData)
    if (metaData && isDownloadingMeta) downloadFile(metaData)
  }, [cidocData, metaData])

  return (
    <Menu
      open={!!contextMenu}
      onClose={() => setContextMenu(null)}
      anchorReference="anchorPosition"
      {...(contextMenu && { anchorPosition: { top: contextMenu.mouseY, left: contextMenu.mouseX } })}
    >
      <List dense disablePadding>
        <ListItemButton disabled={isDownloadingCidoc} onClick={() => setIsDownloadingCidoc(true)}>
          <ListItemText primary="Cidoc CRM export" />
        </ListItemButton>
        <ListItemButton disabled={isDownloadingMeta} onClick={() => setIsDownloadingMeta(true)}>
          <ListItemText primary="Polifonia Music Representation export" />
        </ListItemButton>
      </List>
    </Menu>
  )
}
