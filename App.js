import './CSS/App.css';
import { useState } from 'react';
import buildings from './data.js';
import Table from './components/Table.js';
import Chart from './components/Chart';

function App() {
    const [dataForChart, setDataForChart] = useState(buildings);

    const handleDataChange = (filteredData) => {
        setDataForChart(filteredData);
    };

    return (
        <>

            <Chart data={dataForChart} />

            <Table
                data={buildings}
                amountRows="10"
                isPaginated={true}
                onDataChange={handleDataChange}
            />
        </>
    );
}

export default App;
