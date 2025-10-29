import { Link } from "@inertiajs/react";
import React, { useEffect, useMemo, useState } from "react";
import Scrollspy from "react-scrollspy";

import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { Button, Collapse, Container, Dropdown, Form, NavbarToggle, NavLink } from "react-bootstrap";
import { changeSidebarVisibility } from "../../../../slices/thunk";
import LightDark from "../../../../Components/Common/LightDark";
import { router, usePage } from "@inertiajs/react";

//import images
import logoSm from "../../../../../images/logo-sm.png";
import logoDark from "../../../../../images/logo-dark.png";
import logoLight from "../../../../../images/logo-light.png";
import NotificationDropdown from "../../../../Components/Common/NotificationDropdown";
import ModalLogin from "../../Home/ModalLogin";
import { useTranslation } from "react-i18next";
import ProfileDropdown from "../../../../Components/Common/ProfileDropdown";
import LanguageDropdown from "../../../../Components/Common/LanguageDropdown";
import { useThemeConfig } from "../hooks/useThemeConfig";

const Navbar = ({ onChangeLayoutMode, layoutModeType }: any) => {
    const dispatch: any = useDispatch();
    const [isOpenMenu, setisOpenMenu] = useState<boolean>(false);
    const [navClass, setnavClass] = useState<any>("");
    const [show, setShow] = useState(false);
    const { user } = usePage().props.auth as any;
    const { t } = useTranslation();
    const storageUrl = usePage().props.storageUrl as string;
    const theme = useThemeConfig()
    const { settings } = usePage().props as any;

    const handleLogout = () => {
        router.post(route("buyer.logout"), {}, {
            onSuccess: () => {
                // Reload page to refresh CSRF token after successful logout
                window.location.reload();
            }
        });
    }
    useEffect(() => {
        if (user) {
            setShow(false);
        }
    }, [user]);

    const toggle = () => setisOpenMenu(!isOpenMenu);

    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    const scrollNavigation = () => {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setnavClass(" is-sticky");
        } else {
            setnavClass("");
        }
    };

    const selectDashboardData = createSelector(
        (state: any) => state.Layout,
        (sidebarVisibilitytype: any) => sidebarVisibilitytype.sidebarVisibilitytype
    );
    // Inside your component
    const sidebarVisibilitytype = useSelector(selectDashboardData);

    const [search, setSearch] = useState<boolean>(false);
    const toogleSearch = () => {
        setSearch(!search);
    };

    const toogleMenuBtn = () => {
        var windowSize = document.documentElement.clientWidth;
        const humberIcon = document.querySelector(".hamburger-icon") as HTMLElement;
        dispatch(changeSidebarVisibility("show"));

        if (windowSize > 767)
            humberIcon.classList.toggle('open');

        //For collapse horizontal menu
        if (document.documentElement.getAttribute('data-layout') === "horizontal") {
            document.body.classList.contains("menu") ? document.body.classList.remove("menu") : document.body.classList.add("menu");
        }

        //For collapse vertical and semibox menu
        if (sidebarVisibilitytype === "show" && (document.documentElement.getAttribute('data-layout') === "vertical" || document.documentElement.getAttribute('data-layout') === "semibox")) {
            if (windowSize < 1025 && windowSize > 767) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'sm') ? document.documentElement.setAttribute('data-sidebar-size', '') : document.documentElement.setAttribute('data-sidebar-size', 'sm');
            } else if (windowSize > 1025) {
                document.body.classList.remove('vertical-sidebar-enable');
                (document.documentElement.getAttribute('data-sidebar-size') === 'lg') ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg');
            } else if (windowSize <= 767) {
                document.body.classList.add('vertical-sidebar-enable');
                document.documentElement.setAttribute('data-sidebar-size', 'lg');
            }
        }


        //Two column menu
        if (document.documentElement.getAttribute('data-layout') === "twocolumn") {
            document.body.classList.contains('twocolumn-panel') ? document.body.classList.remove('twocolumn-panel') : document.body.classList.add('twocolumn-panel');
        }
    };

    const menuItems = useMemo(() => {
        if (settings?.menus) {
            const newMenu = settings?.menus.filter((menu: any) => menu.status === 'active')
            return newMenu;
        }
        return []
    }, [])

    return (
        <React.Fragment>
            <nav
                className={
                    "navbar navbar-expand-lg navbar-landing fixed-top job-navbar" +
                    navClass
                }
                id="navbar"
            >
                <Container fluid className="custom-container">
                    <Link className="navbar-brand" href="/">
                        <img
                            src={theme?.storeLogo ? `${storageUrl}/${theme.storeLogo}?v=${Date.now()}` : logoLight}
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height="17"
                        />
                        <img
                            src={theme?.storeLogo ? `${storageUrl}/${theme.storeLogo}?v=${Date.now()}` : logoLight}
                            className="card-logo card-logo-light"
                            alt="logo light"
                            height="17"
                        />
                    </Link>
                    <NavbarToggle
                        onClick={toggle}
                        className="navbar-toggler py-0 fs-20 text-body"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="mdi mdi-menu"></i>
                    </NavbarToggle>

                    <Collapse className="navbar-collapse" in={isOpenMenu}>
                        <div>
                            <Scrollspy
                                offset={-18}
                                items={[
                                    "hero",
                                    "process",
                                ]}
                                currentClassName="active"
                                className="navbar-nav mx-auto mt-2 mt-lg-0 ms-5"
                                id="navbar-example"
                            >
                                <li className="nav-item">
                                    <NavLink className="fs-16" href="/">
                                        {t("Home")}
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    {!!user && (
                                        <NavLink className="fs-16" href="/profile">
                                            {t("Personal profile")}
                                        </NavLink>
                                    )}
                                </li>
                                <li className="nav-item">
                                    {!!user && (
                                        <NavLink className="fs-16" href="/order">
                                            {t("Order history")}
                                        </NavLink>
                                    )}
                                </li>
                                <li className="nav-item">
                                    {!!user && (
                                        <NavLink className="fs-16" href="/deposits">
                                            {t("Deposits")}
                                        </NavLink>
                                    )}
                                </li>
                                <li className="nav-item">
                                    {!!user && (
                                        <NavLink className="fs-16" href="/payment-history">
                                            {t("Payment History")}
                                        </NavLink>
                                    )}
                                </li>
                                {menuItems && menuItems?.map((item: any, index: number) => (
                                    <li key={index} className="nav-item">
                                        {!!user && (
                                            <NavLink target="_blank" rel="noopener noreferrer" className="fs-16" href={`https://${item?.value}`}>
                                                {item?.label ?? ""}
                                            </NavLink>
                                        )}
                                    </li>
                                ))}
                            </Scrollspy>

                            <div className="d-flex align-items-center">
                                {/* LanguageDropdown */}
                                <LanguageDropdown />

                                {/* Dark/Light Mode set */}
                                <LightDark
                                    layoutMode={layoutModeType}
                                    onChangeLayoutMode={onChangeLayoutMode}
                                />

                                {/* NotificationDropdown */}
                                {/* <NotificationDropdown /> */}

                                {/* ProfileDropdown */}
                                {user && (
                                    <Link href="/profile">
                                        <div className="ms-sm-2 text-white">
                                            <span className="d-flex align-items-center">
                                                <i className="ri-user-line fs-22"></i>
                                                <span className="d-flex flex-row align-items-center">
                                                    <span className="ms-1 fw-medium user-name-text">{user?.name}</span>
                                                    <span className="ms-1 fs-12">: {user?.balance ?? 0} VND
                                                    </span>
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                {/* User Login/Register */}
                                <div className="ms-sm-3 header-item d-none d-sm-flex">
                                    {user ? (
                                        <Button variant="primary" onClick={handleLogout}>
                                            <i className="ri-logout-box-r-line"></i>{" "}{t("Logout")}
                                        </Button>
                                    ) : (
                                        <Button variant="primary" onClick={() => { setShow(true) }}>
                                            {t("Login")}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </Container>

            </nav>
            <ModalLogin show={show} handleClose={() => { setShow(false) }} />
        </React.Fragment>
    )
}
export default Navbar;