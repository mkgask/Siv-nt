import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Typography from '@mui/material/Typography'
import { AppBar, IconButton, Toolbar, styled, Link, Box, Menu, MenuItem, Stack } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import packageJson from '../../package.json'



const Root = styled('section')(({ theme }) => {
  return {
    textAlign: 'center',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    backgroundColor: '#333333',
    color: '#ffffff',
  }
})



function Home() {
  const [open, setOpen] = React.useState(false)
  const handleClose = () => setOpen(false)
  const handleClick = () => setOpen(true)



  /*  Modules  Menu
  */
  const [anchorEl, setAnchorEl] = React.useState(null)

  const menuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const menuClose = () => {
    setAnchorEl(null)
  }


  /*  Modules  Image
  */
  const accepted_types = [
    'image/png',
    'image/apng',
    'image/jpeg',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'image/webp',
    'image/avif',
  ]

  const [ImageSource, setImageSource] = React.useState(null)
  const [ImageFilePath, setImageFilePath] = React.useState(null)
  const [ImageFileSize, setImageFileSize] = React.useState(null)

  const handleDrop = (event) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    console.log('drop image')
    console.debug(file)

    if (accepted_types.indexOf(file.type) === -1) {
      alert('画像ファイルをドロップしてください')
      return
    }

    if (file) {
      const reader = new FileReader()

      reader.onload = (event) => {
        setImageSource(event.target.result)
        setImageFilePath(file.path)
        setImageFileSize(calculateDisplayFileSize(file.size))
      }

      reader.readAsDataURL(file)
    }
  }

  const calculateDisplayFileSize = (size) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
    const index = Math.floor(Math.log(size) / Math.log(1024))
    const display_size = (size / Math.pow(1024, index)).toFixed(2) * 1 + ' ' + units[index]
    return display_size
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }



  return (
    <React.Fragment>
      <Head>
        <title>{packageJson.name} v{packageJson.version}</title>
      </Head>
      <Root>
        <Stack
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {ImageSource ? (
            <Image
              src={ImageSource}
              alt='Image'
              layout='intrinsic'
              width={5120}
              height={5120}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <Typography>
              Drop Image
            </Typography>
          )}
        </Stack>
      </Root>
      <AppBar position='fixed' color='primary' sx={{ top: 'auto', bottom: 0 }}>
        <Toolbar>
          <Stack>
            {ImageFilePath ? (
              <Typography>
                {ImageFilePath}
              </Typography>
            ) : (
              <></>
            )}
            {ImageFileSize ? (
              <Typography>
                {ImageFileSize}
              </Typography>
            ) : (
              <></>
            )}
          </Stack>
          {/*
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
                color='inherit'
                aria-label='menu open'
                title='Menu'
                edge='start'
                onClick={menuClick}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={menuClose}
            >
                <MenuItem onClick={handleClose}>メニューアイテム1</MenuItem>
                <MenuItem onClick={handleClose}>メニューアイテム2</MenuItem>
                <MenuItem onClick={handleClose}>メニューアイテム3</MenuItem>
            </Menu>
          */}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  )
}

export default Home
