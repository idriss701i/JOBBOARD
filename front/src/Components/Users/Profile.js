import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Container, Form, FormControl, Alert, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import {
  CDBListGroup,
  CDBListGroupItem,
  CDBInput
} from 'cdbreact';
import { Oval } from 'react-loader-spinner'
import styled from 'styled-components'

function Profile() {

  const [data, setData] = useState([])
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [dataIsLoaded, setDataIsLoaded] = useState(false);
  const navigate = useNavigate();
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
  const [valueAddress, setValueAddres] = React.useState([]);
  const [companyName, setCompanyName] = React.useState('');
  const [companyID, setCompanyID] = React.useState('');
  const [isRecruiter, setIsRecruiter] = React.useState(false);
  const [alert, setAlert] = React.useState({});
  const [msg, setMsg] = React.useState('');
  const [loader, setLoader] = React.useState(false);

  useEffect(() => {
    if(!dataIsLoaded &&  token !== null && token.length > 0) getData();
    else if (token == null) {
      navigate('/login');
    }
  })

  const getData = async () => {
    await axios.get('http://localhost:3001/users/get-user', { headers: {"Authorization" : `Bearer ${token}`}})
    .then(async (response) => {
      if(response.status === 401){
        console.log('Logout');
        localStorage.removeItem('token');
        navigate('/login');
      }
      let {firstName, lastname, address, email, city, country, gender, dob, postal, isRecruiter} = response.data.user;
      setIsRecruiter(isRecruiter)
      if (isRecruiter) {
        let {name, _id}  = response.data.company;
        setCompanyID(_id);
        setCompanyName(name);
      }
      dob = new Date(dob)
      var day = ("0" + dob.getDate()).slice(-2);
      var month = ("0" + (dob.getMonth() + 1)).slice(-2);
      var today = dob.getFullYear()+"-"+(month)+"-"+(day) ;
      setFirstName(firstName);
      setLastName(lastname);
      setAddress(address);
      setCity(city)
      setEmail(email)
      setGender(gender)
      setDob(today)
      setCountry(country)
      setPostal(postal)
      console.log(dob);
      await setDataIsLoaded(true);
    })
  }

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

  const editProfil = async (e) => {
    e.preventDefault();
    let data = {username: email, password, dob, firstName, postal, lastname: lastName, email, country, city, gender, address, companyID: companyID.length > 0 ? companyID : "", companyName: companyName.length > 0 ? companyName : ""}
    Object.keys(data).forEach(key => {
        console.log(key, data[key])
      if (data[key].trim() === '') {
        delete data[key];
      }
    });
    const isEmpty = Object.keys(data).length === 0;
    if(isEmpty){
      setMsg('Erreur: aucun champ ne peut être vide !');
      setAlert('danger');
      return;
    }
    axios.post('http://localhost:3001/users/update-user', data, { headers: {"Authorization" : `Bearer ${token}`}})
    .then((response) => {
        if(response.data.edit === true) {
            setMsg('Modification faite avec succès !');
            setAlert('success');
            setLoader(true);
            setTimeout(async () => {
                setLoader(false);
                getData();
            }, 1500);
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
  
  if(!dataIsLoaded) return( null );

  return (
    
    <div>
      <Container className='mt-4'>
          <Form className='w-50' onSubmit={editProfil}>
          <Alert show={msg.length > 0 ? true : false} variant={alert}>
                            {msg}{' '}{msg === 'Mot de passe incorrect' ? <Alert.Link href="#">Réinitialiser mon mot de passe</Alert.Link> : null}
                        </Alert>
                        <div className="form-row mb-n4">
                            <label htmlFor="lastname" className="text-muted m-0">
                                Prénom
                            </label>
                            <div className="col">
                                <FormControl label="Firstname" placeholder="Entrer votre prénom" type="text" value={firstName}  onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="lastname" className="text-muted m-0">
                                Nom
                            </label>
                            <div className="col">
                                <FormControl id={'lastname'} label="Lastname" type="text" placeholder="Entrer votre nom" value={lastName}  onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="date" className="text-muted m-0">
                                Date de naissance
                            </label>
                            <div className="col">
                                <FormControl id={'date'} label="Date" type="date" placeholder="Entrer votre date de naissance" value={dob}  onChange={(e) => setDob(e.target.value)}  />
                            </div>
                        </div>
                        {isRecruiter ?                        <div className="form-row mb-n4">
                            <label htmlFor="lastname" className="text-muted m-0">
                                Nom Entreprise
                            </label>
                            <div className="col">
                                <CDBInput label="Entrer votre nom d'entreprise" placeholder="Entrer votre nom d'entreprise" type="text" value={companyName} required onChange={(e) => setCompanyName(e.target.value)} />
                            </div>
                        </div> : null}
                        <div className="form-row mt-1">
                            <label htmlFor="email" className="text-muted m-0">
                                E-mail
                            </label>
                            <div className="col">
                                <FormControl id={'email'} label="Email" type="email" placeholder="Entrer votre adresse e-mail" value={email}  onChange={(e) => setEmail(e.target.value)}  />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="password" className="text-muted m-0">
                                Mot de passe
                            </label>
                            <div className="col">
                                <FormControl id={'password'} label="Mot de passe" type="password" placeholder="Entrer votre mot de passe" value={password}  onChange={(e) => setPassword(e.target.value)}  />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="date" className="text-muted m-0">
                                Genre
                            </label>
                            <div className="col">
                            <Form.Select className='mt-2' aria-label="Default select example" value={gender} onChange={(e) => setGender(e.target.value)}>
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
                                <FormControl type="text" placeholder="Entrer votre adresse"  value={address} onChange={(e) => {
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
                                <FormControl value={postal} placeholder="Entrer votre code postal"  disabled style={{ backgroundColor: 'white' }}  /> 
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="postal" className="text-muted m-0">
                                Ville
                            </label>
                            <div className="col mt-2">
                                <FormControl value={city} placeholder="Entrer votre ville"  disabled style={{ backgroundColor: 'white' }}  /> 
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="postal" className="text-muted m-0">
                                Pays
                            </label>
                            <div className="col mt-2">
                                <FormControl value={country} placeholder="Entrer votre pays"  disabled style={{ backgroundColor: 'white' }}  /> 
                            </div>
                        </div>
                        <StyledButton style={{ display: 'flex', justifyContent: 'center' }} className="my-4" variant="primary" type="submit">
                            {!loader ? "Modifier mon profil":
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
          </Form>
      </Container>
    </div>
  )
}

export default Profile