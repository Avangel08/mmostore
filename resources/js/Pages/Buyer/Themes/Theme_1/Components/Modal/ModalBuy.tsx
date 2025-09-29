import { Link, router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Form, Button, Card, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
}

interface ProductModalProps {
    productId: number | null;
    show: boolean;
    onClose: () => void;
}

// ⚡ fetch products detail (TanStack Query)
const fetchProduct = async (id: number): Promise<Product> => {
    const res = await fetch(`https://coco.mmostore.local//products/${id}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

const ModalBuy: React.FC<ProductModalProps> = ({
    productId,
    show,
    onClose,
}) => {

    const { data, isLoading, error } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId!),
        enabled: !!productId && show, // chỉ fetch khi modal mở và có id
    });

    const { errors } = usePage().props;


    if (!show) return null;

    const formik = useFormik({
        initialValues: {
            quantity: "",
            email: "",
            password: "",
            rememberMe: true,
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email("Email không hợp lệ")
                .matches(/^[^@]+@[^@]+\.[^@]+$/, "Email không hợp lệ"),
            password: Yup.string()
                .required("Mật khẩu là bắt buộc"),
            rememberMe: Yup.boolean(),
        }),
        onSubmit: (values) => {
            router.post(route("buyer.login"), values);
        },
    });

    return (
        <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
            <Modal.Header
                closeButton
                style={{
                    borderBottom: "none",
                    paddingTop: "2rem",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                }}
            >
                <Modal.Title
                    style={{
                        fontWeight: "bold",
                        width: "100%",
                        textAlign: "center",
                        fontSize: "1.75rem",
                    }}
                >
                    Xác nhận đơn hàng
                </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ padding: "0 2rem 2rem 2rem" }}>
                {isLoading && <p className="text-center">Đang tải dữ liệu...</p>}
                {error && <p className="text-red-500 text-center">Lỗi tải sản phẩm</p>}
                <Form noValidate onSubmit={formik.handleSubmit}>
                    <Card className="product">
                        <Card.Body>
                            <Row className="gy-3">
                                <div className="col-sm-auto">
                                    <div className="avatar-xl bg-light rounded p-1">
                                        <img
                                            src={data && data.image}
                                            alt=""
                                            className="img-fluid d-block"
                                        />
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <h5 className="fs-14">
                                        {data && data.title}
                                    </h5>
                                    <ul className="list-inline text-muted">
                                        <li className="list-inline-item">
                                            Color :{" "}
                                            <span className="fw-medium">
                                                Red
                                            </span>
                                        </li>
                                        <li className="list-inline-item">
                                            Size :{" "}
                                            <span className="fw-medium">12</span>
                                        </li>
                                        <li className="list-inline-item">
                                            Color :{" "}
                                            <span className="fw-medium">
                                                Red
                                            </span>
                                        </li>
                                        <li className="list-inline-item">
                                            Color :{" "}
                                            <span className="fw-medium">
                                                Red
                                            </span>
                                        </li>
                                        <li className="list-inline-item">
                                            Color :{" "}
                                            <span className="fw-medium">
                                                Red
                                            </span>
                                        </li>
                                        <li className="list-inline-item">
                                            Color :{" "}
                                            <span className="fw-medium">
                                                Red
                                            </span>
                                        </li>
                                        <li className="list-inline-item">
                                            Color :{" "}
                                            <span className="fw-medium">
                                                Red
                                            </span>
                                        </li>
                                    </ul>

                                    <div className="input-step">
                                        <button
                                            type="button"
                                            className="minus material-shadow"
                                        // onClick={() => {
                                        //     countDown(cartItem.id, cartItem.data_attr, cartItem.price);
                                        // }}
                                        >
                                            –
                                        </button>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                className="quantity"
                                                value={1}
                                                name="demo_vertical"
                                                readOnly
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.quantity || errors?.quantity}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <button
                                            type="button"
                                            className="plus material-shadow"
                                        // onClick={() => {
                                        //     countUP(cartItem.id, cartItem.data_attr, cartItem.price);
                                        // }}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text">
                                        <p className="text-muted mb-1">Item Price:</p>
                                        <h5 className="fs-14">
                                            $
                                            <span id="ticket_price" className="product-price">
                                                12
                                            </span>
                                        </h5>
                                    </div>
                                    <div className="col-sm-auto">
                                    </div>
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Submit */}
                    <div className="d-flex gap-2 justify-content-end">
                        <Button
                            variant="light"
                            type="button"
                            // size=""
                            style={{ fontWeight: "bold" }}
                        >
                            Close
                        </Button>
                        <Button
                            variant="success"
                            type="submit"
                            // size=""
                            style={{ fontWeight: "bold" }}
                        >
                            Buy
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ModalBuy;