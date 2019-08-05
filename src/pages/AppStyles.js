export default theme => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: document.documentElement.clientHeight
  },
  appContainer: {
    maxWidth: 750,
    margin: theme.spacing(3)
  },
  paperHeader: {
    padding: theme.spacing(3)
  },
  fab: {},
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
});
