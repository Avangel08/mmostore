import React, { useTransition } from "react";
import {
  Card,
  Col,
  Container,
  Form,
  Nav,
  Row,
  Tab,
  Button,
} from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";

//import images
import avatar1 from "../../../../images/users/user-dummy-img.jpg";
import { Head, usePage, router } from "@inertiajs/react";
import Layout from "../../../CustomSellerLayouts";
import { useTranslation } from "react-i18next";
import { Slide, toast, ToastContainer } from "react-toastify";
import TabPaneChangeInformation from "./TabPaneChangeInformation";
import TabPaneChangePassword from "./TabPaneChangePassword";

const EditProfile = () => {
  const { t } = useTranslation();
  const user = usePage().props.auth.user;

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

  return (
    <React.Fragment>
      <Head title="Profile Settings | Velzon - React Admin & Dashboard Template" />
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <Row>
            <Col xxl={3}>
              <Card className="">
                <Card.Body className="p-4">
                  <div className="text-center">
                    <div className="profile-user position-relative d-inline-block mx-auto  mb-4">
                      <img
                        src={avatar1}
                        className="rounded-circle avatar-xl img-thumbnail user-profile-image material-shadow"
                        alt="user-profile"
                      />
                      {/* <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                <Form.Control id="profile-img-file-input" type="file"
                                                    className="profile-img-file-input" />
                                                <Form.Label htmlFor="profile-img-file-input"
                                                    className="profile-photo-edit avatar-xs">
                                                    <span className="avatar-title rounded-circle bg-light text-body material-shadow">
                                                        <i className="ri-camera-fill"></i>
                                                    </span>
                                                </Form.Label>
                          </div> */}
                    </div>
                    <h5 className="fs-16 mb-1">{user?.name ?? ""}</h5>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col xxl={9}>
              <Card className="">
                <Tab.Container defaultActiveKey="personal-info">
                  <Card.Header>
                    <Nav
                      className="nav-tabs-custom rounded card-header-tabs border-bottom-0"
                      role="tablist"
                    >
                      <Nav.Item>
                        <Nav.Link eventKey="personal-info">
                          <i className="fas fa-home"></i>
                          {t("Personal Information")}
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="change-password">
                          <i className="far fa-user"></i>
                          {t("Change Password")}
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Tab.Content>
                      <TabPaneChangeInformation showToast={showToast} />
                      <TabPaneChangePassword showToast={showToast} />
                    </Tab.Content>
                  </Card.Body>
                </Tab.Container>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
EditProfile.layout = (page: any) => <Layout children={page} />;

export default EditProfile;
