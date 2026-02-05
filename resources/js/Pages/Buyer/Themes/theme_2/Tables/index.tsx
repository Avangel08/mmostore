import React, { useMemo } from "react";
import TableContainer from "./TableContainer";
import { Accordion, Card, Col, Container, Dropdown, Nav, Row } from "react-bootstrap";

import vn from "../../../../../../images/flags/vn.svg"
import us from "../../../../../../images/flags/us.svg"
import { ColumnDef } from "@tanstack/react-table";
import { Published } from "../../../../Demo/Ecommerce/EcommerceProducts/EcommerceProductCol";
import Rating from "react-rating";
import { Price } from "../../../../Demo/Crypto/BuySell/MarketCol";
import { Link } from "@inertiajs/react";

// import image
import product11 from "../../../../../../images/products/img11.png";

type product = {
    id: number;
    name: string;
    usePop3: boolean;
    live: string;
    country: string;
    price: string;
    quantity: string;
}

const Table = () => {
    const defaultTable = [
        { name: "HotMail NEW", image: product11, usePop3: true, live: "1-3 giờ", price: "50đ", quantity: 300 },
        { name: "OutLook NEW", image: product11, usePop3: true, live: "1-3 giờ", price: "50đ", quantity: 200 },
        { name: "OutLook DOMAIN NEW", image: product11, usePop3: true, live: "1-3 giờ", price: "50đ", quantity: 10 },
        { name: "Hotmail TRUSTED [IMAP/POP3]", image: product11, usePop3: true, live: "1-3 giờ", price: "50đ", quantity: 500 },
        { name: "Outlook TRUSTED [IMAP/POP3]", image: product11, usePop3: true, live: "1-3 giờ", country: "us", price: "50đ", quantity: 300 },
        { name: "Hotmail TRUSTED 2 [GRAPH API]", image: product11, usePop3: true, live: "6-12 Tháng", price: "650đ", quantity: 300 },
        { name: "Outlook TRUSTED 2 [GRAPH API]", image: product11, usePop3: true, live: "6-12 Tháng", price: "650đ", quantity: 300 },
        { name: "Shannon", image: product11, usePop3: true, live: "6-12 Tháng", price: "650đ", quantity: 300 },
        { name: "Harold", image: product11, usePop3: true, live: "12-36 Tháng", price: "650đ", quantity: 300 },
        { name: "Jonathan", image: product11, usePop3: true, live: "12-36 Tháng", price: "650đ", quantity: 300 }
    ];

    const columns: ColumnDef<product>[] = useMemo(
        () => [
            // {
            //     header: "ID",
            //     cell: (cell: any) => {
            //         return (
            //             <span className="fw-semibold">{cell.getValue()}</span>
            //         );
            //     },
            //     accessorKey: "id",
            //     enableColumnFilter: false,
            // },

            {
                header: "Outlook",
                accessorKey: "name",
                enableColumnFilter: false,
                cell: (product: any) => (
                    <>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm bg-light rounded p-1">
                                    <img
                                        src={product.row.original.image}
                                        alt=""
                                        className="img-fluid d-block"
                                    />
                                </div>
                            </div>
                            <div className="flex-grow-1">
                                <h5 className="fs-14 mb-1">
                                    <Link
                                        href="/apps-ecommerce-product-details"
                                        className="text-body"
                                    >
                                        {" "}
                                        {product.getValue()}
                                    </Link>
                                </h5>
                                <p className="text-muted mb-0">
                                    Category :{" "}
                                    <span className="fw-medium">
                                        {" "}
                                        {product.row.original.category}
                                    </span>
                                </p>
                            </div>
                        </div>
                    </>
                ),
            },
            // {
            //     header: "POP3",
            //     accessorKey: "usePop3",
            //     enableColumnFilter: false,
            //     enableSorting: false,
            //     cell: ({ row }) => {
            //         const usePop3 = row.original.usePop3;
            //         return (
            //             <span>{usePop3 ? "Đã bật" : "Đã tắt"}</span>
            //         )
            //     }
            // },
            // {
            //     header: "Live",
            //     accessorKey: "live",
            //     enableColumnFilter: false,
            //     enableSorting: false,
            // },
            // {
            //     header: "Quốc gia",
            //     accessorKey: "country",
            //     enableColumnFilter: false,
            //     enableSorting: false,
            //     cell: ({ row }) => {
            //         const country = row.original.country;
            //         return (
            //             <div className="image-flag">
            //                 {
            //                     country === 'vn' ? <img src={vn} alt="" /> : <img src={us} alt="" />
            //                 }
            //             </div>
            //         )
            //     }
            // },
            {
                header: "Giá",
                accessorKey: "price",
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Số lượng",
                accessorKey: "quantity",
                enableColumnFilter: false,
                enableSorting: false,
            },
            {
                header: "Action",
                accessorKey: null,
                enableColumnFilter: false,
                enableSorting: false,
                cell: () => {
                    return (
                        <button type="button" className="btn btn-sm btn-success">Mua</button>
                    )
                }
            }
        ],
        []
    );

    return (
        <React.Fragment>
            <Container fluid className="custom-container">
                <Row className="p-2 bg-black rounded">
                    <Col lg={2} className="p-2">
                        <Accordion defaultActiveKey="1">
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>
                                    <span className="text-muted text-uppercase fs-12 fw-medium p-0">
                                        Chọn mục sản phẩm
                                    </span>{" "}
                                    <span className="badge bg-success rounded-pill align-middle ms-1">
                                        2
                                    </span>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div
                                        id="flush-collapseBrands"
                                        className="accordion-collapse collapse show"
                                        aria-labelledby="flush-headingBrands"
                                    >
                                        <div className="text-body pt-0">
                                            <div className="search-box search-box-sm">
                                                <input
                                                    type="text"
                                                    className="form-control bg-light border-0"
                                                    placeholder="Search Brands..."
                                                />
                                                <i className="ri-search-line search-icon"></i>
                                            </div>
                                            <div className="d-flex flex-column gap-2 mt-3">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="productBrandRadio5"
                                                        defaultChecked
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="productBrandRadio5"
                                                    >
                                                        Boat
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="productBrandRadio4"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="productBrandRadio4"
                                                    >
                                                        OnePlus
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="productBrandRadio3"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="productBrandRadio3"
                                                    >
                                                        Realme
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="productBrandRadio2"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="productBrandRadio2"
                                                    >
                                                        Sony
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id="productBrandRadio1"
                                                        defaultChecked
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="productBrandRadio1"
                                                    >
                                                        JBL
                                                    </label>
                                                </div>

                                                <div>
                                                    <button
                                                        type="button"
                                                        className="btn btn-link text-decoration-none text-uppercase fw-medium p-0"
                                                    >
                                                        1,235 More
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                    <Col lg={10} className="p-2">
                        <div>
                            <Card>
                                <div className="pt-0">
                                    <TableContainer
                                        columns={columns}
                                        data={(defaultTable || [])}
                                        // isGlobalFilter={true}
                                        customPageSize={10}
                                        divClass="table-responsive mb-1"
                                        tableClass="mb-0 align-middle custom-table"
                                        // isProductsFilter={true}
                                        SearchPlaceholder='Search Products...'
                                    />
                                    {/* {productList && productList.length > 0 ? (
                                    ) : (
                                        <div className="py-4 text-center">
                                            <div>
                                                <i className="ri-search-line display-5 text-success"></i>
                                            </div>

                                            <div className="mt-4">
                                                <h5>Sorry! No Result Found</h5>
                                            </div>
                                        </div>
                                    )} */}
                                </div>


                            </Card>
                        </div>

                        {/* <TableContainer
                            columns={(columns || [])}
                            data={(defaultTable || [])}
                            // customPageSize={5}
                            SearchPlaceholder='Search...'
                            tableClass={"table-card"}
                        /> */}
                    </Col >
                </Row >
            </Container >
        </React.Fragment >
    );
}

export { Table };