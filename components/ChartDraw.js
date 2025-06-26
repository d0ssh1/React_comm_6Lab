import * as d3 from "d3";
import { useEffect, useMemo, useRef } from "react";

const ChartDraw = (props) => {
    const { data, oy, chartType, error } = props;
    const chartRef = useRef(null);

    // ЗАДАНИЕ РАЗМЕРОВ ГРАФИКА
    const width = 800;
    const height = 500;
    const margin = { top: 20, bottom: 60, left: 60, right: 20 };
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    // ФОРМИРОВАНИЕ ШКАЛ ДЛЯ ОСЕЙ
    const scaleX = useMemo(() => {
        return d3
            .scaleBand()
            .domain(data.map(d => d.labelX))
            .range([0, boundsWidth])
            .padding(0.2); // Добавим отступы для гистограммы
    }, [data, boundsWidth]);

    const scaleY = useMemo(() => {
        const allValues = data.flatMap(d => d.values);
        const [min, max] = d3.extent(allValues);
        return d3
            .scaleLinear()
            .domain([min > 0 ? min * 0.9 : min, max * 1.1])
            .range([boundsHeight, 0]);
    }, [data, boundsHeight]);

    // ОСНОВНОЙ ЭФФЕКТ ДЛЯ РИСОВАНИЯ
    useEffect(() => {
        const svg = d3.select(chartRef.current);
        svg.selectAll("*").remove(); // Очищаем SVG перед перерисовкой

        // Если данных нет, ничего не делаем
        if (!data || data.length === 0) return;

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // РИСУЕМ ОСИ
        const xAxis = d3.axisBottom(scaleX);
        g.append("g")
            .attr("transform", `translate(0, ${boundsHeight})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-45)");

        const yAxis = d3.axisLeft(scaleY);
        g.append("g").call(yAxis);

        // РИСУЕМ ГРАФИК В ЗАВИСИМОСТИ ОТ ТИПА
        if (chartType === "Гистограмма") {
            // Рисуем Минимальную высоту (синие столбцы)
            if (oy[1]) {
                g.selectAll(".bar-min")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar-min")
                    .attr("x", d => scaleX(d.labelX))
                    .attr("y", d => scaleY(d.values[0]))
                    .attr("width", scaleX.bandwidth() / 2) // Делим ширину, чтобы уместить два столбца
                    .attr("height", d => boundsHeight - scaleY(d.values[0]))
                    .style("fill", "steelblue");
            }
            // Рисуем Максимальную высоту (красные столбцы)
            if (oy[0]) {
                g.selectAll(".bar-max")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar-max")
                    .attr("x", d => scaleX(d.labelX) + scaleX.bandwidth() / 2) // Смещаем вправо
                    .attr("y", d => scaleY(d.values[1]))
                    .attr("width", scaleX.bandwidth() / 2)
                    .attr("height", d => boundsHeight - scaleY(d.values[1]))
                    .style("fill", "red");
            }
        } else if (chartType === "Точечная") {
            // Рисуем Минимальную высоту (синие точки)
            if (oy[1]) {
                g.selectAll(".dot-min")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "dot-min")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", d => scaleY(d.values[0]))
                    .style("fill", "steelblue");
            }
            // Рисуем Максимальную высоту (красные точки)
            if (oy[0]) {
                g.selectAll(".dot-max")
                    .data(data)
                    .enter()
                    .append("circle")
                    .attr("class", "dot-max")
                    .attr("r", 5)
                    .attr("cx", d => scaleX(d.labelX) + scaleX.bandwidth() / 2)
                    .attr("cy", d => scaleY(d.values[1]))
                    .style("fill", "red");
            }
        }
    }, [data, scaleX, scaleY, oy, chartType]); // Перерисовываем при изменении этих пропсов

    // Условный рендеринг: показываем ошибку или график
    return (
        <div>
            {error ? (
                <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
            ) : (
                <svg ref={chartRef} style={{ width: width, height: height }}></svg>
            )}
        </div>
    );
};

export default ChartDraw;
