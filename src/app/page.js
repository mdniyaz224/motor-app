"use client";
import React, { useState, useEffect } from "react";
import { Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Typography } from "@mui/material";
import TableComponent from '../components/tabel'; // Import the TableComponent

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
console.log(inputText,"inputText");
  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedData = parseInput(inputText);
console.log(parsedData,"parsedData");

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
      } else {
        console.error("Server Error:", result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
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
          // Call fetchData() to refresh the list from the server
      fetchData();
      } else {
        console.error("Server Error:", result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
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
        console.error("Error fetching data:", await response.json());
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };


  const parseInput = (input) => {
    const parsedData = {};
    // Split by ", " but keep ": " as the key-value separator
    const keyValuePairs = input.split(/,\s*(?=[^:]*:)/);
    console.log(keyValuePairs, "keyValuePairs"); // Log the key-value pairs for debugging
  
    // Improved key-value matching pattern to handle inconsistent spaces
    const keyValuePattern = /([^:]+):\s*(.*)/;
    
    keyValuePairs.forEach((pair) => {
      const match = keyValuePattern.exec(pair.trim());
      if (match) {
        const key = match[1].trim();  // Trim key for consistency
        const value = match[2]
          ? match[2].trim().replace(/,,/g, ",").replace(/,+/g, ",")
          : "";
  
        // Check for header matches, ignoring spaces and punctuation differences
        const matchedHeader = tableHeaders.find(
          (header) =>
            header.label.toLowerCase().replace(/[\s.]/g, "") ===
            key.toLowerCase().replace(/[\s.]/g, "")
        );
  
        if (matchedHeader) {
          parsedData[matchedHeader.key] = value;
        } else {
          console.log(`No match found for key: ${key}`); // Log when no match is found
        }
      } else {
        console.log(`Failed to parse pair: ${pair}`); // Log unparseable pairs
      }
    });
    return parsedData;
  };
  
  const handleEdit = async (index) => {
    setEditIndex(index); // Set the index for the item being edited
    try {
      const response = await fetch(`/api/data/${index}`); // Fetch data by ID

      if (response.ok) {
        const result = await response.json();
             console.log(result,"result");
             
        // Convert the fetched data back into the inputText format
        const prefilledText = Object.entries(result)
          .filter(([key, value]) => key !== '_id') // Exclude _id from the fields
          .map(([key, value]) => `${tableHeaders.find(header => header.key === key)?.label}: ${value}`)
          .join(", ");

        // Set the input text to the fetched document details
        setInputText(prefilledText);
      } else {
        const errorResponse = await response.json();
        console.error("Error fetching data for edit:", errorResponse.message);
      }
    } catch (error) {
      console.error("Network error while fetching data for edit:", error);
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
           // Call fetchData() to refresh the list from the server
      fetchData();
      } else {
        const result = await response.json();
        console.error("Server Error:", result.message);
      }
    } catch (error) {
      console.error("Network Error:", error);
    }
  };

  return (
    <Box sx={{ p: 4,}}>
    <Card sx={{p:2 ,backgroundColor:'#edf4f5'}}>
      <CardContent>
      <Typography variant="h4" gutterBottom>
        Data Entry Form
      </Typography>
      <Box component="form" onSubmit={handleSubmit} >
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
      <Card  sx={{backgroundColor:'#edf4f5'}}>
        <CardContent sx={{mt:1}}>
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
    </Box>
  );
}

export default DataEntryAndDisplay;
