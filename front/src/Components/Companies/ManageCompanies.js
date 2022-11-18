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

function ManageCompanies() {

    const [companies, setCompanies] = useState([]);
    const [company, setCompany] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [companyName, setCompanyName] = React.useState('');
    const [loaded, setLoaded] = useState(false);
    const [show, setShow] = useState(false);
    const [users, setUsers] = React.useState('');
    const [selectedRecruiter, setSelectedRecruiter] = React.useState('');
    const [alert, setAlert] = React.useState({});
    const [msg, setMsg] = React.useState('');
    const [loader, setLoader] = React.useState(false);
    const [recruiter, setOneUser] = React.useState({})
    const [id, setId] = React.useState('')
    const handleClose = () => setShow(false);
    
    const handleShow = async (id) => {
        setShow(true);
        getUsers();
        await axios.get('http://localhost:3001/companies/get-one-company/' + id, { headers: {"Authorization" : `Bearer ${token}`}})
        .then((res) => {
            setCompany(res.data.company.name);
            setCompanyName(res.data.company.name);
            setOneUser(res.data.company.recruiter);
            setId(res.data.company._id);
            setLoaded(true);
        })
    };

    React.useEffect(() => {
       if(loaded === false) getCompanies();
    })

    const editCompany = (e, id) => {
        console.log(id);
        // e.preventDefault();
        console.log()
        let data = {name: company, recruiter: recruiter._id}
        console.log(data);
        Object.keys(data).forEach(key => {
          if (data[key].trim() === '') {
            delete data[key];
          }
        });
        const isEmpty = Object.keys(data).length === 0;
        if(isEmpty){
            console.log('empty')
          setMsg('Erreur: aucun champ ne peut être vide !');
          setAlert('danger');
          return;
        } 
        console.log('data', data)
        setLoaded(false)
        axios.patch('http://localhost:3001/companies/update-one-company/' + id, data, { headers: {"Authorization" : `Bearer ${token}`}})
        .then((response) => {
            if(response.data.edit === true) {
                console.log('Bonjour')
                setMsg('Modification faite avec succès !');
                setAlert('success');
                setLoader(true);
                setShow(false);
                handleClose();
            }
            else if(response.data.edit === false){
                setMsg(response.data.msg);
                console.log('Bonsoir  ')
                setAlert('danger');
            } 
            
        });
    }
    

    const getCompanies = async () => {  
        await axios.get('http://localhost:3001/companies/get-companies', { headers: {"Authorization" : `Bearer ${token}`}})
        .then((res) => {
            console.log(res.data);
            setCompanies(res.data);
            setLoaded(true);
        })
    }   

    const deleteCompany = (id) => {
        let data = {
            id: id
        }
        axios.delete('http://localhost:3001/companies/delete-company/' + id, { headers: {"Authorization" : `Bearer ${token}`}}, data)
        .then((res) => {
            console.log(res.data);
            getCompanies();
        })
    }

    const getUsers = () => {
        axios.get('http://localhost:3001/users/all-users', {headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}})
        .then((response) => {
            console.log(response.data.users);
            setUsers(response.data.users);
        });
    }



    return (
        <div>
            <Table striped bordered hover size="sm">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nom de l'entreprise</th>
                        <th>Recruteur</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.length > 0 ? companies.map((value, key) => {
                        return(
                            <tr>
                                <td>{key + 1}</td>
                                <td>{value.name}</td>
                                <td>{value.recruiter.firstName + ' ' + value.recruiter.lastname}</td>
                                <td>
                                    <Button style={{ marginRight: 5 }} onClick={() => handleShow(value._id)}>Editer</Button>
                                    <Button variant='danger' onClick={() => deleteCompany(value._id)}>Supprimer</Button>
                                </td>
                            </tr>
                        )
                    }) : <tr><td colSpan={4}>Aucune entreprise</td></tr>}
                    {/* {companies.length < 1 && } */}
                </tbody>
            </Table>
                <Modal show={show} onHide={handleClose} >
                    <Modal.Dialog>
                        <Modal.Header>
                            <Modal.Title>Modifier l'entreprise</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className="form-row mb-n4">
                            <label htmlFor="lastname" className="text-muted m-0">
                                Nom de l'entreprise
                            </label>
                            <div className="col">
                                <FormControl 
                                    label="Nom de l'entreprise" 
                                    placeholder="Nom de l'entreprise" 
                                    type="text" value={company}  
                                    onChange={(e) => setCompany(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="form-row mt-1">
                            <label htmlFor="date" className="text-muted m-0">
                                Recruteur
                            </label>
                            <div className="col">
                                <Form.Select className='mt-2' aria-label="Default select example"  onChange={(e) => {
                                    setSelectedRecruiter(e.target.value);
                                }}>
                                    <option value={recruiter._id}>{recruiter.email}</option>
                                    {users.length > 0 ? users.map((user, index) => {
                                        if (user._id === recruiter._id) {
                                            return;
                                        }
                                        return (
                                            <option key={index} value={user._id}>{user.email}</option>
                                        )
                                    }) : null}
                                </Form.Select>
                            </div>
                        </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onChange={() => handleClose()}>Close</Button>
                            <Button variant="primary" onClick={(e) => editCompany(e, id)}>Save changes</Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal>
        </div>
    )
}

export default ManageCompanies