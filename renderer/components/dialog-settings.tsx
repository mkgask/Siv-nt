import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@mui/material";

import SettingsSlider from "./dialog-settings/settings-slider";
import SettingsSwitch from "./dialog-settings/settings-switch";
import { SettingsDivider } from "./dialog-settings/settings-style";

import type { SettingsType } from "../../commonTypes/settings-type";



export default function DialogSettings(props) {

    const [settings, setSettings] = useState<SettingsType>({} as SettingsType)

    useEffect(() => {
        const ipcSend = (window as any).ipcSend
        const ipcEvent = (window as any).ipcEvent

        const onSettings = (settings: SettingsType) => {
            console.log('DialogSettings: onSettings: settings: ', settings)
            setSettings(settings)
        }

        ipcEvent.onSettings(onSettings)

        ipcSend.readySettingsDialog()

        return () => {
            ipcEvent.off('onSettings', onSettings)
        }
    }, [])

    const handleClose = () => {
        props.setShowDialogSettings(false)
    }

    return (
        <>
            <Dialog
                open={props.show}
                onClose={handleClose}
                maxWidth="lg"
                className={`dialog-settings ${props.show ? 'active' : 'inactive'}`}
            >
                <DialogContent>
                    <DialogTitle>
                        Settings
                    </DialogTitle>

                    <SettingsDivider />

                    <SettingsSlider
                        name="Image move ratio horizontal"
                        value_name="image_move_ratio_x"
                        arg_value={settings.image_move_ratio_x}
                        arg_min={1}
                        arg_max={32}
                    />

                    <SettingsDivider />

                    <SettingsSlider
                        name="Image move ratio vertical"
                        value_name="image_move_ratio_y"
                        arg_value={settings.image_move_ratio_y}
                        arg_min={1}
                        arg_max={32}
                    />

                    <SettingsDivider />

                    <SettingsSwitch
                        name="Image move inverse horizontal"
                        value_name="move_inverse_x"
                        arg_checked={settings.move_inverse_x}
                    />

                    <SettingsDivider />

                    <SettingsSwitch
                        name="Image move inverse vertical"
                        value_name="move_inverse_y"
                        arg_checked={settings.move_inverse_y}
                    />

                    <SettingsDivider />

                    <SettingsSlider
                        name="Zoom change ratio"
                        value_name="zoom_change_ratio"
                        arg_value={settings.zoom_change_ratio}
                        arg_min={1}
                        arg_max={32}
                    />

                    <SettingsDivider />

                    <SettingsSwitch
                        name="Zoom wheel inverse"
                        value_name="wheel_inverse"
                        arg_checked={settings.wheel_inverse}
                    />

                    <SettingsDivider />

                    <SettingsSwitch
                        name="Log output"
                        value_name="log_output"
                        arg_checked={settings.log_output}
                    />

                </DialogContent>
            </Dialog>
        </>
    )
}