import { Link, usePage } from "@inertiajs/react";
import React, { useState } from "react";
import moment from "moment";

//import images
import logoSm from "../../images/logo-sm.png";
import logoDark from "../../images/logo-dark.png";
import logoLight from "../../images/logo-light.png";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { Dropdown, Form } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import { changeSidebarVisibility } from "../slices/thunk";
import SearchOption from "../Components/Common/SearchOption";
import LanguageDropdown from "../Components/Common/LanguageDropdown";
import WebAppsDropdown from "../Components/Common/WebAppsDropdown";
import MyCartDropdown from "../Components/Common/MyCartDropdown";
import FullScreenDropdown from "../Components/Common/FullScreenDropdown";
import LightDark from "../Components/Common/LightDark";
import NotificationDropdown from "../Components/Common/NotificationDropdown";
import CustomProfileDropdown from "./CustomProfileDropdown";

const Header = ({ onChangeLayoutMode, layoutModeType, headerClass }: any) => {
    const dispatch: any = useDispatch();
    const { t } = useTranslation();
    const user = usePage().props.auth.user as any;

    const currentPlan = user?.current_plan || { name: "Free", expires_on: null };
    const formatExpiryDate = (dateString: string) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    const getPlanStatus = () => {
        if (!currentPlan.expires_on) return 'free'; // Free plan
        
        const now = moment();
        const expiryDate = moment(currentPlan.expires_on);
        const daysUntilExpiry = expiryDate.diff(now, 'days');
        
        if (daysUntilExpiry < 0) return 'expired';
        if (daysUntilExpiry <= 7) return 'expiring-soon';
        if (daysUntilExpiry <= 30) return 'expiring';
        return 'active';
    };

    const planStatus = getPlanStatus();
    const getDaysUntilExpiry = () => {
        if (!currentPlan.expires_on) return 0;
        return moment(currentPlan.expires_on).diff(moment(), 'days');
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

    const handlePlanClick = () => {
        window.open(route('seller.plan.index'), '_self');
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
            <header id="page-topbar" className={headerClass}>
                <div className="layout-width">
                    <div className="navbar-header">
                        <div className="d-flex">

                            <div className="navbar-brand-box horizontal-logo">
                                <Link href="/" className="logo logo-dark">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoDark} alt="" height="17" />
                                    </span>
                                </Link>

                                <Link href="/" className="logo logo-light">
                                    <span className="logo-sm">
                                        <img src={logoSm} alt="" height="22" />
                                    </span>
                                    <span className="logo-lg">
                                        <img src={logoLight} alt="" height="17" />
                                    </span>
                                </Link>
                            </div>

                            <button
                                onClick={toogleMenuBtn}
                                type="button"
                                className="btn btn-sm px-3 fs-16 header-item vertical-menu-btn topnav-hamburger"
                                id="topnav-hamburger-icon">
                                <span className="hamburger-icon">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </span>
                            </button>

                        </div>

                        <div className="d-flex align-items-center">

                            <Dropdown show={search} onClick={toogleSearch} className="d-md-none topbar-head-dropdown header-item">
                                <Dropdown.Toggle type="button" as="button" className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle">
                                    <i className="bx bx-search fs-22"></i>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-lg dropdown-menu-end p-0">
                                    <Form className="p-3">
                                        <div className="form-group m-0">
                                            <div className="input-group">
                                                <input type="text" className="form-control" placeholder="Search ..."
                                                    aria-label="Recipient's username" />
                                                <button className="btn btn-primary" type="submit"><i
                                                    className="mdi mdi-magnify"></i></button>
                                            </div>
                                        </div>
                                    </Form>
                                </Dropdown.Menu>
                            </Dropdown>

                            {/* Plan Display - Before Language */}
                             <div className="header-item">
                                <button
                                    type="button"
                                    className={`btn btn-sm me-2 ${
                                        planStatus === 'expired' ? 'btn-danger' :
                                        planStatus === 'expiring-soon' ? 'btn-warning' :
                                        planStatus === 'expiring' ? 'btn-outline-warning' :
                                        'btn-outline-primary'
                                    }`}
                                    onClick={handlePlanClick}
                                    style={{
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        padding: '0.375rem 0.75rem'
                                    }}
                                >
                                    <div className="d-flex align-items-center">
                                        <i className={`mdi me-1 ${
                                            planStatus === 'expired' ? 'mdi-alert-circle text-white' :
                                            planStatus === 'expiring-soon' ? 'mdi-clock-alert text-white' :
                                            planStatus === 'expiring' ? 'mdi-clock-outline text-warning' :
                                            'mdi-crown text-warning'
                                        }`}></i>
                                        <div className="d-flex flex-column text-start" onClick={handlePlanClick}>
                                            <span className="fw-semibold">{currentPlan.name}</span>
                                            {currentPlan.expires_on && (
                                                <small className={`${
                                                    planStatus === 'expired' ? 'text-white' :
                                                    planStatus === 'expiring-soon' ? 'text-white' :
                                                    planStatus === 'expiring' ? 'text-warning' :
                                                    'text-muted'
                                                }`} style={{ fontSize: '0.65rem' }}>
                                                    {planStatus === 'expired' ? `${t("Expires date")}: ${formatExpiryDate(currentPlan.expires_on)}` :
                                                     planStatus === 'expiring-soon' ? `${getDaysUntilExpiry()} ${t("days left")}` :
                                                     planStatus === 'expiring' ? `${getDaysUntilExpiry()} ${t("days left")}` :
                                                     `${t("Exp")}: ${formatExpiryDate(currentPlan.expires_on)}`}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            </div> 

                            {/* LanguageDropdown */}
                            <LanguageDropdown />

                            {/* WebAppsDropdown */}
                            {/* <WebAppsDropdown /> */}

                            {/* MyCartDropdwon */}
                            {/* <MyCartDropdown /> */}

                            {/* FullScreenDropdown */}
                            {/* <FullScreenDropdown /> */}

                            {/* Dark/Light Mode set */}
                            <LightDark
                                layoutMode={layoutModeType}
                                onChangeLayoutMode={onChangeLayoutMode}
                            />

                            {/* NotificationDropdown */}
                            {/* <NotificationDropdown /> */}

                            <CustomProfileDropdown />
                        </div>
                    </div>
                </div>
            </header>
        </React.Fragment>
    )
}
export default Header;
