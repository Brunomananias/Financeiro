import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import React from 'react';

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

interface GraficoData {
  labels: string[];
  datasets: Dataset[];
}

// Função para formatar e agrupar os dados
const processarDados = (dados: any[]): { receitas: number[]; despesas: number[]; meses: string[] } => {
  const receitasPorMes: Record<string, number> = {};
  const despesasPorMes: Record<string, number> = {};

  dados.forEach((item) => {
    const mes = new Date(item.dataLancamento).toLocaleString('pt-BR', { month: 'long' });
    console.log(mes);
    if (item.tipo === 'entrada') {
      receitasPorMes[mes] = (receitasPorMes[mes] || 0) + item.valor;
    } else if (item.tipo === 'saída') {
      despesasPorMes[mes] = (despesasPorMes[mes] || 0) + item.valor;
    }
  });

  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const receitas = meses.map((mes) => receitasPorMes[mes] || 0);
  const despesas = meses.map((mes) => despesasPorMes[mes] || 0);
  
  return { receitas, despesas, meses };
};

const Grafico = () => {
  const [dataGrafico, setDataGrafico] = useState<GraficoData | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
        try {
          const response = await axios.get('http://localhost:5085/api/conta');
      
          // A resposta correta estará dentro de response.data
          const dados = response.data;
          const { receitas, despesas, meses } = processarDados(dados);
      
          setDataGrafico({
            labels: meses,
            datasets: [
              {
                label: 'Receitas',
                data: receitas,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
              },
              {
                label: 'Despesas',
                data: despesas,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
            ],
          });
        } catch (error) {
          console.error('Erro ao carregar os dados:', error);
        }
      };

    carregarDados();
  }, []);

  return (
    <div>
      <h2>Gráfico de Receitas e Despesas</h2>
      {dataGrafico ? <Bar data={dataGrafico} /> : <p>Carregando...</p>}
    </div>
  );
};

export default Grafico;
