import axios from 'axios';
import React, { useState } from 'react'
import { Button, Form, FormControl, Modal, Table } from 'react-bootstrap';
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
import jwt_decode from 'jwt-decode';

function ManageUsers() {

    const [users, setUsers] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loaded, setLoaded] = useState(false);
    const [show, setShow] = useState(false);
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
    const [user, setOneUser] = React.useState({})
    const [id, setId] = React.useState('')
    const handleClose = () => setShow(false);
    
    const handleShow = async (id) => {
        setShow(true);
        await axios.get('http://localhost:3001/users/get-one-user/' + id, { headers: {"Authorization" : `Bearer ${token}`}})
        .then((res) => {
            res.data.user.dob = new Date(res.data.user.dob)
            var day = ("0" + res.data.user.dob.getDate()).slice(-2);
            var month = ("0" + (res.data.user.dob.getMonth() + 1)).slice(-2);
            var today = res.data.user.dob.getFullYear()+"-"+(month)+"-"+(day);
            setFirstName(res.data.user.firstName);
            setLastName(res.data.user.lastname);
            setAddress(res.data.user.address);
            setCity(res.data.user.city)
            setEmail(res.data.user.email)
            setGender(res.data.user.gender)
            setDob(today)
            setCountry(res.data.user.country)
            setPostal(res.data.user.postal)
            setId(res.data.user._id)
            setLoaded(true);
        })
    };

    React.useEffect(() => {
       if(loaded === false) getUsers();
       let decoded = jwt_decode(token);
       if(decoded.isAdmin === false) window.location.href = '/';
    }, [loaded])

    const editUser = (e, id) => {
        e.preventDefault();
        setLoaded(false)
        let data = {username: email, password, dob, firstName, postal, lastname: lastName, email, country, city, gender, id, address}
        Object.keys(data).forEach(key => {
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
        axios.post('http://localhost:3001/users/update-one-user/', data, { headers: {"Authorization" : `Bearer ${token}`}})
        .then((response) => {
            if(response.data.edit === true) {
                setMsg('Modification faite avec succès !');
                setAlert('success');
                setLoader(true);
                setLoaded(true);
                setShow(false);
            }
            else if(response.data.edit === false){
                setMsg(response.data.msg);
                setAlert('danger');
            } 
            
        });
    }
    

    const getUsers = async () => {  
        await axios.get('http://localhost:3001/users/all-users', { headers: {"Authorization" : `Bearer ${token}`}})
        .then((res) => {
            console.log(res.data);
            setUsers(res.data.users);
            setLoaded(true);
        })
    }   

    const deleteUser = (id) => {
        let data = {
            id: id
        }
        axios.delete('http://localhost:3001/users/delete-user/' + id, { headers: {"Authorization" : `Bearer ${token}`}}, data)
        .then((res) => {
            console.log(res.data);
            getUsers();
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

    return (
        <div>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Prénom</th>
                        <th>Nom</th>
                        <th>Adresse E-mail</th>
                        <th>Adresse Postal</th>
                        <th>Code Postal</th>
                        <th>Ville</th>
                        <th>Pays</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((value, key) => {
                        return(
                            <tr>
                                <td>{key + 1}</td>
                                <td>{value.firstName}</td>
                                <td>{value.lastname}</td>
                                <td>{value.email}</td>
                                <td>{value.address}</td>
                                <td>{value.postal}</td>
                                <td>{value.city}</td>
                                <td>{value.country}</td>
                                <td>
                                    <Button style={{ marginRight: 5 }} onClick={() => handleShow(value._id)}>Editer</Button>
                                    <Button variant='danger' onClick={() => deleteUser(value._id)}>Supprimer</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
                <Modal show={show} >
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Modal title</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
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
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onChange={() => handleClose()}>Close</Button>
                            <Button variant="primary" onClick={(e) => editUser(e, id)}>Save changes</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
        </div>
    )
}

export default ManageUsers