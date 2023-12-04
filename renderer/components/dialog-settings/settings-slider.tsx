import { useState } from "react";

import { Slider } from "@mui/material";

import {
    SettingsStack,
    SettingsInnerStack,
    SettingsDialogText,
} from "./settings-style";



export default function SettingsSlider({
    name = 'Slider',
    value_name = 'value_name',
    arg_value = 16,
    arg_min = 1,
    arg_max = 32,
}) {

    const [value, setValue] = useState(arg_value)
    const [min, setMin] = useState(arg_min)
    const [max, setMax] = useState(arg_max)

    /*
    // 親コンポーネントから更新された値を受け取ることはないのでコメントアウト
    // 値の更新は本コンポーネントからしか発出されない
    useEffect(() => {
        setValue(props.value)
    }, [props.value])
    */

    const handleChange = (event, newValue) => {
        event.preventDefault()
        console.log('DialogSettings: handleChange: ', name, ': ', newValue)
        setValue(newValue as number)
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
                    {value}
                </SettingsDialogText>

                <Slider
                    value={value}
                    min={min}
                    max={max}
                    onChange={handleChange}
                    sx={{ width: '16vw' }}
                ></Slider>
            </SettingsInnerStack>
        </SettingsStack>
    )

}