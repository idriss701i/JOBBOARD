import axios from 'axios';
import React from 'react'
import { Alert, Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';


function ResetPassword(props) {

    const [email, setEmail] = React.useState(props.email);
    const [password, setPassword] = React.useState('');
    const [alert, setAlert] = React.useState({});
    const [msg, setMsg] = React.useState('');

    React.useEffect(() => {
        console.log(email);
    })
    
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(email);
        console.log(password);
    }
    
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
                    <Button variant="primary" type="submit">
                        Se connecter
                    </Button>
                </Form>
            </Container>
        </>
    )
}

export default ResetPassword;