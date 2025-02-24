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

interface IGraficoProps {
  isPlanejamentoContas?: boolean;
}

const processarDados = (dados: any[]): { receitas: number[]; despesas: number[]; semTipo: number[]; meses: string[] } => {
  const receitasPorMes: Record<string, number> = {};
  const despesasPorMes: Record<string, number> = {};
  const semTipoPorMes: Record<string, number> = {};
  dados.forEach((item) => {
    const mes = new Date(item.dataLancamento).toLocaleString('pt-BR', { month: 'long' });
    const mesVencimento = new Date(item.vencimento).toLocaleString('pt-BR', { month: 'long' });
    if (item.tipo === 'entrada') {
      receitasPorMes[mes] = (receitasPorMes[mes] || 0) + item.valor;
    } else if (item.tipo === 'saída') {
      despesasPorMes[mes] = (despesasPorMes[mes] || 0) + item.valor;
    } else {
      semTipoPorMes[mesVencimento] = (semTipoPorMes[mesVencimento] || 0) + item.valor;
    }
  });

  const meses = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  let receitas, despesas, semTipo;

if (semTipoPorMes.length > 0) {
  receitas = meses.map((mesVencimento) => receitasPorMes[mesVencimento] || 0);
  despesas = meses.map((mesVencimento) => despesasPorMes[mesVencimento] || 0);
  semTipo = meses.map((mesVencimento) => semTipoPorMes[mesVencimento] || 0);
} else {
  receitas = meses.map((mes) => receitasPorMes[mes] || 0);
  despesas = meses.map((mes) => despesasPorMes[mes] || 0);
  semTipo = meses.map((mes) => semTipoPorMes[mes] || 0);
}
  return { receitas, despesas, semTipo, meses };
};

const Grafico: React.FC<IGraficoProps> = ({ isPlanejamentoContas }) => {
  const [dataGrafico, setDataGrafico] = useState<GraficoData | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
        try {
          const response = await axios.get('http://localhost:5085/api/conta');
          let dados = response.data;

          if (isPlanejamentoContas){
            dados = dados.filter((item: any) => !item.dataLancamento)
          }

          const { receitas, despesas, semTipo, meses } = processarDados(dados);
      
          setDataGrafico({
            labels: meses,
            datasets: isPlanejamentoContas
                ?
                [
                  {
                    label: 'Contas a Vencer',
                    data: semTipo,
                    backgroundColor: 'rgba(199, 230, 25, 0.5)',
                  },
                ] : 
                [
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
      {isPlanejamentoContas ? <h2>Gráfico de Contas a Vencer</h2> : <h2>Gráfico de Receitas e Despesas</h2>}
      
      {dataGrafico ? <Bar data={dataGrafico} width={400} height={100} /> : <p>Carregando...</p>}
    </div>
  );
};

export default Grafico;
