import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Grid,
  Modal,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import react from "react";
import Categoria from "../Components/categoria/Categoria.tsx";
import Table from "../Components/table/table.tsx";
import DatePicker from "../Components/dataPicker/dataPicker.tsx";
import axios from "axios";
import Pagamento from "../Components/pagamento/pagamento.tsx";
import { Bounce, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
import Grafico from "../Components/grafico/grafico.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

interface IConta {
  id: number;
  descricao: string;
  valor: number;
  tipo: string;
  dataLancamento: Date;
  categoriaId: number;
  forma_pagamento_id: number;
  vencimento: Date;
}

interface ICategoria {
  id: number;
  nome: string;
}

const PlanejamentoContas: React.FC = () => {
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<number | undefined>(undefined);
  const [input, setInput] = useState<string>("");
  const [total, setTotal] = useState<number>(0);
  const [totalMesAtual, setTotalMesAtual] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedPagamentoId, setSelectedPagamentoId] = useState<number | null>(
    null
  );
  const [selectedConta, setSelectedConta] = useState<IConta | null>(null);
  const [open, setOpen] = useState(false);
  const [abrirModalEditar, setAbrirModalEditar] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id);
  };
  const handleDateSelect = (date: Date | null) => {
    setDataSelecionada(date);
  };
  const adicionarConta = async (): Promise<void> => {
    await axios.post("http://localhost:5085/api/conta", {
      descricao: descricao,
      valor: valor,
      categoriaId: selectedCategoryId,
      vencimento: dataSelecionada,
      vencida: false,
    });
    somarContas();
    toast.success("Conta adicionada com sucesso!", {
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

  const handlePagamentoSelect = (id: number) => {
    setSelectedPagamentoId(id);
  };

  const handleOpenModal = (conta: IConta) => {
    setSelectedConta(conta);
    setOpen(true);
  };

  const handleAbrirModalEditar = (conta: IConta) => {
    setSelectedConta(conta);
    setAbrirModalEditar(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedConta(null);
  };

  const fecharModalEditar = () => {
    setAbrirModalEditar(false);
    setSelectedConta(null);
  };

  const getCategoriaNome = (categoriaId: number) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nome : "Categoria não encontrada";
  };

  const atualizarConta = async (conta: IConta) => {
    try {
      const response = await fetch(`/api/contas/${conta.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(conta),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao atualizar conta");
      }
  
      const dadosAtualizados = await response.json();
      return dadosAtualizados;
    } catch (erro) {
      console.error(erro);
      alert("Erro ao atualizar a conta.");
      return null;
    }
  };
  

  const confirmarPagamento = async (conta: IConta) => {
    try {
      const response = await axios.put(
        `http://localhost:5085/api/conta/${conta.id}`,
        {
          ...conta,
          forma_pagamento_id: selectedPagamentoId,
          dataLancamento: new Date().toISOString(),
        }
      );

      if (response.status === 200) {
        somarContas();
        toast.success("Pagamento confirmado com sucesso!", {
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
        return response.data;
      } else {
        toast.error("Error ao confirmar pagamento!", {
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
      }
    } catch (error) {
      toast.error("Error ao confirmar pagamento!", {
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
    }
  };

  const somarContas = async (): Promise<void> => {
    try {
      const response = await axios.get("http://localhost:5085/api/conta");
      const contasSemTipo = response.data.filter(
        (conta: IConta) => !conta.dataLancamento
      );
      const somaContas = contasSemTipo.reduce(
        (total: number, conta: IConta) => total + conta.valor,
        0
      );
      const mesAtual = new Date().getMonth();
      const anoAtual = new Date().getFullYear();
      const contasNoMesAtual = response.data.filter((conta: IConta) => {
        const dataVencimento = new Date(conta.vencimento);
        return (
          !conta.dataLancamento &&
          dataVencimento.getMonth() === mesAtual &&
          dataVencimento.getFullYear() === anoAtual
        );
      });
      const somaContasNoMesAtual = contasNoMesAtual.reduce(
        (total: number, conta: IConta) => total + conta.valor,
        0
      );
      setTotal(somaContas);
      setTotalMesAtual(somaContasNoMesAtual);
    } catch (error) {
      console.error("Erro ao calcular as contas sem tipo:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    somarContas();
  }, []);

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Contas a Vencer Total</Typography>
              <Typography variant="h4" color="green">
                <FontAwesomeIcon icon={faArrowUp} color="green" size="1x" />
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Contas a Vencer no mês atual</Typography>
              <Typography variant="h4" color="red">
                <FontAwesomeIcon icon={faArrowDown} color="red" size="1x" />
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(totalMesAtual)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grafico isPlanejamentoContas={true} />
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
              value={input}
              onChange={handleChange}
            />
            <FormControl></FormControl>
            <Categoria onCategorySelect={handleCategorySelect} />
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

      <Table
        dashboard={false}
        planejamentoContas={true}
        openModal={handleOpenModal}
        onDataChange={somarContas}
        abrirModalEditar={handleAbrirModalEditar}
      />

      <Modal open={open} onClose={handleCloseModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Pagar Conta
          </Typography>
          {selectedConta && (
            <>
              <Typography>
                <strong>Descrição:</strong> {selectedConta.descricao}
              </Typography>
              <Typography>
                <strong>Valor:</strong>{" "}
                {new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(selectedConta.valor)}
              </Typography>
              <Pagamento onPagamentoSelect={handlePagamentoSelect} />
              <Typography>
                <strong>Data de Hoje:</strong>{" "}
                {new Date().toLocaleDateString("pt-BR")}
              </Typography>
            </>
          )}
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                if (selectedConta) {
                  const contaAtualizada = await confirmarPagamento(
                    selectedConta
                  );

                  if (contaAtualizada) {
                    setSelectedConta((prevConta) =>
                      prevConta && prevConta.id === contaAtualizada.id
                        ? contaAtualizada
                        : prevConta
                    );
                    setOpen(false);
                  }
                }
              }}
            >
              Confirmar Pagamento
            </Button>
          </Box>
        </Box>
      </Modal>

      <Modal open={abrirModalEditar} onClose={fecharModalEditar}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Editar Conta
          </Typography>
          {selectedConta && (
            <>
              <Typography>
                <strong>Descrição:</strong>
              </Typography>
              <TextField
                id="descricao"
                variant="standard"
                value={selectedConta.descricao}
                onChange={(e) =>
                  setSelectedConta(
                    (prev) => prev && { ...prev, descricao: e.target.value }
                  )
                }
              />
              <Typography>
                <strong>Valor:</strong>{" "}
              </Typography>
              <TextField
                id="valor"
                variant="standard"
                value={selectedConta.valor}
                onChange={(e) =>
                  setSelectedConta(
                    (prev) =>
                      prev && { ...prev, valor: parseFloat(e.target.value) }
                  )
                }
              />
              <Pagamento
                onPagamentoSelect={(pagamento) =>
                  setSelectedConta((prev) => prev && { ...prev, pagamento })
                }
              />
              <Typography>
                <strong>Categoria:</strong>{" "}
                <Categoria
                  onCategorySelect={(categoria) =>
                    setSelectedConta((prev) => prev && { ...prev, categoria })
                  }
                />
              </Typography>
              <Typography>
                <strong>Data de Vencimento:</strong>
              </Typography>
              <TextField
                id="dataVencimento"
                type="date"
                variant="standard"
                value={
                  selectedConta.vencimento
                    ? new Date(selectedConta.vencimento).toISOString().split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setSelectedConta((prev) =>
                    prev
                      ? {
                          ...prev,
                          dvencimento: new Date(e.target.value).toISOString(),
                        }
                      : null
                  )
                }
              />              
            </>
          )}

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={async () => {
                if (selectedConta) {
                  const contaAtualizada = await confirmarPagamento(
                    selectedConta
                  );

                  if (contaAtualizada) {
                    setSelectedConta((prevConta) =>
                      prevConta && prevConta.id === contaAtualizada.id
                        ? contaAtualizada
                        : prevConta
                    );
                    setOpen(false);
                  }
                }
              }}
            >
              Editar
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PlanejamentoContas;
