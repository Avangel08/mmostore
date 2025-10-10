import React, { useEffect, useState } from "react";
import { Head, usePage, router, useForm } from "@inertiajs/react";
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
import Layout from "../../Layouts";
import { Table } from "../Tables";
import PageHeader from "../PageHeader/PageHeader";
import { useThemeConfig } from "../../hooks/useThemeConfig";

//redux
import { useDispatch } from "react-redux";
import { changeLayoutTheme } from "../../../../../slices/thunk";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import { Slide, toast, ToastContainer } from "react-toastify";

//import images
import avatar1 from "../../../../../../images/users/user-dummy-img.jpg";

// Import the tab panes
import TabPaneChangeInformation from "./TabPaneChangeInformation";
import TabPaneChangePassword from "./TabPaneChangePassword";
import { showToast } from "../../../../../utils/showToast";

const Profile = () => {
    const { t } = useTranslation();
    const theme = useThemeConfig();
    const user = usePage().props.auth.user as any;
    const storageUrl = usePage().props.storageUrl as string;
    const dispatch: any = useDispatch();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [originalImage, setOriginalImage] = useState<string | null>(null);

    const { data, setData, post, processing, errors, progress } = useForm({
        image: null as File | null,
    });

    useEffect(() => {
        if (theme) {
            dispatch(changeLayoutTheme(theme?.theme));
        }
    }, [theme, dispatch]);

    React.useEffect(() => {
        const style = document.createElement('style');
        style.textContent = `
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .profile-img-file-input {
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
            cursor: pointer;
          }
          .profile-photo-edit {
            position: absolute;
            right: -10px;
            bottom: 8px;
            cursor: pointer;
          }
          .profile-photo-edit .avatar-title {
            background-color: var(--vz-light) !important;
            color: var(--vz-body-color) !important;
            border: 2px solid var(--vz-white) !important;
            font-size: 14px;
            cursor: pointer;
          }
          .profile-photo-edit .avatar-title:hover {
            background-color: var(--vz-primary) !important;
            color: var(--vz-white) !important;
          }
        `;
        document.head.appendChild(style);

        if (user?.image) {
            setOriginalImage(`${storageUrl}/${user.image}?v=${Date.now()}`);
            setPreviewImage(`${storageUrl}/${user.image}?v=${Date.now()}`);
        }

        return () => {
            document.head.removeChild(style);
        };
    }, [user?.image]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const maxSize = 2 * 1024 * 1024; // 2MB = 2 * 1024 * 1024 bytes
            if (file.size > maxSize) {
                showToast(t('Image size must be less than 2MB'), 'error');
                e.target.value = '';
                return;
            }

            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                showToast(t('Please select a valid image file') + ' (JPEG, PNG, GIF, WebP)', 'error');
                e.target.value = '';
                return;
            }

            setData('image', file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            uploadImage(file);
        }
    };

    const uploadImage = (file: File) => {
        const formData = new FormData();
        formData.append('image', file);

        router.post(route('buyer.profile.upload-image'), formData, {
            forceFormData: true,
            onSuccess: (page: any) => {
                showToast(t('Profile image updated successfully'), 'success');
                if (page.props?.auth?.user?.image) {
                    setOriginalImage(`${storageUrl}/${page.props.auth.user.image}?v=${Date.now()}`);
                }
            },
            onError: (errors) => {
                if (originalImage) {
                    setPreviewImage(originalImage);
                } else {
                    setPreviewImage(null);
                }

                setData('image', null);

                const fileInput = document.getElementById('profile-img-file-input') as HTMLInputElement;
                if (fileInput) {
                    fileInput.value = '';
                }

                Object.keys(errors).forEach((key) => {
                    showToast(t(errors[key]), "error");
                });
            },
        });
    };

    return (
        <React.Fragment>
            <Head title={t("Personal profile")} />
            <PageHeader title={theme?.pageHeaderText ?? ""} />
            <div className="mt-4">
                <ToastContainer />
                <Container fluid className="custom-container">
                    <Row>
                        <Col lg={12}>
                            <Card style={{ minHeight: '40vh' }}>
                                <Tab.Container defaultActiveKey="personal-info">
                                    <Card.Body className="p-0">
                                        <Row className="g-0">
                                            <Col md={3}>
                                                <Nav
                                                    variant="pills"
                                                    className="flex-column nav-pills-custom p-3 border-end" style={{ height: '100%' }}
                                                    role="tablist"
                                                >
                                                    <Nav.Item className="mb-2">
                                                        <Nav.Link eventKey="personal-info" className="text-start">
                                                            <i className="fas fa-home me-2"></i>
                                                            {t("Personal Information")}
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                    <Nav.Item>
                                                        <Nav.Link eventKey="change-password" className="text-start">
                                                            <i className="far fa-user me-2"></i>
                                                            {t("Change Password")}
                                                        </Nav.Link>
                                                    </Nav.Item>
                                                </Nav>
                                            </Col>
                                            <Col md={5}>
                                                <Tab.Content className="p-4">
                                                    <TabPaneChangeInformation />
                                                    <TabPaneChangePassword />
                                                </Tab.Content>
                                            </Col>
                                            <Col md={4}>
                                                <div className="p-4 border-start d-flex align-items-center justify-content-center" style={{ minHeight: '100%' }}>
                                                    <div className="text-center">
                                                        <div className="profile-user position-relative d-inline-block mx-auto mb-4">
                                                            <img
                                                                src={previewImage || (user?.image ? `${storageUrl}/${user.image}?v=${Date.now()}` : avatar1)}
                                                                className="rounded-circle img-thumbnail user-profile-image material-shadow"
                                                                alt="user-profile"
                                                                onClick={() => {
                                                                    const imageUrl = previewImage || (user?.image ? `${storageUrl}/${user.image}?v=${Date.now()}` : avatar1);
                                                                    window.open(imageUrl, '_blank');
                                                                }}
                                                                style={{
                                                                    cursor: 'pointer',
                                                                    width: '150px',
                                                                    height: '150px',
                                                                    objectFit: 'cover'
                                                                }}
                                                            />
                                                            <div className="avatar-xs p-0 rounded-circle profile-photo-edit">
                                                                <Form.Control
                                                                    id="profile-img-file-input"
                                                                    type="file"
                                                                    className="profile-img-file-input"
                                                                    accept="image/*"
                                                                    onChange={handleImageChange}
                                                                    disabled={processing}
                                                                />
                                                                <Form.Label
                                                                    htmlFor="profile-img-file-input"
                                                                    className="profile-photo-edit avatar-xs"
                                                                >
                                                                    <span className="avatar-title rounded-circle bg-light text-body material-shadow">
                                                                        {processing ? (
                                                                            <i
                                                                                className="ri-loader-2-line"
                                                                                style={{
                                                                                    animation: 'spin 1s linear infinite',
                                                                                    display: 'inline-block'
                                                                                }}
                                                                            ></i>
                                                                        ) : (
                                                                            <i className="ri-camera-fill"></i>
                                                                        )}
                                                                    </span>
                                                                </Form.Label>
                                                            </div>
                                                        </div>
                                                        {progress && (
                                                            <div className="progress mb-3" style={{ height: '6px' }}>
                                                                <div
                                                                    className="progress-bar"
                                                                    style={{ width: `${progress.percentage}%` }}
                                                                />
                                                            </div>
                                                        )}
                                                        <h5 className="fs-6 mb-1">{(user?.first_name || user?.last_name) ? ((user?.first_name ?? "") + ' ' + (user?.last_name ?? "")) : (user?.name ?? "")}</h5>
                                                        {errors?.image && (
                                                            <div className="text-danger small mt-1">
                                                                {errors?.image}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Tab.Container>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}
Profile.layout = (page: React.ReactNode) => <Layout>{page}</Layout>
export default Profile;