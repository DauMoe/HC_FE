import React from "react";
import NotFoundImg from './404.jpg';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    container: {
        width: '100%',
        height: '100vh',
        backgroundImage: `url(${NotFoundImg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain'
    }
}));

export default function NotFound() {
    const classed = useStyles();

    return(
        <div className={classed.container}></div>
    );
}