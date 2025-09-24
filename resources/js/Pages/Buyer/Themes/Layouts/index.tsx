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

const Layout = ({ children }: { children: React.ReactNode }) => {
    const dispatch: any = useDispatch();
    const { subdomain, user, isAuthenticated, theme } = usePage().props;

    console.log({ subdomain, user, isAuthenticated, theme })

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

    useEffect(() => {
        if (theme) {
            dispatch(changeLayoutTheme(theme));
        }
    }, [theme, dispatch])

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
            <div id="layout-wrapper">
                <Navbar
                    layoutModeType={layoutModeType}
                    onChangeLayoutMode={onChangeLayoutMode} />
                <div className="main-page">
                    {children}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Layout; 