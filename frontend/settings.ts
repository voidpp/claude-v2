import { createContext, useContext } from "react";
import {
    DashboardInput,
    PluginType,
    useRemoveDashboardMutation,
    useRemovePluginMutation,
    useRemoveWidgetMutation,
    useSaveDashboardMutation,
    useSavePluginMutation,
    useSaveWidgetMutation,
    useSettingsQuery,
    Widget,
    WidgetInput,
} from "./graphql-types-and-hooks";
import { createContextProviderComponent } from "./widgets";

const useAppSettingsData = () => {
    const { data, refetch } = useSettingsQuery();
    const [saveDashboard] = useSaveDashboardMutation();
    const [saveWidget] = useSaveWidgetMutation();
    const [removeWidget] = useRemoveWidgetMutation();
    const [savePlugin] = useSavePluginMutation();
    const [removeDashboard] = useRemoveDashboardMutation();
    const [removePlugin] = useRemovePluginMutation();

    return {
        settings: data?.settings,
        refreshSettings: refetch,
        removeWidget: async (id: string, refetchSettings = true) => {
            const result = await removeWidget({ variables: { id } });
            if (refetchSettings) refetch();
            return result.data.removeWidget;
        },
        removeDashboard: async (id: string, refetchSettings = true) => {
            const result = await removeDashboard({ variables: { id } });
            if (refetchSettings) refetch();
            return result.data.removeDashboard;
        },
        removePlugin: async (id: string, refetchSettings = true) => {
            const result = await removePlugin({ variables: { id } });
            if (refetchSettings) refetch();
            return result.data.removePlugin;
        },
        saveDashboard: async (data: DashboardInput, refetchSettings = true) => {
            const result = await saveDashboard({ variables: { data } });
            if (refetchSettings) refetch();
            return result.data.saveDashboard;
        },
        saveWidget: async (data: WidgetInput, refetchSettings = true) => {
            const result = await saveWidget({
                variables: { data: { ...data, settings: JSON.stringify(data.settings) } },
            });
            if (refetchSettings) refetch();
            return result.data.saveWidget;
        },
        savePlugin: async (
            id: string,
            file: string,
            name: string,
            type: PluginType,
            className: string,
            refetchSettings = true
        ) => {
            const result = await savePlugin({
                variables: { id, file, name, type, className },
            });
            if (refetchSettings) refetch();
            return result.data.savePlugin;
        },
        getWidgetById: (id: string): Widget => {
            return data.settings.widgets.filter(widget => widget.id === id)[0];
        },
    };
};

const AppSettingsContext = createContext(undefined);

export const useAppSettings = () => useContext<ReturnType<typeof useAppSettingsData>>(AppSettingsContext);

export const AppSettingsContextProvider = createContextProviderComponent(AppSettingsContext, useAppSettingsData);
