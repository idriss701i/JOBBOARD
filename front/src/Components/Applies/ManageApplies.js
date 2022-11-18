import React, {useEffect} from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import axios from 'axios';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Dayjs } from 'dayjs';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormLabel } from '@mui/material';
import styled from 'styled-components';
import { Form } from 'react-bootstrap';

function ManageApplies() {

    const [applies, setApplies] = React.useState([]);
    const [applyInModal, setApplyInModal] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [selectedRecruiter, setSelectedRecruiter] = React.useState('');
    const [users, setUsers] = React.useState('');

    useEffect(() => {
        getApplies();
        getUsers();
    }, [])
    
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        textAlign: 'center'
    };
    
    const getApplies = async () => {
        axios.get('http://localhost:3001/applies/get-applies', { headers: {Authorization: 'Bearer ' + localStorage.getItem('token')} })
        .then((response) => {
            console.log(response.data.applies);
            setApplies(response.data.applies);
        });
    }

    const getUsers = async () => {
        axios.get('http://localhost:3001/users/all-users', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            setUsers(response.data.users);
        });
    }

    const editApply = (apply) => {
        setApplyInModal(apply);
        handleOpen();
    }

    const deleteApply = (id) => {
        console.log(id);
    }

    return (
        <div>
            <Modal>
                <Box sx={style}>
                    <Typography variant="h6" component="div" gutterBottom>
                        Modifier une candidature
                    </Typography>
                    <Form.Select className='mt-2' aria-label="Default select example" onChange={(e) => {
                                    setSelectedRecruiter(e.target.value); console.log(selectedRecruiter)
                                }}>
                                    <option>Sélectionner un candidat</option>
                                    {users.length > 0 ? users.map((user, index) => {
                                        return (
                                            <option key={index} value={user._id}>{user.email}</option>
                                        )
                                    }) : null}
                                </Form.Select>
                    <Button variant="contained" style={{ marginTop: '20px' }}>Modifier</Button>
                </Box>
            </Modal>
            <h1>Manage Applies</h1>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Titre</TableCell>
                                <TableCell>Entreprise</TableCell>
                                <TableCell>Candidat</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {applies.map((apply, index) => (
                                <TableRow key={index}>
                                    <TableCell>{apply.job.name}</TableCell>
                                    <TableCell>{apply.companyName}</TableCell>
                                    <TableCell>{apply.candidate.firstName}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => {editApply(apply)}}>Edit</Button>
                                        <Button variant="contained" color="secondary" onClick={() => {deleteApply(apply._id)}}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
    )
}

export default ManageApplies