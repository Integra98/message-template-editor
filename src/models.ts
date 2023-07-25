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
  conditionType: ConditionType | null;          //Значение (IF/THEN/ELSE) для textArea, null = у поля нет условия
  conditionVar: string | null;                  //Variables for (IF/THEN/ELSE)
  parentAreaId: string | null | undefined;      //ID textArea под которым добавлено условие
  parentConditionId: string | null | undefined; //ID textArea with IF для THEN/ELSE
}

export enum ConditionType {
  if= 'IF',
  then='THEN',
  else='ELSE'
}
