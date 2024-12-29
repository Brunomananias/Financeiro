import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  Modal,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import react from "react";
import Categoria from "../Components/categoria/Categoria.tsx";
import Table from "../Components/table/table.tsx";
import DatePicker from "../Components/dataPicker/dataPicker.tsx";
import axios from "axios";
import Pagamento from "../Components/pagamento/pagamento.tsx";

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

const PlanejamentoContas: React.FC = () => {
  const [descricao, setDescricao] = useState<string>("");
  const [valor, setValor] = useState<number>(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedPagamentoId, setSelectedPagamentoId] = useState<number | null>(
      null
    );
  const [selectedConta, setSelectedConta] = useState<IConta | null>(null);
  const [open, setOpen] = useState(false);
  const [dataSelecionada, setDataSelecionada] = useState<Date | null>(null);
  const handleCategorySelect = (id: number) => {
    setSelectedCategoryId(id);
  };
  const handleDateSelect = (date: Date | null) => {
    setDataSelecionada(date);
    console.log(date);
  };
  const adicionarConta = async (): Promise<void> => {
    await axios.post("http://localhost:5085/api/conta", {
      descricao: descricao,
      valor: valor,
      categoriaId: selectedCategoryId,
      vencimento: dataSelecionada,
      vencida: false,
    });
  };

  const handlePagamentoSelect = (id: number) => {
    setSelectedPagamentoId(id);
  };

  const handleOpenModal = (conta: IConta) => {
    setSelectedConta(conta);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedConta(null);
  };

  const confirmarPagamento = async (conta: IConta) => {
    try {
        console.log(selectedPagamentoId);
      const response = await axios.put(`http://localhost:5085/api/conta/${conta.id}`, {
        ...conta,
        forma_pagamento_id: selectedPagamentoId,
        dataLancamento: new Date().toISOString(),
      });

      if (response.status === 200) {
        alert("Pagamento confirmado com sucesso!");
        return response.data;
      } else {
        alert("Erro ao confirmar pagamento.");
      }
    } catch (error) {
      console.error("Erro ao confirmar pagamento:", error);
      alert("Erro ao confirmar pagamento.");
    }
  };
  return (
    <>
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
                    // Atualiza a lista de contas no estado
                    setSelectedConta((prevConta) => 
                        prevConta && prevConta.id === contaAtualizada.id ? contaAtualizada : prevConta
                    );
                    setOpen(false); // Fecha o modal
                  }
                }
              }}
            >
              Confirmar Pagamento
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default PlanejamentoContas;
