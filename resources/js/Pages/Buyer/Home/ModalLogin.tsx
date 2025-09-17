import { Link, router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Modal, Form, Button } from "react-bootstrap";

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
  const formik = useFormik({
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
      router.post(route("buyer.login"), values);
    },
  });

  return (
    <Modal show={show} onHide={handleClose} centered>
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
          Đăng nhập
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ padding: "0 2rem 2rem 2rem" }}>
        <Form noValidate onSubmit={formik.handleSubmit}>
          {/* Email */}
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email *"
              style={{ borderRadius: "0.25rem" }}
              {...formik.getFieldProps("email")}
              isInvalid={!!((formik.errors.email && formik.touched.email) || errors?.email)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.email || errors?.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Mật khẩu *"
              style={{ borderRadius: "0.25rem" }}
              {...formik.getFieldProps("password")}
              isInvalid={!!((formik.errors.password && formik.touched.password) || errors?.password)}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.password || errors?.password}
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
              {...formik.getFieldProps("rememberMe")}
              checked={formik.values.rememberMe}
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

        {/* Register */}
        <div className="text-center mt-3">
          <Link
            href={route("buyer.register")}
            style={{ textDecoration: "none" }}
          >
            Đăng ký
          </Link>
        </div>
      </Modal.Body>
    </Modal>
  );
}
