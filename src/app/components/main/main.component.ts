import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TreeNode } from 'src/app/core/models/tree-node';
import { Data } from 'src/app/core/models/data';
import { SelectService } from 'src/app/shared/select.service';
import { MessageService } from 'src/app/shared/message.service';

let TREE_DATA: TreeNode[] = [];

// if node has children, tick the children nodes too.
const processTree = (treeNodes: any[], name: any, checked: boolean) =>
  treeNodes.forEach((treeNode) => {
    let checkedNodeWithChildren: boolean = false;
    if (treeNode.id == name && treeNode.children != null) {
      checkedNodeWithChildren = true;
      treeNode.selected = true;
      processTree(treeNode.children, name, checkedNodeWithChildren);
    }
    if (treeNode.id == name) {
      checkedNodeWithChildren = true;
      treeNode.selected = true;
    }
    if (treeNode.children != null && checked) {
      processTree(treeNode.children, name, true);
    }
    if (treeNode.children != null) {
      processTree(treeNode.children, name, checked);
    }
    if (checked) {
      treeNode.selected = true;
    }
  });

/**
 * @title Tree with nested nodes
 */

@Component({
  selector: 'tree',
  templateUrl: 'main.component.html',
  styleUrls: ['main.component.css'],
})
export class MainComponent implements AfterViewInit {
  nameFormControl = new FormControl('', [Validators.required]);
  treeFormControl = new FormControl('', [Validators.required]);
  selectBoxFormControl = new FormControl('', [Validators.required]);
  intro: string =
    '<p><em><strong>Please enter your name and pick the Sectors you are currently involved in.</strong></em></p>';
  sectors: string = '<p><em><strong>Sectors:</strong></em></p>';
  checked = false;
  nameValue = '';
  selectedAValue = false;
  clickedSubmit = false;
  treeok = true;
  checkboxok = true;
  nameok = true;
  public treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  public dataSource = new MatTreeNestedDataSource<TreeNode>();
  @ViewChild('outputDiv', { static: false })
  public outputDivRef: ElementRef<HTMLParagraphElement>;
  constructor(
    private selectService: SelectService,
    private messageService: MessageService
  ) {
    this.dataSource.data = TREE_DATA;
    this.updateParents();
  }

  updateParents(): void {
    Object.keys(this.dataSource.data).forEach((key) => {
      this.setParent(this.dataSource.data[key], null);
    });
  }

  ngAfterViewInit(): void {
    this.selectService.getTree().subscribe(
      (x) => console.log(this.setTree(JSON.parse(x))),
      (err) => console.error('error: ' + err),
      () => console.log('completed')
    );

    this.selectService.getData().subscribe(
      (x) => console.log(this.updateSelection(x)),
      (err) => console.error('error: ' + err),
      () => console.log('completed')
    );
  }

  public hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

