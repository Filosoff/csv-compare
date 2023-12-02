const UploadComponent = ({ csv1, csv2 }) => {
  if (!csv1.length && !csv2.length) {
    return null;
  }

  const getInfo = (label, csv) => (
    <div>{label} - Rows: {csv.length}; Cols: { csv[0].length}</div>
  )

  const compare = () => {
    const errors = [];

    for (let i = 1; i < csv1.length; i++) {
      const row1 = csv1[i];
      const row2 = csv2[i];
      if (JSON.stringify(row1) !== JSON.stringify(row2)) {
        row1.forEach((value, index) => {
          if (value !== row2[index]) {
            errors.push({
              row: i + 1,
              col: index,
              expected: value,
              actual: row2[index],
            });
          }
        });
      }
    }

    if (!errors.length) {
      return <ins>All good</ins>
    }

    return errors.map((error, index) => (
      <div key={`${error.row}+${index}`}>
        <strong>Error in row #{error.row}. Col #{error.col +1}</strong><br/>
        &emsp;&emsp;<span style={{ color: 'var(--ins-color)'}}>Expected ({csv1[0][error.col]}): {error.expected};</span><br/>
        &emsp;&emsp;<span style={{ color: 'var(--del-color)'}}>Actual ({csv2[0][error.col]}): {error.actual}</span>
      </div>
    ))
  }

  return (
    <article>
      {  csv1.length ? getInfo('File 1', csv1) : null }
      {  csv2.length ? getInfo('File 2', csv2) : null }

      { csv1.length === csv2.length &&  csv1[0].length === csv2[0].length  ? <><hr/>{compare()}</> : 'Files have different rows number' }
    </article>
  );
}

export default UploadComponent;