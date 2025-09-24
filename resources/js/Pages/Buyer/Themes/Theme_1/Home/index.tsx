import React from "react";
import { Head } from "@inertiajs/react";
import Layout from "../../Layouts";
import { Table } from "../Tables";
import PageHeader from "../PageHeader/PageHeader";

const Index = () => {
    return (
        <React.Fragment>
            <Head title="MMO Store" />
            <PageHeader title="Hỗ Trợ và Chính Sách Bảo Hành" />
            <Table />
        </React.Fragment>
    )
}
Index.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default Index;