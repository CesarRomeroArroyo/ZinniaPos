import { SettingTaskKeys } from "../consts/enums/initial-setting.enum";

export interface IInitialSetting<I> {
    key: SettingTaskKeys;
    tasks: Array<I>;
    completed: boolean;
}