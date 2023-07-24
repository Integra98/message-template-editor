export interface IVariable {
  name: string;
}

export const variables: IVariable[] = [
  { name: "firstName" },
  { name: "lastName" },
  { name: "company" },
  { name: "position" },
];

export interface ITextAreaTemplate {
  textAreaId: string;
  content: string;
  isSecondArea: boolean;
  firstAreaId: string | null;
  secondAreaId: string | null;
  conditionType: ConditionType | null;
  conditionVar: string | null;
  parentConditionId: string | null | undefined;
}

export enum ConditionType {
  if= 'IF',
  then='THEN',
  else='ELSE'
}
