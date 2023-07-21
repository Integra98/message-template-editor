import React, { useRef, useState } from 'react';
import styles from '../App.module.css';

interface VariablesProps{
    variables: IVariable[];
    selected: (variable: IVariable) => void
}

export interface IVariable{
    name: string;
}

export function Variables({variables, selected}: VariablesProps){

    return (
        <div className={styles.editor_variables}>
             {variables.map(variable => {
        return (
            <div className={styles.variable} key={variable.name} onClick={() => {selected(variable)}}>{variable.name}</div>
        );
      })}
        </div>
    )
}