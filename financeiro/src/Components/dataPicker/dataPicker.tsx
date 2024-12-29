import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface IDatePickerProps {
  onDateSelect: (date: Date | null) => void;
}

const DataPicker: React.FC<IDatePickerProps> = ({ onDateSelect }) => {
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);

  const handleChange = (date: Date | null) => {
    setDataSelecionada(date);
    onDateSelect(date);
  };

  useEffect(() => {
    if (dataSelecionada) {
      onDateSelect(dataSelecionada);
    }
  }, [dataSelecionada, onDateSelect]);

  return (
    <div>
      <DatePicker
        selected={dataSelecionada}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        placeholderText="Escolha uma data"
      />
    </div>
  );
};

export default DataPicker;
