import { useState, useEffect } from "react";
import ChartDraw from './ChartDraw.js';
import * as d3 from "d3";

const Chart = (props) => {
    const [ox, setOx] = useState("Страна");
    const [oy, setOy] = useState([true, false]);
    const [chartType, setChartType] = useState("Гистограмма");
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(false);

    const prepareData = (dataToProcess, currentOx, currentOy) => {
        if (!currentOy[0] && !currentOy[1]) {
            setError("Ошибка: выберите хотя бы одно значение по оси OY.");
            return null;
        }
        if (!dataToProcess || dataToProcess.length === 0) {
            setError('');
            return [];
        }
        setError('');
        const groupObj = d3.group(dataToProcess, d => d[currentOx]);
        let arrGraph = [];
        for (let entry of groupObj) {
            let minMax = d3.extent(entry[1].map(d => d['Высота']));
            arrGraph.push({ labelX: entry[0], values: minMax });
        }
        if (currentOx === 'Год') {
            arrGraph.sort((a, b) => d3.ascending(a.labelX, b.labelX));
        }
        return arrGraph;
    };

    useEffect(() => {
        const prepared = prepareData(props.data, ox, oy);
        if (prepared !== null) {
            setChartData(prepared);
        }
    }, [props.data, ox, oy]);

    const handleSubmit = (event) => {
        event.preventDefault();
        setOx(event.target["ox"].value);
        setOy([event.target["oy_max"].checked, event.target["oy_min"].checked]);
        setChartType(event.target["chartType"].value);
    };


    return (
        <>
            <form onSubmit={handleSubmit} className="chart-form">
                <h3>Визуализация</h3>
                <div className="form-row">
                    <strong>Значение по оси OX:</strong>
                    <div className="input-group">
                        <label>
                            <input type="radio" name="ox" value="Страна" defaultChecked={ox === 'Страна'} /> Страна
                        </label>
                        <label>
                            <input type="radio" name="ox" value="Год" defaultChecked={ox === 'Год'} /> Год
                        </label>
                    </div>
                </div>
                <div className="form-row">
                    <strong>Значение по оси OY:</strong>
                    <div className={`input-group ${error ? 'error-label' : ''}`}>
                        <label>
                            <input type="checkbox" name="oy_max" defaultChecked={oy[0]}/> Максимальная высота
                        </label>
                        <label>
                            <input type="checkbox" name="oy_min" defaultChecked={oy[1]}/> Минимальная высота
                        </label>
                    </div>
                </div>
                <div className="form-row">
                    <strong>Тип диаграммы:</strong>
                    <select name="chartType" defaultValue={chartType}>
                        <option value="Точечная">Точечная диаграмма</option>
                        <option value="Гистограмма">Гистограмма</option>
                    </select>
                </div>
                <button type="submit" className="build-button">Построить</button>
            </form>
            <ChartDraw
                data={chartData}
                oy={oy}
                chartType={chartType}
            />
        </>
    );
};

export default Chart;
