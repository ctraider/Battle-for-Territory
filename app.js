(function () {
  const e = React.createElement;

  /* ========== CONSTANTS ========== */
  const SIZE = 10;
  const INIT = 3;

  const PLAYER_NAMES = {
    1: { name: "🔵 Синее Королевство", color: "#4444ff" },
    2: { name: "🔴 Красная Империя", color: "#ff4444" }
  };

  const TYPES = {
    KNIGHT: { name: 'Рыцарь', img: '01.png', cost: 5, dam: 5, arm: 3, hp: 12, mv: 2, unlock: 0 },
    ARCHER: { name: 'Лучник', img: '02.png', cost: 7,  dam: 3, arm: 0, hp: 4, mv: 3, unlock: 5 },
    HEALER: { name: 'Хиллер', img: '03.png', cost: 9, dam: 1, arm: 1, hp: 10, mv: 2, unlock: 10 },
    MAGE:   { name: 'Маг',    img: '04.png',   cost: 12, dam: 5, arm: 1, hp: 8, mv: 2, unlock: 15 },
    TANK:   { name: 'Танк',   img: '05.png',   cost: 15, dam: 4, arm: 6, hp: 20, mv: 2, unlock: 20 },
    SCOUT:  { name: 'Разведчик', img: '02.png', cost: 1, dam: 2, arm: 1, hp: 6, mv: 4, unlock: 5 }
  };

  const FUNNY_MESSAGES = {
    KNIGHT: {
      attack: [
        "За честь короля!",
        "Почувствуй силу моего меча!",
        "Сегодня славный день для битвы!"
      ],
      death: [
        "Умираю с честью...",
        "За королевство!",
        "Мой путь окончен..."
      ]
    },
    ARCHER: {
      attack: [
        "Стрела летит прямо в цель!",
        "Дождь из стрел!",
        "Меткий выстрел!"
      ],
      death: [
        "Последняя стрела выпущена...",
        "Колчан опустел навсегда...",
        "Лук сломан..."
      ]
    },
    HEALER: {
      attack: [
        "Исцеляющий удар!",
        "Лечить или не лечить?",
        "Больно, но полезно!"
      ],
      death: [
        "Кто теперь будет лечить?",
        "Мои заклинания иссякли...",
        "Свет угасает..."
      ]
    },
    MAGE: {
      attack: [
        "Огненный шар!",
        "Сила магии безгранична!",
        "Абракадабра!"
      ],
      death: [
        "Магия покидает меня...",
        "Последнее заклинание...",
        "Портал закрывается..."
      ]
    },
    TANK: {
      attack: [
        "Сокрушающий удар!",
        "Стена против стены!",
        "Броня крепка!"
      ],
      death: [
        "Броня не выдержала...",
        "Даже стены падают...",
        "Щит разбит..."
      ]
    },
    SCOUT: {
      attack: [
        "Захватываю территорию!",
        "Это земля теперь моя!",
        "Быстрый налет!"
      ],
      death: [
        "Я слишком далеко зашел...",
        "Разведка провалена...",
        "Возвращение... невозможно..."
      ]
    }
  };

  const MOVE_MESSAGES = [
    "совершает тактическое перемещение",
    "меняет позицию",
    "занимает новый рубеж",
    "перегруппировывается"
  ];

  const BUY_MESSAGES = [
    "прибывает на поле боя",
    "готов к сражению",
    "присоединяется к армии",
    "вступает в битву"
  ];

  function getRandomMessage(type, action, unitType) {
    if (action === 'move') return MOVE_MESSAGES[Math.floor(Math.random() * MOVE_MESSAGES.length)];
    if (action === 'buy') return BUY_MESSAGES[Math.floor(Math.random() * BUY_MESSAGES.length)];
    return FUNNY_MESSAGES[unitType][action][Math.floor(Math.random() * FUNNY_MESSAGES[unitType][action].length)];
  }

  /* Получение случайной фразы из нашей базы BATTLE_PHRASES */
  function getRandomPhrase(unitType, action) {
    // Если тип юнита существует и для него есть фразы для данного действия
    if (unitType && BATTLE_PHRASES[unitType] && BATTLE_PHRASES[unitType][action]) {
      const phrases = BATTLE_PHRASES[unitType][action];
      return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    // Если для юнита нет фраз или юнит неизвестен, используем общие фразы
    if (BATTLE_PHRASES.GENERIC && BATTLE_PHRASES.GENERIC[action]) {
      const phrases = BATTLE_PHRASES.GENERIC[action];
      return phrases[Math.floor(Math.random() * phrases.length)];
    }
    
    // Если ничего не нашли, возвращаем стандартное сообщение
    return "Я сделал что-то!";
  }

  /* Получение случайного имени для юнита определенного типа */
  function getRandomUnitName(unitType) {
    if (unitType && UNIT_NAMES[unitType]) {
      const names = UNIT_NAMES[unitType];
      return names[Math.floor(Math.random() * names.length)];
    }
    
    // Если типа нет в базе имен, возвращаем дефолтное имя
    return "Безымянный";
  }

  /* Получение случайного названия территории */
  function getRandomTerritory() {
    return STORY_TEMPLATES.territories[Math.floor(Math.random() * STORY_TEMPLATES.territories.length)];
  }

  /* Формирование нарративного описания боя */
  function getStoryTemplate(type, params = {}) {
    // Для шаблонов атаки, определяем тип юнита, если есть
    if (type === 'attack' && params.unitType) {
      // Пробуем найти специфичный для этого типа юнита шаблон атаки
      const specificType = params.unitType.toLowerCase() + 'Attack';
      if (STORY_TEMPLATES[specificType]) {
        const templates = STORY_TEMPLATES[specificType];
        let template = templates[Math.floor(Math.random() * templates.length)];
        
        // Заменяем плейсхолдеры на значения
        Object.keys(params).forEach(key => {
          template = template.replace(`{${key}}`, params[key]);
        });
        
        return template;
      }
    }
    
    // Стандартная обработка для других типов
    if (!STORY_TEMPLATES[type]) return "Что-то произошло...";
    
    const templates = STORY_TEMPLATES[type];
    
    // Для движения - выбираем шаблоны, соответствующие типу юнита, если указан
    if (type === 'move' && params.unitType) {
      // Фильтруем шаблоны, содержащие название типа юнита
      const unitTypeName = TYPES[params.unitType]?.name || 'Рыцарь';
      const matchingTemplates = templates.filter(t => 
        t.toLowerCase().includes(unitTypeName.toLowerCase())
      );
      
      // Если нашли подходящие шаблоны, используем их
      if (matchingTemplates.length > 0) {
        let template = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
        
        // Заменяем плейсхолдеры на значения
        Object.keys(params).forEach(key => {
          template = template.replace(`{${key}}`, params[key]);
        });
        
        return template;
      }
    }
    
    // Если специфичных шаблонов не нашлось, используем общие
    let template = templates[Math.floor(Math.random() * templates.length)];
    
    // Заменяем плейсхолдеры на значения
    Object.keys(params).forEach(key => {
      template = template.replace(`{${key}}`, params[key]);
    });
    
    return template;
  }

  /* Соседние клетки (4‑связность) */
  const neigh = (x, y) =>
    [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(
      ([i, j]) => i >= 0 && i < SIZE && j >= 0 && j < SIZE
    );

  /* ========== REACT COMPONENTS ========== */
  const { useState, useEffect } = React;

  // Клетка поля
  function Cell({ i, j, terr, unit, selected, validMove, validAttack, onClick }) {
    let className = "cell";
    if (terr === 1) className += " player1-territory";
    if (terr === 2) className += " player2-territory";
    if (selected) className += " selected";
    if (validMove) className += " valid-move";
    if (validAttack) className += " valid-attack";

    // Текст для screen readers и title
    let ariaLabel = `Клетка ${i},${j}`;
    let title = "";
    
    if (unit) {
      const unitName = unit.name || "Безымянный";
      title = `${TYPES[unit.type].name}: ${unitName}, HP: ${unit.hp}/${TYPES[unit.type].hp}`;
      ariaLabel += `, ${title}`;
    }

    return (
      e('div', {
        className,
        tabIndex: 0,
        'aria-label': ariaLabel,
        title: title,
        onClick: () => onClick(i, j),
        onKeyDown: e => { if (e.key === "Enter" || e.key === " ") onClick(i, j); }
      },
        unit && e('div', { className: 'unit-container' },
          e('div', { className: 'health-bar-container' },
            e('div', { 
              className: 'health-bar',
              style: { width: `${(unit.hp / TYPES[unit.type].hp) * 100}%` }
            })
          ),
          e('img', {
            className: `unit-image player${unit.pl}`,
            src: `img/${TYPES[unit.type].img}`,
            alt: TYPES[unit.type].name,
            'data-unit-name': unit.name,
            'data-unit-type': unit.type,
            'data-unit-hp': unit.hp
          })
        )
      )
    );
  }

  // Сетка поля
  function Grid({ units, terr, sel, moves, att, onCellClick }) {
    let cells = [];
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        cells.push(e(Cell, {
          key: `${i},${j}`,
          i, j,
          terr: terr[i][j],
          unit: units[i][j],
          selected: sel && sel.x === i && sel.y === j,
          validMove: moves.some(m => m[0] === i && m[1] === j),
          validAttack: att.some(a => a[0] === i && a[1] === j),
          onClick: onCellClick
        }));
      }
    }
    return e('div', { className: 'grid' }, cells);
  }

  // Панель информации
  function HUD({ pl, res, phase, turn, terr }) {
    // Подсчитываем количество территорий для каждого игрока
    const player1Territories = terr.flat().filter(t => t === 1).length;
    const player2Territories = terr.flat().filter(t => t === 2).length;
    const totalTerritories = SIZE * SIZE;
    const claimedTerritories = player1Territories + player2Territories;
    
    // Процент захваченных территорий
    const player1Percent = Math.round((player1Territories / totalTerritories) * 100);
    const player2Percent = Math.round((player2Territories / totalTerritories) * 100);
    const unclaimedPercent = 100 - player1Percent - player2Percent;
    
    return e('div', { className: 'info' },
      e('div', { className: 'panel', style: { color: PLAYER_NAMES[pl].color } },
        `${PLAYER_NAMES[pl].name}`
      ),
      e('div', { className: 'panel' }, `✶ ${res}`),
      e('div', { className: 'panel territory-counter'}, 
        e('div', { className: 'blue' }, `🔵 ${player1Territories} (${player1Percent}%)`),
        e('div', { className: 'progress-bar' },
          e('div', { 
            className: 'player1-progress',
            style: { width: `${player1Percent}%` }
          }),
          e('div', { 
            className: 'player2-progress',
            style: { width: `${player2Percent}%` }
          })
        ),
        e('div', { className: 'red' }, `🔴 ${player2Territories} (${player2Percent}%)`)
      ),
      e('div', { className: 'panel' }, `Phase: ${phase}`),
      e('div', { className: 'panel' }, `Turn: ${turn}`)
    );
  }

  // История ходов
  function History({ hist }) {
    return e('div', { className: 'history' },
      e('h4', null, 'History'),
      e('ul', null, hist.map((m, i) => e('li', { key: i }, m)))
    );
  }

  // Меню покупки
  function BuyMenu({ terr, pl, res, onBuy, onClose }) {
    // Счетчики для территорий
    const player1Territories = terr.flat().filter(t => t === 1).length;
    const player2Territories = terr.flat().filter(t => t === 2).length;
    const yourTerritories = pl === 1 ? player1Territories : player2Territories;

    // Показываем больше информации о юнитах
    const unitDetails = (type, unit) => {
      const isAvailable = res >= unit.cost && yourTerritories >= unit.unlock;
      const nameExample = getRandomUnitName(type);
      
      return e('div', { 
        className: 'unit-details',
        style: { 
          opacity: isAvailable ? 1 : 0.5,
          cursor: isAvailable ? 'pointer' : 'not-allowed'
        },
        onClick: isAvailable ? () => onBuy(type) : null
      },
        e('div', { className: 'unit-header' },
          e('img', { src: `img/${unit.img}`, alt: unit.name, className: 'unit-preview' }),
          e('h4', null, unit.name)
        ),
        e('div', { className: 'unit-stats' },
          e('div', { className: 'unit-cost' }, `💰 Цена: ${unit.cost}`),
          e('div', { className: 'unit-unlock' }, `🔓 Нужно территорий: ${unit.unlock}`),
          e('div', { className: 'unit-params' }, `❤️ HP: ${unit.hp} | ⚔️ ATK: ${unit.dam} | 🛡️ DEF: ${unit.arm} | 👣 MV: ${unit.mv}`),
          e('div', { className: 'unit-name-example' }, `🔖 Возможное имя: "${nameExample}"`)
        ),
        !isAvailable && e('div', { className: 'unit-locked' },
          res < unit.cost ? 'Не хватает ресурсов' : 'Недостаточно территорий'
        ),
        isAvailable && e('button', { 
          className: 'buy-button',
          onClick: () => onBuy(type)
        }, 'Купить')
      );
    };

    return e('div', { className: 'menu buy-menu', role: 'dialog', 'aria-modal': 'true' },
      e('h3', null, 'Покупка юнитов'),
      e('div', { className: 'resources-info' }, `Ресурсы: ${res} | Территории: ${yourTerritories}`),
      e('div', { className: 'unit-list' },
        unitDetails('SCOUT', TYPES.SCOUT),
        unitDetails('KNIGHT', TYPES.KNIGHT),
        unitDetails('ARCHER', TYPES.ARCHER),
        unitDetails('HEALER', TYPES.HEALER),
        unitDetails('MAGE', TYPES.MAGE),
        unitDetails('TANK', TYPES.TANK)
      ),
      e('button', { 
        onClick: onClose,
        className: 'close-button'
      }, 'Закрыть')
    );
  }

  // Добавим компонент HeroCards
  function HeroCards() {
    return e('div', { className: 'hero-cards' },
      Object.entries(TYPES).map(([type, data]) =>
        e('div', { key: type, className: 'hero-card' },
          e('div', { className: 'hero-card-header' },
            e('img', { src: `img/${data.img}`, alt: data.name }),
            e('h4', null, data.name)
          ),
          e('div', { className: 'hero-card-stats' },
            e('div', { className: 'stat' },
              e('span', { className: 'stat-icon' }, '❤️'),
              e('span', null, `HP: ${data.hp}`)
            ),
            e('div', { className: 'stat' },
              e('span', { className: 'stat-icon' }, '⚔️'),
              e('span', null, `Урон: ${data.dam}`)
            ),
            e('div', { className: 'stat' },
              e('span', { className: 'stat-icon' }, '🛡️'),
              e('span', null, `Броня: ${data.arm}`)
            ),
            e('div', { className: 'stat' },
              e('span', { className: 'stat-icon' }, '👣'),
              e('span', null, `Ход: ${data.mv}`)
            )
          )
        )
      )
    );
  }

  // Компонент для отображения военных сводок в нарративном стиле
  function WarLog({ logs }) {
    return e('div', { className: 'war-log' },
      e('h3', null, 'Хроники Сражения'),
      logs.map((log, i) => {
        // Определяем стиль в зависимости от типа лога
        const className = `war-log-entry ${log.type || 'generic'}`;
        
        // Выбираем цвет текста: для войны - цвет игрока, для нарратива - белый
        const textColor = log.player ? PLAYER_NAMES[log.player]?.color : '#fff';
        
        return e('div', { 
          key: i, 
          className: className,
          style: { color: textColor }
        }, log.text);
      })
    );
  }

  // Главное приложение
  function App() {
    const [units, setUnits] = useState(Array(SIZE).fill().map(() => Array(SIZE).fill(null)));
    const [terr, setTerr] = useState(Array(SIZE).fill().map(() => Array(SIZE).fill(null)));
    const [res, setRes] = useState(0);
    const [placed, setPlaced] = useState(0);
    const [phase, setPhase] = useState('placement');
    const [pl, setPl] = useState(1);
    const [sel, setSel] = useState(null);
    const [moves, setMoves] = useState([]);
    const [att, setAtt] = useState([]);
    const [menu, setMenu] = useState(false);
    const [place, setPlace] = useState(null);
    const [hint, setHint] = useState(false);
    const [hist, setHist] = useState([]);
    const [turn, setTurn] = useState(1);
    const [win, setWin] = useState(null);
    const [error, setError] = useState(null);
    const [isGodMode, setIsGodMode] = useState(false);
    const [warLog, setWarLog] = useState([]);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    // Функция для добавления боевой фразы в журнал
    function addWarLogEntry(type, player, text) {
      console.log("Добавляю в боевые сводки:", { type, player, text });
      setWarLog(prev => [...prev, { type, player, text }]);
    }

    // Функция для создания нарративной истории
    function addNarrativeLog(type, params = {}) {
      // Получаем текст истории из шаблона
      const storyText = getStoryTemplate(type, params);
      
      // Определяем, какой тип лога это
      let logType = 'generic';
      if (type === 'move' || type === 'enemyMove') logType = 'move';
      if (type === 'attack' || type === 'finalAttack') logType = 'attack';
      if (type === 'enemyDeath') logType = 'death';
      if (type === 'response') logType = 'attack';
      
      // Определяем игрока на основе параметров
      let player = pl;
      
      // Для вражеских действий или ответов меняем игрока
      if (type === 'enemyMove' || type === 'enemyDeath' || type === 'response') {
        player = pl === 1 ? 2 : 1;
      }
      
      // Для точного указания игрока
      if (params.player) player = params.player;
      
      // Добавляем запись в журнал
      addWarLogEntry(logType, player, storyText);
      
      // Если это атака, добавляем ответку с задержкой, если не было указано отключить ответку
      if ((type === 'attack' || type === 'finalAttack') && !params.noResponse) {
        setTimeout(() => {
          // Добавляем ответку от противника как отдельную запись
          const responseText = getStoryTemplate('response', {
            knight: params.enemy || "Противник"
          });
          
          // Враг отвечает
          const enemyPlayer = pl === 1 ? 2 : 1;
          addWarLogEntry('attack', enemyPlayer, responseText);
        }, 800); // Небольшая задержка для лучшего визуального эффекта
      }
    }

    // Функция buy с проверкой на GOD MODE (не показывать hint в автоматическом режиме)
    function buy(type) {
      const unlocked = terr.flat().filter(t => t === pl).length >= TYPES[type].unlock;
      if (res < TYPES[type].cost || !unlocked) return;
      
      const canPlace = terr.some((row, i) => row.some((t, j) => t === pl && !units[i][j]));
      if (!canPlace) {
        setError('Нет свободных клеток для размещения!');
        return;
      }
      
      // Добавляем боевую сводку о покупке
      addNarrativeLog('heal', { isEnemy: false });
      
      setMenu(false);
      setRes(r => r - TYPES[type].cost);
      setPhase('placing');
      setPlace(type);
      setHint(true);
    }

    // Улучшенная функция executeMove для GOD MODE
    function executeMove(fromX, fromY, toX, toY) {
      if (!units[fromX][fromY] || units[fromX][fromY].pl !== pl) return false;
      if (units[toX][toY]) return false;
      
      const unit = units[fromX][fromY];
      const distance = Math.abs(fromX - toX) + Math.abs(fromY - toY);
      if (distance > TYPES[unit.type].mv) return false;

      const u = units.map(r => r.slice());
      const t = terr.map(r => r.slice());
      
      // Анимация перемещения
      const unitElement = document.querySelector(`.cell:nth-child(${fromX * SIZE + fromY + 1}) .unit-image`);
      if (unitElement) {
        unitElement.classList.add('unit-moving');
      }
      
      // Создаем нарративную историю о перемещении
      const territory = getRandomTerritory();
      addNarrativeLog('move', { 
        knight: unit.name || getRandomUnitName(unit.type), 
        enemy: "никого", 
        tile: territory,
        unitType: unit.type  // Передаем тип юнита для соответствующего выбора фраз
      });

      setTimeout(() => {
        u[fromX][fromY] = null;
        u[toX][toY] = unit;
        
        // Специальная логика для Скаута - захватывает территорию в радиусе 1 клетки (матрица 3x3)
        if (unit.type === 'SCOUT') {
          // Захватываем все клетки в радиусе 1 вокруг точки назначения (матрица 3x3)
          for (let x = Math.max(0, toX - 1); x <= Math.min(SIZE - 1, toX + 1); x++) {
            for (let y = Math.max(0, toY - 1); y <= Math.min(SIZE - 1, toY + 1); y++) {
              t[x][y] = pl;
              // Добавляем визуальный эффект захвата территории
              setTimeout(() => {
                const cellElement = document.querySelector(`.cell:nth-child(${x * SIZE + y + 1})`);
                if (cellElement) {
                  cellElement.classList.add('scout-capture');
                  setTimeout(() => cellElement.classList.remove('scout-capture'), 300);
                }
              }, Math.random() * 300);
            }
          }
          // Добавляем специальное сообщение о захвате территории
          addWarLogEntry('move', pl, `Скаут ${unit.name} захватил территорию вокруг [${toX},${toY}]!`);
        } else {
          // Обычное поведение для других юнитов
          t[toX][toY] = pl; // Захватываем только целевую клетку
        }
        
        setUnits(u);
        setTerr(t);
        
        if (unitElement) {
          unitElement.classList.remove('unit-moving');
        }
        
        // Записываем в историю
        setHist(h => [...h, `${unit.type}[${fromX},${fromY}]→[${toX},${toY}]`]);
        
        end();
      }, 500);

      return true;
    }
    
    // Улучшенная функция executeAttack для GOD MODE
    function executeAttack(fromX, fromY, toX, toY) {
      if (!units[fromX][fromY] || units[fromX][fromY].pl !== pl) return false;
      if (!units[toX][toY]) return false;

      const attacker = units[fromX][fromY];
      const defender = units[toX][toY];
      
      // Если это хиллер и цель - союзник, то лечим
      if (attacker.type === 'HEALER' && defender.pl === pl) {
        const healAmount = 2; // Количество HP для лечения
        const u = units.map(r => r.slice());
        
        // Анимация лечения
        const healerElement = document.querySelector(`.cell:nth-child(${fromX * SIZE + fromY + 1}) .unit-image`);
        const targetElement = document.querySelector(`.cell:nth-child(${toX * SIZE + toY + 1}) .unit-image`);
        
        if (healerElement) {
          healerElement.classList.add('unit-attacking');
        }

        // Создаем нарративную историю о лечении
        const healerName = attacker.name || getRandomUnitName(attacker.type);
        const targetName = defender.name || getRandomUnitName(defender.type);
        
        addNarrativeLog('heal', { 
          knight: healerName, 
          enemy: targetName,
          unitType: attacker.type,
          noResponse: true
        });

        setTimeout(() => {
          // Лечим юнита, но не выше максимального HP
          const maxHp = TYPES[defender.type].hp;
          defender.hp = Math.min(maxHp, defender.hp + healAmount);
          
          u[toX][toY] = defender;
          setUnits(u);
          
          // Записываем в историю
          setHist(h => [...h, `${attacker.type}->${defender.type}+${healAmount}, HP${defender.hp}`]);
          
          if (healerElement) {
            healerElement.classList.remove('unit-attacking');
          }
          
          end();
        }, 300);

        return true;
      }
      
      // Стандартная логика атаки для всех остальных случаев
      if (defender.pl === pl) return false;
      
      const dmg = Math.max(1, TYPES[attacker.type].dam - TYPES[defender.type].arm);
      
      const u = units.map(r => r.slice());
      
      // Анимация атаки
      const attackerElement = document.querySelector(`.cell:nth-child(${fromX * SIZE + fromY + 1}) .unit-image`);
      const defenderElement = document.querySelector(`.cell:nth-child(${toX * SIZE + toY + 1}) .unit-image`);
      
      if (attackerElement) {
        attackerElement.classList.add('unit-attacking');
      }

      // Создаем нарративную историю об атаке
      const attackerName = attacker.name || getRandomUnitName(attacker.type);
      const defenderName = defender.name || getRandomUnitName(defender.type);
      const territory = getRandomTerritory();
      
      addNarrativeLog('attack', { 
        knight: attackerName, 
        enemy: defenderName, 
        tile: territory,
        unitType: attacker.type,
        noResponse: true
      });

      setTimeout(() => {
        defender.hp -= dmg;
        
        if (defender.hp <= 0) {
          if (defenderElement) {
            defenderElement.classList.add('unit-death');
          }
          
          addNarrativeLog('finalAttack', { 
            knight: attackerName, 
            enemy: defenderName,
            noResponse: true
          });
          
          setTimeout(() => {
            addNarrativeLog('enemyDeath', { 
              enemy: defenderName,
              player: defender.pl
            });
            
            setTimeout(() => {
              u[toX][toY] = attacker;
              u[fromX][fromY] = null;
              const t2 = terr.map(r => r.slice());
              t2[toX][toY] = pl;
              setUnits(u);
              setTerr(t2);
              
              setHist(h => [...h, `${attacker.type}->${defender.type}-${dmg}, убит`]);
              
              end();
            }, 500);
          }, 1000);
        } else {
          addNarrativeLog('response', { 
            knight: defenderName,
            player: defender.pl
          });
          
          u[toX][toY] = defender;
          setUnits(u);
          
          setHist(h => [...h, `${attacker.type}->${defender.type}-${dmg}, HP${defender.hp}`]);
          
          end();
        }
        
        if (attackerElement) {
          attackerElement.classList.remove('unit-attacking');
        }
      }, 300);

      return true;
    }

    // Эффекты
    useEffect(() => {
      if (phase === 'placement' && placed === INIT * 2) {
        setPhase('game');
        setHist(h => [...h, 'Начинается игра']);
      }
    }, [phase, placed]);

    useEffect(() => {
      if (phase === 'game') {
        const inc = terr.flat().filter(t => t === pl).length;
        setRes(r => r + inc);
        setHist(h => [...h, `+${inc}✶ за территории`]);
      }
    }, [turn]);

    useEffect(() => {
      if (phase === 'game') {
        const flat = units.flat();
        if (!flat.some(u => u && u.pl === 1)) setWin(2);
        else if (!flat.some(u => u && u.pl === 2)) setWin(1);
        else {
          // Проверяем, остались ли незахваченные территории
          const allTerrClaimed = terr.flat().every(t => t === 1 || t === 2);
          if (allTerrClaimed) {
            const c1 = terr.flat().filter(t => t === 1).length;
            const c2 = terr.flat().filter(t => t === 2).length;
            console.log('Все территории захвачены! Подсчитываем: Синий -', c1, 'Красный -', c2);
            setWin(c1 > c2 ? 1 : c2 > c1 ? 2 : 'Draw');
          }
        }
      }
    }, [terr, units, phase]);

    // Сохранение состояния
    useEffect(() => {
      // Не сохраняем боевые сводки в localStorage, чтобы избежать переполнения
      const tempWarLog = warLog;
      const stateToSave = { 
        units, terr, res, placed, phase, pl, sel, moves, att, menu, place, hint, hist, turn, win, isGodMode 
      };
      localStorage.setItem('battleGameState', JSON.stringify(stateToSave));
    }, [units, terr, res, placed, phase, pl, sel, moves, att, menu, place, hint, hist, turn, win, isGodMode]);

    // Загрузка состояния
    useEffect(() => {
      const saved = localStorage.getItem('battleGameState');
      if (saved) {
        try {
          const state = JSON.parse(saved);
          setUnits(state.units);
          setTerr(state.terr);
          setRes(state.res);
          setPlaced(state.placed);
          setPhase(state.phase);
          setPl(state.pl);
          setSel(state.sel);
          setMoves(state.moves);
          setAtt(state.att);
          setMenu(state.menu);
          setPlace(state.place);
          setHint(state.hint);
          setHist(state.hist);
          setTurn(state.turn);
          setWin(state.win);
          setIsGodMode(state.isGodMode);
        } catch {}
      }
    }, []);

    // Обработка клавиатуры
    useEffect(() => {
      function handleKeyDown(e) {
        if (e.key === 'Escape') {
          if (hint) cancelPlacing();
          else if (sel) {
            setSel(null);
            setMoves([]);
            setAtt([]);
          }
        }
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [hint, sel]);

    // Улучшенная функция handleGodMode
    function handleGodMode() {
      if (!isGodMode) {
        console.log("GOD MODE: Активирован. Игра будет автоматически играть до победы.");
        setIsGodMode(true);
        
        // Если игра только начата — сразу делаем первый шаг расстановки
        if (phase === 'placement' && placed === 0) {
          const zone = pl === 1 ? [0, 1, 2] : [SIZE - 3, SIZE - 2, SIZE - 1];
          outer: for (const i of zone) {
            for (let j = 0; j < SIZE; j++) {
              if (!units[i][j]) {
                setTimeout(() => handle(i, j), 500);
                break outer;
              }
            }
          }
        }
      } else {
        console.log("GOD MODE: Деактивирован. Игра возвращается в ручной режим.");
        setIsGodMode(false);
      }
    }

    // Стабилизируем GOD MODE
    useEffect(() => {
      if (!isGodMode || win) return;
      
      // Только если мы в фазе игры и еще нет победителя
      if (phase === 'game') {
        console.log(`GOD MODE active for player ${pl} (${PLAYER_NAMES[pl].name}) on turn ${turn}`);
        
        // Задержка для визуализации
        setTimeout(() => {
          let actionPerformed = false;
          
          // ШАГ 1: ОСНОВНАЯ СТРАТЕГИЯ - ЗАХВАТ ТЕРРИТОРИЙ
          // Находим все доступные юниты текущего игрока
          const playerUnits = [];
          for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
              if (units[i][j] && units[i][j].pl === pl) {
                playerUnits.push([i, j, units[i][j]]);
              }
            }
          }
          
          // ПРОБЛЕМА 2: Не все юниты двигаются
          // Выводим информацию о доступных юнитах
          console.log(`GOD MODE: Player ${pl} has ${playerUnits.length} units available`);
          
          // Сначала сортируем юниты - юниты сверху и снизу поля имеют больший приоритет
          // Это решает проблему застрявших юнитов в углах
          playerUnits.sort((a, b) => {
            const [aX, aY] = [a[0], a[1]];
            const [bX, bY] = [b[0], b[1]];
            
            // Приоритет юнитам в углах карты
            const aIsInCorner = (aX === 0 || aX === SIZE-1) && (aY === 0 || aY === SIZE-1);
            const bIsInCorner = (bX === 0 || bX === SIZE-1) && (bY === 0 || bY === SIZE-1);
            
            // Приоритет юнитам на краях
            const aIsOnEdge = aX === 0 || aX === SIZE-1 || aY === 0 || aY === SIZE-1;
            const bIsOnEdge = bX === 0 || bX === SIZE-1 || bY === 0 || bY === SIZE-1;
            
            if (aIsInCorner && !bIsInCorner) return -1;
            if (!aIsInCorner && bIsInCorner) return 1;
            if (aIsOnEdge && !bIsOnEdge) return -1;
            if (!aIsOnEdge && bIsOnEdge) return 1;
            
            // Затем по скорости движения
            return TYPES[b[2].type].mv - TYPES[a[2].type].mv;
          });
          
          // Быстрая проверка - есть ли соседние непринадлежащие клетки, которые можно захватить
          for (const [unitX, unitY, unit] of playerUnits) {
            // Проверяем соседние клетки для немедленного захвата
            const nearbyCaptures = neigh(unitX, unitY).filter(([nx, ny]) => 
              !units[nx][ny] && terr[nx][ny] !== pl
            );
            
            if (nearbyCaptures.length > 0) {
              // Сортируем захваты, предпочитая вражеские территории нейтральным
              nearbyCaptures.sort(([ax, ay], [bx, by]) => {
                const aIsEnemy = terr[ax][ay] && terr[ax][ay] !== pl;
                const bIsEnemy = terr[bx][by] && terr[bx][by] !== pl;
                return bIsEnemy - aIsEnemy; // Вражеские территории в приоритете
              });
              
              const [moveToX, moveToY] = nearbyCaptures[0];
              console.log(`GOD MODE: Quick capture from [${unitX},${unitY}] to [${moveToX},${moveToY}]`);
              executeMove(unitX, unitY, moveToX, moveToY);
              actionPerformed = true;
              break;
            }
          }
          
          // Если нет быстрых захватов, ищем дальние захваты
          if (!actionPerformed) {
            console.log(`GOD MODE: No quick captures available, searching for distant captures`);
            
            // Сортируем юниты по скорости движения (сначала быстрые)
            for (const [unitX, unitY, unit] of playerUnits) {
              const moveRange = TYPES[unit.type].mv;
              console.log(`GOD MODE: Checking unit at [${unitX},${unitY}], type=${unit.type}, moveRange=${moveRange}`);
              
              // BFS для поиска нейтральных/вражеских территорий в радиусе движения
              const visited = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
              const queue = [[unitX, unitY, 0]]; // x, y, distance
              visited[unitX][unitY] = true;
              
              let bestTarget = null;
              
              while (queue.length > 0) {
                const [x, y, dist] = queue.shift();
                
                // Если нашли пустую клетку не нашей территории
                if (!units[x][y] && terr[x][y] !== pl && dist > 0) {
                  bestTarget = [x, y, dist];
                  console.log(`GOD MODE: Found potential target at [${x},${y}], distance=${dist}`);
                  break; // Берем первую найденную территорию для захвата
                }
                
                // Не выходим за пределы радиуса движения
                if (dist >= moveRange) continue;
                
                // Проверяем соседей
                for (const [nx, ny] of neigh(x, y)) {
                  if (!visited[nx][ny] && !units[nx][ny]) {
                    visited[nx][ny] = true;
                    queue.push([nx, ny, dist + 1]);
                  }
                }
              }
              
              // Если нашли цель для захвата
              if (bestTarget) {
                const [targetX, targetY, dist] = bestTarget;
                
                // Если цель в пределах одного хода
                if (dist <= moveRange) {
                  console.log(`GOD MODE: Executing move from [${unitX},${unitY}] to [${targetX},${targetY}], distance=${dist}`);
                  executeMove(unitX, unitY, targetX, targetY);
                  actionPerformed = true;
                  break;
                }
              }
            }
          }
          
          // ПРОБЛЕМА 3: Если все еще нет действия, пытаемся переместить юниты на пустые клетки своей территории
          // Это помогает разблокировать юниты, которые не могут двигаться
          if (!actionPerformed) {
            console.log(`GOD MODE: No captures available, trying to reposition units`);
            
            for (const [unitX, unitY, unit] of playerUnits) {
              // Ищем пустые соседние клетки (даже на своей территории)
              const emptyNeighbors = neigh(unitX, unitY).filter(([nx, ny]) => !units[nx][ny]);
              
              if (emptyNeighbors.length > 0) {
                // Предпочитаем клетки, которые ведут к центру карты
                emptyNeighbors.sort(([ax, ay], [bx, by]) => {
                  const aDistToCenter = Math.abs(ax - SIZE/2) + Math.abs(ay - SIZE/2);
                  const bDistToCenter = Math.abs(bx - SIZE/2) + Math.abs(by - SIZE/2);
                  return aDistToCenter - bDistToCenter; // Ближе к центру = лучше
                });
                
                const [moveToX, moveToY] = emptyNeighbors[0];
                console.log(`GOD MODE: Repositioning unit from [${unitX},${unitY}] to [${moveToX},${moveToY}]`);
                executeMove(unitX, unitY, moveToX, moveToY);
                actionPerformed = true;
                break;
              }
            }
          }
          
          // ШАГ 2: АТАКИ
          if (!actionPerformed) {
            console.log(`GOD MODE: No movement actions available, looking for attacks`);
            // Находим все возможные атаки
            const possibleAttacks = [];
            
            for (const [unitX, unitY, unit] of playerUnits) {
              // Проверяем соседние клетки на наличие противников
              for (const [nx, ny] of neigh(unitX, unitY)) {
                if (units[nx][ny] && units[nx][ny].pl !== pl) {
                  // Рассчитываем потенциальный урон
                  const damage = Math.max(1, TYPES[unit.type].dam - TYPES[units[nx][ny].type].arm);
                  const canKill = damage >= units[nx][ny].hp;
                  
                  possibleAttacks.push({
                    fromX: unitX,
                    fromY: unitY,
                    toX: nx,
                    toY: ny,
                    damage,
                    canKill,
                    priority: canKill ? 2 : 1 // Приоритет убийствам
                  });
                }
              }
            }
            
            // Сортируем атаки по приоритету
            possibleAttacks.sort((a, b) => b.priority - a.priority || b.damage - a.damage);
            
            if (possibleAttacks.length > 0) {
              const bestAttack = possibleAttacks[0];
              console.log(`GOD MODE: Executing attack from [${bestAttack.fromX},${bestAttack.fromY}] to [${bestAttack.toX},${bestAttack.toY}]`);
              executeAttack(bestAttack.fromX, bestAttack.fromY, bestAttack.toX, bestAttack.toY);
              actionPerformed = true;
            }
          }

          // ШАГ 3: ПОКУПКА ЮНИТОВ
          if (!actionPerformed) {
            // ПРОБЛЕМА 1: Покупка юнитов работает некорректно
            // Попытка купить самого дорогого доступного юнита
            const territoryCount = terr.flat().filter(t => t === pl).length;
            console.log(`GOD MODE: Player ${pl} has ${territoryCount} territories and ${res} resources`);
            
            // Проверяем наличие свободных клеток для размещения
            const hasFreeSpots = terr.some((row, i) => row.some((t, j) => t === pl && !units[i][j]));
            
            if (hasFreeSpots) {
              const availableTypes = Object.entries(TYPES)
                .filter(([_, data]) => {
                  return res >= data.cost && territoryCount >= data.unlock;
                })
                .sort((a, b) => b[1].cost - a[1].cost); // Сортировка от дорогих к дешевым
              
              if (availableTypes.length > 0) {
                console.log(`GOD MODE: Buying unit type ${availableTypes[0][0]}, cost=${availableTypes[0][1].cost}, available types=${availableTypes.length}`);
                // Важно: вызываем функцию buy с выбранным типом
                buy(availableTypes[0][0]); // Покупаем самый дорогой тип
                actionPerformed = true;
              }
            } else {
              console.log(`GOD MODE: No free spots for placement`);
            }
            
            // Если не можем купить или разместить юнит - завершаем ход
            if (!actionPerformed) {
              console.log(`GOD MODE: No actions available for player ${pl}, ending turn`);
              end();
            }
          }
        }, 500); // Задержка в 0.5 секунды для анимаций
      } else if (phase === 'placement') {
        // Для фазы начальной расстановки
        setTimeout(() => {
          // Размещаем рыцарей в стратегически выгодных позициях
          // Для player 1 - внизу карты, для player 2 - вверху
          const startRow = pl === 1 ? SIZE - INIT : 0;
          
          for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
              // Проверяем позицию согласно условиям расстановки
              const validZone = pl === 1 ? i >= SIZE - INIT : i < INIT;
              
              if (validZone && !units[i][j]) {
                // Размещаем рыцаря и заканчиваем ход
                handle(i, j);
                return;
              }
            }
          }
        }, 500);
      } else if (phase === 'placing') {
        // Размещение купленного юнита
        setTimeout(() => {
          // Ищем лучшую клетку для размещения
          // Оцениваем клетки по количеству свободных соседей и расстоянию до врага
          const availableSpots = [];
          
          for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
              if (!units[i][j] && terr[i][j] === pl) {
                // Оцениваем позицию
                let score = 0;
                
                // Бонус за каждую свободную соседнюю клетку
                const freeNeighbors = neigh(i, j).filter(([nx, ny]) => !units[nx][ny]);
                score += freeNeighbors.length;
                
                // Бонус за соседние вражеские территории (для атаки)
                const enemyNeighbors = neigh(i, j).filter(([nx, ny]) => 
                  terr[nx][ny] && terr[nx][ny] !== pl
                );
                score += enemyNeighbors.length * 2;
                
                // Бонус за соседние нейтральные территории (для захвата)
                const neutralNeighbors = neigh(i, j).filter(([nx, ny]) => 
                  !terr[nx][ny]
                );
                score += neutralNeighbors.length;
                
                // Центр карты более ценный
                const distanceToCenter = Math.abs(i - SIZE/2) + Math.abs(j - SIZE/2);
                score += (SIZE - distanceToCenter) / 3;
                
                availableSpots.push([i, j, score]);
              }
            }
          }
          
          // Сортируем по убыванию счета
          availableSpots.sort((a, b) => b[2] - a[2]);
          
          if (availableSpots.length > 0) {
            // Размещаем в лучшей позиции
            const [bestI, bestJ] = availableSpots[0];
            console.log(`GOD MODE: Placing unit at [${bestI},${bestJ}] with score ${availableSpots[0][2]}`);
            handle(bestI, bestJ);
          } else {
            // Если нет доступных позиций, отменяем размещение
            cancelPlacing();
          }
        }, 500);
      }
    }, [pl, turn, isGodMode, phase, win, units, terr, res]);

    // Обработчики событий
    function reset() {
      setIsGodMode(false);
      setIsAutoPlaying(false);
      localStorage.removeItem('battleGameState');
      window.location.reload();
    }

    function end() {
      setSel(null);
      setMoves([]);
      setAtt([]);
      setTurn(t => t + 1);
      setPl(p => p === 1 ? 2 : 1);
      setIsAutoPlaying(false);
      
      // В GOD MODE автоматически продолжаем игру
      console.log(`GOD MODE: Ход игрока ${pl} завершен, переход к следующему игроку ${pl === 1 ? 2 : 1}`);
      
      // Не нужно делать ничего, useEffect с зависимостью от pl автоматически
      // сработает для следующего игрока и продолжит GOD MODE
    }

    function cancelPlacing() {
      setPhase('game');
      setPlace(null);
      setHint(false);
    }

    function handle(i, j) {
      if (win) return;
      setError(null);
      // Расстановка
      if (phase === 'placement') {
        const zone = pl === 1 ? i < INIT : i >= SIZE - INIT;
        if (!units[i][j] && zone) {
          const u = units.map(r => r.slice());
          const t = terr.map(r => r.slice());
          const unitName = getRandomUnitName('KNIGHT');
          u[i][j] = { type: 'KNIGHT', pl, hp: TYPES.KNIGHT.hp, name: unitName };
          t[i][j] = pl;
          
          // Добавляем фразу размещения с именем
          const territory = getRandomTerritory();
          addNarrativeLog('move', { 
            knight: unitName, 
            enemy: "никого", 
            tile: territory,
            unitType: 'KNIGHT'  // Для начальной расстановки всегда рыцари
          });
          
          setUnits(u); setTerr(t); setPlaced(p => p + 1); 
          setHist(h => [...h, `K@${i},${j}`]); 
          setPl(3 - pl);
        }
        return;
      }
      
      // Размещение купленного юнита
      if (phase === 'placing') {
        if (!units[i][j] && terr[i][j] === pl) {
          const u = units.map(r => r.slice());
          const unitName = getRandomUnitName(place);
          u[i][j] = { type: place, pl, hp: TYPES[place].hp, name: unitName };
          
          // Добавляем фразу размещения с именем
          const territory = getRandomTerritory();
          addNarrativeLog('move', { 
            knight: unitName, 
            enemy: "никого", 
            tile: territory,
            unitType: place  // Передаем тип юнита
          });
          
          setUnits(u);
          setHist(h => [...h, `${place}@${i},${j}`]);
          setPhase('game');
          setHint(false);
          setPlace(null);
          end();
        }
        return;
      }
      
      // Основная игра
      if (phase === 'game') {
        if (sel) {
          if (moves.some(m => m[0] === i && m[1] === j)) {
            // Ход
            executeMove(sel.x, sel.y, i, j);
            return;
          }
          if (att.some(a => a[0] === i && a[1] === j)) {
            // Атака
            executeAttack(sel.x, sel.y, i, j);
            return;
          }
          setSel(null); setMoves([]); setAtt([]);
          return;
        }
        // Выбор своего юнита
        const cell = units[i][j];
        if (cell && cell.pl === pl) {
          // BFS для расчёта ходов
          const vis = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
          const q = [[i, j, 0]];
          vis[i][j] = true;
          const mv = [], at = [];
          while (q.length) {
            const [x, y, d] = q.shift();
            if (d > 0 && !units[x][y]) mv.push([x, y]);
            if (d === TYPES[cell.type].mv) continue;
            neigh(x, y).forEach(([nx, ny]) => {
              if (vis[nx][ny]) return;
              vis[nx][ny] = true;
              if (units[nx][ny] && units[nx][ny].pl !== pl) at.push([nx, ny]);
              // Для хиллера: добавляем союзников как цели для лечения (кроме самого себя)
              if (cell.type === 'HEALER' && units[nx][ny] && units[nx][ny].pl === pl && !(nx === i && ny === j)) at.push([nx, ny]);
              else q.push([nx, ny, d + 1]);
            });
          }
          setSel({ x: i, y: j }); setMoves(mv); setAtt(at);
        }
      }
    }

    // Исправленный autoPlay: если нельзя атаковать и двигаться, но можно купить юнита — покупает
    function autoPlay() {
      if (phase !== 'game' || win) return;
      setIsAutoPlaying(true);
      setSel(null);
      setMoves([]);
      setAtt([]);
      let attackPairs = [];
      units.forEach((row, i) => {
        row.forEach((unit, j) => {
          if (unit && unit.pl === pl) {
            neigh(i, j).forEach(([nx, ny]) => {
              if (units[nx][ny] && units[nx][ny].pl !== pl) {
                attackPairs.push({
                  from: [i, j],
                  to: [nx, ny],
                  power: TYPES[unit.type].dam
                });
              }
            });
          }
        });
      });
      if (attackPairs.length > 0) {
        attackPairs.sort((a, b) => b.power - a.power);
        const attack = attackPairs[0];
        handle(attack.from[0], attack.from[1]);
        setTimeout(() => {
          handle(attack.to[0], attack.to[1]);
          setIsAutoPlaying(false);
        }, 300);
        return;
      }
      let moveOptions = [];
      units.forEach((row, i) => {
        row.forEach((unit, j) => {
          if (unit && unit.pl === pl) {
            const vis = Array(SIZE).fill().map(() => Array(SIZE).fill(false));
            const q = [[i, j, 0]];
            vis[i][j] = true;
            while (q.length) {
              const [x, y, d] = q.shift();
              if (d > 0 && !units[x][y]) {
                moveOptions.push({
                  from: [i, j],
                  to: [x, y],
                  value: terr[x][y] !== pl ? 10 : 0,
                  distance: d
                });
              }
              if (d === TYPES[unit.type].mv) continue;
              neigh(x, y).forEach(([nx, ny]) => {
                if (!vis[nx][ny] && (!units[nx][ny] || units[nx][ny].pl !== pl)) {
                  vis[nx][ny] = true;
                  if (!units[nx][ny]) q.push([nx, ny, d + 1]);
                }
              });
            }
          }
        });
      });
      if (moveOptions.length > 0) {
        moveOptions.sort((a, b) => b.value - a.value || a.distance - b.distance);
        const move = moveOptions[0];
        handle(move.from[0], move.from[1]);
        setTimeout(() => {
          handle(move.to[0], move.to[1]);
          setIsAutoPlaying(false);
        }, 300);
        return;
      }
      // Попробовать купить юнита
      const hasFreeCells = terr.some((row, i) => row.some((t, j) => t === pl && !units[i][j]));
      if (hasFreeCells && !menu && !place) {
        const territoryCount = terr.flat().filter(t => t === pl).length;
        const availableTypes = Object.entries(TYPES)
          .filter(([k, v]) => v.cost <= res && territoryCount >= v.unlock)
          .sort((a, b) => b[1].cost - a[1].cost);
        if (availableTypes.length > 0) {
          buy(availableTypes[0][0]);
          setTimeout(() => setIsAutoPlaying(false), 300);
          return;
        }
      }
      end();
      setIsAutoPlaying(false);
    }

    // Рендер с улучшенными классами для кнопок
    return e('div', null,
      e(HUD, { pl, res, phase, turn, terr }),
      e(Grid, { units, terr, sel, moves, att, onCellClick: handle }),
      e(HeroCards),
      e('div', { className: 'controls' },
        phase === 'game' && e('button', { onClick: () => setMenu(true) }, 'Buy'),
        phase === 'game' && e('button', { onClick: end }, 'End Turn'),
        e('button', { 
          className: isGodMode ? 'god-mode-active' : '', 
          onClick: handleGodMode 
        }, isGodMode ? 'Выключить GOD MODE' : 'Включить GOD MODE'),
        e('button', { onClick: reset }, 'Reset'),
        e('button', { onClick: () => { localStorage.removeItem('battleGameState'); window.location.reload(); } }, '🗑️ Очистить сохранение')
      ),
      // Отображаем WarLog только если есть записи, показываем 10 последних
      warLog.length > 0 && e(WarLog, { logs: warLog.slice(-10).reverse() }),
      menu && e(BuyMenu, { terr, pl, res, onBuy: buy, onClose: () => setMenu(false) }),
      hint && e('div', { className: 'hint', role: 'alertdialog' },
        e('p', null, 'Щёлкните по своей территории, чтобы разместить юнита, или отмените.'),
        e('button', { onClick: cancelPlacing }, 'Отмена')
      ),
      error && e('div', { className: 'error-message' }, error),
      e(History, { hist }),
      win && e('div', { className: 'winner', role: 'alertdialog' },
        e('h2', null, typeof win === 'number' ? `Player ${win} wins` : 'Draw'),
        e('button', { onClick: reset }, 'Replay')
      )
    );
  }

  // Рендерим приложение
  ReactDOM.render(e(App), document.getElementById('root'));

  // Переключение правил
  document.getElementById('toggleRules').onclick = () =>
    document.getElementById('rules').classList.toggle('hidden');
})();
