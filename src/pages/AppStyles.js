export default theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: document.documentElement.clientHeight
  },
  appContainer: {
    maxWidth: 750,
    margin: theme.spacing.unit * 3
  },
  paperHeader: {
    padding: theme.spacing.unit * 3
  },
  fab: {},
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
});
