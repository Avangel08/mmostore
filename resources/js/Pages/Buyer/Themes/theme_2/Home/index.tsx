import React from "react";
import { Head } from "@inertiajs/react";
import Layout from "../../Layouts";
import PageHeader from "../PageHeader/PageHeader";
import { Table } from "../Tables";

const Index = () => {
    return (
        <React.Fragment>
            <Head title="MMO Store" />
            <PageHeader title="BUY OUTLOOK ACCOUNTS" />
            <Table />
        </React.Fragment>
    )
}
Index.layout = (page: any) => <Layout children={page} />
export default Index;