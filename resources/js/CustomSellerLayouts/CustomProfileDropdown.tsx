import React, { useState} from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link, usePage, router } from '@inertiajs/react';
//import images
import avatar1 from "../../images/users/user-dummy-img.jpg";
import { useTranslation } from 'react-i18next';

const CustomProfileDropdown = () => {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    const subdomain = usePage().props.subdomain || "";
    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState<boolean>(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };

    const handleLogout = () => {
        router.post(route('seller.logout', subdomain), {}, {
            onSuccess: () => {
                // Reload page to refresh CSRF token after successful logout
                window.location.reload();
            }
        });
    };
    return (
        <React.Fragment>
            <Dropdown
                show={isProfileDropdown}
                onClick={toggleProfileDropdown}
                className="ms-sm-3 header-item topbar-user">
                <Dropdown.Toggle as="button" type="button" className="arrow-none btn">
                    <span className="d-flex align-items-center">
                        <img className="rounded-circle header-profile-user" src={avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{user?.name}</span>
                        </span>
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                    <h6 className="dropdown-header">{t("Hello")}, {user?.name}</h6>
                    <Dropdown.Item href={route("seller.profile", {sub: subdomain})} className="dropdown-item">
                       <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-2"></i>
                       <span className="align-middle">{t("Edit information")}</span>
                    </Dropdown.Item>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}><i
                            className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i> <span
                                className="align-middle" data-key="t-logout">{t("Logout")}</span></button>
                </Dropdown.Menu>
            </Dropdown>
        </React.Fragment>
    );
};

export default CustomProfileDropdown;