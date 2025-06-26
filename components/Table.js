import React, { useState, useEffect } from "react";
import TableHead from './TableHead.js';
import TableBody from './TableBody.js';
import Filter from './Filter.js';

const Table = (props) => {
    const [dataTable, setDataTable] = useState(props.data);
    const [activePage, setActivePage] = useState(1);

    const updateDataTable = (value) => {
        setDataTable(value);
        if (props.onDataChange) {
            props.onDataChange(value);
        }
    };

    const resetPage = () => {
        setActivePage(1);
    };

    useEffect(() => {
        if (props.onDataChange) {
            props.onDataChange(dataTable);
        }
    }, [dataTable, props.onDataChange]);

    const changeActive = (event) => {
        setActivePage(Number(event.target.innerHTML));
    };

    const isPaginated = props.isPaginated !== false;

    if (!isPaginated) {
        return (
            <>
                <Filter fullData={props.data} filtering={updateDataTable} resetPage={resetPage} />
                <table>
                    <TableHead head={Object.keys(props.data[0] || {})} />
                    <TableBody body={dataTable} amountRows={dataTable.length} numPage="1" />
                </table>
            </>
        );
    }

    const n = Math.ceil(dataTable.length / props.amountRows);
    const arr = Array.from({ length: n }, (v, i) => i + 1);

    const pages = arr.map((item) =>
        <span
            key={item}
            onClick={changeActive}
            className={item === activePage ? 'page-number active-page' : 'page-number'}
        >
            {item}
        </span>
    );

    return (
        <>
            <Filter fullData={props.data} filtering={updateDataTable} resetPage={resetPage} />
            <table>
                <TableHead head={Object.keys(props.data[0] || {})} />
                <TableBody body={dataTable} amountRows={props.amountRows} numPage={activePage} />
            </table>
            {n > 1 && (
                <div className="pagination-controls">
                    {pages}
                </div>
            )}
        </>
    );
}

export default Table;
