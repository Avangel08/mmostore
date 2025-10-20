import React, { useState } from "react";
import { Container, Row, Col, Card, CardBody } from "react-bootstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "../../../CustomAdminLayouts";
import { Link, usePage } from "@inertiajs/react";
import Pagination from "../../../Components/Common/Pagination";
import { color } from "echarts";

const PostListView = () => {
  document.title = "Danh sách bài viết | Admin Dashboard";


  const { posts } = usePage().props as any;

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const perPageData = 6;
  const indexOfLast = currentPage * perPageData;
  const indexOfFirst = indexOfLast - perPageData;
  const currentData = posts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Danh sách bài viết" pageTitle="Posts" />

        <Row className="g-4 mb-3">
          <div className="col-sm-auto">
            <Link
              href={route("admin.posts.create")}
              className="btn btn-success"
            >
              <i className="ri-add-line align-bottom me-1"></i> Thêm bài viết
            </Link>
          </div>
        </Row>

        <Row className="gx-4">
          {currentData.length > 0 ? (
            currentData.map((post: any) => (
              <Col xxl={12} key={post.id}>
                <Card>
                  <CardBody>
                    <div className="row g-4">
                      <div className="col-xxl-3 col-lg-5">
                        {post.image ? (
                          <img
                            src={`/storage/${post.image}`}
                            alt={post.title}
                            className="img-fluid rounded object-fit-cover"
                            style={{ width: "100%", height: "250px" }}
                          />
                        ) : (
                          <div className="bg-light text-center p-5 rounded">
                            <i className="ri-image-line fs-2 text-muted"></i>
                          </div>
                        )}
                      </div>

                      <div className="col-xxl-9 col-lg-7 d-flex flex-column justify-content-between">
                        <div>
                          <h5 className="fs-15 fw-semibold">{post.title}</h5>
                          <p className="text-muted mb-2">
                            {post.content?.slice(0, 150)}...
                          </p>
                        </div>
                        <div style={{ color: "red" }}>
                          {post.status ?? "Không có trạng thái"}
                        </div>

                        <div className="d-flex justify-content-between align-items-center mt-2">
                          <div className="d-flex align-items-center gap-2">
                            <p className="text-muted mb-0">
                              <i className="ri-calendar-event-line me-1"></i>
                              {new Date(post.created_at).toLocaleDateString(
                                "vi-VN"
                              )}
                            </p>

                            <Link
                              href={route("admin.posts.show", post.id)}
                              className="btn btn-info btn-sm"
                            >
                              Xem chi tiết
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center text-muted">Chưa có bài viết nào.</p>
          )}
        </Row>

        <div className="text-center mt-4">
          <Pagination
            perPageData={perPageData}
            data={posts}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </Container>
    </div>
  );
};

PostListView.layout = (page: any) => <Layout children={page} />;
export default PostListView;