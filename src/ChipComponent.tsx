


// ChipComponent.tsx
import React, { useState, useRef, useEffect, KeyboardEvent, ChangeEvent, MouseEvent } from 'react';
import './ChipComponent.css';

interface Chip {
  id: number;
  label: string;
  image: string; 
}

const ChipComponent: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [filteredItems, setFilteredItems] = useState<Chip[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Chip[] = [
    { id: 1, label: 'Nick Giannopoulos', image: '/images/download.png' },
    { id: 2, label: 'John Doe', image:  '/images/download.png' },
    { id: 3, label: 'Jane Doe', image:  '/images/download.png' },
    { id: 4, label: 'Alice', image:  '/images/download.png' },
    { id: 5, label: 'Bob', image:  '/images/download.png' },
  ];

  useEffect(() => {
     setFilteredItems(filteredItems.filter(item => !chips.some(chip => chip.label === item.label)));
  }, [chips, items]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);

    setFilteredItems(prevItems => {
      return items.filter(item => item.label.toLowerCase().includes(value.toLowerCase()));
    });

    setHighlightedIndex(-1); // Reset highlighted index when input changes
  };

  const handleItemClick = (item: Chip) => {
    const newChip: Chip = { id: chips.length + 1, label: item.label, image: item.image };
    setChips([...chips, newChip]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleChipRemove = (chipId: number) => {
    const updatedChips = chips.filter(chip => chip.id !== chipId);
    setChips(updatedChips);
    setFilteredItems(items);
    setFilteredItems(prevItems => {
      return items.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase()));
    });
  };

  const handleClicks = (event: MouseEvent<HTMLInputElement>) => {
      setFilteredItems(items);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && inputValue === '' && chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      handleChipRemove(lastChip.id);

    }

    if (event.key === 'ArrowUp' && highlightedIndex > 0) {
      setHighlightedIndex(prevIndex => prevIndex - 1);
    }

    if (event.key === 'ArrowDown' && highlightedIndex < filteredItems.length - 1) {
      setHighlightedIndex(prevIndex => prevIndex + 1);
    }

    if (event.key === 'Enter' && highlightedIndex !== -1) {
      handleItemClick(filteredItems[highlightedIndex]);
    }
  };

  return (
    <div className="chip-container">
      <div className="chip-input">
        {chips.map(chip => (
          <div key={chip.id} className="chip">
            <img src={chip.image} alt={chip.label} className="chip-image" />
            {chip.label}
            <button onClick={() => handleChipRemove(chip.id)}>X</button>
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onClick={handleClicks}
          placeholder="Type here..."
        />
      </div>
      <ul className="item-list">
        {filteredItems.map((item, index) => (
          <li
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={index === highlightedIndex ? 'highlighted' : ''}
          >
            <img src={item.image} alt={item.label} className="list-item-image" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChipComponent;
