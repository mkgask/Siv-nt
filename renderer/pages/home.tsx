import React from 'react'
import Head from 'next/head'

import {
    AppBar,
    Toolbar,
    styled,
} from '@mui/material'

import packageJson from '../../package.json'

import MediaViewer from '../components/media-viewer'
import DisplayInfo from '../components/display-info'



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
        <>
            <Head>
                <title>{packageJson.name} v{packageJson.version}</title>
            </Head>
            <Theme>
                <MediaViewer></MediaViewer>
            </Theme>
            <AppBar position='fixed' color="transparent" sx={{ top: 'auto', bottom: 0 }}>
                <StyledToolbar>
                    <DisplayInfo></DisplayInfo>
                </StyledToolbar>
            </AppBar>
        </>
    )
}

export default Home
