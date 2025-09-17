import React, { useEffect } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { router, usePage } from "@inertiajs/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Slide, toast } from "react-toastify";

// minh hoạ, có thể thay thế bằng hình ảnh hoặc component khác
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
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.657-3.356-11.303-7.962l-6.571,4.819C9.656,39.663,16.318,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.089,5.571l6.19,5.238C39.986,36.236,44,30.552,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
);

// chỉ là minh hoạ...
const Illustration = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 545 385"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="148" y="4" width="300" height="220" rx="10" fill="#F0F5FF" />
    <path d="M148 14H448V50H148V14Z" fill="#E6EFFF" />
    <rect x="160" y="26" width="40" height="8" rx="4" fill="#B9D1FF" />
    <rect x="396" y="26" width="40" height="8" rx="4" fill="#B9D1FF" />
    <g filter="url(#filter0_d_101_2)">
      <rect x="20" y="100" width="300" height="180" rx="10" fill="white" />
      <rect x="32" y="112" width="60" height="8" rx="4" fill="#E6EFFF" />
      <rect x="32" y="132" width="276" height="12" rx="6" fill="#F0F5FF" />
      <rect x="32" y="156" width="276" height="12" rx="6" fill="#F0F5FF" />
      <rect x="32" y="180" width="200" height="12" rx="6" fill="#F0F5FF" />
    </g>
    <circle cx="90" cy="280" r="20" fill="#4A90E2" />
    <rect x="70" y="300" width="40" height="60" fill="#4A90E2" />
    <circle cx="450" cy="300" r="25" fill="#F5A623" />
    <rect x="425" y="325" width="50" height="60" fill="#F5A623" />
    <defs>
      <filter
        id="filter0_d_101_2"
        x="16"
        y="98"
        width="308"
        height="188"
        filterUnits="userSpaceOnUse"
        color-interpolation-filters="sRGB"
      >
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.0627451 0 0 0 0 0.0941176 0 0 0 0 0.156863 0 0 0 0.05 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_101_2"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_101_2"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
function SignUpPage() {
  const { errors } = usePage().props;
  
  const showToast = (message: string, type: "success" | "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const formik = useFormik({
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
        .max(255, "Must be 255 characters or less")
        .required("First name is required"),
      last_name: Yup.string()
        .max(255, "Must be 255 characters or less"),
      email: Yup.string()
        .email("Invalid email address")
        .max(255, "Must be 255 characters or less")
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      password_confirmation: Yup.string()
        .oneOf([Yup.ref('password')], "Passwords must match")
        .required("Password confirmation is required"),
      terms_agreed: Yup.boolean()
        .oneOf([true], "You must agree to the terms and conditions"),
    }),
    onSubmit: (values) => {
      router.post(route("buyer.register"), values, {
        onError: (errors) => {
          const errorMessages = Object.values(errors);
          if (errorMessages.length > 0) {
            showToast("Please check the form for errors", "error");
          }
        },
      });
    },
  });
  
  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <Row className="w-100" style={{ maxWidth: "1200px" }}>
        {/* Cột Form */}
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center p-4"
        >
          <Card
            className="w-100"
            style={{
              maxWidth: "450px",
              border: "none",
              boxShadow: "0 4px 25px rgba(0,0,0,0.1)",
            }}
          >
            <Card.Body className="p-5">
              <h2 className="text-center mb-4 fw-bold">Sign up</h2>
              <Form onSubmit={formik.handleSubmit} noValidate>
                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="formFirstName">
                      <Form.Label>First name <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        placeholder="Input first name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(
                          (formik.touched.first_name && formik.errors.first_name) || 
                          errors?.first_name
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.first_name || formik.errors.first_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="formLastName">
                      <Form.Label>Last name</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="last_name"
                        placeholder="Input last name" 
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={!!(
                          (formik.touched.last_name && formik.errors.last_name) || 
                          errors?.last_name
                        )}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors?.last_name || formik.errors.last_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="example.email@gmail.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(
                      (formik.touched.email && formik.errors.email) || 
                      errors?.email
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.email || formik.errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter at least 8+ characters"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(
                      (formik.touched.password && formik.errors.password) || 
                      errors?.password
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.password || formik.errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formPasswordConfirmation">
                  <Form.Label>Confirm Password <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="password"
                    name="password_confirmation"
                    placeholder="Confirm your password"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(
                      (formik.touched.password_confirmation && formik.errors.password_confirmation) || 
                      errors?.password_confirmation
                    )}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors?.password_confirmation || formik.errors.password_confirmation}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formCheckbox">
                  <Form.Check
                    type="checkbox"
                    name="terms_agreed"
                    checked={formik.values.terms_agreed}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!(formik.touched.terms_agreed && formik.errors.terms_agreed)}
                    label={
                      <span>
                        By signing up, I agree with the{" "}
                        <a href="#">Terms of Use</a> &{" "}
                        <a href="#">Privacy Policy</a>
                      </span>
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.terms_agreed}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" size="lg" type="submit">
                    Sign up
                  </Button>
                </div>
              </Form>

              <div className="text-center my-4">
                <p className="text-muted">
                  Already have an account? <a href="#">Log in</a>
                </p>
                <div className="d-flex align-items-center">
                  <hr className="w-100" />
                  <span className="px-2 text-muted">OR</span>
                  <hr className="w-100" />
                </div>
              </div>

              <div className="d-flex justify-content-center">
                <Button
                  variant="light"
                  className="rounded-circle p-2"
                  style={{
                    width: "50px",
                    height: "50px",
                    border: "1px solid #dee2e6",
                  }}
                >
                  <GoogleIcon />
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Cột Hình ảnh */}
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center p-4"
        >
          <Illustration />
        </Col>
      </Row>
    </Container>
  );
}

export default SignUpPage;
