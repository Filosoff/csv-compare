import UploadComponent from "./UploadComponent";
import { useState } from "react";
import CompareComponent from "./CompareComponent";


const AppComponent = () => {
  const [csv1, setCsv1] = useState([]);
  const [csv2, setCsv2] = useState([]);

  return (
    <main className="container">
      <UploadComponent setCsv={setCsv1} />
      { csv1.length ? <UploadComponent setCsv={setCsv2} /> : null}
      <CompareComponent csv1={csv1} csv2={csv2} />
    </main>
  );
}

export default AppComponent;