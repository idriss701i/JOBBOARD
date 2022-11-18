import axios from 'axios';
import React, { useEffect } from 'react'
import { Row } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Alert, Modal } from '@mui/material';
import { TextField } from '@mui/material';
import jwt_decode from 'jwt-decode';

function Home() { 

    const [jobs, setJobs] = React.useState([]);
    const [loaded, setLoaded] = React.useState(false);
    const [learnMore, setLearnMore] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState('');
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [jobInModal, setJobInModal] = React.useState({});
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [city, setCity] = React.useState('');
    const [zip, setZip] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [alert, setAlert] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [userID, setUserID] = React.useState(localStorage.getItem('token') == null ? '' : jwt_decode(localStorage.getItem('token')).id);

    const StyledSection1 = styled.div`
        width: 100vw;
        height: 89.9vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #673ab7;
        flex-direction: column;
    `

    const StyledSection2 = styled.div`
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        flex-direction: column;
    `

    const StyledTitle = styled.h1`
        color: white;
        font-weight: 900;
        text-align: center;
        margin: 0;
        padding: 0;
        margin-bottom: 40px;
        padding-left: 10px;
        padding-right: 10px;
    `

    const StyledButton = styled.button`
        background-color: #673ab7;
        color: white;
        border: 1px solid white;
        border-radius: 5px;
        padding: 10px 20px;
        font-size: 1.2rem;
        font-weight: 900;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        &:hover {
            background-color: white;
            color: #673ab7;
        }
    `

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
        textAlign: 'center', 
        display: 'flex',
        flexDirection: 'column',
    };

    useEffect(() => {
        if (!loaded) {
            allJobs();
        }
    }, [loaded])

    const thisJob = (job) => {
        setJobInModal(job);
        handleOpen();
    }
    

    const allJobs = async () => {
        axios.get('http://localhost:3001/jobs/get-all-jobs', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            setJobs(response.data.jobs);
            setLoaded(true);
        });
    }

    const seeDescription = (id) => {
        console.log(id);
        setLearnMore(id);
    }

    const sendApply = async () => {

        if (localStorage.getItem('token') === null) {
            await axios.post('http://localhost:3001/users/register', {
                firstName: firstName,
                lastName: lastName,
                email: email,
                phone: phone,
                address: address,
                city: city,
                zip: zip,
                message: message,
                job: jobInModal._id,
                nonAccount: true,
                password: "password", 
                dob: new Date()
            })
            .then(async (response) => {
                console.log(response.data);
                if(response.data.msg === 'Utilisateur déjà existant, veuillez utiliser une autre adresse électronique'){
                    console.log('Utilisateur déjà existant, veuillez utiliser une autre adresse électronique');
                    setMsg('Vous possédez un compte, veuillez vous connecter à celui-ci pour postuler à cette offre et postuler à d\'autres offres.');
                    setAlert('error');
                }
                else if(response.data.msg === 'Successful'){
                    setMsg('Votre candidature a été transmise !');
                    setAlert('success');
                    setUserID(response.data.user._id)
                    apply(response.data.user._id);
                    setTimeout(() => {
                        handleClose();
                    }, 3000);
                }
            })
            .catch((error) => {
                console.log(error);
            })
        } else {
            console.log('logged in');
        }
    }

    const apply = async (id) => {
        axios.post('http://localhost:3001/applies/create-apply', {message, id, companyId: jobInModal.company._id, jobId: jobInModal._id}, {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            console.log(response);
        });
    }


    return(
        <>
        <Modal open={open} handleClose={handleClose} style={{ overflow: 'scroll' }}>
            <Box sx={style}>
                        <Alert severity={alert}>
                            {msg}
                        </Alert>
                <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                    Candidature pour: {jobInModal.name}
                </Typography>
                <p>En postulant à cette offre, vous acceptez de créer un compte.</p>
                {localStorage.getItem('token') === null ? (
                <>
                    <TextField style={{ marginBottom: 25 }} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder='Prénom' />
                    <TextField style={{ marginBottom: 25 }} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder = 'Nom' />
                    <TextField style={{ marginBottom: 25 }} value={email} onChange={(e) => setEmail(e.target.value)} placeholder = 'E-mail' />
                    <TextField style={{ marginBottom: 25 }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder = 'Téléphone'  />
                </>
                ) : null}
                <TextField style={{ marginBottom: 25 }} value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Vos motivations...' />
                <Button style={{ backgroundColor: '#673ab7', color: 'white', marginBottom: 25 }} onClick={() => sendApply()} size="small">Postuler</Button>
                <Button style={{ backgroundColor: '#673ab7', color: 'white'  }} onClick={() => handleClose()} size="small">Fermer</Button>
            </Box>

        </Modal>
        <StyledSection1>
            <StyledTitle>Bienvenue sur le JobBoard</StyledTitle>
            <StyledButton onClick={() => window.location.href = "#section-2"}>Voir les emplois</StyledButton>
        </StyledSection1>
        <StyledSection2 id='section-2' style={{ background: 'white' }}>
            <StyledTitle style={{ color: '#673ab7' }}>Les dernières offres d'emploi</StyledTitle>
            <Row>
                {jobs.map((job) => (
                    
                    <div key={job._id} className="col-sm">
                        <Card sx={{ minWidth: 275, minHeight: 200 }}>
                            <CardContent>   
                                <Typography sx={{ fontSize: 14, color: '#673ab7' }} color="text.secondary" gutterBottom>
                                    Poste {job.name}
                                </Typography>
                                <Typography color={'#673ab7'} variant="h5" component="div">
                                    {job.company.name}
                                </Typography>
                                <Typography color={'#673ab7'} sx={{ mb: 1.5 }} >
                                    {job.shortDescription}
                                </Typography>
                                <Typography color={'#673ab7'} sx={{ mb: 1.5 }} >
                                    {job.salary}€/an
                                </Typography>
                                {learnMore == job._id ? <Typography variant="body2">{job.description}</Typography> : null}
                                <CardActions>
                                    <Button style={{ backgroundColor: '#673ab7', color: 'white'  }} onClick={() => seeDescription(job._id)} size="small">Voir Plus</Button>
                                    <Button style={{ backgroundColor: job.company.recruiter === userID ? "grey" :  '#673ab7', color: 'white'  }} disabled={userID == job.company.recruiter ? true : false} onClick={() => thisJob(job)} size="small">Postuler</Button>
                                </CardActions>
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </Row>
        </StyledSection2>
        </>
    );
}

export default Home;