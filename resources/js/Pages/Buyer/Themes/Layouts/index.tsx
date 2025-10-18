import React, { useEffect } from "react";

//import actions
import {
    changeLayoutMode,
} from "../../../../slices/thunk";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';
import Navbar from "./Navbar";
import { Head, usePage } from "@inertiajs/react";
import { LayoutProvider } from "./LayoutContext";
import Footer from "../theme_1/Components/Footer/Footer";
import ContactFloatingButton from "../../../../Components/ContactFloatingButton";
import { useThemeConfig } from "../hooks/useThemeConfig";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const dispatch: any = useDispatch();
    const { contacts, store, domainSuffix } = usePage().props as any;
    const theme = useThemeConfig()
    const selectLayoutState = (state: any) => state.Layout;
    const selectLayoutProperties = createSelector(
        selectLayoutState,
        (layout: any) => ({
            layoutModeType: layout.layoutModeType,
            layoutThemeType: layout.layoutThemeType,
        })
    );

    // Inside your component
    const { layoutModeType } = useSelector((state: any) => selectLayoutProperties(state));

    /* layout settings */
    useEffect(() => {
        if (layoutModeType) {
            dispatch(changeLayoutMode(layoutModeType));

        }
    }, [layoutModeType, dispatch]);

    /*
    call dark/light mode
    */
    const onChangeLayoutMode = (value: any) => {
        if (changeLayoutMode) {
            dispatch(changeLayoutMode(value));
        }
    };

    return (
        <React.Fragment>
            <LayoutProvider>
                <Head>
                    <meta
                        name="description"
                        content={theme?.metaDescription || ""}
                    />
                    <meta name="author" content={theme?.storeName || ""} />

                    {/* Open Graph meta tags */}
                    <meta property="og:title" content={theme?.storeName || ""} />
                    <meta property="og:description" content={theme?.metaDescription || ""} />
                    <meta property="og:image" content={theme?.pageHeaderImage || ""} />
                    <meta property="og:url" content={`https://${store?.domain.find((d: any) => d.includes(domainSuffix))}`} />
                    <meta property="og:type" content="product" />
                    <meta property="og:site_name" content={theme?.storeName || ""} />

                    {/* Twitter card tags (tùy chọn) */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={theme?.storeName || ""} />
                    <meta name="twitter:description" content={theme?.metaDescription || ""} />
                    <meta name="twitter:image" content={theme?.pageHeaderImage || ""} />

                    <meta name="robots" content="index, follow" />
                </Head>
                <div id="layout-wrapper">
                    <Navbar
                        layoutModeType={layoutModeType}
                        onChangeLayoutMode={onChangeLayoutMode} />
                    <div className="main-page">
                        {children}
                    </div>
                    <Footer />

                    {/* Contact Floating Button */}
                    <ContactFloatingButton contacts={contacts as any} position="bottom-right" />
                </div>
            </LayoutProvider>
        </React.Fragment>
    )
}

export default Layout; 