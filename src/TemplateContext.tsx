import { createContext, useState } from "react";
import { ITextAreaTemplate, IVariable, variables } from "./models";

interface ITemplateContext {
    selectedVars: IVariable[];
    textAreaTemp: string | null;
    varSelected: (textAreaId: string, variable: string) => void
    areaAdded: (areaTemplate: ITextAreaTemplate) => void
    areaChanged: (area: HTMLTextAreaElement) => void
    parentAreaChanged: (textAreaId: string, parentAreaId: string) => void
}

export const TemplateContext = createContext<ITemplateContext>({ selectedVars: [], textAreaTemp: null,
    varSelected: () => { }, 
    areaAdded: () => { },
    areaChanged: () => { },
    parentAreaChanged: () => {} })

export const TemplateProvider = ({ children }: { children: React.ReactNode }) => {

    const [existedAreas, setExistedAreas] = useState<ITextAreaTemplate[]>([]);
    const [jsonTemplate, setJsonTemplate] = useState('');
    const [selectedVariables, setSelectedVariables] = useState<IVariable[]>([]);

    function addselectedVariable(textAreaId: string, variable: string) {
        const selectedVar = variables.find(v => v.name === variable);

        if(selectedVar){
            const newVars = selectedVariables;
            newVars.push(selectedVar)
            setSelectedVariables(newVars)
            console.log('$selectedVariables', selectedVariables);
        }

        const areaObjIndx = existedAreas.findIndex(ar => ar.textAreaId === textAreaId)
        if(areaObjIndx > -1){
            existedAreas[areaObjIndx].conditionVar = selectedVar?.name ? selectedVar?.name : '0'
            console.log('@Var', existedAreas);
            setJsonTemplate(JSON.stringify(existedAreas));
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

    function textAreaValueChanged(area: HTMLTextAreaElement){
        const areaObjIndx = existedAreas.findIndex(ar => ar.textAreaId === area.id)
        if(areaObjIndx > -1){
            existedAreas[areaObjIndx].content = area.value
            setJsonTemplate(JSON.stringify(existedAreas));
        }
    }

    function parentAreaChanged(areaID: string, parentAreaID: string){
        const areaObjIndx = existedAreas.findIndex(ar => ar.textAreaId === areaID)
        if(areaObjIndx > -1){
            existedAreas[areaObjIndx].parentConditionId = parentAreaID
            setJsonTemplate(JSON.stringify(existedAreas));
        }
    }

    return (
        <TemplateContext.Provider
            value={{
                selectedVars: selectedVariables,
                textAreaTemp: jsonTemplate,
                varSelected: (textAreaId, variable) => addselectedVariable(textAreaId, variable),
                areaAdded: (temp) => addTextArea(temp),
                areaChanged: (ref) => textAreaValueChanged(ref),
                parentAreaChanged: (id, parentId) => parentAreaChanged(id, parentId)
            }}>

            {children}
        </TemplateContext.Provider>
    )
}