import { Link, router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useState, useEffect } from "react";

const GoogleIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    width="24px"
    height="24px"
    {...props}
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
         c-6.627,0-12-5.373-12-12s5.373-12,12-12
         c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
         C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,
         4,24s8.955,20,20,20s20-8.955,20-20
         C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819
         C14.655,15.108,18.961,12,24,12
         c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
         C34.046,6.053,29.268,4,24,4
         C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192
         l-6.19-5.238C29.211,35.091,26.715,36,24,36
         c-5.222,0-9.657-3.356-11.303-7.962l-6.571,4.819
         C9.656,39.663,16.318,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303
         c-0.792,2.237-2.231,4.166-4.089,5.571
         l6.19,5.238C39.986,36.236,44,30.552,
         44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

export default function ModalLogin({
  show,
  handleClose,
}: {
  show: boolean;
  handleClose: () => void;
}) {
  const { errors } = usePage().props;
  const [isLogin, setIsLogin] = useState(true);

  const loginFormik = useFormik({
    initialValues: {
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
      router.post(route("buyer.login"), values, {
        onSuccess: () => window.location.reload(),
      });
    },
  });

  useEffect(() => {
    loginFormik.setErrors(errors || {});
  }, [errors]);

  const registerFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms_agreed: false,
    },
    validationSchema: Yup.object({
      first_name: Yup.string()
        .max(50, "Tối đa 50 ký tự")
        .required("Tên là bắt buộc"),
      last_name: Yup.string()
        .max(50, "Tối đa 50 ký tự"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .max(255, "Tối đa 255 ký tự")
        .required("Email là bắt buộc"),
      password: Yup.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .required("Mật khẩu là bắt buộc"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], "Mật khẩu xác nhận không khớp")
        .required("Xác nhận mật khẩu là bắt buộc"),
      terms_agreed: Yup.boolean()
        .oneOf([true], "Bạn phải đồng ý với điều khoản"),
    }),
    onSubmit: (values) => {
      router.post(route("buyer.register"), values, {
        onSuccess: () => {
          setIsLogin(true);
          registerFormik.resetForm();
          window.location.reload();
        },
      });
    },
  });

  useEffect(() => {
    registerFormik.setErrors(errors || {});
  }, [errors]);

  const handleToggleForm = () => {
    setIsLogin(!isLogin);
    loginFormik.resetForm();
    registerFormik.resetForm();
  };

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
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
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "0 2rem 2rem 2rem" }}>
        {isLogin ? (
          // Login Form
          <Form noValidate onSubmit={loginFormik.handleSubmit}>
            {/* Email */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email của bạn"
                style={{ borderRadius: "0.25rem" }}
                {...loginFormik.getFieldProps("email")}
                isInvalid={!!(loginFormik.errors.email && loginFormik.touched.email)}
              />
              <Form.Control.Feedback type="invalid">
                {loginFormik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Password */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                style={{ borderRadius: "0.25rem" }}
                {...loginFormik.getFieldProps("password")}
                isInvalid={!!(loginFormik.errors.password && loginFormik.touched.password)}
              />
              <Form.Control.Feedback type="invalid">
                {loginFormik.errors.password}
              </Form.Control.Feedback>
              <div className="d-flex justify-content-end mt-1">
                <a
                  href="#"
                  style={{ fontSize: "0.8rem", textDecoration: "none" }}
                >
                  Quên mật khẩu
                </a>
              </div>
            </Form.Group>

            {/* Remember Me */}
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                label="Ghi nhớ đăng nhập"
                {...loginFormik.getFieldProps("rememberMe")}
                checked={loginFormik.values.rememberMe}
              />
            </Form.Group>

            {/* Submit */}
            <div className="d-grid gap-2">
              <Button
                variant="success"
                type="submit"
                size="lg"
                style={{ fontWeight: "bold" }}
              >
                Đăng nhập
              </Button>
              <Button
                variant="light"
                size="lg"
                className="d-flex align-items-center justify-content-center border"
                type="button"
              >
                <GoogleIcon className="me-2" /> Đăng nhập bằng Google
              </Button>
            </div>
          </Form>
        ) : (
          // Register Form
          <Form noValidate onSubmit={registerFormik.handleSubmit}>
            <Row>
              <Col>
                <Form.Group className="mb-3" controlId="formFirstName">
                  <Form.Label>Tên <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    placeholder="Nhập tên của bạn"
                    style={{ borderRadius: "0.25rem" }}
                    {...registerFormik.getFieldProps("first_name")}
                    isInvalid={!!(registerFormik.touched.first_name && registerFormik.errors.first_name)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {registerFormik.errors.first_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3" controlId="formLastName">
                  <Form.Label>Họ</Form.Label>
                  <Form.Control
                    type="text"
                    maxLength={50}
                    placeholder="Nhập họ của bạn"
                    style={{ borderRadius: "0.25rem" }}
                    {...registerFormik.getFieldProps("last_name")}
                    isInvalid={!!(registerFormik.touched.last_name && registerFormik.errors.last_name)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {registerFormik.errors.last_name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formRegisterEmail">
              <Form.Label>Email <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email của bạn"
                style={{ borderRadius: "0.25rem" }}
                {...registerFormik.getFieldProps("email")}
                isInvalid={!!(registerFormik.touched.email && registerFormik.errors.email)}
              />
              <Form.Control.Feedback type="invalid">
                {registerFormik.errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterPassword">
              <Form.Label>Mật khẩu <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu (ít nhất 8 ký tự)"
                style={{ borderRadius: "0.25rem" }}
                {...registerFormik.getFieldProps("password")}
                isInvalid={!!(registerFormik.touched.password && registerFormik.errors.password)}
              />
              <Form.Control.Feedback type="invalid">
                {registerFormik.errors.password}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPasswordConfirmation">
              <Form.Label>Xác nhận mật khẩu <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu của bạn"
                style={{ borderRadius: "0.25rem" }}
                {...registerFormik.getFieldProps("password_confirmation")}
                isInvalid={!!(registerFormik.touched.password_confirmation && registerFormik.errors.password_confirmation)}
              />
              <Form.Control.Feedback type="invalid">
                {registerFormik.errors.password_confirmation}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formTermsCheckbox">
              <Form.Check
                type="checkbox"
                {...registerFormik.getFieldProps("terms_agreed")}
                checked={registerFormik.values.terms_agreed}
                isInvalid={!!(registerFormik.touched.terms_agreed && registerFormik.errors.terms_agreed)}
                label={
                  <span>
                    Tôi đồng ý với{" "}
                    <a href="#" style={{ textDecoration: "none" }}>Điều khoản sử dụng</a> &{" "}
                    <a href="#" style={{ textDecoration: "none" }}>Chính sách bảo mật</a>
                  </span>
                }
              />
              <Form.Control.Feedback type="invalid">
                {registerFormik.errors.terms_agreed}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                style={{ fontWeight: "bold" }}
              >
                Đăng ký
              </Button>
              <Button
                variant="light"
                size="lg"
                className="d-flex align-items-center justify-content-center border"
                type="button"
              >
                <GoogleIcon className="me-2" /> Đăng ký bằng Google
              </Button>
            </div>
          </Form>
        )}

        {/* Toggle between Login/Register */}
        <div className="text-center mt-4">
          <div className="d-flex align-items-center mb-3">
            <hr className="w-100" />
            <span className="px-2 text-muted">HOẶC</span>
            <hr className="w-100" />
          </div>
          <Button
            variant="link"
            onClick={handleToggleForm}
            style={{
              textDecoration: "none",
              fontWeight: "500",
              padding: "0.5rem 1rem"
            }}
          >
            {isLogin ? "Chưa có tài khoản? Đăng ký ngay" : "Đã có tài khoản? Đăng nhập"}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
