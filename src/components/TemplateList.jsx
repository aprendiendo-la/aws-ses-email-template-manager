import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import Typography from "@material-ui/core/Typography";

import {
  ListSubheader,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  ListItemAvatar
} from "@material-ui/core";

const styles = theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

class TemplateList extends Component {
  state = {
    open: false,
    selectedToDelete: null
  };

  handleClickOpen = templateName => {
    this.setState({ open: true, selectedToDelete: templateName });
  };

  handleClose = () => {
    this.setState({ open: false, selectedToDelete: null });
  };

  showListItems = (items, onClickListItem, selectedListItem) => {
    if (items.length === 0) {
      return (
        <Typography variant="body2" color="textSecondary" align="center">
          {"No encotramos ningún template de email."}
        </Typography>
      );
    }

    return items.map((item, index) => {
      return (
        <ListItem
          button
          key={item.Name}
          selected={selectedListItem === index}
          onClick={() => onClickListItem(item.Name, index)}
        >
          <ListItemAvatar>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.Name}
            secondary={
              item.CreatedTimestamp
                ? item.CreatedTimestamp.toString()
                : "Justo ahora"
            }
          />
          <ListItemSecondaryAction>
            <IconButton
              aria-label="Delete"
              onClick={() => this.handleClickOpen(item.Name)}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  };

  resolved = templateName => {
    const { removeTemplate } = this.props;

    this.setState({ open: false });

    removeTemplate(templateName);
  };

  rejected = () => {};

  handleOnDeleteClick = async templateName => {
    const { onDeleteListItem } = this.props;

    await onDeleteListItem(templateName).then(
      this.resolved(templateName),
      this.rejected
    );
  };

  render() {
    const { classes, items, selectedListItem, onClickListItem } = this.props;
    const { open, selectedToDelete } = this.state;

    return (
      <div>
        <List
          subheader={
            <ListSubheader>Lista de Templates de AWS SES</ListSubheader>
          }
          className={classes.root}
        >
          {this.showListItems(items, onClickListItem, selectedListItem)}
        </List>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {`¿Desea eliminar el template "${selectedToDelete}"?`}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Revise bien antes de eliminar porque no habrá vuelta atrás!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.handleOnDeleteClick(selectedToDelete)}
              color="primary"
              autoFocus
            >
              Aceptar
            </Button>
            <Button onClick={this.handleClose}>Cancelar</Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

TemplateList.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TemplateList);
