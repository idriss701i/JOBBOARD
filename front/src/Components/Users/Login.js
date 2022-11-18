import axios from 'axios';
import React, { useEffect } from 'react'
import { Alert, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';


function Login() {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [alert, setAlert] = React.useState({});
    const [msg, setMsg] = React.useState('');

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
        border-color: #673ab7;
    }
`

    const onSubmit = (e) => {
        e.preventDefault();
        let data = {username: email, password}
        axios.post('http://localhost:3001/users/login', data)
        .then((response) => {
            
            if(response.data.login === true) {
                setMsg(response.data.msg);
                setAlert('success');
                localStorage.setItem('token', response.data.token);
                window.location.href = '/';
            }
            else if(response.data.login === false){
                setMsg(response.data.msg);
                setAlert('danger');
            } 
        })
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            window.location.href = '/profile';
        }
    }, [])
    
    return (
        <>
            <Container>
                <Form  onSubmit={onSubmit}>
                    <Alert show={msg.length > 0 ? true : false} variant={alert}>
                        {msg}{' '}{msg === 'Mot de passe incorrect' ? <Alert.Link href="#">Réinitialiser mon mot de passe</Alert.Link> : null}
                    </Alert>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Adresse E-mail</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" value={email} required onChange={(e) => setEmail(e.target.value)} />
                        <Form.Text className="text-muted">
                        
                        </Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Mot de passe</Form.Label>
                        <Form.Control type="password" placeholder="Mot de passe" value={password} required onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <StyledButton variant="primary" type="submit">
                        Se connecter
                    </StyledButton>
                </Form>
            </Container>
        </>
    )
}

export default Login;