import { Box, Container, Stack } from "@mui/material";
import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { UserTable } from "../UserTable/UserTable";

function applyPagination(documents: any, page: any, rowsPerPage: any) {
  return documents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}

const Users = () => {
  const privateAxios = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dataToShow, setDataToShow] = useState([]);
  const queryClient = useQueryClient();
  const { data = [] } = useQuery(["users"], async () => {
    try {
      const result = await privateAxios.get("/users");
      setDataToShow(applyPagination(result.data, page, rowsPerPage));
      return result.data;
    } catch (err) {
      console.log(err);
      navigate("/login", { state: { from: location } });
    }
  });

  const createUserMutation = useMutation(
    async (user: any) => {
      try {
        const result = await privateAxios.put("/users/verify", { user });
        return result.data;
      } catch (err) {
        console.log(err);
      }
    },
    {
      onSuccess: (user: any) => {
        queryClient.setQueryData(["users"], (old: any) => {
          const newUsers = [...old].filter((x) => x.email !== user.email);
          const newData = [...newUsers, user];
          setDataToShow(applyPagination(newData, page, rowsPerPage));
          return newData;
        });
        //   queryClient.invalidateQueries(["users"]);
      },
    }
  );

  const onApprove = async (user: any) => {
    const u = { ...user, verified: true };
    createUserMutation.mutate(u);
  };

  const handlePageChange = (event: any, value: any) => {
    setPage(value);
    setDataToShow(applyPagination(data, value, rowsPerPage));
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(event.target.value);
    setDataToShow(applyPagination(data, page, event.target.value));
  };

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            {/* <CustomersSearch /> */}
            <UserTable
              count={data.length}
              items={dataToShow}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              onApprove={onApprove}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Users;
