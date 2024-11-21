import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IListTask } from 'src/app/core/consts/types/progress-list.type';

@Component({
  selector: 'app-progress-list',
  templateUrl: './progress-list.component.html',
  styleUrls: ['./progress-list.component.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class ProgressListComponent implements OnInit {
  
  @Input() tasks: IListTask[] = [];
  @Output() taskStatusChange = new EventEmitter<{ name: string; completed: boolean }>();

  constructor() { }

  ngOnInit() {}

  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter((task) => task.completed).length;
  }

  onTaskClick(task: IListTask): void {
    if (task.onClick) {
      task.onClick();
    }
  }

}
