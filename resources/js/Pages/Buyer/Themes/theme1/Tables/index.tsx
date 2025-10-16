import React, { useState } from "react";
import { Container } from "react-bootstrap";

import { useQuery } from "@tanstack/react-query";
import CategoryTable from "./CategoryTable";
import ModalBuy from "../Components/Modal/ModalBuy";
import ModalLogin from "../../../Home/ModalLogin";
import { useTranslation } from "react-i18next";

const fetchCategories = async () => {
    const res = await fetch("/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

const Table = () => {
    const [show, setShow] = useState(false)
    const [openLogin, setOpenLogin] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const { data: categories, isLoading, error } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <Container fluid className="custom-container">
                <div className="d-sm-flex align-items-center justify-content-between mt-4 mb-4 page-title">
                    <h4 className="mb-sm-0 text-white">{t("Service price list")}</h4>
                </div>
                {categories?.map((category: any) => (
                    <CategoryTable
                        key={category.id}
                        category={category}
                        setShow={setShow}
                        setSelectedProduct={setSelectedProduct}
                        setOpenLogin={setOpenLogin}
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
            <ModalLogin show={openLogin} handleClose={() => { setOpenLogin(false) }} />
        </React.Fragment>
    );
}

export { Table };