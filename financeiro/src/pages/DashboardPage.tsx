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
import {
  faArrowUp,
  faArrowDown,
  faCoins,
  faMoneyBillWave,
  faBalanceScale,
  faWallet,
  faHandHoldingDollar,
} from "@fortawesome/free-solid-svg-icons";
import Pagamento from "../Components/pagamento/pagamento.tsx";
import { Bounce, toast } from "react-toastify";
import apiClient from "../services/apiClient.tsx";

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
  const [idUsuario, setIdUsuario] = useState(0);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [receita, setReceita] = useState<number>(0);
  const [despesas, setDespesas] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<number | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [isEntrada, setIsEntrada] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedPagamentoId, setSelectedPagamentoId] = useState<number | null>(
    null
  );
  const [fornecedorIdSelecionado, setFornecedorIdSelecionado] = useState<
    number | null
  >(null);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEntrada(event.target.value === "entrada");
  };
  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id);
  };
  const handleFornecedorSelect = (id: number) => {
    setFornecedorIdSelecionado(id);
  };
  const handlePagamentoSelect = (id: number) => {
    setSelectedPagamentoId(id);
  };
  const handleDateSelect = (date: Date | null) => {
    setDataSelecionada(date);
    console.log(date);
  };
  const somarReceitas = async (): Promise<void> => {
    try {
      const response = await apiClient.get("/api/conta");
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
    await apiClient.post("/api/conta", {
      descricao: descricao,
      valor: valor,
      tipo: isEntrada ? "entrada" : "saída",
      dataLancamento: dataSelecionada,
      categoriaId: selectedCategoryId,
      forma_pagamento_id: selectedPagamentoId,
      usuarioId: idUsuario
    });
    somarReceitas();
    toast.success("Conta adicionada!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleValor = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = inputValue.replace(/[^0-9,\.]/g, "");
    setInput(formattedValue);
    const numericValue = parseFloat(formattedValue.replace(",", "."));
    if (!isNaN(numericValue)) {
      setValor(numericValue);
    } else {
      setValor(undefined);
    }
  };

  useEffect(() => {
    somarReceitas();
  });

  return (
    <Box>
      <Box sx={{ padding: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ backgroundColor: "green", color: "white", borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Receitas
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FontAwesomeIcon icon={faCoins} />
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(receita)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ backgroundColor: "red", color: "white", borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Despesas
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <FontAwesomeIcon icon={faHandHoldingDollar} />
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(despesas)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{ backgroundColor: "blue", color: "white", borderRadius: 2 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total
                </Typography>
                <Typography
                  variant="h4"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: total >= 0 ? "lightgreen" : "lightcoral",
                  }}
                >                  
                  <FontAwesomeIcon icon={faBalanceScale} />
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(total)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grafico isPlanejamentoContas={false} />
      </Box>

      <Card>
      <CardContent>
        <Typography variant="h6">Cadastrar Conta</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={2}>
            <TextField
              label="Descrição"
              variant="outlined"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={8} sm={4} md={1}>
            <TextField
              label="Valor"
              variant="outlined"
              value={input}
              onChange={handleValor}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4} md={1}>
            <FormControl>
              <RadioGroup value={isEntrada ? "entrada" : "saida"} onChange={handleChange} row>
                <FormControlLabel value="entrada" control={<Radio />} label="Entrada" />
                <FormControlLabel value="saida" control={<Radio />} label="Saída" />
              </RadioGroup>
            </FormControl>
          </Grid>
          <Grid item xs={8} sm={6} md={2}>
            <Categoria onCategorySelect={handleCategorySelect} />
          </Grid>
          <Grid item xs={8} sm={6} md={2}>
            <Pagamento onPagamentoSelect={handlePagamentoSelect} />
          </Grid>
          <Grid item xs={12} sm={6} md={1}>
            <DatePicker onDateSelect={handleDateSelect} />
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={adicionarConta}
              variant="contained"
              color="primary"
              fullWidth
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>

      <Table
        dashboard={true}
        planejamentoContas={false}
        openModal={handleCloseModal}
      />
    </Box>
  );
};

export default Dashboard;
