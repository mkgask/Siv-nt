import { useEffect, useState } from 'react'
import Head from 'next/head'

import {
    AppBar,
    Toolbar,
    styled,
} from '@mui/material'

import packageJson from '../../package.json'

import MediaViewer from '../components/media-viewer'
import DisplayInfo from '../components/display-info'
import MenuBar from '../components/menu-bar'
import DialogHelp from '../components/dialog-help'
import DialogSettings from '../components/dialog-settings'
import DialogPackageLicense from '../components/dialog-package-lisences'

import appBarStyle from './app-bar.module.css'


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
    backgroundColor: '#2885D181',
    color: '#ffffff',
    gap: '0.32vw',
    padding: '1rem 0',
    justifyContent: 'space-between',

    [`@media (min-width: ${theme.breakpoints.values.sm}px)`]: {
        minHeight: 'initial',
    },

    [`@media (min-width: ${theme.breakpoints.values.md}px)`]: {
        minHeight: 'initial',
    },
}))



function Home() {

    const [appBarActive, setAppBarActive] = useState(true)

    const [showDialogApi, setShowDialogApi] = useState(false)
    const [showDialogHelp, setShowDialogHelp] = useState(false)
    const [showDialogSettings, setShowDialogSettings] = useState(false)



    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        const onToggleMenuBar = () => {
            setAppBarActive((prevAppBarActive) => {
                const newAppBarActive = !prevAppBarActive
                console.log('Home: onToggleMenuBar(): prevAppBarActive -> newAppBarActive ', prevAppBarActive, ' -> ', newAppBarActive)
                ; (window as any).ipcSend.settings('display_info_enabled', newAppBarActive )
                return newAppBarActive
            })
        }

        const onSettings = (settings) => {
            console.log('FileInfo: onSettings(): settings.display_info_enabled : ', settings.display_info_enabled)
            setAppBarActive(settings.display_info_enabled)
        }
    
        ipcEvent.onToggleMenuBar(onToggleMenuBar)
        ipcEvent.onSettings(onSettings)

        return () => {
            ipcEvent.off('onToggleMenuBar', onToggleMenuBar)
            ipcEvent.off('onSettings', onSettings)
        }
    }, [])



    return (
        <>
            <Head>
                <title>{packageJson.name} v{packageJson.version}</title>
            </Head>

            <Theme>
                <MediaViewer></MediaViewer>
            </Theme>

            <AppBar
                position='fixed'
                color="transparent"
                sx={{ top: 'auto', bottom: 0 }}
                className={`${appBarStyle.appBar} ${appBarActive ? 'appBar-active' : appBarStyle.inactive}`}
            >
                <StyledToolbar>
                    <DisplayInfo></DisplayInfo>
                    <MenuBar
                        openDialogApi={() => { setShowDialogApi(true) }}
                        openDialogHelp={() => { setShowDialogHelp(true) }}
                        openDialogSettings={() => { setShowDialogSettings(true) }}
                    ></MenuBar>
                </StyledToolbar>
            </AppBar>

            <DialogHelp
                show={showDialogHelp}
                setShowDialogHelp={setShowDialogHelp}
            ></DialogHelp>

            <DialogPackageLicense
                show={showDialogApi}
                setShowDialogPackageLicense={setShowDialogApi}
            ></DialogPackageLicense>

            <DialogSettings
                show={showDialogSettings}
                setShowDialogSettings={setShowDialogSettings}
            ></DialogSettings>
        </>
    )
}

export default Home
