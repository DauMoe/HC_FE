import React, {useState} from "react";
import {Redirect} from 'react-router';
import makeStyles from "@material-ui/core/styles/makeStyles";
import {TextField, Button} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    custom_tf: {
        width: '300px',
        margin: '10px'
    },
    Container: {
        position: 'relative',
        height: '100vh'
    },
    FormContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
    },
    btn: {
        width: 'calc(100% - 20px)',
        margin: '10px 0 0 0'
    }
}));

function Login(props) {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [goHome, setgohome] = useState(false);

    function HandleLogin(e) {
        e.preventDefault();

        //Call API
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "username": username,
            "pass": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "login", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code !== 200) {
                    alert(result.msg);
                    setgohome(false);
                } else {
                    localStorage.setItem("username", result.username);
                    localStorage.setItem("pub", result.pub);
                    localStorage.setItem("token", result.token);
                    setgohome(true);
                }
            })
            .catch(error => alert(error));
    }

    if (goHome) return <Redirect to={{ pathname: "/home", state: { from: props.location } }} />

    return(
        <div className={classes.Container}>
            <form className={classes.FormContainer} onSubmit={HandleLogin}>
                <div>
                    <TextField
                        id="outlined-basic"
                        size="medium"
                        value={username}
                        className={classes.custom_tf}
                        label="Username"
                        type="text"
                        variant="outlined"
                        onChange={e => setUsername(e.target.value)} />
                </div>
                <div>
                    <TextField
                        id="outlined-basic"
                        size="medium"
                        value={password}
                        className={`${classes.custom_tf}`}
                        label="Password"
                        type="password"
                        variant="outlined"
                        onChange={e => setPassword(e.target.value)} />
                </div>
                <Button
                    variant="contained"
                    color="secondary"
                    type="submit"
                    className={classes.btn}>Login</Button>
            </form>
        </div>
    );
}

export default Login;