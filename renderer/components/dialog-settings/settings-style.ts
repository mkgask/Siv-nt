import styled from "@emotion/styled";

import {
    DialogContentText,
    Divider,
    Stack
} from "@mui/material";



const SettingsStack = styled(Stack)({
    marginTop: '1rem',
    marginBottom: '1rem',
    width: '50vw',
    gap: '3vw',
    justifyContent: 'space-between',
    alignItems: 'center',
})

const SettingsInnerStack = styled(Stack)({
    gap: '3vw',
    alignItems: 'center',
})

const SettingsDialogText = styled(DialogContentText)({
    flexShrink: 0,
    fontWeight: 500,
})

const SettingsDivider = styled(Divider)({
    marginTop: '1rem',
})



export {
    SettingsStack,
    SettingsInnerStack,
    SettingsDialogText,
    SettingsDivider,
}


