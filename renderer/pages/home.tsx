import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Typography from '@mui/material/Typography'

import {
    AppBar,
    IconButton,
    Toolbar,
    styled,
    Link,
    Box,
    Menu,
    MenuItem,
    Stack,
} from '@mui/material'

import MenuIcon from '@mui/icons-material/Menu'

import packageJson from '../../package.json'

import MediaViewer from '../components/media-viewer'
import FileInfo from '../components/file-info'



const Theme = styled('section')(({ theme }) => {
    return {
        textAlign: 'center',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#333333',
        color: '#ffffff',
    }
})

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    minHeight: 'initial',
    padding: 0,
    [`@media (min-width: ${theme.breakpoints.values.sm}px)`]: {
        minHeight: 'initial',
        padding: 0,
    },
    [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
        minHeight: 'initial',
        padding: 0,
    },
}))



function Home() {
    return (
        <React.Fragment>
            <Head>
                <title>{packageJson.name} v{packageJson.version}</title>
            </Head>
            <Theme>
                <MediaViewer></MediaViewer>
            </Theme>
            <AppBar position='fixed' color="transparent" sx={{ top: 'auto', bottom: 0 }}>
                <StyledToolbar>
                    <FileInfo></FileInfo>
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
                </StyledToolbar>
            </AppBar>
        </React.Fragment>
    )
}

export default Home
