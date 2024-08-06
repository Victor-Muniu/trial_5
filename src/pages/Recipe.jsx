import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

function Recipe() {
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentRecipeId, setCurrentRecipeId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        raw_materials: [''],
        quantity: [''],
        unit_price: ['']
    });

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('https://hotel-backend-1-trhj.onrender.com/receipes');
                setData(response.data);
            } catch (error) {
                console.error('There was a problem with axios operation:', error);
            }
        };
        getData();
    }, []);

    const handleClickOpen = (recipe = null) => {
        if (recipe) {
            setFormData({
                name: recipe.name,
                raw_materials: recipe.raw_materials,
                quantity: recipe.quantity,
                unit_price: recipe.unit_price
            });
            setCurrentRecipeId(recipe._id);
            setIsEdit(true);
        } else {
            setFormData({
                name: '',
                raw_materials: [''],
                quantity: [''],
                unit_price: ['']
            });
            setIsEdit(false);
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (index, event, field) => {
        const values = [...formData[field]];
        values[index] = event.target.value;
        setFormData({ ...formData, [field]: values });
    };

    const handleAddField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const handleRemoveField = (index, field) => {
        const values = [...formData[field]];
        values.splice(index, 1);
        setFormData({ ...formData, [field]: values });
    };

    const handleAddRecipe = async () => {
        const formattedData = {
            name: formData.name,
            raw_materials: formData.raw_materials.filter(item => item !== ''),
            quantity: formData.quantity.filter(item => item !== ''),
            unit_price: formData.unit_price.filter(item => item !== ''),
        };

        try {
            let response;
            if (isEdit && currentRecipeId) {
                // Patch request to update the recipe
                response = await axios.patch(`https://hotel-backend-1-trhj.onrender.com/receipes/${currentRecipeId}`, formattedData);
                setData(data.map(recipe => recipe._id === currentRecipeId ? response.data : recipe));
            } else {
                // Post request to add a new recipe
                response = await axios.post('https://hotel-backend-1-trhj.onrender.com/receipes', formattedData);
                setData([...data, response.data]);
            }
            handleClose();
        } catch (error) {
            console.error('Error adding or updating recipe:', error);
        }
    };

    const handleDeleteRecipe = async (id) => {
        try {
            await axios.delete(`https://hotel-backend-1-trhj.onrender.com/receipes/${id}`);
            setData(data.filter(recipe => recipe._id !== id));
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    };

    const filteredData = data.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <TextField
                label="Search Products"
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                margin="normal"
            />

            <Button variant="contained" color="primary" onClick={() => handleClickOpen()}>
                Add New Recipe
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{isEdit ? "Edit Recipe" : "Add Recipe"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Recipe Name"
                        type="text"
                        fullWidth
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    {formData.raw_materials.map((material, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                margin="dense"
                                label={`Raw Material ${index + 1}`}
                                type="text"
                                value={material}
                                onChange={(e) => handleChange(index, e, 'raw_materials')}
                                fullWidth
                            />
                            <Button onClick={() => handleRemoveField(index, 'raw_materials')}>Remove</Button>
                        </div>
                    ))}
                    <Button onClick={() => handleAddField('raw_materials')}>Add Raw Material</Button>

                    {formData.quantity.map((qty, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                margin="dense"
                                label={`Quantity ${index + 1}`}
                                type="number"
                                value={qty}
                                onChange={(e) => handleChange(index, e, 'quantity')}
                                fullWidth
                            />
                            <Button onClick={() => handleRemoveField(index, 'quantity')}>Remove</Button>
                        </div>
                    ))}
                    <Button onClick={() => handleAddField('quantity')}>Add Quantity</Button>

                    {formData.unit_price.map((price, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                            <TextField
                                margin="dense"
                                label={`Unit Price ${index + 1}`}
                                type="number"
                                value={price}
                                onChange={(e) => handleChange(index, e, 'unit_price')}
                                fullWidth
                            />
                            <Button onClick={() => handleRemoveField(index, 'unit_price')}>Remove</Button>
                        </div>
                    ))}
                    <Button onClick={() => handleAddField('unit_price')}>Add Unit Price</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddRecipe} color="primary">
                        {isEdit ? "Update" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Raw Materials</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Unit Price</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.map(recipe => (
                            <TableRow key={recipe._id}>
                                <TableCell>{recipe.name}</TableCell>
                                <TableCell>
                                    {recipe.raw_materials.map((material, index) => (
                                        <div key={index}>
                                            <Typography>{material}</Typography>
                                            {index < recipe.raw_materials.length - 1 && <Divider />}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    {recipe.quantity.map((qty, index) => (
                                        <div key={index}>
                                            <Typography>{qty}</Typography>
                                            {index < recipe.quantity.length - 1 && <Divider />}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>
                                    {recipe.unit_price.map((price, index) => (
                                        <div key={index}>
                                            <Typography>{price}</Typography>
                                            {index < recipe.unit_price.length - 1 && <Divider />}
                                        </div>
                                    ))}
                                </TableCell>
                                <TableCell>{recipe.total[0]}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary" onClick={() => handleClickOpen(recipe)} style={{ marginRight: '8px' }}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDeleteRecipe(recipe._id)} style={{ marginRight: '8px' }}>
                                        Delete
                                    </Button>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Recipe;
