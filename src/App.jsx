import { useState } from 'react';
import './App.css';

function App() {
  const [page, setPage] = useState('main');

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
            <p>Это приложение для помощи диабетикам. Выберите нужный раздел в меню выше.</p>
          </div>
        )}

        {page === 'calculator' && (
          <div className="page">
            <h2>Калькулятор ХЕ</h2>
            <p>Здесь вы можете рассчитать количество хлебных единиц для вашего рациона.</p>
          </div>
        )}

        {page === 'symptoms' && (
          <div className="page">
            <h2>Симптомы и профилактика</h2>
            <p>Здесь вы найдете информацию о симптомах диабета и способах их профилактики.</p>
          </div>
        )}

        {page === 'sugar' && (
          <div className="page">
            <h2>Учет сахара в крови</h2>
            <p>Здесь вы можете вести учет уровня сахара в крови.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
