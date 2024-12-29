import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

interface IPagamento {
 id:number;
 descricao: string;
}

interface PagamentoSelectProps {
  onPagamentoSelect: (id: number) => void;
}

const Categoria: React.FC<PagamentoSelectProps> = ({ onPagamentoSelect }) => {
  const [selectedPagamento, setSelectedPagamento] = useState<IPagamento | null>(null); // Agora é uma string ao invés de array
  const [pagamentos, setPagamentos] = useState<IPagamento[]>([]);

  const listarCategorias = async (): Promise<void> => {
    const response = await axios.get<IPagamento[]>('http://localhost:5085/api/pagamentos');
    setPagamentos(response.data);
  }

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);
    const pagamento = pagamentos.find((cat) => cat.id === selectedId) || null;
    setSelectedPagamento(pagamento);
    onPagamentoSelect(selectedId);
  };

  useEffect(() => {
    listarCategorias();
  })

  return (
    <div>
      <Select
        value={selectedPagamento?.id || ''}
        onChange={handleChange}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Forma de Pagamento
        </MenuItem>
        {pagamentos.map((pagamento) => (
          <MenuItem key={pagamento.id} value={pagamento.id}>
            {pagamento.descricao}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default Categoria;
