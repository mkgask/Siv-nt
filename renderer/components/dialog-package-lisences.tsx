import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Stack
} from "@mui/material";

import styled from "@emotion/styled";

import md from "../lib/markdown-utils";


const VerticalStack = styled(Stack)({
    width: '50vw',
})

const HorizontalStack = styled(Stack)({
    justifyContent: 'space-between',
    paddingTop: '1rem',
    paddingBottom: '1rem',
})

const StyledDialogText = styled(DialogContentText)({
    color: '#646464',
    fontSize: '0.95rem',
    fontWeight: 500,
})

type LicenseContent = {
    "licenses": string,
    "repository": string,
    "publisher": string,
    "url": string,
    "name": string,
    "version": string,
    "description": string,
    "copyright": string,
    "licenseFile": string,
    "licenseText": string,
    "licenseModified": string,
    "path": string,
}



export default function DialogPackageLicense(props) {

    const [licenses, setLicenses] = useState(null)
    const [showDetail, setShowDetail] = useState(false)
    const [licenseText, setLicenseText] = useState(null)

    useEffect(() => {
        const ipcEvent = (window as any).ipcEvent
        const ipcSend = (window as any).ipcSend

        const onPackageLicenses = (licenses) => {
            const licenseList = []
            console.log('DialogPackageLicense: onPackageLicenses: licenses: ', licenses)

            const openDetail = (event) => {
                event.preventDefault()
                console.log('DialogPackageLicense: openDetail')

                console.log('DialogPackageLicense: openDetail: event.target.innerText: ', event.target.innerText)
                const licenseName: string = licenses[event.target.innerText].name
                const licenseVersion: string = licenses[event.target.innerText].version
                const licenseText: string = licenses[event.target.innerText].licenseText
                console.log('DialogPackageLicense: openDetail: licenseName: ', licenseName)
                console.log('DialogPackageLicense: openDetail: licenseVersion: ', licenseVersion)
                console.log('DialogPackageLicense: openDetail: licenseText.length: ', licenseText.length)
                //console.log('DialogPackageLicense: openDetail: licenseText: ', licenseText)

                const licenseTextComponent = (texts: string) => {
                    console.log('DialogPackageLicense: openDetail: texts.length: ', texts.length)
                    return md.convertMarkDown2ReactComponent(texts)
                }

                setLicenseText(licenseTextComponent(licenseName + '@' + licenseVersion + '\n\n' + licenseText))
                //setLicenseText(licenseTextComponent(licenseText))

                setShowDetail(true)
            }

            Object.entries(licenses).forEach(([key, value]: [string, LicenseContent]) => {
                licenseList.push(
                    <HorizontalStack
                        direction="row"
                        key={key}
                        onClick={openDetail}
                    >
                        <StyledDialogText>
                            {value.name}@{value.version}
                        </StyledDialogText>

                        <StyledDialogText>
                            {value.licenses}
                        </StyledDialogText>
                    </HorizontalStack>
                )
            })

            setLicenses(licenseList)
        }

        ipcEvent.onPackageLicenses(onPackageLicenses)

        ipcSend.readyPackageLicenses()

        return () => {
            ipcEvent.off('onPackageLicenses', onPackageLicenses)
        }
    }, [])



    const handleClose = () => {
        props.setShowDialogPackageLicense(false)
    }

    return (
        <>
            <Dialog
                open={props.show}
                onClose={handleClose}
                className={`dialog-package-licenses ${props.show ? 'active' : 'inactive'}`}
                aria-labelledby="modal-package-licenses-title"
                aria-describedby="modal-package-licenses-description"
                maxWidth="lg"
                sx={{ margin: '5vw' }}
            >
                <DialogContent
                    className="dialog-package-licenses-content"
                >
                    <DialogTitle>
                        Package Licenses
                    </DialogTitle>

                    <VerticalStack
                        divider={<Divider orientation="horizontal" flexItem />}
                    >
                        {licenses}
                    </VerticalStack>
                </DialogContent>
            </Dialog>

            <Dialog
                open={showDetail}
                onClose={() => setShowDetail(false)}
                className={`dialog-package-license-text ${showDetail ? 'active' : 'inactive'}`}
                maxWidth="lg"
                sx={{ margin: '4vw' }}
            >
                <DialogContent>
                    <StyledDialogText>
                        {licenseText}
                    </StyledDialogText>
                </DialogContent>
            </Dialog>
        </>
    )
}


