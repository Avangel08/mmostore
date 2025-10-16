import React from "react";
import { Head } from "@inertiajs/react";
import Layout from "../../Layouts";
import List from "../ProductList/List";

const Index = () => {
    return (
        <React.Fragment>
            <Head title="MMO Store" />
            <List />
        </React.Fragment>
    )
}
Index.layout = (page: any) => <Layout children={page} />
export default Index;