  private setParent(node: TreeNode, parent: TreeNode): void {
    node.parent = parent;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.setParent(childNode, node);
      });
    }
  }

  private checkAllParents(node: TreeNode) {
    if (node.parent) {
      const descendants = this.treeControl.getDescendants(node.parent);
      node.parent.selected = descendants.every((child) => child.selected);
      node.parent.indeterminate = descendants.some((child) => child.selected);
      this.checkAllParents(node.parent);
    }
  }
  nameChanged(searchValue: any): void {
    this.clickedSubmit = false;
  }

  public itemToggle(checked: boolean, node: TreeNode) {
    console.log(node);
    this.treeok = true;
    this.clickedSubmit = false;
    node.selected = checked;

    this.selectedAValue = true;
    if (node.children) {
      node.children.forEach((child) => {
        this.itemToggle(checked, child);
      });
    }
    console.log(node);

    this.checkAllParents(node);
  }

  onClickSubmit(): void {
    let newdata: Data = this.submitToTree(this.nameValue);
    if (this.verifyFields(newdata)) {
      this.postData(newdata);
      this.messageService.displayMessage('Data posted', 'success');
    }
  }
  public updateSelection(input: Data): void {
    var res = input;
    this.checked = res.agreedToTerms;
    this.nameValue = res.name;
    var str = new String(res.selectedSectors).replace(/[\[\]']+/g, '');
    var arrayOfStrings = str.split(',');
    for (var val of arrayOfStrings) {
      processTree(this.dataSource.data, val.trim(), false);
    }
    this.updateParents();
    if (arrayOfStrings.length <= 1) {
      this.selectedAValue = false;
    } else {
      this.selectedAValue = true;
    }
    this.dataSource.data.forEach((element) => {
      this.updateValues(element);
    });
  }
  /**
   * get the id's and submit them
   */
  public submitToTree(name: any): Data {
    let result = this.dataSource.data.reduce(
      (acc: number[], node: TreeNode) =>
        acc.concat(
          this.treeControl
            .getDescendants(node)
            .filter((descendant) => descendant.selected)
            .map((descendant) => descendant.id)
        ),
      [] as number[]
    );
    let data = <Data>{};
    data.agreedToTerms = this.checked;
    data.name = name;
    data.selectedSectors = result;
    return data;
  }

  public postData(data: Data): void {
    this.selectService.updateData(data).subscribe(
      (x) => (this.clickedSubmit = true),
      (err) => console.error('error: ' + err),
      () => console.log('completed')
    );
  }

  public verifyFields(data: Data): boolean {
    let isok = true;
    if (data.selectedSectors.length < 1) {
      console.log('tree not ok');
      this.treeok = false;
      isok = false;
    } else {
      this.treeok = true;
    }
    if (data.agreedToTerms == false) {
      console.log('checkbox not ok');
      this.checkboxok = false;
      isok = false;
    } else {
      this.checkboxok = true;
    }
    if (this.nameValue.length <= 0) {
      isok = false;
    }
    if (!isok) {
      return false;
    }
    return true;
  }

  checkboxChanged(event: any): void {
    if ((event.checked = true)) {
      this.checkboxok = true;
    }
  }
  updateValues(val: TreeNode): void {
    if (val.selected || val.indeterminate) {
      if (val.parent) {
        val.parent.indeterminate = true;
      }
    }
    if (val.children) {
      val.children.forEach((child) => {
        this.updateValues(child);
        this.checkAllParents(child);
      });
    }
  }

  setTree(input: TreeNode[]): void {
    const nested = input.reduce(
      (initial: any, value: any, index: any, original: any) => {
        if (value.parentId === '-1') {
          if (initial.left.length) this.checkLeftOvers(initial.left, value);
          delete value.parentId;
          value.root = true;
          initial.nested.push(value);
        } else {
          let parentFound = this.findParent(initial.nested, value);
          if (parentFound) this.checkLeftOvers(initial.left, value);
          else initial.left.push(value);
        }
        return index < original.length - 1 ? initial : initial.nested;
      },
      { nested: [], left: [] }
    );

    this.dataSource.data = null;
    this.dataSource.data = nested;
  }
  findParent(possibleParents: any, possibleChild: any): boolean {
    let found = false;
    for (let i = 0; i < possibleParents.length; i++) {
      if (possibleParents[i].id === possibleChild.parentId) {
        found = true;
        delete possibleChild.parentId;
        if (possibleParents[i].children)
          possibleParents[i].children.push(possibleChild);
        else possibleParents[i].children = [possibleChild];
        possibleParents[i].count = possibleParents[i].children.length;
        return true;
      } else if (possibleParents[i].children)
        found = this.findParent(possibleParents[i].children, possibleChild);
    }
    return found;
  }
  checkLeftOvers(leftOvers: any, possibleParent: any): void {
    for (let i = 0; i < leftOvers.length; i++) {
      if (leftOvers[i].parentId === possibleParent.id) {
        delete leftOvers[i].parentId;
        possibleParent.children
          ? possibleParent.children.push(leftOvers[i])
          : (possibleParent.children = [leftOvers[i]]);
        possibleParent.count = possibleParent.children.length;
        const addedObj = leftOvers.splice(i, 1);
        this.checkLeftOvers(leftOvers, addedObj[0]);
      }
    }
  }
}
