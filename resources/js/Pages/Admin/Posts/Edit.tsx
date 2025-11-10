import React, { useState, useEffect } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { Head, Link, useForm, usePage, router } from "@inertiajs/react";
import Layout from "../../../CustomAdminLayouts";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EditPost = () => {
  const { post }: any = usePage().props;

  const [previewImage, setPreviewImage] = useState<string | null>(
    post.image ? `/storage/${post.image}` : null
  );

  const { data, setData, put, processing, errors } = useForm({
    title: post.title || "",
    image: null as File | null,
    content: post.content || "",
    category: post.category || "",
    published_date: post.published_date || "",
    status: post.status || "Draft",
    visibility: post.visibility || "Public",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setData("image", file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route("admin.posts.update", post.id));
  };

  return (
    <>
      <Head title={`Chỉnh sửa: ${post.title} | Admin Panel`} />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Edit Post" pageTitle="Posts" />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <Card.Body>
                    <div className="mb-3">
                      <Form.Label>Post Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={data.title}
                        onChange={(e) => setData("title", e.target.value)}
                      />
                      {errors.title && (
                        <div className="text-danger small">{errors.title}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <Form.Label>Thumbnail Image</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleImageChange}
                      />
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mt-2 rounded"
                          style={{
                            width: "100%",
                            height: "250px",
                            objectFit: "cover",
                          }}
                        />
                      )}
                      {errors.image && (
                        <div className="text-danger small">{errors.image}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <Form.Label>Content</Form.Label>
                      <CKEditor
                        editor={ClassicEditor as any}
                        data={data.content}
                        onChange={(_, editor) =>
                          setData("content", editor.getData())
                        }
                      />
                      {errors.content && (
                        <div className="text-danger small">
                          {errors.content}
                        </div>
                      )}
                    </div>

                    <Row>
                      <Col lg={6}>
                        <Form.Label>Category</Form.Label>
                        <select
                          className="form-select"
                          value={data.category}
                          onChange={(e) => setData("category", e.target.value)}
                        >
                          <option value="">-- Select --</option>
                          <option>News</option>
                          <option>Technology</option>
                          <option>Business</option>
                          <option>Life</option>
                        </select>
                      </Col>
                      <Col lg={6}>
                        <Form.Label>Published Date</Form.Label>
                        <Flatpickr
                          className="form-control"
                          options={{ dateFormat: "Y-m-d" }}
                          value={data.published_date}
                          onChange={(date) =>
                            setData(
                              "published_date",
                              date.length
                                ? date[0].toISOString().split("T")[0]
                                : ""
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <div className="text-end mb-4">
                  <Link
                    href={route("admin.posts.index")}
                    className="btn btn-secondary me-2"
                  >
                    Cancel
                  </Link>
                  <button
                    className="btn btn-success"
                    type="submit"
                    disabled={processing}
                  >
                    {processing ? "Saving..." : "Update"}
                  </button>
                </div>
              </Col>

              <Col lg={4}>
                <Card>
                  <Card.Header>
                    <h5 className="card-title mb-0">Post Settings</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <select
                        className="form-select"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                      >
                        <option>Bản nháp</option>
                        <option>Xuất bản</option>
                      </select>
                    </div>

                    <div>
                      <Form.Label>Visibility</Form.Label>
                      <select
                        className="form-select"
                        value={data.visibility}
                        onChange={(e) => setData("visibility", e.target.value)}
                      >
                        <option>Public</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
    </>
  );
};

EditPost.layout = (page: any) => <Layout children={page} />;
export default EditPost;