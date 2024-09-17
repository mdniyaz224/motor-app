import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  TextField,
  Box,
} from "@mui/material";

const TableComponent = ({ data, tableHeaders, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const filteredData = data
  .filter((entry) => {
    // Filter by name if search term is provided
    if (searchTerm) {
      return entry.customerName
        ?.toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    }
    return true; // If no search term is provided, return all entries
  })
  .filter((entry) => {
    // Filter by the selected date if a date is picked
    if (selectedDate) {
      const entryDate = new Date(entry.date)?.toISOString().split("T")[0]; // Replace 'date' with the actual date field in your data
      return entryDate === selectedDate;
    }
    return true; // If no date is selected, return all entries
  });


  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      {/* Search and Date Filters */}
      <Box sx={{ display: "flex", justifyContent: "", mb: 2 }}>
        <Box>
          <TextField
            label="Search"
            variant="outlined"
            placeholder="Search by Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ mr: 2, width: "400px" }}
          />
        </Box>
        <Box>
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ width: "200px" }}
          />
        </Box>
      </Box>

      {/* Data Table */}
      <TableContainer component={Paper}>
        <Table sx={{backgroundColor:'#edf4f5'}}>
          <TableHead sx={{background:'black',}}>
            <TableRow sx={{ textWrap: "nowrap", }}>
              {tableHeaders.map((header) => (
                <TableCell key={header.key} sx={{color:'white'}}>
                  <strong>{header.label}</strong>
                </TableCell>
              ))}
              <TableCell key="actions" sx={{color:'white'}}>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((entry, index) => (
              <TableRow key={index}>
                {tableHeaders.map((header) => (
                  <TableCell key={header.key}>{entry[header.key]}</TableCell>
                ))}
                <TableCell>
                  <Box display='flex'>
                  <Button
                    onClick={() => onEdit(entry._id)}
                    variant="outlined"
                    color="primary"
                  >
                   <EditIcon />
                  </Button>
                  <Button
                    onClick={() => onDelete(entry._id)}
                    variant="outlined"
                    color="secondary"
                    sx={{ ml: 1 }}
                  >
                   <DeleteIcon />
                  </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default TableComponent;
