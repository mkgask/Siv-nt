import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import styled from "@emotion/styled";



const StyledDialogText = styled(DialogContentText)({
    color: '#646464',
    fontSize: '0.95rem',
    fontWeight: 500,
})



export default function DialogPackageLicense(props) {

    const [licenses, setLicenses] = useState(null)

    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent
        const ipcSend = (window as any).ipcSend

        ipcEvent.onPackageLicenses((licenses) => {
            const licenseList = []
            console.log('DialogPackageLicense: onPackageLicenses: licenses: ', licenses)

            for (const license of licenses) {    // TODO: convert object to array
                licenseList.push(
                    <StyledDialogText key={license.name}>
                        {license.name}@{license.version}
                    </StyledDialogText>
                )
            }

            setLicenses(licenseList)
        })

        ipcSend.readyPackageLicenses()
    })



    const handleClose = () => {
        props.setShowDialogPackageLicense(false)
    }

    return (
        <Dialog
            open={props.show}
            onClose={handleClose}
            className={`dialog-package-licenses ${props.show ? 'active' : 'inactive'}`}
        >
            <DialogTitle>
                Package Licenses
            </DialogTitle>

            <DialogContent>
                {licenses}
            </DialogContent>
        </Dialog>
    )
}


