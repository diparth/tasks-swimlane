import { FormGroup, FormControl } from '@angular/forms';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {

  public form: FormGroup;

  constructor(private dialogRef: MatDialogRef<TaskFormComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {

    if (this.data) {
      this.initForm(this.data);
    } else {
      this.initForm();
    }
  }

  public initForm(data?: any): void {
    this.form = new FormGroup({
      id: new FormControl(data?.id || Math.floor((Math.random() * 1000))),
      title: new FormControl(data?.title),
      type: new FormControl(data?.type),
      description: new FormControl(data?.description),
      priority: new FormControl(data?.priority)
    });
  }

  public save(): void {
    this.dialogRef.close(this.form.value);
  }
}
