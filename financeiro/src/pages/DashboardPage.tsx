/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControlLabel,
  Radio,
  Button,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Categoria from "../Components/categoria/Categoria.tsx";
import Table from "../Components/table/table.tsx";
import Grafico from "../Components/grafico/grafico.tsx";
import DatePicker from "../Components/dataPicker/dataPicker.tsx";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import Pagamento from "../Components/pagamento/pagamento.tsx";
// Configuração do Chart.js

interface IConta {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  dataLancamento: Date;
  categoriaId: number;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [receita, setReceita] = useState<number>(0);
  const [despesas, setDespesas] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [isEntrada, setIsEntrada] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedPagamentoId, setSelectedPagamentoId] = useState<number | null>(
    null
  );
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEntrada(event.target.value === "entrada");
  };
  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id); // Atualiza o ID da categoria selecionada
  };
  const handlePagamentoSelect = (id: number) => {
    setSelectedPagamentoId(id); // Atualiza o ID da categoria selecionada
  };
  const handleDateSelect = (date: Date | null) => {
    setDataSelecionada(date); // Atualiza o estado com a data selecionada
    console.log(date); // Aqui você pode fazer o que quiser com a data selecionada
  };
  const somarReceitas = async (): Promise<void> => {
    try {
      const response = await axios.get("http://localhost:5085/api/conta");
      const receitas = response.data.filter(
        (conta: IConta) => conta.tipo === "entrada"
      );
      const despesas = response.data.filter(
        (conta: IConta) => conta.tipo === "saída"
      );
      const somaReceitas = receitas.reduce(
        (total: number, conta: IConta) => total + conta.valor,
        0
      );
      const somaDespesas = despesas.reduce(
        (total: number, conta: IConta) => total + conta.valor,
        0
      );
      const total = somaReceitas - somaDespesas;
      setReceita(somaReceitas);
      setDespesas(somaDespesas);
      setTotal(total);
    } catch (error) {
      console.error("Erro ao calcular as receitas:", error);
    }
  };

  const adicionarConta = async (): Promise<void> => {
    await axios.post("http://localhost:5085/api/conta", {
      descricao: descricao,
      valor: valor,
      tipo: isEntrada ? "entrada" : "saída",
      dataLancamento: dataSelecionada,
      categoriaId: selectedCategoryId,
      forma_pagamento_id: selectedPagamentoId,
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    somarReceitas();
  });

  return (
    <Box>
      <Box sx={{ padding: 3 }}>
        {/* Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Receitas</Typography>
                <Typography variant="h4" color="green">
                  <FontAwesomeIcon icon={faArrowUp} color="green" size="1x" />
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(receita)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Despesas</Typography>
                <Typography variant="h4" color="red">
                  <FontAwesomeIcon icon={faArrowDown} color="red" size="1x" />
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(despesas)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h4" color="blue">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(total)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Gráfico */}
        <Box sx={{ marginTop: 4, marginBottom: 40, height: 400 }}>
          <Grafico />
        </Box>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6">Cadastrar conta</Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TextField
              id="outlined-basic"
              label="Descrição"
              variant="outlined"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Valor"
              variant="outlined"
              value={valor}
              onChange={(e) =>
                setValor(Number(e.target.value.replace(",", ".")))
              }
            />
            <FormControl>
              <RadioGroup
                value={isEntrada ? "entrada" : "saida"}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="entrada"
                  control={<Radio />}
                  label="Entrada"
                />
                <FormControlLabel
                  value="saida"
                  control={<Radio />}
                  label="Saída"
                />
              </RadioGroup>
            </FormControl>
            <Categoria onCategorySelect={handleCategorySelect} />
            <Pagamento onPagamentoSelect={handlePagamentoSelect} />
            <DatePicker onDateSelect={handleDateSelect} />
            <Button
              onClick={adicionarConta}
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 2,
                padding: "10px 20px",
                fontWeight: "bold",
                boxShadow: 3,
                "&:hover": {
                  backgroundColor: "#1976d2",
                  boxShadow: 6,
                },
              }}
            >
              Adicionar Conta
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Table dashboard={true} planejamentoContas={false} openModal={handleCloseModal}/>
    </Box>
  );
};

export default Dashboard;
