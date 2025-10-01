import React, { useEffect } from "react";
import { Head, usePage } from "@inertiajs/react";
import Layout from "../../Layouts";
import { Table } from "../Tables";
import PageHeader from "../PageHeader/PageHeader";
import { themeStorage, ThemeConfig } from "../../config/theme.config";
import { useThemeConfig } from "../../hooks/useThemeConfig";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from 'reselect';
import { changeLayoutTheme } from "../../../../../slices/thunk";

const Index = () => {
    const theme = useThemeConfig()
    const dispatch: any = useDispatch();

    useEffect(() => {
        if (theme) {
            dispatch(changeLayoutTheme(theme?.nameTheme));
        }
    }, [theme, dispatch])

    return (
        <React.Fragment>
            <Head title="MMO Store" />
            <PageHeader title={theme?.titleHeader ?? ""} />
            <Table />
        </React.Fragment>
    )
}
Index.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default Index;