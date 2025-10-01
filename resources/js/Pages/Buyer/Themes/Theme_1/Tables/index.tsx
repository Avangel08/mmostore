import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "./TableContainer";
import { Container } from "react-bootstrap";

import vn from "../../../../../../images/flags/vn.svg"
import us from "../../../../../../images/flags/us.svg"
import { ColumnDef } from "@tanstack/react-table";
import { useQuery } from "@tanstack/react-query";
import CategoryTable from "./CategoryTable";
import ModalBuy from "../Components/Modal/ModalBuy";

type product = {
    id: number;
    name: string;
    usePop3: boolean;
    live: string;
    country: string;
    price: string;
    quantity: string;
}

// ⚡ fetch products (TanStack Query)
const fetchCategories = async () => {
    const res = await fetch("https://owner2.mmostores.shop/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

const Table = () => {
    const [show, setShow] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    // ✅ Server state
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    console.log("categories ===>>", { categories })
    // const [columns, setColumns] = useState();

    return (
        <React.Fragment>
            <Container fluid className="custom-container">
                <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-4 page-title">
                    <h4 className="mb-sm-0 text-white">Bảng giá dịch vụ</h4>
                </div>
                {categories?.map((category: any) => (
                    <CategoryTable
                        key={category.id}
                        category={category}
                        setShow={setShow}
                        setSelectedProduct={setSelectedProduct}
                    />
                ))}
            </Container>
            <ModalBuy
                productId={selectedProduct?.id}
                show={show}
                onClose={() => {
                    setShow(false)
                    setSelectedProduct(null)
                }}
            />
        </React.Fragment>
    );
}

export { Table };