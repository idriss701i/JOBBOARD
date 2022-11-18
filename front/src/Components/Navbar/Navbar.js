import axios from 'axios';
import React from 'react'
import { NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import jwt from 'jwt-decode';
import { width } from '@mui/system';

function Nav() {
    const [firstName, setFirstName] = React.useState('');
    const [isLoggedIn, setLoggedIn] = React.useState(null);

    React.useEffect(() => {
        const token = localStorage.getItem('token');
        if (token !==  null && token.length > 0) {
          axios.get('http://localhost:3001/users/get-user', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
              }
          })
          .then((response) => {
              setFirstName(response.data.user.firstName);
              setLoggedIn(true);
          })
          .catch((err) => {
              if (err.response.status === 0) {
                  setLoggedIn(false);
              }
          })
        }
    }, [])

    const logout = (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = '/';
      setLoggedIn(false);
    }

    function displayLoginOrNot(){

       let jwtDecoded = jwt(localStorage.getItem('token'));
        if (jwtDecoded.isAdmin) {
        return(firstName.length > 0  ?             
        <NavDropdown title={'Bonjour' + " " + firstName} id="basic-nav-dropdown">
          <NavDropdown.Item href="/profile">Modifier Profil</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/create-user">
            Ajouter un utilisateur
          </NavDropdown.Item>
          <NavDropdown.Item href="/create-company">
            Ajouter une entreprise
          </NavDropdown.Item>
          <NavDropdown.Item href="/create-job">
            Ajouter un emploi
          </NavDropdown.Item>
          <NavDropdown.Item href="/create-apply">
            Ajouter une candidature
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/all-users">
            Gestions des utilisateurs
          </NavDropdown.Item>
          <NavDropdown.Item href="/all-companies">
            Gestions des entreprises
          </NavDropdown.Item>
          <NavDropdown.Item href="/all-applies">
            Gestions des candidatures
          </NavDropdown.Item>
          <NavDropdown.Item href="/all-jobs">
            Gestions des emplois
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item onClick={(e) => logout(e)}>
                Se Déconnecter
          </NavDropdown.Item>
      </NavDropdown> : <a href="/login">Login</a>)
        } else if(jwtDecoded.isRecruiter)  {  
          return(
            <NavDropdown title={'Bonjour' + " " + firstName} id="basic-nav-dropdown">
              <NavDropdown.Item href="/profile">Modifier Profil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/create-job">
                Ajouter un emploi
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/all-applies">
                Gestions des candidatures
              </NavDropdown.Item>
              <NavDropdown.Item href="/all-jobs" style={{}}>
                Gestions des emplois
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={(e) => logout(e)}>
                Se Déconnecter
              </NavDropdown.Item>
            </NavDropdown>

          )
    }
    else {
      return(
        <NavDropdown title={'Bonjour' + " " + firstName}  id="basic-nav-dropdown">
          <NavDropdown.Item href="/profile">Modifier Profil</NavDropdown.Item>
        </NavDropdown>
      )
    }
  }
    
    return(
        <Navbar>
          <Container>
            <Navbar.Brand className='title-website' href="/">JobBoard</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse style={{ justifyContent: 'center', border: '1px solid #673ab7', borderRadius: 5, maxWidth: 150, marginRight: 10 }}>
              <Navbar.Text>
                {isLoggedIn ? displayLoginOrNot() : <Link style={{ textDecoration: 'none', fontWeight: 500, color: "#673ab7" }} to="/login">Se connecter</Link>}
              </Navbar.Text>
            </Navbar.Collapse>
            {!isLoggedIn ?
            <Navbar.Collapse className='d-none' style={{ justifyContent: 'center', border: '1px solid #673ab7', borderRadius: 5, maxWidth: 150, marginRight: 10 }}>
              <Navbar.Text>
                {!isLoggedIn ? <Link style={{ textDecoration: 'none', fontWeight: 500, color: "#673ab7" }} to="/register">S'inscrire</Link> : null}
              </Navbar.Text>
            </Navbar.Collapse> : null}
          </Container>
        </Navbar>
    );
}

export default Nav;