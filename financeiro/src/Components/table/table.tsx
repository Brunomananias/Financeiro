import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
} from "@mui/material";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";

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
interface IPagamento {
  id: number;
  descricao: string;
}

interface ITabelaProps {
  dashboard: boolean;
  planejamentoContas: boolean;
  openModal: (conta: IConta) => void;
}

const Tabela: React.FC<ITabelaProps> = ({ dashboard, planejamentoContas, openModal }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [contas, setContas] = useState<IConta[]>([]);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [formaPagamento, setFormaPagamento] = useState<IPagamento[]>([]);
  const [open, setOpen] = useState(false);

  const listarContas = async (): Promise<void> => {
    const response = await axios.get<IConta[]>(
      "http://localhost:5085/api/conta"
    );
    setContas(response.data);
  };

  const listarCategorias = async (): Promise<void> => {
    const response = await axios.get<ICategoria[]>(
      "http://localhost:5085/api/categoria"
    );
    setCategorias(response.data);
  };

  const listarPagamentos = async (): Promise<void> => {
    const response = await axios.get<IPagamento[]>(
      "http://localhost:5085/api/pagamentos"
    );
    setFormaPagamento(response.data);
  };
  // Função para controlar a mudança de página
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Função para controlar a mudança de linhas por página
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Resetar para a primeira página
  };

  const getCategoriaNome = (categoriaId: number) => {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nome : "Categoria não encontrada";
  };

  const getDescricaoPagamento = (formaPagamentoId: number) => {
    const pagamento = formaPagamento.find((c) => c.id === formaPagamentoId);
    return pagamento
      ? pagamento.descricao
      : "forma de pagamento não encontrada";
  };

  const handleOpenModal = (conta: any) => {
    setOpen(true);
  };

  useEffect(() => {
    listarContas();
    listarPagamentos();
    listarCategorias();
  }, [contas]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Descrição</strong>
            </TableCell>
            <TableCell>
              <strong>Valor</strong>
            </TableCell>
            <TableCell>
              <strong>Categoria</strong>
            </TableCell>
            {!dashboard && (
              <TableCell>
                <strong>Vencimento</strong>
              </TableCell>
            )}
            {dashboard && (
              <>
                <TableCell>
                  <strong>Data</strong>
                </TableCell>
                <TableCell>
                  <strong>Forma de Pagamento</strong>
                </TableCell>
                <TableCell>
                  <strong>Tipo</strong>
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {contas
            .filter((row) =>
              dashboard ? row.dataLancamento : !row.dataLancamento
            ) // Filtra com base no tipo de página
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.descricao}</TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(row.valor)}
                </TableCell>
                <TableCell>{getCategoriaNome(row.categoriaId)}</TableCell>
                {!dashboard && (
                  <>
                  <TableCell>
                    {new Date(row.vencimento).toLocaleDateString("pt-BR")}
                    {new Date(row.vencimento).toLocaleDateString("pt-BR") ===
                      new Date().toLocaleDateString("pt-BR") && (
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        color="orange"
                        style={{ marginLeft: "8px" }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openModal(row)}
                  >
                    Pagar
                  </Button>
                </TableCell>
                </>
                )}
                {dashboard && row.dataLancamento && (
                  <>
                    <TableCell>
                      {new Date(row.dataLancamento).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      {getDescricaoPagamento(row.forma_pagamento_id)}
                    </TableCell>
                    <TableCell>
                      {row.tipo === "entrada" ? (
                        <FontAwesomeIcon icon={faArrowUp} color="green" />
                      ) : (
                        <FontAwesomeIcon icon={faArrowDown} color="red" />
                      )}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={
          contas.filter((row) =>
            dashboard ? row.dataLancamento : !row.dataLancamento
          ).length
        } // Atualiza a contagem com base no filtro
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default Tabela;