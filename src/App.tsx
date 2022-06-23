import { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import { loadModules } from "esri-loader";
import { useEffect } from "react";
import DataTable, { Selector, TableColumn } from 'react-data-table-component';

type DataRow = {
  name: string;
  selector: Selector<DataRow>;
  sortable: boolean;
  grow: number;
};

function App() {
  const [tableData, setTableData] = useState(null)
  const [fields, setFields] = useState(null)

  const getColumn = (field: __esri.field): TableColumn<DataRow> => {
    return {
      name: field.name,
      selector: (row) => row[field.name],
      sortable: true,
      grow: 2,
    }
  }

  const getFeatureLayerData = async (url: string) => {
    const [FeatureLayer] = await loadModules(["esri/layers/FeatureLayer"]);
    const layer = new FeatureLayer(url);
    const _tableData = await layer.queryFeatures().then((data: any) => data.toJSON())
    setTableData(_tableData.features.map((feature: {attributes: object}) => feature.attributes));
    setFields(_tableData.fields.map((field: __esri.field) => getColumn(field)))
  };

  const handleChange = (e: any) => console.log(e)

  useEffect(() => {
    getFeatureLayerData(
      "https://services3.arcgis.com/qlOmllyNDOMuPtQ9/ArcGIS/rest/services/stops_csv/FeatureServer/0"
    );
  }, []);

  return (
    <div className="App">
      {tableData && fields && <DataTable
			title="Desserts"
			data={tableData}
			columns={fields}
			selectableRows
			onSelectedRowsChange={handleChange}
		/>}
    </div>
  );
}

export default App
