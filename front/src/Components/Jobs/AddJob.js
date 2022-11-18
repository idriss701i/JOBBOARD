import React, { useEffect } from 'react'
import axios from 'axios';
import Autocomplete from 'react-autocomplete';
import { Alert, Container, FormControl, FormText } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {
    CDBInput,
    CDBCheckbox,
    CDBCard,
    CDBCardBody,
    CDBIcon,
    CDBBtn,
    CDBLink,
    CDBContainer,
    CDBAutocomplete,
    CDBListGroup,
    CDBListGroupItem,
    CDBSelect, 
} from 'cdbreact';

import styled from 'styled-components';
import { Oval } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

function AddJob() {

    const navigate = useNavigate();
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [shortDescription, setShortDescription] = React.useState('');
    const [city, setCity] = React.useState('');
    const [wages, setWages] = React.useState('');
    const [jobName, setJobName] = React.useState('');
    const [user, setUser] = React.useState({});
    const [company, setCompany] = React.useState("");
    const [selected, setSelectedCompany] = React.useState("");
    const [companies, setCompanies] = React.useState([]);
    const [message, setMessage] = React.useState('');
    const [alert, setAlert] = React.useState({});
    const [msg, setMsg] = React.useState('');
    const [loader, setLoader] = React.useState(false);

    const StyledButton = styled(Button)`
        background-color: black;
        border: none;
        border-radius: 0;
        width: 180px;
    `;

    const onSubmit = (e) => {
        e.preventDefault();
        let data = {title: title, company: selected, description: description, shortDescription: shortDescription, city: city, salary: wages }
        axios.post('http://localhost:3001/jobs/create-job', data, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            console.log(response)
            if(response.data.createdJob === true) {
                setMsg("Création d'offre faite avec succès !");
                setAlert('success');
                setLoader(true);
                setTimeout(() => {
                    navigate('/all-jobs');
                }, 3000);
            }
            else if(response.status === 401){
                setMsg(response.data.msg);
                setAlert('danger');
            }
        })
    }

    useEffect(() => {  
        getCompanies() 
    }, []);

    const getCompanies = async () => {
        const token = jwtDecode(localStorage.getItem('token'));
        if (token.isAdmin || token.isRecruiter) {
            axios.get('http://localhost:3001/companies/get-companies', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
            .then((response) => {
                setCompanies(response.data.companies);
                if (response.data.companies.length === 1) {
                    setSelectedCompany(response.data.companies[0]._id);
                }
            });
        }
        else if(token.isRecruiter){
            axios.get('http://localhost:3001/companies/get-one-company/' + token.companyId, {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
            .then((response) => {
                let arr = [];
                arr.push(response.data.company);
                setCompanies(arr);
            });
        }
    }

    return (
        <>
        <CDBContainer>
            <CDBCard   style={{ width: '30rem', marginLeft: 'auto', marginRight: 'auto' }}>
                <CDBCardBody className="mx-4">
                <div className="text-center text-white" style={{ background: 'black' }}>
                    <p className="h5  py-4 font-weight-bold"> Créer un emploi </p>
                </div>
                    <div className="form-row mt-1">
                        <label htmlFor="lastname" className="text-muted m-0">
                            Nom du poste
                        </label>
                        <div className="col">
                            <CDBInput id={'lastname'} label="Lastname" type="text" placeholder="Entrer le nom du poste" value={title} required onChange={(e) => setTitle(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row mt-1">
                            <label htmlFor="date" className="text-muted m-0">
                                    Entreprise
                            </label>
                            <div className="col">
                                <Form.Select className='mt-2' aria-label="Default select example" disabled={companies.length === 1 ? true : false} onChange={(e) => {
                                    setSelectedCompany(e.target.value)
                                }}>
                                    {companies.length > 1 ? <option>Sélectionner une entreprise</option> : null}
                                    {companies !== undefined &&  companies.length > 1 ? companies.map((company, index) => {
                                        return (
                                            <>
                                                <option key={index} value={company._id}>{company.name}</option>
                                            </>
                                        )
                                    }) : null}
                                    {companies.length === 1 ? companies.map((company, index) => {
                                        return (
                                            <>
                                                <option key={index} value={company._id}>{company.name}</option>
                                            </>
                                        )
                                    }) : null}
                                </Form.Select>
                            </div>
                    </div>
                    <div className="form-row mt-1">
                        <label htmlFor="lastname" className="text-muted m-0">
                            Courte Description
                        </label>
                        <div className="col">
                            <CDBInput id={'lastname'} label="Lastname" type="text" placeholder="Entrer la description" value={shortDescription} required onChange={(e) => setShortDescription(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row mt-1">
                        <label htmlFor="lastname" className="text-muted m-0">
                            Description
                        </label>
                        <div className="col">
                            <Form.Control
                                as="textarea"
                                onChange={(e) => setDescription(e.target.value)}
                                value={description}
                                placeholder="Contenu de l'emploi"
                                style={{ height: '100px' }}
                            />
                        </div>
                    </div>
                    <div className="form-row mt-1">
                        <label htmlFor="lastname" className="text-muted m-0">
                            Lieu
                        </label>
                        <div className="col">
                            <CDBInput id={'lastname'} label="Lastname" type="text" placeholder="Entrer la ville" value={city} required onChange={(e) => setCity(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-row mt-1">
                        <label htmlFor="lastname" className="text-muted m-0">
                            Salaire
                        </label>
                        <div className="col">
                            <CDBInput id={'lastname'} label="Lastname" type="text" placeholder="Entrer le salaire" value={wages} required onChange={(e) => setWages(e.target.value)} />
                        </div>
                    </div>
                    <StyledButton onClick={(e) => onSubmit(e)}  style={{ display: 'flex', justifyContent: 'center' }} className="my-4" variant="primary" type="submit">
                        {!loader ? "Créer l'offre":
                        <Oval
                            height={30}
                            width={30}
                            color="white"
                            wrapperStyle={{
                            alignSelf: 'center'
                            }}
                            wrapperClass=""
                            visible={true}
                            ariaLabel='oval-loading'
                            secondaryColor="white"
                            strokeWidth={5}
                            strokeWidthSecondary={2}

                        />}

                    </StyledButton>
                </CDBCardBody>
            </CDBCard>
        </CDBContainer>
</>
    )
}

export default AddJob