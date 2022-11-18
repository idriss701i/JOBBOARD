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

function AddCompany() {

    const [companyName, setCompanyName] = React.useState('');
    const [users, setUsers] = React.useState('');
    const [dataLoaded, setDataLoaded] = React.useState(false);
    const [selectedRecruiter, setSelectedRecruiter] = React.useState('');
    const [alert, setAlert] = React.useState({});
    const [msg, setMsg] = React.useState('');
    const [loader, setLoader] = React.useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        if (dataLoaded === false) {
            getUsers();
            setDataLoaded(true);
        }
    })


    const getUsers = () => {
        axios.get('http://localhost:3001/users/all-users', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            console.log(response.data.users);
            setUsers(response.data.users);
        });
    }



    const onSubmit = (e) => {
        e.preventDefault();
        let data = {name: companyName, recruiter: selectedRecruiter}
        axios.post('http://localhost:3001/companies/create-company', data, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            console.log(response)
            if(response.data.createdCompany === true) {
                setMsg("Création d'entreprise faite avec succès !");
                setAlert('success');
                setLoader(true);
                setTimeout(() => {
                    navigate('/all-companies');
                }, 3000);
            }
            else if(response.status === 401){
                setMsg(response.data.msg);
                setAlert('danger');
            }
        })
    }

    const StyledButton = styled(Button)`
        background-color: black;
        border: none;
        border-radius: 0;
        width: 180px;
    `;

  return (
            <>
            <CDBContainer>
                <CDBCard   style={{ width: '30rem', marginLeft: 'auto', marginRight: 'auto' }}>
                    <CDBCardBody className="mx-4">
                    <div className="text-center text-white" style={{ background: 'black' }}>
                        <p className="h5  py-4 font-weight-bold"> Créer une entreprise </p>
                    </div>
                        <Alert show={msg.length > 0 ? true : false} variant={alert}>
                            {msg}{' '}{msg === 'Mot de passe incorrect' ? <Alert.Link href="#">Réinitialiser mon mot de passe</Alert.Link> : null}
                        </Alert>
                        <div className="form-row mb-n4">
                            <label htmlFor="Nom de l'entreprise" className="text-muted m-0">
                                Nom de l'entreprise
                            </label>
                            <div className="col">
                                <CDBInput label="Nom de l'entreprise" placeholder="Entrer l'entreprise" type="text" value={companyName} required onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="date" className="text-muted m-0">
                                Recruteur
                            </label>
                            <div className="col">
                                <Form.Select className='mt-2' aria-label="Default select example" onChange={(e) => {
                                    setSelectedRecruiter(e.target.value); console.log(selectedRecruiter)
                                }}>
                                    <option>Sélectionner un recruteur</option>
                                    {users.length > 0 ? users.map((user, index) => {
                                        if(user.isRecruiter == true || user.isAdmin == true) {
                                            return;
                                        }
                                        return (
                                            <option key={index} value={user._id}>{user.email}</option>
                                        )
                                    }) : null}
                                </Form.Select>
                            </div>
                        </div>
                        <StyledButton onClick={(e) => onSubmit(e)}  style={{ display: 'flex', justifyContent: 'center' }} className="my-4" variant="primary" type="submit">
                            {!loader ? "S'inscrire":
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

export default AddCompany