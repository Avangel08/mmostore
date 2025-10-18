import { usePage, router } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Form, Button, Card, Row } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect, useState } from "react";
import { showToast } from "../../../../../../utils/showToast";

interface Product {
    id: number;
    name: string;
    price: number;
    short_description: string;
    image: string;
    sub_products: any[];
}

interface ProductModalProps {
    productId: number | null;
    show: boolean;
    onClose: () => void;
}

interface ProductFormValues {
    quantity: number;
    subProduct: string;
    price: number;
}

// ⚡ fetch products detail (TanStack Query)
const fetchProduct = async (id: number): Promise<Product> => {
    const res = await fetch(`/products/detail/${id}`);
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
};

const ModalBuy: React.FC<ProductModalProps> = ({ productId, show, onClose, }) => {
    const { t } = useTranslation()
    const [itemSubProduct, setItemSubProduct] = useState<any>(null);
    const { data: product, isLoading, error } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId!),
        enabled: !!productId && show, // chỉ fetch khi modal mở và có id
    });
    const { errors } = usePage().props;
    const storageUrl = usePage().props.storageUrl as string;
    const { user } = usePage().props.auth as any;

    useEffect(() => {
        if (product && product.sub_products.length > 0) {
            setItemSubProduct(product.sub_products[0]);
        } else {
            setItemSubProduct(null);
        }
    }, [product]);


    const formik = useFormik<ProductFormValues>({
        initialValues: {
            quantity: 1,
            subProduct: product?.sub_products?.[0]?.id || "",
            price: product?.sub_products?.[0]?.price || 0,
        },
        enableReinitialize: true,
        validateOnChange: true,
        validateOnBlur: true,
        validationSchema: Yup.object({
            subProduct: Yup.string().required(
                t("Please choose your sub product")
            ),
        }),
        onSubmit: async (values) => {
            try {
                if (!user?.balance || user?.balance < (values.price * values.quantity)) {
                    showToast(t("Your balance is not enough, please recharge"), "error");
                    return;
                }
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
            } finally {
                formik.setSubmitting(false);
            }
        },
    });

    // ✅ wrapper: reset form trước, gọi onClose sau
    const handleClose = () => {
        formik.resetForm();
        onClose();
    };

    console.log({ formQuantity: formik.values.quantity, error: formik.errors });
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
                                                            formik.setFieldValue("quantity", 1);
                                                            formik.setFieldValue("price", sub.price ?? 0);
                                                            setItemSubProduct(sub);
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

                                    <div className="d-flex justify-items-center mb-3">
                                        <div className="input-step">
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
                                                    type="number"
                                                    className="text-center"
                                                    name="quantity"
                                                    value={formik.values.quantity}
                                                    onChange={(e) => {
                                                        formik.setFieldError("quantity", "Exceeded the allowed number of purchases");
                                                        const value = Number(e.target.value);

                                                        // custom logic
                                                        if (value < 1) return; // không cho nhỏ hơn 1
                                                        if (itemSubProduct && value > itemSubProduct.quantity) {
                                                            formik.setFieldValue("quantity", itemSubProduct.quantity);
                                                            return;
                                                        } // không cho lớn hơn quantity hiện có

                                                        // cập nhật formik
                                                        formik.setFieldValue("quantity", value);
                                                    }}
                                                    disabled={!formik.values.subProduct || itemSubProduct?.quantity === 0}
                                                    min={1}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.quantity || errors?.quantity}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <button
                                                type="button"
                                                disabled={!formik.values.subProduct || (formik.values.quantity >= (itemSubProduct?.quantity ?? 0))}
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
                                        {
                                            itemSubProduct && itemSubProduct.quantity === 0 ? (
                                                <div className="text-danger align-self-center ms-2">
                                                    {t("Out of stock")}
                                                </div>
                                            ) : (
                                                <div className="text-danger align-self-center ms-2">
                                                    {t('Stock')}:{" "}{itemSubProduct?.quantity}
                                                </div>
                                            )
                                        }
                                        {formik.errors.quantity && (
                                            <div className="text-danger small">{formik.errors.quantity}</div>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <p className="text-muted mb-0 me-2">{t("Price")}:</p>
                                        <span id="ticket_price" className="fs-18 text-danger product-price">
                                            {formik.values.price * formik.values.quantity}
                                        </span>
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
                            {t("Close")}
                        </Button>
                        <Button
                            variant="success"
                            type="submit"
                            style={{ fontWeight: "bold" }}
                            disabled={isLoading || !product || !formik.isValid || formik.isSubmitting || (itemSubProduct?.quantity === 0)}
                        >
                            {formik.isSubmitting ? t("Processing...") : t("Buy")}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default ModalBuy;