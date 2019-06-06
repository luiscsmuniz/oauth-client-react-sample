import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    client_id: 'Iggf48wgCZ1DWx2069zedPdMkoBkUqguRTrCQHL9VWg',
    client_secret: 'oSDIbJGP-PwPM8c8UsaB4g6HvEQlyGfLoTPpZmIuE_Q',
    username: 'luisc.souzamuniz@gmail.com',
    password: '123456',
    token: '',
    requestAPI: [],
    isAuthenticate: false,
  }

  // handleChange = (event) => {
  //   this.setState({value: event.target.value});
  // }

  handleSubmit = async (event) => {
    const form = new FormData();
    form.append('client_id', this.state.client_id)
    form.append('client_secret', this.state.client_secret)
    form.append('username', this.state.username)
    form.append('password', this.state.password)
    form.append('grant_type', 'password')

    const request = await fetch("http://localhost:3001/oauth/token", {
      method: "POST",
      body: form
    })
    
    const teste = await request.json()

    this.setState({
      token: teste.access_token,
      isAuthenticate: true,
    })
  }

  logout = () => {
    this.setState({
      isAuthenticate: false,
      token: '',
      requestAPI: ''
    })
  }

  requestAPI = async () => {
    const request = await fetch(`http://localhost:3000/tasks/?token=${this.state.token}`, {
      method: "GET"
    })
    const data = await request.json()
    if (this.state.token) {
      this.setState({ 
        requestAPI: data
      })

    } else {
      alert(data.errors)
    }
  }

  render (){
    const {
      client_id,
      client_secret,
      password,
      username,
      token,
      requestAPI,
      isAuthenticate
    } = this.state

    return (
      <div style={{width: '60%', margin: '0 auto'}}>
        { !isAuthenticate ? (
        <div>
          <label>
            client_id:
          </label>
          <input type="text" defaultValue={client_id} readOnly style={{width: '100%'}} />

          <label>
            client_secret:
            <input type="text" defaultValue={client_secret} readOnly style={{width: '100%'}} />
          </label>

          <label>
            username:
            <input type="text" defaultValue={username} readOnly style={{width: '100%'}} />
          </label>

          <label>
            password:
            <input type="password" defaultValue={password} readOnly style={{width: '100%'}} />
          </label>
          <button type="button" onClick={this.handleSubmit}> Enviar</button>
        </div> 
        ) : (
          <div>
          <button onClick={this.requestAPI}>Request API</button>
          <button onClick={this.logout}>Logout</button>
          <br />
          <label>Request API: </label>
            {requestAPI.length === 0 ?
            null :
              requestAPI.errors ? 
                (requestAPI.errors) :
                (
                  <ul>
                    <li>email: {requestAPI.user.email}</li>
                    <li>UID: {requestAPI.user.id}</li>
                    <li>Tempo de expiração: {requestAPI.exp}</li>
                    <li>Nome da tarefa: {requestAPI.tasks[0].name}</li>
                    <li>Descrição: {requestAPI.tasks[0].description}</li>
                  </ul>
                )
            }
          </div>
        )}

        <p style={{wordWrap: 'break-word'}}>
          Token: {token}
        </p>
      </div>
    );
  }
}

export default App;
