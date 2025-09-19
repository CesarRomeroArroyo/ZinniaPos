import { Injectable } from "@angular/core";
import { BusinessCategoryId } from "../../consts/enums/business/business-category.enum";
import { initalSettingTaskMap } from "../../consts/values/initial-setting.consts";
import { IInitialSetting } from "../../interfaces/initial-setting.interface";
import { IListTask } from "../../consts/types/progress-list.type";
import { AuthSessionService } from "./auth-session.service";
import { ModalController } from "@ionic/angular";
import { SettingsStorageService } from "./storage/setting-storage.service";
import { AppSettingsKeys, SettingTaskKeys } from "../../consts/enums/initial-setting.enum";
import { BehaviorSubject, Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class InitialBusinessSettingService {

    private initalSetting!: IInitialSetting<IListTask>;
    private readonly STOREGE_KEY = AppSettingsKeys.BUSINESS_SETTING;
    private readonly INITIAL_SETTING_TASKS_MAP = initalSettingTaskMap;

    private tasksSubject = new BehaviorSubject<IListTask[]>([]);

    constructor(
        private _modalCtrl: ModalController,
        private _authSession: AuthSessionService,
        private _settingStorageSrv: SettingsStorageService
    ) { 
        this._authSession.userAuthenticated$.subscribe(() => {
            this.initializeSetting();
        });
    }

    public getTasks$(): Observable<IListTask[]> {
        return this.tasksSubject.asObservable();
    }

    public initializeSetting() {
        if(!this.getSetting()) {
            this.initalSetting = {
                key: SettingTaskKeys.INITIAL_BUSINESS_SETUP,
                tasks: this.getInitialUserTask(),
                completed: false
            }; 
            this.saveSetting(this.initalSetting);
        }
        this.emitCurrentTasks();
    }

    public getSetting(): IInitialSetting<IListTask> | null {
        return this._settingStorageSrv.getProperty<IInitialSetting<IListTask>>(this.STOREGE_KEY);
    }

    public saveSetting(setting: IInitialSetting<IListTask>) {
        this._settingStorageSrv.setProperty(this.STOREGE_KEY,setting);
    }

    public getStatus(): boolean {
        return this.getSetting()?.completed ?? false;
    }

    public getInitialTaskByCategory(categoryId: BusinessCategoryId): IListTask[] {
        return this.INITIAL_SETTING_TASKS_MAP[categoryId] || [];
    }

    public clearSettings(): void {
        this._settingStorageSrv.removeProperty(this.STOREGE_KEY);
    }

    public getInitialUserTask(): IListTask[] {
        const userCompany = this._authSession.getUserCompany();
        if (!userCompany) return [];

        const freshTasks = this.getInitialTaskByCategory(userCompany.category);

        const savedSettings = this.getSetting();
        if (savedSettings) {
            return freshTasks.map(freshTask => ({
                ...freshTask,
                completed: savedSettings.tasks.find(saved => saved.label === freshTask.label)?.completed || false,
                onClick: () => this.openTaskModal(freshTask)
            }));
        }

        return freshTasks.map(task => ({
            ...task,
            onClick: () => this.openTaskModal(task)
        }));
    }

    public async openTaskModal(task: IListTask): Promise<void> {
        if (!task.component) {
            console.warn(`No component defined for task: ${task.label}`);
            return;
        }

        const modal = await this._modalCtrl.create({
            component: task.component
        });
        
        await modal.present();
        const { data } = await modal.onDidDismiss();
        

        if (data?.completed === true) {
            task.completed = true;
            this.updateTaskCompletion(task);
        }
    }

    private updateTaskCompletion(updatedTask: IListTask): void {
        const currentSetting = this.getSetting();
        console.log(currentSetting);
        if (currentSetting) {
            const taskIndex = currentSetting.tasks.findIndex(t => t.label === updatedTask.label);
            if (taskIndex !== -1) {
                currentSetting.tasks[taskIndex].completed = updatedTask.completed;
                
                const allCompleted = currentSetting.tasks.every(task => task.completed);
                currentSetting.completed = allCompleted;
                
                this.saveSetting(currentSetting);
                this.emitCurrentTasks();
            }
        }
    }

    private emitCurrentTasks(): void {
        const initialUserTask = this.getInitialUserTask();
        this.tasksSubject.next(initialUserTask);
    }

}