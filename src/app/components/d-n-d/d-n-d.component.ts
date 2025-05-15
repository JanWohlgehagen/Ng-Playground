import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'd-n-d',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CommonModule],
  templateUrl: './d-n-d.html',
  styleUrl: './d-n-d.scss',
})
export class DNDComponent implements AfterViewInit {
  // Angular material drag and drop required a list, therefore we have to fetch all ng-templates
  // and put them in an array to use for the cdkDropList.
  @ViewChild('aPanel') aPanel!: TemplateRef<any>;
  @ViewChild('bPanel') bPanel!: TemplateRef<any>;
  @ViewChild('cPanel') cPanel!: TemplateRef<any>;
  @ViewChild('dPanel') dPanel!: TemplateRef<any>;
  @ViewChild('ePanel') ePanel!: TemplateRef<any>;
  @ViewChild('fPanel') fPanel!: TemplateRef<any>;

  list: Array<TemplateRef<any>> = [];

  ngAfterViewInit(): void {
    this.list = [
      this.aPanel,
      this.bPanel,
      this.cPanel,
      this.dPanel,
      this.ePanel,
      this.fPanel,
    ];
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
