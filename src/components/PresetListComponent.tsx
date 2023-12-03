import { useLocalStorage } from 'usehooks-ts'
import { useState } from "react";
import { Preset } from "../type/Preset";
import PresetComponent from "./PresetComponent";

const PresetListComponent = () => {
  const [presets, setPresets] = useLocalStorage<Preset[]>('presets', []);
  const [newPresetName, setNewPresetName] = useState('');

  const onAddClick = () => {
    if (!newPresetName) {
      alert('Please specify preset name');
      return;
    }

    if (presets.filter(preset => preset.name === newPresetName).length) {
      alert('Preset with this name already exists');
      return;
    }

    const newPreset: Preset = {
      name: newPresetName,
      fields: [],
      convertTo: [],
    }

    setPresets(presets.concat([newPreset]));
    setNewPresetName('');
  }

  return (
    <>
      <div className="grid">
        <input type="text" value={ newPresetName } onChange={ e => setNewPresetName(e.target.value) }/>
        <button type="button" onClick={ onAddClick }>Add new</button>
      </div>

      { presets.map(preset => <PresetComponent preset={ preset } key={ preset.name }/>) }
    </>
  )
}

export default PresetListComponent;