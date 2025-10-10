import React, { useEffect, useState } from "react";

//import actions
import {
    changeLayoutMode,
    changeLayoutTheme
} from "../../../../slices/thunk";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';
import Navbar from "./Navbar";
import { usePage } from "@inertiajs/react";
import { LayoutProvider } from "./LayoutContext";
import Footer from "../Theme_1/Components/Footer/Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const dispatch: any = useDispatch();
    const { subdomain, user, isAuthenticated, theme, store_settings, contacts, contact_types } = usePage().props;

    console.log({ subdomain, user, isAuthenticated, theme, store_settings })

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
                <div id="layout-wrapper">
                    <Navbar
                        layoutModeType={layoutModeType}
                        onChangeLayoutMode={onChangeLayoutMode} />
                    <div className="main-page">
                        {children}
                    </div>
                    <Footer contacts={contacts} />
                </div>
            </LayoutProvider>
        </React.Fragment>
    )
}

export default Layout; 