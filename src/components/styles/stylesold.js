export const navbarStyles = {
    appBar: {
      backgroundColor: "#0d47a1",
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
    },
    brandContainer: {
      display: "flex",
      alignItems: "center",
    },
    brand: {
      fontWeight: "bold",
      color: "#bbdefb",
      fontSize: 20,
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
    },
    logo: {
      width: 30,
      height: 30,
      marginRight: 10,
    },
    menuItem: (isActive) => ({
      fontWeight: isActive ? "bold" : "normal",
      color: isActive ? "#bbdefb" : "#9e9e9e",
      fontSize: 17,
      textDecoration: "none",
    }),
    icon: (isActive) => ({
      marginRight: 10,
      color: isActive ? "#bbdefb" : "#9e9e9e",
    }),
    userSection: {
      display: "flex",
      alignItems: "center",
    },
    drawer: {
      width: 240,
      flexShrink: 0,
      "& .MuiDrawer-paper": {
        width: 240,
        boxSizing: "border-box",
      },
    },
    menuButton: {
      marginRight: 2,
      display: { xs: "block", md: "none" },
    },
    desktopMenu: {
      display: { xs: "none", md: "flex" },
      alignItems: "center",
    },
  };