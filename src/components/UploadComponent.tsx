import React, { Dispatch, SetStateAction, useState } from "react";
import Papa, { ParseResult } from 'papaparse';
import { FieldValue } from "../type/Data";
import { Preset } from "../type/Preset";
import { useReadLocalStorage  } from "usehooks-ts";

enum Step {
  upload,
  matchedPreset,
  mappingError,
  parsingError,
  success,
}

type Props = {
  setCsv: Dispatch<SetStateAction<any>>
}

const UploadComponent = ({ setCsv }: Props) => {
  const presets = useReadLocalStorage<Preset[]>('presets') || [];
  const [step, setStep] = useState(Step.upload);
  const [data, setData] = useState([] as FieldValue[][]);

  const dataHandler = (data: ParseResult<FieldValue[]>) => {
    if (data.errors.length) {
      setStep(Step.parsingError);
      return;
    }
    setData(data.data);
    setStep(Step.matchedPreset);
  }

  const handleUpload = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // @ts-ignore
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        delimiter: ",",
        skipEmptyLines: true,
        complete: dataHandler,
        error: () => setStep(Step.parsingError),
      });
    }
  }

  const getUploadStep = () => (
    <article>
      <header>Step 1: Choose the file</header>
      <input type="file" onChange={ handleUpload }/>
    </article>
  )

  const getMatchedPresetStep = () => {
    let matchedPreset: Preset | undefined;
    const headers = data[0];

    presets.forEach(preset => {
      if (preset.fields.join(',') === headers.join(',')) {
        matchedPreset = preset;
      }
    });

    if (!matchedPreset) {
      setStep(Step.mappingError);
      return;
    }

    const handleYes = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      const indexes: number[] = [];
      matchedPreset?.convertTo.forEach(col => {
        const index = data[0].findIndex(el => el === col);
        indexes.push(index);
      });

      const converted = data.map(row => {
        const newRow: FieldValue[] = [];
        indexes.forEach(index => {
          newRow.push(row[index]);
        });
        return newRow;
      });

      setCsv(converted);

      setStep(Step.success);
    }

    const handleNo = (e: React.SyntheticEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setStep(Step.mappingError);
    }

    return (
      <article>
        <header>Step 2: Pattern</header>
        Recognized as { matchedPreset.name }
        <footer>
          <a href="#" role="button" onClick={ handleYes }>Yes</a>&nbsp;
          <a href="#" role="button" onClick={ handleNo } className="secondary">No</a>
        </footer>
      </article>
    )
  }


  const getMappingErrorStep = () => <article className="alert error">Could not find specific preset for this file</article>;
  const getParsingErrorStep = () => <article className="alert error">Parsing error. Please make sure your file is correct csv with correct delimiter</article>;

  const getSuccessStep = () => <article className="alert success">File uploaded and processed</article>;

  switch (step) {
    case Step.upload:
      return getUploadStep();
    case Step.matchedPreset:
      return getMatchedPresetStep();
    case Step.mappingError:
      return getMappingErrorStep();
    case Step.success:
      return getSuccessStep();
    case Step.parsingError:
      return getParsingErrorStep()
    default:
      return null;
  }
}

export default UploadComponent;