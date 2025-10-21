import React, { useState} from 'react';
import { Button, Dropdown } from 'react-bootstrap';
import { Link, usePage, router } from '@inertiajs/react';
import moment from "moment";
//import images
import avatar1 from "../../images/users/user-dummy-img.jpg";
import { useTranslation } from 'react-i18next';

const CustomProfileDropdown = () => {
    const { t } = useTranslation();
    const user = usePage().props.auth.user as any;
    const subdomain = usePage().props.subdomain || "";
    const storageUrl = usePage().props.storageUrl || "";
    const username = (user?.first_name || user?.last_name) ? ((user?.first_name ?? "") + ' ' + (user?.last_name ?? "")) : (user?.name ?? "");
    
    const currentPlan = user?.plan || { name: "Basic Plan", expires_at: "2025-12-31" };
    const formatExpiryDate = (dateString: string) => {
        return moment(dateString).format('DD/MM/YYYY');
    };
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
                        <img className="rounded-circle header-profile-user object-fit-contain" src={user?.image ? `${storageUrl}/${user.image}` : avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">{username}</span>
                        </span>
                    </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                    <h6 className="dropdown-header">{t("Hello")}, {username}</h6>
                    
                    {/* Plan Information Section */}
                     <div className="px-3 py-2 bg-light-subtle rounded mx-2 mb-2 mouse-pointer cursor-pointer">
                        <div className="d-flex flex-column" onClick={() => { window.open(route('seller.plan.index'), '_self'); }}>
                            <span className="fw-semibold text-primary mb-1" style={{fontSize: '0.875rem'}}>
                                {currentPlan.name}
                            </span>
                            <small className="text-muted d-flex align-items-center">
                                <i className="mdi mdi-calendar-clock text-warning me-1"></i>
                                {t("Expires")}: {formatExpiryDate(currentPlan.expires_at)}
                            </small>
                        </div>
                    </div> 
                    
                    <div className="dropdown-divider"></div>
                    <Dropdown.Item href={route("seller.profile")} className="dropdown-item">
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
