import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Finanças Pessoais
        </Typography>
        <Box>
          <Button component={Link} to="/" color="inherit" sx={{ marginRight: 1 }}>
            Dashboard
          </Button>
          <Button component={Link} to="/planejamento-contas" color="inherit" sx={{ marginRight: 1 }}>
            Planejamento de Contas
          </Button>
          <Button color="inherit" sx={{ marginRight: 1 }}>
            Configurações
          </Button>
          <Button color="inherit">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
