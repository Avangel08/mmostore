import React, { useState} from 'react';
import { Button, Dropdown, Badge } from 'react-bootstrap';
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
    
    const currentPlan = user?.current_plan || { name: "Free", expires_on: null };
    const formatExpiryDate = (dateString: string) => {
        return moment(dateString).format('DD/MM/YYYY');
    };

    // Check plan expiration status
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
                     <div className={`px-3 py-2 rounded mx-2 mb-2 mouse-pointer cursor-pointer ${
                        planStatus === 'expired' ? 'bg-danger-subtle border border-danger' :
                        planStatus === 'expiring-soon' ? 'bg-warning-subtle border border-warning' :
                        planStatus === 'expiring' ? 'bg-warning-subtle' :
                        'bg-light-subtle'
                     }`}>
                        <div className="d-flex flex-column" onClick={() => { window.open(route('seller.plan.index'), '_self'); }}>
                            <div className="d-flex align-items-center justify-content-between mb-1">
                                <span className={`fw-semibold ${
                                    planStatus === 'expired' ? 'text-danger' :
                                    planStatus === 'expiring-soon' ? 'text-warning' :
                                    planStatus === 'expiring' ? 'text-warning' :
                                    'text-primary'
                                }`} style={{fontSize: '0.875rem'}}>
                                    {currentPlan.name}
                                </span>
                                {planStatus === 'expired' && (
                                    <Badge bg="danger" className="ms-2" style={{fontSize: '0.65rem'}}>
                                        {t("Expired")}
                                    </Badge>
                                )}
                                {planStatus === 'expiring-soon' && (
                                    <Badge bg="warning" className="ms-2" style={{fontSize: '0.65rem'}}>
                                        {t("Expiring Soon")}
                                    </Badge>
                                )}
                            </div>
                            {currentPlan.expires_on && (
                                <small className={`d-flex align-items-center ${
                                    planStatus === 'expired' ? 'text-danger' :
                                    planStatus === 'expiring-soon' ? 'text-warning' :
                                    planStatus === 'expiring' ? 'text-warning' :
                                    'text-muted'
                                }`}>
                                    <i className={`mdi me-1 ${
                                        planStatus === 'expired' ? 'mdi-alert-circle' :
                                        planStatus === 'expiring-soon' ? 'mdi-clock-alert' :
                                        planStatus === 'expiring' ? 'mdi-clock-outline' :
                                        'mdi-calendar-clock'
                                    }`}></i>
                                    {planStatus === 'expired' ? 
                                        `${t("Expires date")}: ${formatExpiryDate(currentPlan.expires_on)}` :
                                        (planStatus === 'expiring-soon' || planStatus === 'expiring') ?
                                        `${getDaysUntilExpiry()} ${t("days left")} (${formatExpiryDate(currentPlan.expires_on)})` :
                                        `${t("Expires")}: ${formatExpiryDate(currentPlan.expires_on)}`
                                    }
                                </small>
                            )}
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
