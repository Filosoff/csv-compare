import UploadComponent from "./UploadComponent";
import React, { useState } from "react";
import CompareComponent from "./CompareComponent";
import '../style.less';
import PresetListComponent from "./PresetListComponent";

enum View {
  compare,
  presets,
}

const AppComponent = () => {
  const [csv1, setCsv1] = useState([]);
  const [csv2, setCsv2] = useState([]);
  const [view, setView] = useState(View.presets);

  const getUploadView = () => (
    <>
      <UploadComponent setCsv={setCsv1} />
      { csv1.length ? <UploadComponent setCsv={setCsv2} /> : null}
      <CompareComponent csv1={csv1} csv2={csv2} />
    </>
  );

  const renderView = () => {
    switch (view) {
      case View.compare: return getUploadView();
      case View.presets: return <PresetListComponent />;
      default: return <div>Hello, world!</div>
    }
  }

  const onMenuClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // @ts-ignore
    const newView = +e.target.dataset.view;
    setView(newView);
  }

  return (
    <main className="container">
      <nav>
        <ul>
          <li><strong>CSV Compare</strong></li>
        </ul>
        <ul>
          <li><a href="#" onClick={onMenuClick} data-view={View.compare}>Compare</a></li>
          <li><a href="#" onClick={onMenuClick} data-view={View.presets}>Presets</a></li>
        </ul>
      </nav>

      { renderView() }

    </main>
  );
}

export default AppComponent;