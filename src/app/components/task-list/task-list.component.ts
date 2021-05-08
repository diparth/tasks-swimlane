import { TaskFormComponent } from './../task-form/task-form.component';
import { Utils } from './../../services/utils';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  public listData: any[] = [];
  public workList: any[] = [];
  public progressList: any[] = [];
  public qaList: any[] = [];
  public completedList: any[] = [];

  constructor(private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.prepareListData();
  }

  public prepareListData(): void {
    if (Utils.isNullOrUndefined(localStorage.getItem('work_items'))) {
      this.http.get('assets/task.json').subscribe((result: any) => {
        this.listData = result.tasks;
        localStorage.setItem('work_items', JSON.stringify(this.listData));
        this.setupLists();
      });
    } else {
      this.listData = JSON.parse(localStorage.getItem('work_items'));
      this.setupLists();
    }
  }

  public setupLists(): void {
    this.workList = this.listData.filter(item => item.type === WORK_TYPE.work);
    this.progressList = this.listData.filter(item => item.type === WORK_TYPE.inprogress);
    this.qaList = this.listData.filter(item => item.type === WORK_TYPE.qa);
    this.completedList = this.listData.filter(item => item.type === WORK_TYPE.completed);
  }

  public drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

    if (event.container.id === "work") {
      this.updateList(this.workList, "work");
    } else if (event.container.id === "inprogress") {
      this.updateList(this.workList, "inprogress");
    } else if (event.container.id === "qa") {
      this.updateList(this.workList, "qa");
    } else if (event.container.id === "completed") {
      this.updateList(this.workList, "completed");
    }
  }

  public updateList(list, type): void {
    list.forEach(item => { item.type = type });
  }

  public edit(data: any): void {
    this.dialog.open(TaskFormComponent, { data }).afterClosed().subscribe(result => {
      const index = this.workList.findIndex(item => item.id === result.id);
      this.listData.splice(index, 1, result);

      localStorage.setItem('work_items', JSON.stringify(this.listData));

      this.prepareListData();
    });
  }

  public new(): void {
    this.dialog.open(TaskFormComponent).afterClosed().subscribe(result => {
      this.listData.push(result);

      localStorage.setItem('work_items', JSON.stringify(this.listData));

      this.prepareListData();
    });
  }
}

export enum WORK_TYPE {
  work = "work",
  inprogress = "inprogress",
  qa = "qa",
  completed = "completed"
}

export enum PRIORITIES {
  low = "low",
  medium = "medium",
  high = "high",
  critical = "critical"
}

export const TYPES = {
  'cdk-drop-list-0': 'work',
  'cdk-drop-list-1': 'inprogress',
  'cdk-drop-list-2': 'qa',
  'cdk-drop-list-3': 'completed'
};
