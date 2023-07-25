import { createContext, useState } from "react";
import { ITextAreaTemplate, IVariable, variables } from "./models";

interface ITemplateContext {
    selectedVars: IVariable[];
    textAreaTemp: string | null;
    generatedMessage: string;
    insertedVariable: {textArea: HTMLTextAreaElement|null, variable: IVariable|null}|undefined;
    varSelected: (textArea: HTMLTextAreaElement, variable: IVariable) => void;
    areaAdded: (areaTemplate: ITextAreaTemplate) => void;
    areaDeleted: (parentAreaIds: string) => void;
    areaChanged: (area: HTMLTextAreaElement) => void;
    parentAreaChanged: (textAreaId: string, parentAreaId: string, forCondition: boolean) => void;
    setGeneratedMessage: (message: string) => void;
}

export const TemplateContext = createContext<ITemplateContext>({ 
    selectedVars: [], 
    textAreaTemp: null, 
    insertedVariable: {textArea: null, variable: null},
    generatedMessage: '',
    varSelected: () => {}, 
    areaAdded: () => {},
    areaDeleted: () => {},
    areaChanged: () => {},
    parentAreaChanged: () => {},
    setGeneratedMessage: () => {}})

export const TemplateProvider = ({ children }: { children: React.ReactNode }) => {

    const [existedAreas, setExistedAreas] = useState<ITextAreaTemplate[]>([]);
    const [jsonTemplate, setJsonTemplate] = useState('');
    const [selectedVariables, setSelectedVariables] = useState<IVariable[]>([]);
    const [insertedVariable, setInsertedVariable] = useState<{textArea: HTMLTextAreaElement|null, variable: IVariable|null}>();
    const [message, setMessage] = useState('');

    
    //Добавление Variables
    function addselectedVariable(textArea: HTMLTextAreaElement, variable: IVariable) {

        // all CustomTextArea listen insertedVariable 
        setInsertedVariable({textArea: textArea, variable: variable})

        const selectedVar = variables.find(v => v.name === variable.name);
        if(selectedVar){
            //Set variables for Preview
            const newVars = selectedVariables;
            newVars.push(selectedVar)
            setSelectedVariables(newVars)
        }

        const areaObjIndx = existedAreas.findIndex(ar => ar.textAreaId === textArea.id)
        if(areaObjIndx > -1){
            //Обновление conditionVar for TextArea после которого добавили condition
            if(existedAreas[areaObjIndx].conditionType){
                existedAreas[areaObjIndx].conditionVar = selectedVar?.name ? selectedVar?.name : null
                setJsonTemplate(JSON.stringify(existedAreas));
            }
        }

    }

    function addTextArea(newArea: ITextAreaTemplate) {
        const findedAreaIndx = existedAreas.findIndex(area => area.textAreaId === newArea.textAreaId);
        if(findedAreaIndx === -1){
            const newAreas = existedAreas;
            newAreas.push(newArea)
            setExistedAreas(newAreas)
        } else {
            existedAreas[findedAreaIndx] = newArea;
        }
        setJsonTemplate(JSON.stringify(existedAreas));
    }

    function deleteTextArea(parentAreaId: string){
        const findedArea = existedAreas.filter(area => area.parentAreaId === parentAreaId);
        findedArea.forEach(area => {
            const findedAreaIndx = existedAreas.findIndex(ar => ar.textAreaId === area.textAreaId);
            existedAreas.splice(findedAreaIndx,1)
            deleteTextArea(area.textAreaId);
        })
        console.log('deleteTextArea', existedAreas);

    }


    //Handle change TextArea content
    function textAreaValueChanged(area: HTMLTextAreaElement){
        const areaObjIndx = existedAreas.findIndex(ar => ar.textAreaId === area.id)
        if(areaObjIndx > -1){
            existedAreas[areaObjIndx].content = area.value
            setJsonTemplate(JSON.stringify(existedAreas));
        }
    }


    //Обновление parentConditionId и parentAreaId при добавлении Condition
    function parentAreaChanged(areaID: string, parentAreaID: string, forCondition: boolean){
        const areaObjIndx = existedAreas.findIndex(ar => ar.textAreaId === areaID)
        if(areaObjIndx > -1){
            if(forCondition){
                existedAreas[areaObjIndx].parentConditionId = parentAreaID
                setJsonTemplate(JSON.stringify(existedAreas));
            }else {
                existedAreas[areaObjIndx].parentAreaId = parentAreaID
                setJsonTemplate(JSON.stringify(existedAreas));
            }
        }
    }

    return (
        <TemplateContext.Provider
            value={{
                selectedVars: selectedVariables,
                textAreaTemp: jsonTemplate,
                insertedVariable: insertedVariable,
                generatedMessage: message,
                varSelected: (textArea, variable) => addselectedVariable(textArea, variable),
                areaAdded: (temp) => addTextArea(temp),
                areaDeleted: (id) => deleteTextArea(id),
                areaChanged: (ref) => textAreaValueChanged(ref),
                parentAreaChanged: (id, parentId, forCondition) => parentAreaChanged(id, parentId, forCondition),
                setGeneratedMessage: (message) => setMessage(message)
            }}>

            {children}
        </TemplateContext.Provider>
    )
}