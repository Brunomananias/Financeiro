import React, { useEffect, useState } from 'react';
import { Box, MenuItem, Select, InputLabel, FormControl, Checkbox, ListItemText, SelectChangeEvent } from '@mui/material';
import axios from 'axios';

interface ICategoria {
 id:number;
 nome: string;
}

interface CategoriaSelectProps {
  onCategorySelect: (id: number) => void;
}

const Categoria: React.FC<CategoriaSelectProps> = ({ onCategorySelect }) => {
  const [selectedCategory, setSelectedCategory] = useState<ICategoria | null>(null); // Agora é uma string ao invés de array
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  const listarCategorias = async (): Promise<void> => {
    const response = await axios.get<ICategoria[]>('http://localhost:5085/api/categoria');
    setCategorias(response.data);
  }

  const handleChange = (event: SelectChangeEvent<number>) => {
    const selectedId = Number(event.target.value);
    const categoria = categorias.find((cat) => cat.id === selectedId) || null;
    setSelectedCategory(categoria);
    onCategorySelect(selectedId);
  };

  useEffect(() => {
    listarCategorias();
  })

  return (
    <div>
      <Select
        value={selectedCategory?.id || ''}
        onChange={handleChange}
        displayEmpty
      >
        <MenuItem value="" disabled>
          Selecione uma categoria
        </MenuItem>
        {categorias.map((categoria) => (
          <MenuItem key={categoria.id} value={categoria.id}>
            {categoria.nome}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default Categoria;
