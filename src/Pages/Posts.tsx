import { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Table from "../components/Table";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function Posts() {
  const navigate = useNavigate();
  const token = localStorage.getItem("x-auth");

  const handleLogOut = () => {
    localStorage.removeItem("x-auth");
    navigate("/login");
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <Box sx={{ flexGrow: 1, height: "100vh" }}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MainPage
          </Typography>
          <Button onClick={handleLogOut} color="inherit">
            Log out asfdas
          </Button>
        </Toolbar>
      </AppBar>
      <Table />
    </Box>
  );
}

export default Posts;
