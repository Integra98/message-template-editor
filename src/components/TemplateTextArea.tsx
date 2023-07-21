import React, { useEffect, useRef, useState } from 'react';
import styles from '../App.module.css';
import { CustomTextArea } from './CustomTextArea/CustomTextArea';
import { Conditions } from './Conditions';
import { IVariable } from './Variables';

interface TemplateTextAreaProps{
    focusedArea: HTMLTextAreaElement | undefined;
    conditionsCount: number;
    selectedVar: IVariable | undefined;
}

export function TemplateTextArea({focusedArea, conditionsCount, selectedVar}: TemplateTextAreaProps) {
    const [secondArea, setSecondArea] = useState(false)
    const [textTemplate, setTextTemplate] = useState('')
    const [secondTextTemplate, setSecondTextTemplate] = useState('')
    const [textAreaId, setTextAreaId] = useState('')
    const [secondTextAreaId, setSecondTextAreaId] = useState('')

    useEffect(() => {
        if(focusedArea && focusedArea.id === textAreaId){
            createCondition()
        }
    }, [conditionsCount])


    function createCondition() {
        const selectionStart = focusedArea?.selectionStart
        const selectionEnd = focusedArea?.selectionEnd
        const textAreaValue = focusedArea?.value
        setTextTemplate(textAreaValue ? textAreaValue.substring(0, selectionStart) : '')
        setSecondTextTemplate(textAreaValue ? textAreaValue.substring(Number(selectionEnd), textAreaValue.length) : '')
        setSecondArea(true)
    }

    function deleteCondition(){
        const firstEl = document.getElementById(textAreaId)
        const secondEl = document.getElementById(secondTextAreaId)
        const textAreaValue = (firstEl?.textContent ? firstEl?.textContent : '') + (secondEl?.textContent ? secondEl?.textContent : '')
        setTextTemplate(textAreaValue)
        setSecondArea(false)
    }

    useEffect(() => {
        if(focusedArea && selectedVar){
            addVariableIntoTextArea(selectedVar)
        }
    }, [selectedVar])

    // Add variable into textArea
    function addVariableIntoTextArea(selectedVar: IVariable) {
        console.log('addVariableIntoTextArea focusedArea', focusedArea);
        const selectionStart = focusedArea?.selectionStart
        const selectionEnd = focusedArea?.selectionEnd
        const textAreaValue = focusedArea?.value
        let newValue = ''

        if (selectionStart && selectionEnd) {
            newValue = textAreaValue?.substring(0, selectionStart) + ' {' + selectedVar.name + '} ' + textAreaValue?.substring(Number(selectionEnd), textAreaValue?.length)
        } else {
            newValue = ' {' + selectedVar.name + '} '
        }

        console.log('newValue', newValue);
        switch(focusedArea?.id){
            case textAreaId: 
            setTextTemplate(newValue)
            break;
            case secondTextAreaId: 
            setSecondTextTemplate(newValue)
            break;
        }

    }


    return (
        <>
            <CustomTextArea template={textTemplate} giveId={(res) => setTextAreaId(res)}/>

            {secondArea &&
                <>
                    <Conditions focusedArea={focusedArea} conditionsCount={conditionsCount} selectedVar={selectedVar} deleteCondition={() => deleteCondition()}/>
                    <CustomTextArea template={secondTextTemplate} giveId={(res) => setSecondTextAreaId(res)}/>
                </>
            }</>
    )

}