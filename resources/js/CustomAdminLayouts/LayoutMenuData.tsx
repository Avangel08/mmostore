import { Inertia } from "@inertiajs/inertia";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navdata = () => {
    //state data
    const [isRoleManagement, setIsRoleManagement] = useState<boolean>(false);
    const [isPermissionManagement, setIsPermissionManagement] = useState<boolean>(false);
    const [isPlanManagement, setIsPlanManagement] = useState<boolean>(false);
    const [iscurrentState, setIscurrentState] = useState('Role Management');
    const { t } = useTranslation();

    function updateIconSidebar(e : any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul : any = document.getElementById("two-column-menu");
            const iconItems : any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID : any = document.getElementById(id) as HTMLElement;
                if (getID)
                    getID?.parentElement.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Role Management') {
            setIsRoleManagement(false);
        }
        if (iscurrentState !== 'Permission Management') {
            setIsPermissionManagement(false);
        }
        if (iscurrentState !== 'Plan Management') {
            setIsPlanManagement(false);
        }
    }, [
        history,
        iscurrentState,
        isRoleManagement,
        isPermissionManagement,
    ]);

    const menuItems : any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "ri-user-star-fill",
            link: route("admin.dashboard"),
            click: function (e : any) {
                e.preventDefault();
                updateIconSidebar(e);
            },
        },
        {
            id: "usermanagement",
            label: t("User"),
            icon: "ri-user-star-fill",
            link: route("admin.user.index"),
            click: function (e : any) {
                e.preventDefault();
                setIscurrentState('User');
                updateIconSidebar(e);
            },
        },
        {
            id: "rolemanagement",
            label: t("Role"),
            icon: "ri-user-star-fill",
            link: route("admin.roles.index"),
            stateVariables: isRoleManagement,
            click: function (e : any) {
                e.preventDefault();
                setIsRoleManagement(!isRoleManagement);
                setIscurrentState('Role Management');
                updateIconSidebar(e);
            },
        },
        {
            id: "permissionmanagement",
            label: t("Permission"),
            icon: "ri-lock-2-fill",
            link: route("admin.permissions.index"),
            stateVariables: isPermissionManagement,
            click: function (e : any) {
                e.preventDefault();
                setIsPermissionManagement(!isPermissionManagement);
                setIscurrentState('Permission Management');
                updateIconSidebar(e);
            },
        },
        {
            id: "planmanagement",
            label: t("Plan"),
            icon: "ri-money-dollar-box-fill",
            link: route("admin.plans.index"),
            stateVariables: isRoleManagement,
            click: function (e : any) {
                e.preventDefault();
                setIsPlanManagement(!isPlanManagement);
                setIscurrentState('Plan Management');
                updateIconSidebar(e);
            },
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;