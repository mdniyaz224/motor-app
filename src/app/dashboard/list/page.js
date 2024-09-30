"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material";
import TableComponent from '../../../components/tabel'; // Import the TableComponent
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const tableHeaders = [
  { label: "File Number", key: "fileNumber" },
  { label: "Customer Name", key: "customerName" },
  { label: "Customer Contact No", key: "customerContactNo" },
  { label: "Location on map", key: "locationOnMap" },
  { label: "Veh No", key: "vehNo" },
  { label: "Benefit", key: "benefit" },
  { label: "Reason", key: "reason" },
  { label: "Location", key: "location" },
  { label: "Near to", key: "nearTo" },
  { label: "Car Model", key: "carModel" },
  { label: "Car Color", key: "carColor" },
  { label: "Repairing Dealer", key: "repairingDealer" },
  { label: "Date", key: "date" },
];

function DataEntryAndDisplay() {
  const [inputText, setInputText] = useState("");
  const [data, setData] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedData = parseInput(inputText);
    if (editIndex === -1) {
      handleCreate(parsedData);
    } else {
      handleUpdate(editIndex, parsedData);
    }
  };

  // Create a new entry
  const handleCreate = async (parsedData) => {
    try {
      const response = await fetch("/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });
      const result = await response.json();

      if (response.ok) {
        setData([...data, { _id: result._id, data: inputText, ...parsedData }]);
        setInputText("");
        toast.success("Data successfully added!");
      } else {
        toast.error(`Server Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Network Error! Please try again.");
    }
  };

  // Update an existing entry
  const handleUpdate = async (index, parsedData) => {
    try {
      const response = await fetch(`/api/data/${index}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });
      const result = await response.json();

      if (response.ok) {
        const updatedData = [...data];
        updatedData[index] = { _id: index, data: inputText, ...parsedData };
        setData(updatedData);
        setInputText("");
        setEditIndex(-1);
        fetchData();
        toast.success("Data successfully updated!");
      } else {
        toast.error(`Server Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("Network Error! Please try again.");
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component is mounted
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/data");
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        toast.error("Error fetching data!");
      }
    } catch (error) {
      toast.error("Network error!");
    }
  };

  const parseInput = (input) => {
    const parsedData = {};
    const keyValuePairs = input.split(/,\s*(?=[^:]*:)/);
    const keyValuePattern = /([^:]+):\s*(.*)/;
    
    keyValuePairs.forEach((pair) => {
      const match = keyValuePattern.exec(pair.trim());
      if (match) {
        const key = match[1].trim();
        const value = match[2] ? match[2].trim().replace(/,,/g, ",").replace(/,+/g, ",") : "";
        const matchedHeader = tableHeaders.find(
          (header) => header.label.toLowerCase().replace(/[\s.]/g, "") === key.toLowerCase().replace(/[\s.]/g, "")
        );
        if (matchedHeader) {
          parsedData[matchedHeader.key] = value;
        }
      }
    });
    return parsedData;
  };

  const handleEdit = async (index) => {
    setEditIndex(index); 
    try {
      const response = await fetch(`/api/data/${index}`);
      if (response.ok) {
        const result = await response.json();
        const prefilledText = Object.entries(result)
          .filter(([key, value]) => key !== '_id')
          .map(([key, value]) => `${tableHeaders.find(header => header.key === key)?.label}: ${value}`)
          .join(", ");
        setInputText(prefilledText);
      } else {
        toast.error("Error fetching data for edit!");
      }
    } catch (error) {
      toast.error("Network error while fetching data for edit!");
    }
  };

  const handleDelete = async (_id) => {
    try {
      const response = await fetch(`/api/data/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setData(data.filter((item) => item._id !== _id));
        fetchData();
        toast.success("Data successfully deleted!");
      } else {
        toast.error("Server Error during delete!");
      }
    } catch (error) {
      toast.error("Network Error during delete!");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ p: 2, backgroundColor: '#edf4f5' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Data Entry Form
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Enter formatted text"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              sx={{ mb: 2 }}
            />
            <CardActions>
              <Button type="submit" variant="contained" color="primary">
                {editIndex === -1 ? "Submit" : "Update"}
              </Button>
            </CardActions>
          </Box>
        </CardContent>
      </Card>

      <Box mt={5}>
        <Card sx={{ backgroundColor: '#edf4f5' }}>
          <CardContent sx={{ mt: 1 }}>
            <Typography variant="h5" gutterBottom>
              Data Table
            </Typography>
            <TableComponent
              data={data}
              tableHeaders={tableHeaders}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </CardContent>
        </Card>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default DataEntryAndDisplay;
DataEntryAndDisplay.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

