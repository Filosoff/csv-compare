import { Preset } from "../type/Preset";
import { useLocalStorage, useToggle } from "usehooks-ts";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  preset: Preset;
}

type UpdatedField = 'fields' | 'convertTo';

const PresetComponent = ({ preset }: Props) => {
  const ref = {
    fields: useRef(null),
    convertTo: useRef(null),
  };
  const [presets, setPresets] = useLocalStorage<Preset[]>('presets', []);
  const [isEdit, toggleIsEdit, setIsEdit] = useToggle(false);

  const updatePreset = (newPreset: Preset) => {
    setPresets(presets.map(p => p.name === newPreset.name ? newPreset : p));
  }

  const onEditToggle = () => {
    if (isEdit) {
      const fieldRef = ref.fields.current;
      const convertToRef = ref.convertTo.current;

      if (fieldRef && convertToRef) {
        const fields = [...(fieldRef as HTMLElement).querySelectorAll('input')].map(el => el.value).filter(Boolean);
        const convertTo = [...(convertToRef as HTMLElement).querySelectorAll('input')].map(el => el.value).filter(Boolean);
        const newPreset: Preset = {
          name: preset.name,
          fields,
          convertTo,
        }

        updatePreset(newPreset);
      }
    }

    toggleIsEdit();
  };

  const addEntry = (field: UpdatedField) => {
    const newPreset = {
      ...preset,
      [field]: preset[field].concat(['']),
    }
    updatePreset(newPreset);
  }

  const updateEntry = (field: UpdatedField, index: number, value: string) => {
    const newPreset = {
      ...preset,
    }
    newPreset[field][index] = value;
    updatePreset(newPreset);
  }

  const onDeleteClick = (e: React.SyntheticEvent) => {
    // @ts-ignore
    const name = e.target.dataset.name;
    setPresets(presets.filter(preset => preset.name !== name));
  }

  const getForm = (field: UpdatedField) => (
    <div ref={ ref[field] }>
      <h6>{ field }</h6>
      <div className="grid">
        <button onClick={ () => addEntry(field) } style={ { maxWidth: '75px' } }>+</button>
        { preset[field].map((entry, index) => <input type="text" key={ `${ index }-${ entry }` } defaultValue={ entry }/>) }
      </div>
    </div>
  );

  return (
    <article>
      <header>
        <div className="grid">
          <div>
            { preset.name }
          </div>
          <div style={ { textAlign: 'right' } }>
            <a href="#" data-name={ preset.name } onClick={ onEditToggle }>{ isEdit ? 'Save' : 'Edit' }</a>
            &emsp;
            <a href="#" data-name={ preset.name } onClick={ onDeleteClick }>Delete</a>
          </div>
        </div>
      </header>

      { isEdit ? (
          <div>
            { getForm('fields') }
            { getForm('convertTo') }
          </div>
        )
        : (
          <>
            Fields: { preset.fields.join(', ') || '-' }<br/>
            Convert to: { preset.convertTo.join(', ') || '-' }<br/>
          </>
        )
      }
    </article>
  )
}

export default PresetComponent;