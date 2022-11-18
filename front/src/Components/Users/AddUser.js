import React from 'react'
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

function AddUser() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [city, setCity] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [postal, setPostal] = React.useState(null);
    const [country, setCountry] = React.useState('');
    const [dob, setDob] = React.useState('');
    const [gender, setGender] = React.useState('');
    const [valueAddress, setValueAddres] = React.useState([])
    const [alert, setAlert] = React.useState({});
    const [msg, setMsg] = React.useState('');
    const [loader, setLoader] = React.useState(false);
    const navigate = useNavigate();

    const onTypeAddress = (a) => {
        axios.get('https://api-adresse.data.gouv.fr/search/?q=' + a)
        .then((response) => {
            // console.log(response.data.features)
            let add = [];
            for (let index = 0; index < response.data.features.length; index++) {
                const element = response.data.features[index].properties;
                add.push(element)
            }
            setValueAddres(add);
        })
    }

    const dispatchAddress = (address, city, postal, country) => {
        setAddress(address)
        setCity(city)
        setPostal(postal)
        setCountry(country)
        setValueAddres([]);
    }


    const onSubmit = (e) => {
        e.preventDefault();
        let data = {username: email, dob, firstName, postal, lastName, email, country, city, gender}
        axios.post('http://localhost:3001/users/create-user', data, {
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then((response) => {
            console.log(response.data)
            if(response.data.register === true) {
                setMsg("Création d'utilisateur faite avec succès !");
                setAlert('success');
                setLoader(true);
                setTimeout(() => {
                    navigate('/all-users');
                }, 3000);
            }
            else if(response.data.register === false){
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
                        <p className="h5  py-4 font-weight-bold"> Créer un utilisateur </p>
                    </div>
                        <Alert show={msg.length > 0 ? true : false} variant={alert}>
                            {msg}{' '}{msg === 'Mot de passe incorrect' ? <Alert.Link href="#">Réinitialiser mon mot de passe</Alert.Link> : null}
                        </Alert>
                        <div className="form-row mb-n4">
                            <label htmlFor="lastname" className="text-muted m-0">
                                Prénom
                            </label>
                            <div className="col">
                                <CDBInput label="Firstname" placeholder="Entrer votre prénom" type="text" value={firstName} required onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="lastname" className="text-muted m-0">
                                Nom
                            </label>
                            <div className="col">
                                <CDBInput id={'lastname'} label="Lastname" type="text" placeholder="Entrer votre nom" value={lastName} required onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="date" className="text-muted m-0">
                                Date de naissance
                            </label>
                            <div className="col">
                                <CDBInput id={'date'} label="Date" type="date" placeholder="Entrer votre date de naissance" value={dob} required onChange={(e) => setDob(e.target.value)}  />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="email" className="text-muted m-0">
                                E-mail
                            </label>
                            <div className="col">
                                <CDBInput id={'email'} label="Email" type="email" placeholder="Entrer votre adresse e-mail" value={email} required onChange={(e) => setEmail(e.target.value)}  />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="date" className="text-muted m-0">
                                Genre
                            </label>
                            <div className="col">
                            <Form.Select className='mt-2' aria-label="Default select example" onChange={(e) => setGender(e.target.value)}>
                                <option>Sélectionner un genre</option>
                                <option value="Male">Homme</option>
                                <option value="Female">Femme</option>
                                <option value="Other">Autre</option>
                            </Form.Select>
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="adresse" className="text-muted m-0">
                                Adresse
                            </label>
                            <div className="col mt-2">
                                <FormControl type="text" placeholder="Entrer votre adresse" required value={address} onChange={(e) => {
                                        setAddress(e.target.value)
                                        onTypeAddress(e.target.value)
                                    }} 
                                /> 
                                {valueAddress.length > 0 ? 
                                    <CDBListGroup>
                                        {valueAddress.map((v, key) => {
                                            return(
                                                <div key={key} style={{ cursor: 'pointer' }}>
                                                    <CDBListGroupItem  onClick={() => dispatchAddress(v.name, v.city, v.postcode, "France")}>{v.label}</CDBListGroupItem>
                                                </div>
                                            )
                                        })}
                                    </CDBListGroup>
                                    : null
                                }
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="postal" className="text-muted m-0">
                                Code Postal
                            </label>
                            <div className="col mt-2">
                                <FormControl value={postal} placeholder="Entrer votre code postal" required disabled style={{ backgroundColor: 'white' }}  /> 
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="postal" className="text-muted m-0">
                                Ville
                            </label>
                            <div className="col mt-2">
                                <FormControl value={city} placeholder="Entrer votre ville" required disabled style={{ backgroundColor: 'white' }}  /> 
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="postal" className="text-muted m-0">
                                Pays
                            </label>
                            <div className="col mt-2">
                                <FormControl value={country} placeholder="Entrer votre pays" required disabled style={{ backgroundColor: 'white' }}  /> 
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

export default AddUser