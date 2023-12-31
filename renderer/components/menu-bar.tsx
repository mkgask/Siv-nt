import { useEffect, useState } from 'react';

import MenuIcon from '@mui/icons-material/Menu';

import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    styled
} from '@mui/material';

import ApiRoundedIcon from '@mui/icons-material/ApiRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import menuListStyle from './menu-bar.module.css';



const StyledMenuList = styled(MenuList)(({ theme }) => ({
    position: 'absolute',
    top: 'auto',
    left: 'auto',
    right: 0,
    backgroundColor: '#2885D181',
    color: '#ffffff',
}))

const StyledApiIcon = styled(ApiRoundedIcon)(({ theme }) => ({
    color: '#ffffff',
}))

const StyledHelpIcon = styled(HelpRoundedIcon)(({ theme }) => ({
    color: '#ffffff',
}))

const StyledSettingsIcon = styled(SettingsRoundedIcon)(({ theme }) => ({
    color: '#ffffff',
}))



export default function MenuBar(props) {

    const [menuOpen, setMenuOpen] = useState(false)

    const [displayInfoFilePath, setDisplayInfoFilePath] = useState('')



    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent

        const onChangeDisplayInfo = (media) => {
            console.log('Home: onChangeDisplayInfo: media: ', media)
            setDisplayInfoFilePath(media.path)
        }

        ipcEvent.onChangeDisplayInfo(onChangeDisplayInfo)

        return () => {
            ipcEvent.off('onChangeDisplayInfo', onChangeDisplayInfo)
        }
    }, [])



    const handleMenuClick = (event) => {
        event.preventDefault()
        setMenuOpen(pervMenuOpen => !pervMenuOpen)
    }



    const handleApiClick = (event) => {
        event.preventDefault()
        props.openDialogApi()
        setMenuOpen(false)
    }



    const handleHelpClick = (event) => {
        event.preventDefault()
        props.openDialogHelp()
        setMenuOpen(false)
    }

    const handleSettingsClick = (event) => {
        event.preventDefault()
        props.openDialogSettings()
        setMenuOpen(false)
    }



    return (
        <>
            <MenuIcon
                onClick={handleMenuClick}
                sx={{ cursor: 'pointer' }}
            ></MenuIcon>

            <StyledMenuList
                className={`
                    ${menuOpen ?
                        displayInfoFilePath ? menuListStyle.menuListActive : menuListStyle.menuListActiveAppbarInactive :
                        menuListStyle.inactive}
                `}
            >
                <MenuItem
                    onClick={handleSettingsClick}
                >
                    <ListItemIcon>
                        <StyledSettingsIcon></StyledSettingsIcon>
                    </ListItemIcon>
                    <ListItemText>
                        Settings
                    </ListItemText>
                    </MenuItem>

                <MenuItem
                    onClick={handleApiClick}
                >
                    <ListItemIcon>
                        <StyledApiIcon></StyledApiIcon>
                    </ListItemIcon>
                    <ListItemText>
                        Package Licenses
                    </ListItemText>
                </MenuItem>

                <MenuItem
                    onClick={handleHelpClick}
                >
                    <ListItemIcon>
                        <StyledHelpIcon></StyledHelpIcon>
                    </ListItemIcon>
                    <ListItemText>
                        Help
                    </ListItemText>
                </MenuItem>
            </StyledMenuList>
        </>
    )
}


