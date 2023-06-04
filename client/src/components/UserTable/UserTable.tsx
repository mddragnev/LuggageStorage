import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

export const UserTable = (props: any) => {
  const {
    count = 0,
    items = [],
    onPageChange = () => {},
    onRowsPerPageChange,
    onApprove,
    page = 0,
    rowsPerPage = 0,
  } = props;

  return (
    <Card>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Име</TableCell>
              <TableCell>Фамилия</TableCell>
              <TableCell>Имейл</TableCell>
              <TableCell>Телефон</TableCell>
              <TableCell>Роля</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((customer: any) => {
              return (
                <TableRow hover key={customer.email}>
                  <TableCell>{customer.firstName}</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.role}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={async () => await onApprove(customer)}
                      disabled={
                        customer.role !== "partner" || customer.verified
                      }
                    >
                      <HowToRegIcon />
                    </IconButton>
                    <IconButton
                      disabled={
                        customer.role !== "partner" || customer.verified
                      }
                    >
                      <PersonRemoveIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

export default UserTable;
