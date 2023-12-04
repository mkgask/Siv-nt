import { useState } from "react";

import { Switch } from "@mui/material";

import {
    SettingsStack,
    SettingsInnerStack,
    SettingsDialogText,
} from "./settings-style";



export default function SettingsSwitch({
    name = 'Swtich',
    value_name = 'value_name',
    arg_checked = false,
}) {

    const [checked, setChecked] = useState(arg_checked)

    /*
    // 親コンポーネントから更新された値を受け取ることはないのでコメントアウト
    // 値の更新は本コンポーネントからしか発出されない
    useEffect(() => {
        setChecked(arg_checked)
    }, [arg_checked])
    */

    const handleChange = (event, newValue) => {
        event.preventDefault()
        console.log('DialogSettings: handleChange: ', name, ': ', newValue)
        setChecked(newValue as boolean)
        ; (window as any).ipcSend.settings(value_name, newValue)
    }

    return (
        <SettingsStack
            direction="row"
        >
            <SettingsDialogText>
                {name}
            </SettingsDialogText>

            <SettingsInnerStack
                direction="row"
            >
                <SettingsDialogText>
                    {checked ? 'On' : 'Off'}
                </SettingsDialogText>

                <Switch
                    checked={checked}
                    onChange={handleChange}
                ></Switch>
            </SettingsInnerStack>
        </SettingsStack>
    )

}