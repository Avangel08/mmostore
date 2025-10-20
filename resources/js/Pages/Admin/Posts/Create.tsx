import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";
import { Head, Link, useForm } from "@inertiajs/react";
import Layout from "../../../CustomAdminLayouts";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Dropzone from "react-dropzone";

const CreatePost = () => {
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [content, setContent] = useState<string>("");

  const { data, setData, post, processing, errors } = useForm({
    title: "",
    image: null as File | null,
    content: "",
    category: "",
    published_date: "",
    status: "Draft",
    visibility: "Public",
  });

  const handleAcceptedFiles = (files: any) => {
    files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(files);
  };

  const formatBytes = (bytes: any, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route("admin.posts.store"));
  };

  return (
    <>
      <Head title="Create Post | Admin Panel" />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Create Post" pageTitle="Posts" />
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <Card.Body>
                    <div className="mb-3">
                      <Form.Label>Post Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter post title..."
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
                        onChange={(e) =>
                          setData("image", e.target.files?.[0] || null)
                        }
                      />
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

                <Card>
                  <Card.Header>
                    <h5 className="card-title mb-0">Attachments</h5>
                  </Card.Header>
                  <Card.Body>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleAcceptedFiles(acceptedFiles)
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div
                          {...getRootProps()}
                          className="dropzone dz-clickable p-4 border border-dashed rounded text-center"
                        >
                          <input {...getInputProps()} />
                          <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                          <p className="mb-0">
                            Drop files here or click to upload
                          </p>
                        </div>
                      )}
                    </Dropzone>

                    <ul className="list-unstyled mt-3">
                      {selectedFiles.map((file: any, i: number) => (
                        <Card key={i} className="p-2 mb-2 shadow-none">
                          <Row className="align-items-center">
                            <Col xs="auto">
                              <img
                                src={file.preview}
                                alt={file.name}
                                height="70"
                                className="rounded bg-light"
                              />
                            </Col>
                            <Col>
                              <Link href="#" className="text-muted">
                                {file.name}
                              </Link>
                              <p className="mb-0 small text-secondary">
                                {file.formattedSize}
                              </p>
                            </Col>
                          </Row>
                        </Card>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>

                <div className="text-end mb-4">
                  <button className="btn btn-secondary me-2" type="button">
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    type="submit"
                    disabled={processing}
                  >
                    {processing ? "Saving..." : "Create"}
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

CreatePost.layout = (page: any) => <Layout children={page} />;

export default CreatePost;