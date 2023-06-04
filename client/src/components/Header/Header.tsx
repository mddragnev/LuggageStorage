import ClearIcon from "@mui/icons-material/Clear";
import MenuIcon from "@mui/icons-material/Menu";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useEffect, useState } from "react";
import { Link as MatRouterButton, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useLogout from "../../hooks/useLogout";
import classes from "./Header.module.scss";

const Header = () => {
  const { auth }: any = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();
  const signOut = async () => {
    await logout();
    navigate("/");
    menuToggleHandler();
  };
  const pages = [
    {
      name: "Съхрани багаж",
      link: "",
      default: true,
    },
    {
      name: "Стани партньор",
      link: "register/partner",
      isLoggedIn: false
    },
    {
      name: "Вход",
      link: "login",
      isLoggedIn: false,
    },
    {
      name: "Моите резервации",
      link: "client/reservations",
      isLoggedIn: true
    },
    {
      name: "Партньорски резервации",
      link: "partner/reservations",
      role: "partner",
    },
    {
      name: "Админ",
      link: "admin",
      role: "admin",
    },
    {
      name: "Изход",
      link: "/",
      isLoggedIn: true,
    },
  ];
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });
  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };
  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);
  return (
    <header className={classes.header}>
      <MatRouterButton to="/" className={classes.header__logo}>
        Logo is here
      </MatRouterButton>
      <div className={classes.header__content}>
        <nav
          className={`${classes.header__content__nav} ${
            menuOpen ? classes.isMenu : ""
          }`}
        >
          <ul>
            {pages
              .filter(
                (p) =>
                  p.isLoggedIn === !!auth?.accessToken ||
                  p.default ||
                  (p.role != null && p.role === auth?.role)
              )
              .map((p, idx) => (
                <li key={idx}>
                  <Button
                    color="secondary"
                    variant="text"
                    component={MatRouterButton}
                    to={p.link}
                    onClick={p.name === "Изход" ? signOut : menuToggleHandler}
                  >
                    {p.name}
                  </Button>
                </li>
              ))}
          </ul>
        </nav>
        <div className={classes.header__content__toggle}>
          {!menuOpen ? (
            <IconButton onClick={menuToggleHandler}>
              <MenuIcon sx={{ color: "dark" }}></MenuIcon>
            </IconButton>
          ) : (
            <IconButton onClick={menuToggleHandler}>
              <ClearIcon sx={{ color: "dark" }}></ClearIcon>
            </IconButton>
          )}
        </div>
      </div>
    </header>
  );
};
export default Header;
