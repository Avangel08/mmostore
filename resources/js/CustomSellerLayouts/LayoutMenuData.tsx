import { Inertia } from "@inertiajs/inertia";
import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navdata = () => {
    const subdomain = usePage().props.subdomain;
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isCategory, setIsCategory] = useState<boolean>(false);
    const [isProduct, setIsProduct] = useState<boolean>(false);
    const [iscurrentState, setIscurrentState] = useState('Dashboard');

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
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        if (iscurrentState !== 'Category') {
            setIsCategory(false);
        }
        if (iscurrentState !== 'Product') {
            setIsProduct(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isCategory,
        isProduct,
    ]);

    const menuItems : any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: route("seller.dashboard"),
            stateVariables: isDashboard,
            click: function (e : any) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
        },
        {
            id: "category",
            label: "Category Management",
            icon: "ri-file-list-fill",
            link: route('seller.category.index'),
            stateVariables: isCategory,
            click: function (e : any) {
                e.preventDefault();
                setIsCategory(!isCategory);
                setIscurrentState('Category');
                updateIconSidebar(e);
            },
        },
        {
            id: "product",
            label: "Product Management",
            icon: "ri-box-3-fill",
            link: route('seller.product.index'),
            stateVariables: isProduct,
            click: function (e : any) {
                e.preventDefault();
                setIsProduct(!isProduct);
                setIscurrentState('Product');
                updateIconSidebar(e);
            },
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;