import { tableData } from "../types";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addTableRow,
  deleteTableRow,
  fetchTables,
  updateTableRow,
} from "../redux/slices/tables";
import { AppDispatch, RootState } from "../redux/store";
import {
  DataGrid,
  GridColDef,
  GridDeleteIcon,
  GridRowId,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Button, IconButton, TextField } from "@mui/material";
import { useForm } from "react-hook-form";

function Table() {
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const { tables, isFetching } = useSelector(
    (state: RootState) => state.tables,
  );
  const dispatch: AppDispatch = useDispatch();
  const token = localStorage.getItem("x-auth");

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchTables(token));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  console.log(isFetching);
  const columns: GridColDef[] = [
    {
      field: "documentName",
      headerName: "Document Name",
      width: 300,
      editable: true,
    },
    {
      field: "documentType",
      headerName: "Document Type",
      width: 200,
      editable: true,
    },
    {
      field: "documentStatus",
      headerName: "Status",
      width: 150,
      editable: true,
    },
    {
      field: "employeeNumber",
      headerName: "Employee Number",
      width: 150,
      editable: true,
    },
    {
      field: "employeeSignatureName",
      headerName: "Employee Signature",
      width: 200,
      editable: true,
    },
    {
      field: "companySignatureName",
      headerName: "Company Signature",
      width: 200,
      editable: true,
    },
    {
      field: "employeeSigDate",
      headerName: "Employee Sig Date",
      width: 200,
      editable: true,
    },
    {
      field: "companySigDate",
      headerName: "Company Sig Date",
      width: 200,
      editable: true,
    },
    {
      field: "Delete",
      headerName: "Delete",
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="secondary"
          onClick={() => handleDelete(params.id)} // Передаем идентификатор строки
        >
          <GridDeleteIcon />
        </IconButton>
      ),
    },
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<tableData>({
    defaultValues: {},
    mode: "onChange",
  });

  const handleRowUpdate = async (newRow: tableData) => {
    setLoadingUpdate(true);
    try {
      await dispatch(updateTableRow(newRow));
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
    } finally {
      setLoadingUpdate(false);
    }

    return newRow;
  };

  const onSubmit = async (values: tableData) => {
    setLoadingAdd(true);
    try {
      const employeeSigDate = new Date().toISOString();
      const companySigDate = new Date().toISOString();
      const newValues = {
        ...values,
        employeeSigDate,
        companySigDate,
      };
      await dispatch(addTableRow(newValues));
      reset();
    } catch (error) {
      console.error("Oшибка добавления данных:", error);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDelete = async (id: GridRowId) => {
    setLoadingDelete(true);
    try {
      await dispatch(deleteTableRow(id.toString()));
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "820px" }}>
      <Box sx={{ position: "relative", height: "100%" }}>
        <DataGrid
          disableColumnSorting
          disableColumnFilter
          disableColumnSelector
          hideFooterSelectedRowCount
          processRowUpdate={handleRowUpdate}
          hideFooter
          hideFooterPagination
          disableDensitySelector
          disableColumnMenu
          columns={columns}
          loading={
            isFetching === "loading" ||
            loadingAdd ||
            loadingDelete ||
            loadingUpdate
          }
          rows={tables?.data || []}
          slotProps={{
            loadingOverlay: {
              variant: "skeleton",
              noRowsVariant: "skeleton",
            },
          }}
        />
        {(loadingAdd || loadingDelete || loadingUpdate) && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 10,
            }}
          ></Box>
        )}
      </Box>

      <Box
        className="sticky bottom-0 z-10 flex justify-between"
        onSubmit={handleSubmit(onSubmit)}
        component="form"
      >
        <TextField
          {...register("documentName", { required: "Обязательное поле" })}
          error={Boolean(errors.documentName?.message)}
          id="outlined-error"
          label="Document Name"
          size="small"
        />
        <TextField
          {...register("documentType", { required: "Обязательное поле" })}
          error={Boolean(errors.documentType?.message)}
          size="small"
          label="Document Type"
        />
        <TextField
          {...register("documentStatus", { required: "Обязательное поле" })}
          error={Boolean(errors.documentStatus?.message)}
          size="small"
          label="Document Status"
        />
        <TextField
          {...register("employeeNumber", { required: "Обязательное поле" })}
          error={Boolean(errors.employeeNumber?.message)}
          size="small"
          label="Employee Number"
        />
        <TextField
          {...register("employeeSignatureName", {
            required: "Обязательное поле",
          })}
          error={Boolean(errors.employeeSignatureName?.message)}
          size="small"
          label="Employee Signature"
        />
        <TextField
          {...register("companySignatureName", {
            required: "Обязательное поле",
          })}
          error={Boolean(errors.companySignatureName?.message)}
          size="small"
          label="Company Signature"
        />
        <Button type="submit" className="w-32 h-9" variant="contained">
          Добавить
        </Button>
      </Box>
    </Box>
  );
}
export default Table;
