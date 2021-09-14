import React, {useEffect, useState} from "react";
import {withStyles, makeStyles} from "@material-ui/core";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Modal, Backdrop, Fade, TextField, CircularProgress } from '@material-ui/core';
import Header from "../header";
import {Redirect} from "react-router-dom";

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
    table: {
        marginTop: '20px'
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    addNewModal: {
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: '10px 30px 30px 30px',
        width: '400px'
    },
    tf: {
        marginTop: '20px'
    }
}));

export default function ShowEx(props) {
    //Global data
    const [data, setData] = useState(null);
    const [goHome, setgoHome] = useState(false);

    //Detail modal
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState({});
    const [videoURL, setvideoURL] = useState(null);

    //Modify modal
    const [openAddNew, setOpenAddNew] = useState(false);
    const [exerName, setExerName] = useState("");
    const [exerDesc, setExerDesc] = useState("");

    //Style
    const classes = useStyles();

    //Utils function
    function handleClose() {
        setOpen(false);
        setvideoURL("");
    };

    function openModal(row) {
        setSelected(row);
        GetOneExer(row.excerID);
        setOpen(true);
    }

    function GetOneExer(id) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "token": localStorage.getItem("token"),
            "id": id
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "api/list_exer", requestOptions)
            .then(response => response.blob())
            .then(result => {
                //Doc: https://stackoverflow.com/questions/41184900/set-video-objects-source-file-to-a-blob-url
                var reader = new FileReader();
                reader.onloadend = function() {
                    var byteCharacters = atob(reader.result.slice(reader.result.indexOf(',') + 1));
                    var byteNumbers = new Array(byteCharacters.length);
                    for (var i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                    }
                    var byteArray = new Uint8Array(byteNumbers);
                    var blob = new Blob([byteArray], {type: 'video/mp4'});
                    var url = URL.createObjectURL(blob);
                    setvideoURL(url);
                }
                reader.readAsDataURL(result);
            })
            .catch(error => console.log('error', error));
    }

    function addExer() {
        setExerName("");
        setExerDesc("");
        setvideoURL(null);
        setOpenAddNew(true);
    }

    function handleAddNewClose() {
        setOpenAddNew(false);
    }

    function uploadFile(input) {
        console.log(input);
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function(e) {
                setvideoURL(e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    //Call API
    useEffect(() => {
        //Call api
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "token": localStorage.getItem("token")
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(process.env.REACT_APP_BASE_URL + "api/list_exer", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.code === 205) {
                    alert(result.msg);
                    setgoHome(true);
                } else if (result.code === 200) {
                    setData(result.msg);
                } else {
                    alert(result.msg);
                }
            })
            .catch(error => console.log('error', error));
    }, []); //deps == [] <=> run onetime when rendering

    //If token is expired or invalid => go to login page
    if (goHome) return <Redirect to={{ pathname: '/', state: { from: props.location } }} />

    return(
        <div>
            <Header/>
            {/*Table*/}
            <Button variant="contained" color="primary" style={{margin: '20px 20px 0 0', float: 'right'}} onClick={addExer}>+ Thêm bài tập</Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">ID</StyledTableCell>
                            <StyledTableCell>Tên bài tập</StyledTableCell>
                            <StyledTableCell align="center">Mô tả</StyledTableCell>
                            <StyledTableCell align="center">BMI</StyledTableCell>
                            <StyledTableCell align="center"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(data !== null) &&
                            data.map((row) => (
                                <StyledTableRow key={row.excerID}>
                                    <StyledTableCell align="center">{row.excerID}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row">{row.excer_name}</StyledTableCell>
                                    <StyledTableCell align="left">{(row.description) ? row.description: "Chưa có mô tả"}</StyledTableCell>
                                    <StyledTableCell align="center">{row.bmi_from}-{row.bmi_to}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <Button variant="outlined" color="secondary" onClick={() => openModal(row)}>
                                            Minh họa
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {(data === null) &&
            <div style={{
                position: 'absolute',
                left: '50%',
                marginTop: '20px',
                transform: 'translateX(-50%)'
            }}>
                <CircularProgress />
            </div>}

            {/*Modal*/}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 1500,
                }}
            >
                <Fade in={open}>
                    <div className={classes.paper}>
                        <h2 id="transition-modal-title">{(videoURL === "") ? "Đang tải video ...." : selected.excer_name}</h2>
                        <video controls preload="auto" loop={true} width="500" src={videoURL}></video>
                    </div>
                </Fade>
            </Modal>

            {/*Add new Exercise Modal*/}
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={openAddNew}
                onClose={handleAddNewClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 1500,
                }}
            >
                <Fade in={openAddNew}>
                    <div className={classes.addNewModal}>
                        <h2 id="transition-modal-title">Thêm bài tập</h2>
                        <form id="transition-modal-description">
                            <div>
                                <TextField
                                    id="standard-basic"
                                    label="Tên bài tập"
                                    fullWidth={true}/>
                            </div>
                            <div className={classes.tf}>
                                <TextField
                                    id="standard-basic"
                                    label="Mô tả"
                                    fullWidth={true}/>
                            </div>
                            {(true) &&
                                <div className={classes.tf}>
                                    <video controls={true} preload="auto" src={videoURL}></video>
                                </div>}
                            <div className={classes.tf}>
                                <input
                                    accept="video/mp4"
                                    style={{display: 'none'}}
                                    id="contained-button-file"
                                    type="file"
                                    onChange={uploadFile}
                                />
                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span">
                                        Tải lên minh họa
                                    </Button>
                                </label>
                            </div>
                            <Button variant="contained" color="secondary" style={{float:'right', marginTop: '20px'}}>
                                Tạo bài tập mới
                            </Button>
                        </form>
                    </div>
                </Fade>
            </Modal>
        </div>
    );
}