import React, { useState } from 'react';

const Filter = (props) => {
    const initialFilterState = {
        Название: '',
        Тип: '',
        Страна: '',
        Город: '',
        Год: ['', ''],
        Высота: ['', '']
    };

    const [filters, setFilters] = useState(initialFilterState);

    const handleChange = (event) => {
        const { name, value, dataset } = event.target;

        if (name === "Год" || name === "Высота") {
            const newRange = [...filters[name]];
            newRange[dataset.index] = value;
            setFilters({
                ...filters,
                [name]: newRange
            });
        } else {
            setFilters({
                ...filters,
                [name]: value
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        let filteredData = props.fullData;

        // Текстовая фильтрация
        ['Название', 'Тип', 'Страна', 'Город'].forEach(key => {
            if (filters[key]) {
                filteredData = filteredData.filter(item =>
                    item[key].toLowerCase().includes(filters[key].toLowerCase())
                );
            }
        });

        // Фильтрация по диапазону "Год"
        const [yearFrom, yearTo] = filters.Год;
        if (yearFrom) {
            filteredData = filteredData.filter(item => item.Год >= Number(yearFrom));
        }
        if (yearTo) {
            filteredData = filteredData.filter(item => item.Год <= Number(yearTo));
        }

        // Фильтрация по диапазону "Высота"
        const [heightFrom, heightTo] = filters.Высота;
        if (heightFrom) {
            filteredData = filteredData.filter(item => item.Высота >= Number(heightFrom));
        }
        if (heightTo) {
            filteredData = filteredData.filter(item => item.Высота <= Number(heightTo));
        }

        props.filtering(filteredData);
        props.resetPage();
    };

    const handleClear = () => {
        setFilters(initialFilterState);
        props.filtering(props.fullData);
        props.resetPage();
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Фильтры</h3>
            <div>
                <label>Название: </label>
                <input type="text" name="Название" value={filters.Название} onChange={handleChange} />
            </div>
            <div>
                <label>Тип: </label>
                <input type="text" name="Тип" value={filters.Тип} onChange={handleChange} />
            </div>
            <div>
                <label>Страна: </label>
                <input type="text" name="Страна" value={filters.Страна} onChange={handleChange} />
            </div>
            <div>
                <label>Город: </label>
                <input type="text" name="Город" value={filters.Город} onChange={handleChange} />
            </div>
            <div>
                <label>Год от: </label>
                <input type="number" name="Год" data-index="0" value={filters.Год[0]} onChange={handleChange} />
            </div>
            <div>
                <label>Год до: </label>
                <input type="number" name="Год" data-index="1" value={filters.Год[1]} onChange={handleChange} />
            </div>
            <div>
                <label>Высота от: </label>
                <input type="number" name="Высота" data-index="0" value={filters.Высота[0]} onChange={handleChange} />
            </div>
            <div>
                <label>Высота до: </label>
                <input type="number" name="Высота" data-index="1" value={filters.Высота[1]} onChange={handleChange} />
            </div>
            <button type="submit">Фильтровать</button>
            <button type="button" onClick={handleClear}>Очистить фильтр</button>
        </form>
    );
};

export default Filter;
