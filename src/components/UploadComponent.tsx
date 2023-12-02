import { useState } from "react";
import Papa from 'papaparse';
import presets from "../presets";

const UploadComponent = ({ setCsv }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState([]);

  const dataHandler = data => {
    if (data.errors.length) {
      setStep(-1);
      return;
    }
    setData(data.data);
    setStep(1);
  }

  const handleUpload = e => {
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        delimiter: ",",
        skipEmptyLines: true,
        complete: dataHandler,
        error: () => setStep(-1),
      });
    }
  }

  const getStep1 = () => (
    <article>
      <header>Step 1: Upload the file</header>
      <input type="file" onChange={ handleUpload }/>
    </article>
  )

  const getStep2 = () => {
    let matchedPreset;
    const headers = data[0];

    presets.forEach(preset => {
      if (preset.fields.join(',') === headers.join(',')) {
        matchedPreset = preset;
      }
    });

    const handleYes = e => {
      e.preventDefault();

      const indexes = [];
      matchedPreset.to.forEach(col => {
        const index = data[0].findIndex(el => el === col);
        indexes.push(index);
      });

      const converted = data.map(row => {
        const newRow = [];
        indexes.forEach(index => {
          newRow.push(row[index]);
        });
        return newRow;
      });

      setCsv(converted);

      setStep(3);
    }

    const handleNo = e => {
      e.preventDefault();
      setStep(step + 1);
    }

    return (
      <article>
        <header>Step 2: Pattern</header>
        { matchedPreset ? `Recognized as '${ matchedPreset.name }'. Is it correct?` : 'Could not find preset' }
        <footer>
          <a href="#" role="button" onClick={ handleYes }>Yes</a>&nbsp;
          <a href="#" role="button" onClick={ handleNo } className="secondary">No</a>
        </footer>
      </article>
    )
  }

  const getStep3 = () => {
    return (
      <article>
        <header>Step 3: Specify fields</header>
        Work in progress. Please update your presets
      </article>
    )
  }

  const getStep4 = () => <article style={{ background: 'var(--ins-color)', color: '#fff', padding: '20px 40px'}}>File uploaded and processed</article>;

  const getError = () => <article style={{ background: 'var(--del-color)', color: '#fff', padding: '20px 40px'}}>Something went wrong. Try again</article>;

  switch (step) {
    case 0:
      return getStep1();
    case 1:
      return getStep2();
    case 2:
      return getStep3();
    case 3:
      return getStep4();
    case -1:
    default:
      return getError()
  }
}

export default UploadComponent;