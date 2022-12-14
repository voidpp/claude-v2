import { useInterval } from "@/hooks";
import { BaseWidgetSettings, CommonWidgetProps } from "@/types";
import { Box, SxProps } from "@mui/material";
import dayjs from "dayjs";
import * as React from "react";
import { useState } from "react";
import { RndFrame, useRnd } from "../rnd";
import { WidgetMenu } from "../widget-menu";

export class ClockSettings extends BaseWidgetSettings {
    showDate: boolean = true;
    timeFormat: string = "HH:mm";
    dateFormat: string = "YYYY. MMMM D. dddd";
}

export type ClockProps = CommonWidgetProps<ClockSettings>;

const bodyStyle: SxProps = {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    overflow: "hidden",
};

const getClockStyle = (height: number): SxProps => ({
    textAlign: "center",
    lineHeight: "90%",
    fontFamily: "Digital7",
    marginTop: 0,
    fontSize: height * 0.8,
});

const getDateStyle = (height: number): SxProps => ({
    textAlign: "center",
    lineHeight: "95%",
    fontWeight: "bold",
    fontSize: height * 0.17,
});

const getTimeString = (timeFormat: string) => dayjs().format(timeFormat);

const DateDisplay = ({ height, format }: { height: number; format: string }) => (
    <Box sx={getDateStyle(height)}>{dayjs().format(format)}</Box>
);

export const Clock = (props: ClockProps) => {
    const { config } = props;
    const [time, setTime] = useState(getTimeString(config.settings.timeFormat));
    const rndProps = useRnd(config, 10);

    useInterval(() => {
        setTime(getTimeString(config.settings.timeFormat));
    }, 1000);

    const height = rndProps.size.height as number;

    return (
        <RndFrame rndProps={rndProps}>
            <Box sx={bodyStyle}>
                <Box sx={getClockStyle(height)}>{time}</Box>
                {props.config.settings.showDate && <DateDisplay height={height} format={config.settings.dateFormat} />}
            </Box>
            <WidgetMenu
                id={config.id}
                settings={config.settings}
                settingsFormFields={[
                    {
                        name: "timeFormat",
                        label: "Time format",
                    },
                    {
                        name: "dateFormat",
                        label: "Date format",
                    },
                    {
                        name: "showDate",
                        label: "Show date",
                    },
                ]}
            />
        </RndFrame>
    );
};
