import { Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
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

const Navbar = ({ onChangeLayoutMode, layoutModeType }: any) => {
    const dispatch: any = useDispatch();
    const [isOpenMenu, setisOpenMenu] = useState<boolean>(false);
    const [navClass, setnavClass] = useState<any>("");
    const [show, setShow] = useState(false);

    const { user } = usePage().props;
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
                    <Link className="navbar-brand" href="/dashboard">
                        <img
                            src={logoLight}
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height="17"
                        />
                        <img
                            src={logoLight}
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
                                    <NavLink className="fs-16" href="#hero">
                                        Sản phẩm
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink className="fs-16" href="#process">
                                        Nạp tiền
                                    </NavLink>
                                </li>
                            </Scrollspy>

                            <div className="d-flex align-items-center">
                                {/* Dark/Light Mode set */}
                                <LightDark
                                    layoutMode={layoutModeType}
                                    onChangeLayoutMode={onChangeLayoutMode}
                                />

                                {/* NotificationDropdown */}
                                <NotificationDropdown />

                                {/* User Login/Register */}
                                <div className="ms-sm-3 header-item d-none d-sm-flex">
                                    <Button variant="primary" onClick={() => { setShow(true) }}>
                                        Đăng nhập
                                    </Button>
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