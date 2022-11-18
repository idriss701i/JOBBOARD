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

export default function ManageJobs() {

    const [jobs, setJobs] = React.useState([]);
    const [jobInModal, setJobInModal] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        getJobs();
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

    const getJobs = async () => {  
        axios.get('http://localhost:3001/jobs/get-jobs', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            console.log(response.data.jobs);
            setJobs(response.data.jobs);
        });
    }
    
    const editJob = (job) => {
        setJobInModal(job);
        handleOpen();
    }

    const onClickEdit = () => {
        console.log(jobInModal);
        axios.patch('http://localhost:3001/jobs/update-job/' + jobInModal._id, {jobInModal, company: jobInModal.company, status: jobInModal.status, date: date}, {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            getJobs();
            handleClose();
        });
    }

    const deleteJob = (id) => {
        console.log(id);
        axios.delete('http://localhost:3001/jobs/delete-job/' + id, {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            if (response.data.deletedJob) {
                getJobs();
            }
        });
    }

    const getRecruiter = (id) => {
        console.log(id);
        axios.get('http://localhost:3001/users/get-one-user/' + id, {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            console.log(response.data.user);
            return response.data.user.firstName + ' ' + response.data.user.lastname;
        });
    }

    const StyledTitle = styled.h1`
        color: black;
        font-weight: 700;
        text-align: center;
        margin: 0;
        padding: 0;
        margin-bottom: 40px;
    `

    
    return (
        <div style={{ paddingLeft: 20, paddingRight: 20}}>
            <StyledTitle>Gérer mes emplois</StyledTitle>
            <Modal        
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <TextField 
                        value={jobInModal.name}  
                        style={{ marginBottom: 20 }}
                        onChange={(e) => setJobInModal({...jobInModal, name: e.target.value})}
                    />
                    {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Date de fin"
                            inputFormat='DD/MM/YYYY'
                            value={date}
                            onChange={(newValue) => {
                                setDate(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider> */}
                    <TextField 
                        value={jobInModal.description}
                        style={{ marginBottom: 20 }}
                        onChange={(e) => setJobInModal({...jobInModal, description: e.target.value})}
                    />
                    <TextField
                        value={jobInModal.shortDescription}
                        style={{marginBottom: 20}}
                        onChange={(e) => setJobInModal({...jobInModal, shortDescription: e.target.value})}
                    />
                    <TextField
                        value={jobInModal.salary}
                        style={{marginBottom: 20}}
                        onChange={(e) => setJobInModal({...jobInModal, salary: e.target.value})}
                    />
                    <br />
                    <Button style={{ marginTop: 20 }} onClick={() => onClickEdit()}  variant="contained">Modifier</Button>
                </Box>
            </Modal>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Poste</TableCell>
                            <TableCell align="center">Entreprise</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {jobs !== null && jobs.length > 0 ? jobs.map((job) => (
                            <TableRow key={job._id}>
                                <TableCell component="th" scope="row">
                                    {job.name}
                                </TableCell>
                                <TableCell align="center">{job.company.name}</TableCell>
                                <TableCell align="center">{'Actif'}</TableCell>
                                <TableCell align="center">
                                    <Button variant="contained" style={{ marginRight: 20 }} color="primary" onClick={() => {editJob(job)}}>Modifier</Button>
                                    <Button variant="contained" color="secondary" onClick={() => {deleteJob(job._id)}}>Supprimer</Button>
                                </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={5}>Aucune Offre</TableCell></TableRow>}
                    </TableBody>    
                </Table>
            </TableContainer>
        </div>
    )
}
