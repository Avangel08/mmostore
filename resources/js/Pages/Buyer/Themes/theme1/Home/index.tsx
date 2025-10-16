import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import Layout from "../../Layouts";
import { Table } from "../Tables";
import PageHeader from "../PageHeader/PageHeader";
import { useThemeConfig } from "../../hooks/useThemeConfig";

//redux
import { useDispatch } from "react-redux";
import { changeLayoutTheme } from "../../../../../slices/thunk";

const Index = () => {
    const theme = useThemeConfig()
    const dispatch: any = useDispatch();

    useEffect(() => {
        if (theme) {
            dispatch(changeLayoutTheme(theme?.theme));
        }
    }, [theme, dispatch])

    return (
        <React.Fragment>
            <Head title={theme?.storeName ?? ""} />
            <PageHeader theme={theme} />
            <Table />
        </React.Fragment>
    )
}
Index.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default Index;