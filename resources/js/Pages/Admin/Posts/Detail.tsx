import React from "react";
import { Container } from "react-bootstrap";
import { Link, usePage, router } from "@inertiajs/react";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Layout from "../../../CustomAdminLayouts";

const DetailPost = () => {
  const { post }: any = usePage().props;
  const storageUrl = usePage().props.storageUrl as string;
  document.title = `${post.title} | Bài viết`;

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa bài viết này không?")) {
      router.delete(route("admin.posts.destroy", post.id), {
        onSuccess: () => {
          alert("Đã xóa bài viết thành công!");
          router.visit(route("admin.posts.index"));
        },
        onError: () => {
          alert("Xóa thất bại, vui lòng thử lại!");
        },
      });
    }
  };

  return (
    <div className="page-content">
      <style>
        {`
          img {
            width: 100%
          }
        `}
      </style>
      <Container fluid>
        <BreadCrumb title={post.title} pageTitle="Bài viết" />

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
                    <h6 className="pb-1">Tác giả:</h6>
                    <div className="d-flex gap-2 mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src="/images/users/avatar-2.jpg"
                          alt=""
                          className="avatar-sm rounded"
                        />
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-1">{post.user?.name ?? "Admin"}</h5>
                        <p className="mb-2">Tác giả bài viết</p>
                        <p className="text-muted mb-0">
                          {new Date(post.created_at).toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-9">
                    <div
                      className="text-muted mb-3"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <Link
                    href={route("admin.posts.index")}
                    className="btn btn-outline-primary btn-sm"
                  >
                    ← Quay lại danh sách
                  </Link>

                  <div className="d-flex gap-2">
                    <Link
                      href={route("admin.posts.edit", post.id)}
                      className="btn btn-warning btn-sm"
                    >
                      <i className="ri-edit-line me-1"></i> Sửa bài viết
                    </Link>

                    <button
                      onClick={handleDelete}
                      className="btn btn-danger btn-sm"
                    >
                      <i className="ri-delete-bin-line me-1"></i> Xóa bài viết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

DetailPost.layout = (page: any) => <Layout children={page} />;
export default DetailPost;