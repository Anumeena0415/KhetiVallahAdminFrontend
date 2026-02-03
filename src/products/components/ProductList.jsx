import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  TableContainer,
  Paper,
  Stack
  
} from "@mui/material";

import { useEffect, useState } from "react";
import { useProducts } from "../../api/product";

export default function ProductList() {
  const dummyPendingData = [
  {
	_id: "dummy1",
	name: "Organic Tomatoes",
	vendor: { businessName: "AgroFresh Farms" },
	store: { name: "Fresh Mart Store 1" },
	category: "Vegetables",
	pricing: { mrp: 80, salePrice: 65 },
	approval: { status: "PENDING" },
	image: "https://via.placeholder.com/80x80?text=Tomato",
  },
  {
	_id: "dummy2",
	name: "Basmati Rice",
	vendor: { businessName: "Golden Grain Agro" },
	store: { name: "Grain House" },
	category: "Grocery",
	pricing: { mrp: 150, salePrice: 130 },
	approval: { status: "PENDING" },
	image: "https://via.placeholder.com/80x80?text=Rice",
  },
  {
	_id: "dummy3",
	name: "Alphonso Mangoes",
	vendor: { businessName: "Fruit Valley Co" },
	store: { name: "Fruit Hub" },
	category: "Fruits",
	pricing: { mrp: 300, salePrice: 260 },
	approval: { status: "Approved" },
	image: "https://via.placeholder.com/80x80?text=Mango",
  },
];

  const {
	products,
	setProducts,
	fetchProductsByStatus,
  } = useProducts();

useEffect(() => {
  fetchProductsByStatus("APPROVED").then((data) => {
	if (!data || data.length === 0) {
	  setProducts(dummyPendingData);
	}
  });
}, [fetchProductsByStatus]);




  return (
	<Box p={2}>
	  <Typography variant="h6" mb={2}>
		Products List
	  </Typography>
<TableContainer component={Paper}>
  <Table>
	<TableHead>
	  <TableRow>
		<TableCell>Product Name</TableCell>
		 <TableCell>Image</TableCell>

		<TableCell>Vendor</TableCell>
		<TableCell>Store</TableCell>
		<TableCell>Category</TableCell>
		<TableCell>Pricing</TableCell>
		<TableCell>Actions</TableCell>
	  </TableRow>
	</TableHead>

	<TableBody>
	  {products.map(p => {
		const isDummy = p._id.startsWith("dummy");
		return (
		  <TableRow key={p._id}>
			<TableCell>{p.name}</TableCell>
			<TableCell>
			  <img
				src={p.image || placeholderImg}
				width="60"
				height="60"
				style={{ borderRadius: 6 }}
			  />
			</TableCell>
			<TableCell>{p.vendor?.businessName}</TableCell>
			<TableCell>{p.store?.name}</TableCell>
			<TableCell>{p.category}</TableCell>
			<TableCell>
			  ₹{p.pricing?.salePrice} / ₹{p.pricing?.mrp}
			</TableCell>

			<TableCell>
			  <Stack direction="row" spacing={1}>
				<Button
				  variant="outlined"
				  size="small"
				  onClick={() => onView(p)}
				>
				  View
				</Button>
			  </Stack>
			</TableCell>
		  </TableRow>
		);
	  })}
	</TableBody>
  </Table>
</TableContainer>

	
	</Box>
  );
}
