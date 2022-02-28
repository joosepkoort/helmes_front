/**
 * Tree data with nested structure.
 * Each node has a name and an option list of children.
 */
export interface TreeNode {
  name: string;
  id?: number;
  children?: TreeNode[];
  selected?: boolean;
  indeterminate?: boolean;
  parent?: TreeNode;
}
