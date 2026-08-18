import { apiClient } from "../client";

export type SettingsGroup = Record<string, string>;

export const settingsApi = {
  getGroup: (groupName: string) => apiClient.get<SettingsGroup>(`/settings/${groupName}`).then((r) => r.data),
  updateGroup: (groupName: string, values: SettingsGroup) =>
    apiClient.put<SettingsGroup>(`/settings/${groupName}`, values).then((r) => r.data),
};
