import React, { RefObject, useContext, useEffect, useId, useRef, useState } from 'react';
import useAutosizeTextArea from './AutosizeTextArea';
import './CustomTextArea.css'
import { IVariable, variables } from '../../models';
import { TemplateContext } from '../../TemplateContext';

interface CustomTextAreaProps {
    template?: string;
    giveRef: (ref: RefObject<HTMLTextAreaElement>) => void;
}

export function CustomTextArea({ template, giveRef }: CustomTextAreaProps) {
    // Autosize TextArea
    const [textAreaValue, setTextAreaValue] = useState('');
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const textAreaId = useId();
    const { insertedVariable, areaChanged } = useContext(TemplateContext)

    useAutosizeTextArea(textAreaRef.current, textAreaValue);


    const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
        let val = evt.target?.value;
        if (textAreaValue.length > evt.target?.value.length) {
            val = removeWholeVariable(val)
        }
        setTextAreaValue(val);
        areaChanged(evt.target)
    };

    function removeWholeVariable(value: string): string {
        const textAreaWords = value.split(' ');
        let lastWord = textAreaWords[textAreaWords.length - 1].replace('{', '')
        const isVar = variables.find(v => v.name === lastWord)
        if (isVar) {
            const valueWords = value.split(' ');
            value = value.replace(valueWords[valueWords.length - 1], '')
        }
        return value;
    }

    // give TextArea Ref to Parent
    const firstRenderRef = useRef(true);
    useEffect(() => {
        const firstRender = firstRenderRef.current;

        if (firstRender) {
            firstRenderRef.current = false;
            giveRef(textAreaRef)

        }
    });

    useEffect(() => {
        if (template) {
            setTextAreaValue(template)
            if (textAreaRef.current) {
                textAreaRef.current.value = template
                areaChanged(textAreaRef.current)
            }
        }
    }, [template]);


    useEffect(() => {
        if (insertedVariable?.textArea) {
            if(insertedVariable.textArea.id === textAreaId && insertedVariable.variable){
                addVariableIntoTextArea(insertedVariable.textArea, insertedVariable.variable)

            }
        }
    }, [insertedVariable]);


    // Add variable into textArea
    function addVariableIntoTextArea(focusedArea: HTMLTextAreaElement, selectedVar: IVariable) {
        const selectionStart = focusedArea?.selectionStart
        const selectionEnd = focusedArea?.selectionEnd
        const currentTextAreaValue = focusedArea?.value
        let newValue = ''

        if (selectionStart && selectionEnd) {
            newValue = currentTextAreaValue?.substring(0, selectionStart) + ' {' + selectedVar.name + '} '
                + currentTextAreaValue?.substring(Number(selectionEnd), currentTextAreaValue?.length)
        } else {
            newValue = ' {' + selectedVar.name + '} ';
        }

        setTextAreaValue(newValue)

    }

    return (
        <>
            <textarea
                id={textAreaId}
                className='textarea'
                onChange={evt => handleChange(evt)}
                ref={textAreaRef}
                rows={1}
                value={textAreaValue}
            />

        </>
    )
}