import { Inertia } from "@inertiajs/inertia";
import React, { useEffect, useState } from "react";

const Navdata = () => {
    //state data
    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isApps, setIsApps] = useState<boolean>(false);
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [isPages, setIsPages] = useState<boolean>(false);
    const [isBaseUi, setIsBaseUi] = useState<boolean>(false);
    const [isAdvanceUi, setIsAdvanceUi] = useState<boolean>(false);
    const [isForms, setIsForms] = useState<boolean>(false);
    const [isTables, setIsTables] = useState<boolean>(false);
    const [isCharts, setIsCharts] = useState<boolean>(false);
    const [isIcons, setIsIcons] = useState<boolean>(false);
    const [isMaps, setIsMaps] = useState<boolean>(false);
    const [isMultiLevel, setIsMultiLevel] = useState<boolean>(false);

    // Apps
    const [isCalendar, setCalendar] = useState<boolean>(false);
    const [isEmail, setEmail] = useState<boolean>(false);
    const [isSubEmail, setSubEmail] = useState<boolean>(false);
    const [isEcommerce, setIsEcommerce] = useState<boolean>(false);
    const [isProjects, setIsProjects] = useState<boolean>(false);
    const [isTasks, setIsTasks] = useState<boolean>(false);
    const [isCRM, setIsCRM] = useState<boolean>(false);
    const [isCrypto, setIsCrypto] = useState<boolean>(false);
    const [isInvoices, setIsInvoices] = useState<boolean>(false);
    const [isSupportTickets, setIsSupportTickets] = useState<boolean>(false);
    const [isNFTMarketplace, setIsNFTMarketplace] = useState<boolean>(false);
    const [isJobs, setIsJobs] = useState<boolean>(false);
    const [isJobList, setIsJobList] = useState<boolean>(false);
    const [isCandidateList, setIsCandidateList] = useState<boolean>(false);


    // Authentication
    const [isSignIn, setIsSignIn] = useState<boolean>(false);
    const [isSignUp, setIsSignUp] = useState<boolean>(false);
    const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);
    const [isPasswordCreate, setIsPasswordCreate] = useState<boolean>(false);
    const [isLockScreen, setIsLockScreen] = useState<boolean>(false);
    const [isLogout, setIsLogout] = useState<boolean>(false);
    const [isSuccessMessage, setIsSuccessMessage] = useState<boolean>(false);
    const [isVerification, setIsVerification] = useState<boolean>(false);
    const [isError, setIsError] = useState<boolean>(false);

    // Pages
    const [isProfile, setIsProfile] = useState<boolean>(false);
    const [isLanding, setIsLanding] = useState<boolean>(false);
    const [isBlog, setIsBlog] = useState<boolean>(false);

    // Charts
    const [isApex, setIsApex] = useState<boolean>(false);

    // Multi Level
    const [isLevel1, setIsLevel1] = useState<boolean>(false);
    const [isLevel2, setIsLevel2] = useState<boolean>(false);

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
        if (iscurrentState !== 'Apps') {
            setIsApps(false);
        }
        if (iscurrentState !== 'Auth') {
            setIsAuth(false);
        }
        if (iscurrentState !== 'Pages') {
            setIsPages(false);
        }
        if (iscurrentState !== 'BaseUi') {
            setIsBaseUi(false);
        }
        if (iscurrentState !== 'AdvanceUi') {
            setIsAdvanceUi(false);
        }
        if (iscurrentState !== 'Forms') {
            setIsForms(false);
        }
        if (iscurrentState !== 'Tables') {
            setIsTables(false);
        }
        if (iscurrentState !== 'Charts') {
            setIsCharts(false);
        }
        if (iscurrentState !== 'Icons') {
            setIsIcons(false);
        }
        if (iscurrentState !== 'Maps') {
            setIsMaps(false);
        }
        if (iscurrentState !== 'MuliLevel') {
            setIsMultiLevel(false);
        }
        if (iscurrentState !== 'Landing') {
            setIsLanding(false);
        }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isApps,
        isAuth,
        isPages,
        isBaseUi,
        isAdvanceUi,
        isForms,
        isTables,
        isCharts,
        isIcons,
        isMaps,
        isMultiLevel
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
            link: "/demo/#",
            stateVariables: isDashboard,
            click: function (e : any) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "analytics",
                    label: "Analytics",
                    link: "/demo/dashboard-analytics",
                    parentId: "dashboard",
                },
                {
                    id: "crm",
                    label: "CRM",
                    link: "/demo/dashboard-crm",
                    parentId: "dashboard",
                },
                {
                    id: "ecommerce",
                    label: "Ecommerce",
                    link: "/demo/dashboard",
                    parentId: "dashboard",
                },
                {
                    id: "crypto",
                    label: "Crypto",
                    link: "/demo/dashboard-crypto",
                    parentId: "dashboard",
                },
                {
                    id: "projects",
                    label: "Projects",
                    link: "/demo/dashboard-projects",
                    parentId: "dashboard",
                },
                {
                    id: "nft",
                    label: "NFT",
                    link: "/demo/dashboard-nft",
                    parentId: "dashboard",
                },
                {
                    id: "job",
                    label: "Job",
                    link: "/demo/dashboard-job",
                    parentId: "dashboard",
                },
                {
                    id: "blog",
                    label: "Blog",
                    link: "/demo/dashboard-blog",
                    parentId: "dashboard",
                    badgeColor: "success",
                    badgeName: "New",
                },
            ],
        },
        {
            id: "apps",
            label: "Apps",
            icon: "ri-apps-2-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsApps(!isApps);
                setIscurrentState('Apps');
                updateIconSidebar(e);
            },
            stateVariables: isApps,
            subItems: [
                {
                    id: "calendar",
                    label: "Calendar",
                    link: "/demo/#",
                    parentId: "apps",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setCalendar(!isCalendar);
                    },
                    stateVariables: isCalendar,
                    childItems: [
                        {
                            id: 1,
                            label: "Main Calendar",
                            link: "/demo/apps-calendar",
                            parentId: "apps"
                        },
                        {
                            id: 2,
                            label: "Month Grid",
                            link: "/demo/apps-calendar-month-grid",
                            parentId: "apps",
                        },
                    ]
                },
                {
                    id: "chat",
                    label: "Chat",
                    link: "/demo/apps-chat",
                    parentId: "apps",
                },
                {
                    id: "mailbox",
                    label: "Email",
                    link: "/demo/#",
                    parentId: "apps",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setEmail(!isEmail);
                    },
                    stateVariables: isEmail,
                    childItems: [
                        {
                            id: 1,
                            label: "Mailbox",
                            link: "/demo/apps-mailbox",
                            parentId: "apps"
                        },
                        {
                            id: 2,
                            label: "Email Templates",
                            link: "/demo/#",
                            parentId: "apps",
                            isChildItem: true,
                            stateVariables: isSubEmail,
                            click: function (e : any) {
                                e.preventDefault();
                                setSubEmail(!isSubEmail);
                            },
                            childItems: [
                                { id: 2, label: "Basic Action", link: "/demo/apps-email-basic", parentId: "apps" },
                                { id: 3, label: "Ecommerce Action", link: "/demo/apps-email-ecommerce", parentId: "apps" },
                            ],
                        },
                    ]
                },
                {
                    id: "appsecommerce",
                    label: "Ecommerce",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsEcommerce(!isEcommerce);
                    },
                    parentId: "apps",
                    stateVariables: isEcommerce,
                    childItems: [
                        { id: 1, label: "Products", link: "/demo/apps-ecommerce-products", parentId: "apps" },
                        { id: 2, label: "Product Details", link: "/demo/apps-ecommerce-product-details", parentId: "apps" },
                        { id: 3, label: "Create Product", link: "/demo/apps-ecommerce-add-product", parentId: "apps" },
                        { id: 4, label: "Orders", link: "/demo/apps-ecommerce-orders", parentId: "apps" },
                        { id: 5, label: "Order Details", link: "/demo/apps-ecommerce-order-details", parentId: "apps" },
                        { id: 6, label: "Customers", link: "/demo/apps-ecommerce-customers", parentId: "apps" },
                        { id: 7, label: "Shopping Cart", link: "/demo/apps-ecommerce-cart", parentId: "apps" },
                        { id: 8, label: "Checkout", link: "/demo/apps-ecommerce-checkout", parentId: "apps" },
                        { id: 9, label: "Sellers", link: "/demo/apps-ecommerce-sellers", parentId: "apps" },
                        { id: 10, label: "Seller Details", link: "/demo/apps-ecommerce-seller-details", parentId: "apps" },
                    ]
                },
                {
                    id: "appsprojects",
                    label: "Projects",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsProjects(!isProjects);
                    },
                    parentId: "apps",
                    stateVariables: isProjects,
                    childItems: [
                        { id: 1, label: "List", link: "/demo/apps-projects-list", parentId: "apps", },
                        { id: 2, label: "Overview", link: "/demo/apps-projects-overview", parentId: "apps", },
                        { id: 3, label: "Create Project", link: "/demo/apps-projects-create", parentId: "apps", },
                    ]
                },
                {
                    id: "tasks",
                    label: "Tasks",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsTasks(!isTasks);
                    },
                    parentId: "apps",
                    stateVariables: isTasks,
                    childItems: [
                        { id: 1, label: "List View", link: "/demo/apps-tasks-list-view", parentId: "apps", },
                        { id: 2, label: "Task Details", link: "/demo/apps-tasks-details", parentId: "apps", },
                        { id: 3, label: "Kanban Board", link: "/demo/apps-tasks-kanban", parentId: "apps", },
                    ]
                },
                {
                    id: "appscrm",
                    label: "CRM",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsCRM(!isCRM);
                    },
                    parentId: "apps",
                    stateVariables: isCRM,
                    childItems: [
                        { id: 1, label: "Contacts", link: "/demo/apps-crm-contacts" },
                        { id: 2, label: "Companies", link: "/demo/apps-crm-companies" },
                        { id: 3, label: "Deals", link: "/demo/apps-crm-deals" },
                        { id: 4, label: "Leads", link: "/demo/apps-crm-leads" },
                    ]
                },
                {
                    id: "appscrypto",
                    label: "Crypto",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsCrypto(!isCrypto);
                    },
                    parentId: "apps",
                    stateVariables: isCrypto,
                    childItems: [
                        { id: 1, label: "Transactions", link: "/demo/apps-crypto-transactions" },
                        { id: 2, label: "Buy & Sell", link: "/demo/apps-crypto-buy-sell" },
                        { id: 3, label: "Orders", link: "/demo/apps-crypto-orders" },
                        { id: 4, label: "My Wallet", link: "/demo/apps-crypto-wallet" },
                        { id: 5, label: "ICO List", link: "/demo/apps-crypto-ico" },
                        { id: 6, label: "KYC Application", link: "/demo/apps-crypto-kyc" },
                    ]
                },
                {
                    id: "invoices",
                    label: "Invoices",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsInvoices(!isInvoices);
                    },
                    parentId: "apps",
                    stateVariables: isInvoices,
                    childItems: [
                        { id: 1, label: "List View", link: "/demo/apps-invoices-list" },
                        { id: 2, label: "Details", link: "/demo/apps-invoices-details" },
                        { id: 3, label: "Create Invoice", link: "/demo/apps-invoices-create" },
                    ]
                },
                {
                    id: "supportTickets",
                    label: "Support Tickets",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsSupportTickets(!isSupportTickets);
                    },
                    parentId: "apps",
                    stateVariables: isSupportTickets,
                    childItems: [
                        { id: 1, label: "List View", link: "/demo/apps-tickets-list" },
                        { id: 2, label: "Ticket Details", link: "/demo/apps-tickets-details" },
                    ]
                },
                {
                    id: "NFTMarketplace",
                    label: "NFT Marketplace",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsNFTMarketplace(!isNFTMarketplace);
                    },
                    parentId: "apps",
                    stateVariables: isNFTMarketplace,
                    childItems: [
                        { id: 1, label: "Marketplace", link: "/demo/apps-nft-marketplace" },
                        { id: 2, label: "Explore Now", link: "/demo/apps-nft-explore" },
                        { id: 3, label: "Live Auction", link: "/demo/apps-nft-auction" },
                        { id: 4, label: "Item Details", link: "/demo/apps-nft-item-details" },
                        { id: 5, label: "Collections", link: "/demo/apps-nft-collections" },
                        { id: 6, label: "Creators", link: "/demo/apps-nft-creators" },
                        { id: 7, label: "Ranking", link: "/demo/apps-nft-ranking" },
                        { id: 8, label: "Wallet Connect", link: "/demo/apps-nft-wallet" },
                        { id: 9, label: "Create NFT", link: "/demo/apps-nft-create" },
                    ]
                },
                {
                    id: "filemanager",
                    label: "File Manager",
                    link: "/demo/apps-file-manager",
                    parentId: "apps",
                },
                {
                    id: "todo",
                    label: "To Do",
                    link: "/demo/apps-todo",
                    parentId: "apps",
                },
                {
                    id: "job",
                    label: "Jobs",
                    link: "/demo/#",
                    parentId: "apps",
                    // badgeName: "New",
                    // badgeColor: "success",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsJobs(!isJobs);
                    },
                    stateVariables: isJobs,
                    childItems: [
                        {
                            id: 1,
                            label: "Statistics",
                            link: "/demo/apps-job-statistics",
                            parentId: "apps",
                        },
                        {
                            id: 2,
                            label: "Job Lists",
                            link: "/demo/#",
                            parentId: "apps",
                            isChildItem: true,
                            stateVariables: isJobList,
                            click: function (e : any) {
                                e.preventDefault();
                                setIsJobList(!isJobList);
                            },
                            childItems: [
                                {
                                    id: 1,
                                    label: "List",
                                    link: "/demo/apps-job-lists",
                                    parentId: "apps",
                                },
                                {
                                    id: 2,
                                    label: "Grid",
                                    link: "/demo/apps-job-grid-lists",
                                    parentId: "apps",
                                },
                                {
                                    id: 3,
                                    label: "Overview",
                                    link: "/demo/apps-job-details",
                                    parentId: "apps",
                                },
                            ],
                        },
                        {
                            id: 3,
                            label: "Candidate Lists",
                            link: "/demo/#",
                            parentId: "apps",
                            isChildItem: true,
                            stateVariables: isCandidateList,
                            click: function (e : any) {
                                e.preventDefault();
                                setIsCandidateList(!isCandidateList);
                            },
                            childItems: [
                                {
                                    id: 1,
                                    label: "List View",
                                    link: "/demo/apps-job-candidate-lists",
                                    parentId: "apps",
                                },
                                {
                                    id: 2,
                                    label: "Grid View",
                                    link: "/demo/apps-job-candidate-grid",
                                    parentId: "apps",
                                },
                            ],
                        },
                        {
                            id: 4,
                            label: "Application",
                            link: "/demo/apps-job-application",
                            parentId: "apps",
                        },
                        {
                            id: 5,
                            label: "New Job",
                            link: "/demo/apps-job-new",
                            parentId: "apps",
                        },
                        {
                            id: 6,
                            label: "Companies List",
                            link: "/demo/apps-job-companies-lists",
                            parentId: "apps",
                        },
                        {
                            id: 7,
                            label: "Job Categories",
                            link: "/demo/apps-job-categories",
                            parentId: "apps",
                        },
                    ],
                },
                {
                    id: "apikey",
                    label: "API Key",
                    link: "/demo/apps-api-key",
                    parentId: "apps",
                    // badgeName: "New",
                    // badgeColor: "success"
                },
            ],
        },
        {
            label: "pages",
            isHeader: true,
        },
        {
            id: "authentication",
            label: "Authentication",
            icon: "ri-account-circle-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsAuth(!isAuth);
                setIscurrentState('Auth');
                updateIconSidebar(e);
            },
            stateVariables: isAuth,
            subItems: [
                {
                    id: "signIn",
                    label: "Sign In",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsSignIn(!isSignIn);
                    },
                    parentId: "authentication",
                    stateVariables: isSignIn,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-signin-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-signin-cover" },
                    ]
                },
                {
                    id: "signUp",
                    label: "Sign Up",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsSignUp(!isSignUp);
                    },
                    parentId: "authentication",
                    stateVariables: isSignUp,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-signup-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-signup-cover" },
                    ]
                },
                {
                    id: "passwordReset",
                    label: "Password Reset",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsPasswordReset(!isPasswordReset);
                    },
                    parentId: "authentication",
                    stateVariables: isPasswordReset,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-pass-reset-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-pass-reset-cover" },
                    ]
                },
                {
                    id: "passwordCreate",
                    label: "Password Create",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsPasswordCreate(!isPasswordCreate);
                    },
                    parentId: "authentication",
                    stateVariables: isPasswordCreate,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-pass-change-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-pass-change-cover" },
                    ]
                },
                {
                    id: "lockScreen",
                    label: "Lock Screen",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsLockScreen(!isLockScreen);
                    },
                    parentId: "authentication",
                    stateVariables: isLockScreen,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-lockscreen-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-lockscreen-cover" },
                    ]
                },
                {
                    id: "logout",
                    label: "Logout",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsLogout(!isLogout);
                    },
                    parentId: "authentication",
                    stateVariables: isLogout,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-logout-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-logout-cover" },
                    ]
                },
                {
                    id: "successMessage",
                    label: "Success Message",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsSuccessMessage(!isSuccessMessage);
                    },
                    parentId: "authentication",
                    stateVariables: isSuccessMessage,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-success-msg-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-success-msg-cover" },
                    ]
                },
                {
                    id: "twoStepVerification",
                    label: "Two Step Verification",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsVerification(!isVerification);
                    },
                    parentId: "authentication",
                    stateVariables: isVerification,
                    childItems: [
                        { id: 1, label: "Basic", link: "/demo/auth-twostep-basic" },
                        { id: 2, label: "Cover", link: "/demo/auth-twostep-cover" },
                    ]
                },
                {
                    id: "errors",
                    label: "Errors",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsError(!isError);
                    },
                    parentId: "authentication",
                    stateVariables: isError,
                    childItems: [
                        { id: 1, label: "404 Basic", link: "/demo/auth-404-basic" },
                        { id: 2, label: "404 Cover", link: "/demo/auth-404-cover" },
                        { id: 3, label: "404 Alt", link: "/demo/auth-404-alt" },
                        { id: 4, label: "500", link: "/demo/auth-500" },
                        { id: 5, label: "Offline Page", link: "/demo/auth-offline" },
                    ]
                },
            ],
        },
        {
            id: "pages",
            label: "Pages",
            icon: "ri-pages-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsPages(!isPages);
                setIscurrentState('Pages');
                updateIconSidebar(e);
            },
            stateVariables: isPages,
            subItems: [
                {
                    id: "starter",
                    label: "Starter",
                    link: "/demo/pages-starter",
                    parentId: "pages",
                },
                {
                    id: "profile",
                    label: "Profile",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsProfile(!isProfile);
                    },
                    parentId: "pages",
                    stateVariables: isProfile,
                    childItems: [
                        { id: 1, label: "Simple Page", link: "/demo/pages-profile", parentId: "pages" },
                        { id: 2, label: "Settings", link: "/demo/pages-profile-settings", parentId: "pages" },
                    ]
                },
                { id: "team", label: "Team", link: "/demo/pages-team", parentId: "pages" },
                { id: "timeline", label: "Timeline", link: "/demo/pages-timeline", parentId: "pages" },
                { id: "faqs", label: "FAQs", link: "/demo/pages-faqs", parentId: "pages" },
                { id: "pricing", label: "Pricing", link: "/demo/pages-pricing", parentId: "pages" },
                { id: "gallery", label: "Gallery", link: "/demo/pages-gallery", parentId: "pages" },
                { id: "maintenance", label: "Maintenance", link: "/demo/pages-maintenance", parentId: "pages" },
                { id: "comingSoon", label: "Coming Soon", link: "/demo/pages-coming-soon", parentId: "pages" },
                { id: "sitemap", label: "Sitemap", link: "/demo/pages-sitemap", parentId: "pages" },
                { id: "searchResults", label: "Search Results", link: "/demo/pages-search-results", parentId: "pages" },
                { id: "PrivecyPolicy", label: "Privacy Policy", link: "/demo/pages-privacy-policy", parentId: "pages" },
                { id: "TermsCondition", label: "Terms Condition", link: "/demo/pages-terms-condition", parentId: "pages" },
                {
                    id: "blogs",
                    label: "Blogs",
                    link: "/demo/#",
                    isChildItem: true,
                    badgeColor: "success", badgeName: "New",
                    click: function (e: any) {
                        e.preventDefault();
                        setIsBlog(!isBlog);
                    },
                    parentId: "pages",
                    stateVariables: isBlog,
                    childItems: [
                        { id: 1, label: "List View", link: "/demo/pages-blog-list", parentId: "pages" },
                        { id: 2, label: "Grid View", link: "/demo/pages-blog-grid", parentId: "pages" },
                        { id: 3, label: "Overview", link: "/demo/pages-blog-overview", parentId: "pages" },
                    ]
                }
            ],
        },
        {
            id: "landing",
            label: "Landing",
            icon: "ri-rocket-line",
            link: "/demo/#",
            stateVariables: isLanding,
            click: function (e : any) {
                e.preventDefault();
                setIsLanding(!isLanding);
                setIscurrentState('Landing');
                updateIconSidebar(e);
            },
            subItems: [
                { id: "onePage", label: "One Page", link: "/demo/landing", parentId: "landing" },
                { id: "nftLanding", label: "NFT Landing", link: "/demo/nft-landing", parentId: "landing" },
                { id: "jobLanding", label: "Job", link: "/demo/job-landing", parentId: "landing", 
                // badgeColor: "success", badgeName: "New"
             },
            ],
        },
        {
            label: "Components",
            isHeader: true,
        },
        {
            id: "baseUi",
            label: "Base UI",
            icon: "ri-pencil-ruler-2-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsBaseUi(!isBaseUi);
                setIscurrentState('BaseUi');
                updateIconSidebar(e);
            },
            stateVariables: isBaseUi,
            subItems: [
                { id: "alerts", label: "Alerts", link: "/demo/ui-alerts", parentId: "baseUi" },
                { id: "badges", label: "Badges", link: "/demo/ui-badges", parentId: "baseUi" },
                { id: "buttons", label: "Buttons", link: "/demo/ui-buttons", parentId: "baseUi" },
                { id: "colors", label: "Colors", link: "/demo/ui-colors", parentId: "baseUi" },
                { id: "cards", label: "Cards", link: "/demo/ui-cards", parentId: "baseUi" },
                { id: "carousel", label: "Carousel", link: "/demo/ui-carousel", parentId: "baseUi" },
                { id: "dropdowns", label: "Dropdowns", link: "/demo/ui-dropdowns", parentId: "baseUi" },
                { id: "grid", label: "Grid", link: "/demo/ui-grid", parentId: "baseUi" },
                { id: "images", label: "Images", link: "/demo/ui-images", parentId: "baseUi" },
                { id: "tabs", label: "Tabs", link: "/demo/ui-tabs", parentId: "baseUi" },
                { id: "accordions", label: "Accordion & Collapse", link: "/demo/ui-accordions", parentId: "baseUi" },
                { id: "modals", label: "Modals", link: "/demo/ui-modals", parentId: "baseUi" },
                { id: "offcanvas", label: "Offcanvas", link: "/demo/ui-offcanvas", parentId: "baseUi" },
                { id: "placeholders", label: "Placeholders", link: "/demo/ui-placeholders", parentId: "baseUi" },
                { id: "progress", label: "Progress", link: "/demo/ui-progress", parentId: "baseUi" },
                { id: "notifications", label: "Notifications", link: "/demo/ui-notifications", parentId: "baseUi" },
                { id: "media", label: "Media object", link: "/demo/ui-media", parentId: "baseUi" },
                { id: "embedvideo", label: "Embed Video", link: "/demo/ui-embed-video", parentId: "baseUi" },
                { id: "typography", label: "Typography", link: "/demo/ui-typography", parentId: "baseUi" },
                { id: "lists", label: "Lists", link: "/demo/ui-lists", parentId: "baseUi" },
                { id: "links", label: "Links", link: "/demo/ui-links", parentId: "baseUi", badgeColor: "success", badgeName: "New" },
                { id: "general", label: "General", link: "/demo/ui-general", parentId: "baseUi" },
                { id: "ribbons", label: "Ribbons", link: "/demo/ui-ribbons", parentId: "baseUi" },
                { id: "utilities", label: "Utilities", link: "/demo/ui-utilities", parentId: "baseUi" },
            ],
        },
        {
            id: "advanceUi",
            label: "Advance UI",
            icon: "ri-stack-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsAdvanceUi(!isAdvanceUi);
                setIscurrentState('AdvanceUi');
                updateIconSidebar(e);
            },
            stateVariables: isAdvanceUi,
            subItems: [
                { id: "scrollbar", label: "Scrollbar", link: "/demo/advance-ui-scrollbar", parentId: "advanceUi" },
                { id: "swiperslider", label: "Swiper Slider", link: "/demo/advance-ui-swiper", parentId: "advanceUi" },
                { id: "ratings", label: "Ratings", link: "/demo/advance-ui-ratings", parentId: "advanceUi" },
                { id: "highlight", label: "Highlight", link: "/demo/advance-ui-highlight", parentId: "advanceUi" },
            ],
        },
        {
            id: "widgets",
            label: "Widgets",
            icon: "ri-honour-line",
            link: "/demo/widgets",
        },
        {
            id: "forms",
            label: "Forms",
            icon: "ri-file-list-3-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsForms(!isForms);
                setIscurrentState('Forms');
                updateIconSidebar(e);
            },
            stateVariables: isForms,
            subItems: [
                { id: "basicelements", label: "Basic Elements", link: "/demo/forms-elements", parentId: "forms" },
                { id: "formselect", label: "Form Select", link: "/demo/forms-select", parentId: "forms" },
                { id: "checkboxsradios", label: "Checkboxs & Radios", link: "/demo/forms-checkboxes-radios", parentId: "forms" },
                { id: "pickers", label: "Pickers", link: "/demo/forms-pickers", parentId: "forms" },
                { id: "inputmasks", label: "Input Masks", link: "/demo/forms-masks", parentId: "forms" },
                { id: "advanced", label: "Advanced", link: "/demo/forms-advanced", parentId: "forms" },
                { id: "rangeslider", label: "Range Slider", link: "/demo/forms-range-sliders", parentId: "forms" },
                { id: "validation", label: "Validation", link: "/demo/forms-validation", parentId: "forms" },
                { id: "wizard", label: "Wizard", link: "/demo/forms-wizard", parentId: "forms" },
                { id: "editors", label: "Editors", link: "/demo/forms-editors", parentId: "forms" },
                { id: "fileuploads", label: "File Uploads", link: "/demo/forms-file-uploads", parentId: "forms" },
                { id: "formlayouts", label: "Form Layouts", link: "/demo/forms-layouts", parentId: "forms" },
                { id: "select2", label: "Select2", link: "/demo/forms-select2", parentId: "forms" },
            ],
        },
        {
            id: "tables",
            label: "Tables",
            icon: "ri-layout-grid-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsTables(!isTables);
                setIscurrentState('Tables');
                updateIconSidebar(e);
            },
            stateVariables: isTables,
            subItems: [
                { id: "basictables", label: "Basic Tables", link: "/demo/tables-basic", parentId: "tables" },
                { id: "reactdatatables", label: "React Datatables", link: "/demo/tables-react", parentId: "tables" },
            ],
        },
        {
            id: "charts",
            label: "Charts",
            icon: "ri-pie-chart-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsCharts(!isCharts);
                setIscurrentState('Charts');
                updateIconSidebar(e);
            },
            stateVariables: isCharts,
            subItems: [
                {
                    id: "apexcharts",
                    label: "Apexcharts",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsApex(!isApex);
                    },
                    stateVariables: isApex,
                    childItems: [
                        { id: 1, label: "Line", link: "/demo/charts-apex-line" },
                        { id: 2, label: "Area", link: "/demo/charts-apex-area" },
                        { id: 3, label: "Column", link: "/demo/charts-apex-column" },
                        { id: 4, label: "Bar", link: "/demo/charts-apex-bar" },
                        { id: 5, label: "Mixed", link: "/demo/charts-apex-mixed" },
                        { id: 6, label: "Timeline", link: "/demo/charts-apex-timeline" },
                        { id: 7, label: "Range Area", link: "/demo/charts-apex-range-area" },
                        { id: 8, label: "Funnel", link: "/demo/charts-apex-funnel" },
                        { id: 9, label: "Candlstick", link: "/demo/charts-apex-candlestick" },
                        { id: 10, label: "Boxplot", link: "/demo/charts-apex-boxplot" },
                        { id: 11, label: "Bubble", link: "/demo/charts-apex-bubble" },
                        { id: 12, label: "Scatter", link: "/demo/charts-apex-scatter" },
                        { id: 13, label: "Heatmap", link: "/demo/charts-apex-heatmap" },
                        { id: 14, label: "Treemap", link: "/demo/charts-apex-treemap" },
                        { id: 15, label: "Pie", link: "/demo/charts-apex-pie" },
                        { id: 16, label: "Radialbar", link: "/demo/charts-apex-radialbar" },
                        { id: 17, label: "Radar", link: "/demo/charts-apex-radar" },
                        { id: 18, label: "Polar Area", link: "/demo/charts-apex-polar" },
                        { id: 19, label: "Slope", link: "/demo/charts-apex-slope", parentId: "charts", badgeColor: "success", badgeName: "New" },
                    ]
                },
                { id: "chartjs", label: "Chartjs", link: "/demo/charts-chartjs", parentId: "charts" },
                { id: "echarts", label: "Echarts", link: "/demo/charts-echarts", parentId: "charts" },

            ],
        },
        {
            id: "icons",
            label: "Icons",
            icon: "ri-compasses-2-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsIcons(!isIcons);
                setIscurrentState('Icons');
                updateIconSidebar(e);
            },
            stateVariables: isIcons,
            subItems: [
                { id: "remix", label: "Remix", link: "/demo/icons-remix", parentId: "icons" },
                { id: "boxicons", label: "Boxicons", link: "/demo/icons-boxicons", parentId: "icons" },
                { id: "materialdesign", label: "Material Design", link: "/demo/icons-materialdesign", parentId: "icons" },
                { id: "lineawesome", label: "Line Awesome", link: "/demo/icons-lineawesome", parentId: "icons" },
                { id: "feather", label: "Feather", link: "/demo/icons-feather", parentId: "icons" },
                { id: "crypto", label: "Crypto SVG", link: "/demo/icons-crypto", parentId: "icons" },
            ],
        },
        {
            id: "maps",
            label: "Maps",
            icon: "ri-map-pin-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsMaps(!isMaps);
                setIscurrentState('Maps');
                updateIconSidebar(e);
            },
            stateVariables: isMaps,
            subItems: [
                { id: "google", label: "Google", link: "/demo/maps-google", parentId: "maps" },
            ],
        },
        {
            id: "multilevel",
            label: "Multi Level",
            icon: "ri-share-line",
            link: "/demo/#",
            click: function (e : any) {
                e.preventDefault();
                setIsMultiLevel(!isMultiLevel);
                setIscurrentState('MuliLevel');
                updateIconSidebar(e);
            },
            stateVariables: isMultiLevel,
            subItems: [
                { id: "level1.1", label: "Level 1.1", link: "/demo/#", parentId: "multilevel" },
                {
                    id: "level1.2",
                    label: "Level 1.2",
                    link: "/demo/#",
                    isChildItem: true,
                    click: function (e : any) {
                        e.preventDefault();
                        setIsLevel1(!isLevel1);
                    },
                    stateVariables: isLevel1,
                    childItems: [
                        { id: 1, label: "Level 2.1", link: "/demo/#" },
                        {
                            id: "level2.2",
                            label: "Level 2.2",
                            link: "/demo/#",
                            isChildItem: true,
                            click: function (e : any) {
                                e.preventDefault();
                                setIsLevel2(!isLevel2);
                            },
                            stateVariables: isLevel2,
                            childItems: [
                                { id: 1, label: "Level 3.1", link: "/demo/#" },
                                { id: 2, label: "Level 3.2", link: "/demo/#" },
                            ]
                        },
                    ]
                },
            ],
        },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;