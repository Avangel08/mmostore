import React, { useState, useEffect } from "react";
import { Collapse, Container, NavbarToggle, NavLink } from "react-bootstrap";
import Scrollspy from "react-scrollspy";

// Import Images
import logodark from "../../../images/logo-dark.png";
import logolight from "../../../images/logo-light.png";
import { Link } from "@inertiajs/react";
import { useTranslation } from "react-i18next";

const Navbar = () => {
    const [isOpenMenu, setisOpenMenu] = useState<boolean>(false);
    const [navClass, setnavClass] = useState<any>("");
    const { t } = useTranslation();

    const toggle = () => setisOpenMenu(!isOpenMenu);

    useEffect(() => {
        window.addEventListener("scroll", scrollNavigation, true);
    });

    const scrollNavigation = () => {
        var scrollup = document.documentElement.scrollTop;
        if (scrollup > 50) {
            setnavClass("is-sticky");
        } else {
            setnavClass("");
        }
    };
    const [activeLink, setActiveLink] = useState<any>();
    useEffect(() => {
        const activation = (event: any) => {
            const target: any = event.target;
            if (target) {
                target.classList.add("active");
                setActiveLink(target);
                if (activeLink && activeLink !== target) {
                    activeLink.classList.remove("active");
                }
            }
        };
        const defaultLink: any = document.querySelector(".navbar li.a.active");
        if (defaultLink) {
            defaultLink?.classList.add("active");
            setActiveLink(defaultLink);
        }
        const links = document.querySelectorAll(".navbar a");
        links.forEach((link) => {
            link.addEventListener("click", activation);
        });
        return () => {
            links.forEach((link) => {
                link.removeEventListener("click", activation);
            });
        };
    }, [activeLink]);

    return (
        <React.Fragment>
            <nav
                className={
                    "navbar navbar-expand-lg navbar-landing fixed-top " +
                    navClass
                }
                id="navbar"
            >
                <Container>
                    <Link className="navbar-brand" href="/">
                        <img
                            src={logodark}
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height="17"
                        />
                        <img
                            src={logolight}
                            className="card-logo card-logo-light"
                            alt="logo light"
                            height="17"
                        />
                    </Link>

                    <NavbarToggle
                        className="navbar-toggler py-0 fs-20 text-body"
                        onClick={toggle}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <i className="mdi mdi-menu"></i>
                    </NavbarToggle>

                    <Collapse in={isOpenMenu} className="navbar-collapse">
                        <div>
                            <Scrollspy
                                offset={-18}
                                items={[
                                    "hero",
                                    "services",
                                    "features",
                                    "plans",
                                    "reviews",
                                    "team",
                                    "contact",
                                ]}
                                currentClassName="active"
                                className="navbar-nav mx-auto mt-2 mt-lg-0"
                                id="navbar-example"
                            >
                                <li className="nav-item">
                                    <NavLink href="#">Về chúng tôi</NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink href="#features">Tính năng</NavLink>
                                </li>
                                {/* <li className="nav-item">
                                    <NavLink href="#plans">Plans</NavLink>
                                </li> */}
                                <li className="nav-item">
                                    <NavLink href="#faqs">FAQ</NavLink>
                                </li>
                                {/* <li className="nav-item">
                                    <NavLink href="/">Tài liệu</NavLink>
                                </li> */}
                            </Scrollspy>

                            <div className="">
                                <Link
                                    href="/login"
                                    className="btn btn-link fw-medium text-decoration-none text-body"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn btn-primary btn-bg-primary border-0"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </div>
                    </Collapse>
                </Container>
            </nav>
        </React.Fragment>
    );
};

export default Navbar;
