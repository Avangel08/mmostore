import { Inertia } from "@inertiajs/inertia";
import React, { useEffect, useState } from "react";

const Navdata = () => {
    //state data
    const [isRoleManagement, setIsRoleManagement] = useState<boolean>(false);
    const [isPermissionManagement, setIsPermissionManagement] = useState<boolean>(false);
    const [iscurrentState, setIscurrentState] = useState('Role Management');

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
            id: "rolemanagement",
            label: "Role Management",
            icon: "ri-user-star-fill",
            link: route("admin.index"),
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
            label: "Permission Management",
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
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;