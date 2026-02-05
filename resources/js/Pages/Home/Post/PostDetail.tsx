import { Head, usePage } from "@inertiajs/react";
import React from "react";
import Navbar from "../navbar";
import Footer from "../footer";
import { Container } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useTranslation } from "react-i18next";

const PostDetail = () => {
    const { post }: any = usePage().props;
    const storageUrl = usePage().props.storageUrl as string;
    const { t } = useTranslation()

    window.onscroll = function () {
        scrollFunction();
    };

    const scrollFunction = () => {
        const element = document.getElementById("back-to-top");
        if (element) {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        }
    };

    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    return (
        <React.Fragment>
            <style>
                {`
                    .post-content img {
                        width: 100%
                    }
                    .navbar-landing {
                        background: #fff;
                        border-bottom: 1px solid #e9ebec;
                    }
                    .header-item {
                        height: auto;
                    }
                `}
            </style>
            <Head title="MMO Store" />
            <div className="layout-wrapper">
                <Navbar />
                <div className="page-content">
                    <Container fluid>
                        <BreadCrumb title={post.title} pageTitle={t("Post")} />

                        <div className="row justify-content-center">
                            <div className="col-xxl-10">
                                <div className="card">
                                    <div className="card-body">
                                        {/* Tiêu đề + thông tin */}
                                        <div className="text-center mb-4">
                                            <p className="text-success text-uppercase mb-2">
                                                {post.category ?? "Không có danh mục"}
                                            </p>
                                            <h4 className="mb-2">{post.title}</h4>
                                            <p className="text-muted mb-4">{post.description}</p>

                                            <div className="d-flex align-items-center justify-content-center flex-wrap gap-2">
                                                {post.tags?.split(",").map((tag: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="badge bg-primary-subtle text-primary"
                                                    >
                                                        {tag.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {post.thumbnail ? (
                                            <img
                                                src={`${storageUrl}/${post.thumbnail}`}
                                                alt={post.title}
                                                className="img-thumbnail mb-4"
                                                style={{
                                                    width: "100%",
                                                    height: "400px",
                                                    objectFit: "cover",
                                                    borderRadius: "10px",
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="bg-light text-center mb-4 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "100%",
                                                    height: "400px",
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <i className="ri-image-line fs-2 text-muted"></i>
                                            </div>
                                        )}

                                        <div className="row mt-4">
                                            <div className="col-lg-3">
                                                <h6 className="pb-1">{t("Author")}:</h6>
                                                <div className="d-flex gap-2 mb-3">
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src="/images/users/avatar-2.jpg"
                                                            alt={t("Author")}
                                                            className="avatar-sm rounded"
                                                        />
                                                    </div>
                                                    <div className="flex-grow-1">
                                                        <h5 className="mb-1">{post.user?.name ?? "Admin"}</h5>
                                                        <p className="mb-2">{t("Author of the post")}</p>
                                                        <p className="text-muted mb-0">
                                                            {new Date(post.created_at).toLocaleString("vi-VN")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-9">
                                                <div
                                                    className="text-muted mb-3 post-content"
                                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
                <Footer />
                <button
                    onClick={() => toTop()}
                    className="btn btn-danger btn-icon landing-back-top"
                    id="back-to-top"
                >
                    <i className="ri-arrow-up-line"></i>
                </button>
            </div>
        </React.Fragment>
    );
};

export default PostDetail;