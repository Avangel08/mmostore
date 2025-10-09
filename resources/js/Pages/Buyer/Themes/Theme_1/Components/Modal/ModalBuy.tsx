import { usePage, router } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Form, Button, Card, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface Product {
    id: number;
    name: string;
    price: number;
    short_description: string;
    image: string;
    sub_products: any;
}

interface ProductModalProps {
    productId: number | null;
    show: boolean;
    onClose: () => void;
}

// ⚡ fetch products detail (TanStack Query)
const fetchProduct = async (id: number): Promise<Product> => {
    const res = await fetch(`/products/detail/${id}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

const ModalBuy: React.FC<ProductModalProps> = ({
    productId,
    show,
    onClose,
}) => {
    const { t } = useTranslation()
    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId!),
        enabled: !!productId && show, // chỉ fetch khi modal mở và có id
    });
    const { errors } = usePage().props;
    const storageUrl = usePage().props.storageUrl as string;

    const formik = useFormik({
        initialValues: {
            quantity: 0,
            subProduct: "",
            price: 0
        },
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema: Yup.object({
            subProduct: Yup.string().required(
                t("Please choose your sub product")
            ),
        }),
        onSubmit: async (values) => {
            try {
                const response = await axios.post('/products/checkout', {
                    product_id: productId,
                    sub_product_id: values.subProduct,
                    quantity: values.quantity,
                    price: values.price
                });

                if (response.data.success) {
                    handleClose();
                    window.location.href = '/order';
                } else {
                    console.error('Checkout failed:', response.data.message);
                }
            } catch (error) {
                console.error('Checkout errors:', error);
            }
        },
    });

    // ✅ wrapper: reset form trước, gọi onClose sau
    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static" size="lg">
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
                                            src={product && `${storageUrl}/${product.image}`}
                                            alt=""
                                            className="img-fluid d-block"
                                        />
                                    </div>
                                </div>

                                <div className="col-sm">
                                    <h5 className="">
                                        {product && product.name}
                                    </h5>
                                    <p className="text-muted mb-2">
                                        {product && product.short_description}
                                    </p>
                                    <Form.Group>
                                        <div className="d-flex gap-2">
                                            {product?.sub_products.map((sub: any) => (
                                                <div key={sub.id} className="custom-radio">
                                                    <Form.Control
                                                        type="radio"
                                                        name="subProduct"
                                                        value={String(sub.id)}
                                                        className="form-check-input d-none"
                                                        id={`sub-${sub.id}`}
                                                        onChange={(e) => {
                                                            formik.handleChange(e);
                                                            formik.setFieldValue("quantity", sub.quantity ?? 1);
                                                            formik.setFieldValue("price", sub.price ?? 1);
                                                        }}
                                                        onBlur={formik.handleBlur}
                                                        checked={formik.values.subProduct === String(sub.id)} // ✅ chỉ chọn 1
                                                    />
                                                    <Form.Label
                                                        htmlFor={`sub-${sub.id}`}
                                                        className={`form-check-label ${formik.values.subProduct === String(sub.id) ? "active" : ""
                                                            }`}
                                                    >
                                                        {sub.name}
                                                    </Form.Label>
                                                </div>
                                            ))}
                                        </div>
                                        {formik.touched.subProduct && formik.errors.subProduct && (
                                            <div className="text-danger small">{formik.errors.subProduct}</div>
                                        )}
                                    </Form.Group>

                                    <div className="input-step mb-3">
                                        <button
                                            type="button"
                                            className="minus material-shadow"
                                            disabled={!formik.values.subProduct}
                                            onClick={() =>
                                                formik.setFieldValue(
                                                    "quantity",
                                                    Math.max(1, Number(formik.values.quantity) - 1)
                                                )
                                            }
                                        >
                                            –
                                        </button>
                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                className="text-center"
                                                name="quantity"
                                                value={formik.values.quantity}
                                                onChange={formik.handleChange}
                                                disabled={!formik.values.subProduct}
                                                min={1}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {formik.errors.quantity || errors?.quantity}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <button
                                            type="button"
                                            disabled={!formik.values.subProduct}
                                            className="plus material-shadow"
                                            onClick={() =>
                                                formik.setFieldValue(
                                                    "quantity",
                                                    Number(formik.values.quantity) + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <p className="text-muted mb-0 me-2">Price:</p>
                                        <span className="fs-18 text-danger">
                                            $
                                            <span id="ticket_price" className="product-price">
                                                {formik.values.price * formik.values.quantity}
                                            </span>
                                        </span>
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
                            style={{ fontWeight: "bold" }}
                            onClick={handleClose}
                        >
                            Close
                        </Button>
                        <Button
                            variant="success"
                            type="submit"
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