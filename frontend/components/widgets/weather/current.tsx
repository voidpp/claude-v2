import { PluginType, useCurrentWeatherQuery } from "@/graphql-types-and-hooks";
import { useInterval, usePluginOptions } from "@/hooks";
import { BaseWidgetSettings, CommonWidgetProps } from "@/types";
import { Box } from "@mui/material";
import * as React from "react";
import { RndFrame, useRnd } from "../../rnd";
import { WidgetMenu } from "../../widget-menu";
import { FormSelectFieldDescriptor } from "../../widget-settings-dialog";

export class CurrentWeatherSettings extends BaseWidgetSettings {
    city: string = "Budapest";
    pollInterval: number = 60 * 10;
    showCity: boolean = false;
    providerId: string = "";
}

export type CurrentWeatherProps = CommonWidgetProps<CurrentWeatherSettings>;

export const CurrentWeather = (props: CurrentWeatherProps) => {
    const { config } = props;
    const rndProps = useRnd(config, 10);
    const providerOptions = usePluginOptions(PluginType.Weather);

    const { data, refetch } = useCurrentWeatherQuery({
        variables: { city: config.settings.city, providerId: config.settings.providerId },
    });

    useInterval(refetch, config.settings.pollInterval * 1000);

    function onBeforeSettingsSubmit(settings: CurrentWeatherSettings) {
        if (settings.city != config.settings.city) refetch();
    }

    const width = rndProps.size.width as number;

    return (
        <RndFrame rndProps={rndProps}>
            <Box sx={{ fontSize: width * 0.3 }}>
                {data && providerOptions.length && (
                    <>
                        {config.settings.showCity && (
                            <Box sx={{ fontSize: width * 0.1, textAlign: "center" }}>{config.settings.city}</Box>
                        )}
                        <Box sx={{ textAlign: "center" }}>{data.weather.current.temperature}°C</Box>
                        <Box sx={{ textAlign: "center" }}>
                            <img style={{ width: width * 0.9 }} src={data.weather.current.image} />
                        </Box>
                    </>
                )}
            </Box>
            <WidgetMenu
                id={config.id}
                onBeforeSubmit={onBeforeSettingsSubmit}
                settings={config.settings}
                defaultOpen={!config.settings.providerId}
                settingsFormFields={[
                    {
                        name: "providerId",
                        label: "Provider",
                        type: "select",
                        default: "",
                        options: providerOptions,
                    } as FormSelectFieldDescriptor,
                    {
                        name: "city",
                        label: "City",
                    },
                    {
                        name: "pollInterval",
                        label: "Interval",
                    },
                    {
                        name: "showCity",
                        label: "Show city name",
                    },
                ]}
            />
        </RndFrame>
    );
};
