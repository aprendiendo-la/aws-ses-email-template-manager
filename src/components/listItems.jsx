import React from "react";
import { Link } from "react-router-dom";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import LogoutIcon from "@material-ui/icons/AirlineSeatIndividualSuite";
import EmailIcon from "@material-ui/icons/Email";

export const mainListItems = (
  <Link to="/templates" style={{ textDecoration: "none", color: "#000" }}>
    <ListItem button selected>
      <ListItemIcon>
        <EmailIcon />
      </ListItemIcon>
      <ListItemText primary="Templates" />
    </ListItem>
  </Link>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Otras opciones</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Cerrar Sesión" />
    </ListItem>
  </div>
);
