import React, { useState, useEffect } from 'react';
import { calculateBreadUnits } from './utils/calc';
import './App.css';

export default function App() {
  const [page, setPage] = useState('main');
  const [items, setItems] = useState([
    { id: Date.now(), name: '', weight: '', carbs100g: 0, fiber100g: 0 }
  ]);

  const addItem = () =>
    setItems(prev => [
      ...prev,
      { id: Date.now(), name: '', weight: '', carbs100g: 0, fiber100g: 0 }
    ]);
  const removeItem = id =>
    setItems(prev => prev.filter(it => it.id !== id));
  const updateItem = (id, changes) =>
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, ...changes } : it))
    );

  // сумма всех ХЕ
  const totalBU = Math.round(
    items.reduce((sum, it) => {
      const bu = calculateBreadUnits(
        Number(it.weight) || 0,
        it.carbs100g,
        it.fiber100g
      );
      return sum + bu;
    }, 0) * 2
  ) / 2;

  return (
    <div>
      <header>
        <h1>Diabetes Management</h1>
        <div className="nav-buttons">
          <button onClick={() => setPage('main')}>Главная</button>
          <button onClick={() => setPage('calculator')}>Калькулятор ХЕ</button>
          <button onClick={() => setPage('symptoms')}>Симптомы и профилактика</button>
          <button onClick={() => setPage('sugar')}>Учет сахара в крови</button>
        </div>
      </header>

      <div className="content">
        {page === 'main' && (
          <div className="page">
            <h2>Добро пожаловать!</h2>
            <p>Это приложение для помощи диабетикам. Выберите нужный раздел.</p>
          </div>
        )}

        {page === 'calculator' && (
          <div className="page calculator">
            <h2>Калькулятор хлебных единиц</h2>

            {items.map(item => (
              <Row
                key={item.id}
                item={item}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            ))}

            <button className="add-btn" onClick={addItem}>
              + Добавить продукт
            </button>

            <div className="total">
              Итого ХЕ: <strong>{totalBU}</strong>
            </div>
          </div>
        )}

        {page === 'symptoms' && (
          <div className="page">
            <h2>Симптомы и профилактика</h2>
            <p>Информация о симптомах диабета и способах профилактики.</p>
          </div>
        )}

        {page === 'sugar' && (
  <div className="page sugar-page">
    <h2>Учет сахара в крови</h2>

    {/* ввод */}
    <div className="sugar-input">
      <input
        type="number"
        value={sugarValue}
        onChange={e => setSugarValue(e.target.value)}
        placeholder="Уровень сахара"
      />
      <button onClick={addSugarEntry}>Добавить</button>
    </div>

    {/* таблица */}
    <table className="sugar-table">
      <thead>
        <tr>
          <th>Дата и время</th>
          <th>Показатель</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        {sugarEntries.map(entry => (
          <tr key={entry.id}>
            <td>{entry.timestamp}</td>
            <td>{entry.value}</td>
            <td>
              <button
                className="remove-btn"
                onClick={() => removeSugarEntry(entry.id)}
              >
                ×
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

      </div>
    </div>
  );
}

// Компонент одной строки с автокомплитом
function Row({ item, updateItem, removeItem }) {
  const [query, setQuery] = useState(item.name);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
        url.searchParams.set('search_simple', '1');
        url.searchParams.set('search_terms', query);
        url.searchParams.set('action', 'process');
        url.searchParams.set('json', '1');

        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.products.slice(0, 5));
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const selectProduct = p => {
    updateItem(item.id, {
      name:        p.product_name,
      carbs100g:   p.nutriments.carbohydrates_100g || 0,
      fiber100g:   p.nutriments.fiber_100g         || 0
    });
    setQuery(p.product_name);
    setSuggestions([]);
  };

  return (
    <div className="item-row">
      <div className="search-wrapper">
        <input
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value);
            updateItem(item.id, { name: e.target.value });
          }}
          placeholder="Название продукта"
        />
        {loading && <span className="loading">…</span>}
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map(p => (
              <li key={p.code} onClick={() => selectProduct(p)}>
                {p.product_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <input
        type="number"
        value={item.weight}
        onChange={e => updateItem(item.id, { weight: e.target.value })}
        placeholder="Вес (г)"
      />

      <button
        className="remove-btn"
        onClick={() => removeItem(item.id)}
      >
        ×
      </button>
    </div>
  );
}
