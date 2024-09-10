import Typography from "@mui/material/Typography";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { useForm } from "react-hook-form";
import { USER } from "../types";
import { fetchLogin } from "../redux/slices/auth";
import { AppDispatch, RootState } from "../redux/store";
import CircularProgress from "@mui/material/CircularProgress";

function Login() {
  const { user, isFetching } = useSelector((state: RootState) => state.login);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<USER>({
    defaultValues: {},
    mode: "onChange",
  });

  const onSubmit = async (values: USER): Promise<void> => {
    try {
      const res = await dispatch(fetchLogin(values));

      if (fetchLogin.fulfilled.match(res)) {
        const { token } = res.payload.data || {};

        if (token) {
          localStorage.setItem("x-auth", token);
          navigate("/");
        }
      } else {
        console.log("Ошибка авторизации");
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <Paper className="w-[400px] p-[50px] border border-red-500  my-[10%] mx-auto">
      <Typography className="text-center text-bold mb-[30px]" variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          className="mb-[20px]"
          label="Username"
          error={Boolean(errors.username?.message)}
          helperText={errors.username?.message}
          {...register("username", { required: "Укажите ник" })}
          fullWidth
        />
        <TextField
          className="mb-[20px]"
          label="Пароль"
          type="password"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message}
          {...register("password", { required: "Укажите пароль" })}
          fullWidth
        />

        <p className="text-red-500 text-center text-xl">{user?.error_text}</p>

        {isFetching === "loading" && <CircularProgress className="ml-[40%] " />}
        <Button
          disabled={!isValid}
          type="submit"
          size="large"
          variant="contained"
          fullWidth
        >
          Войти
        </Button>
      </form>
    </Paper>
  );
}
export default Login;
