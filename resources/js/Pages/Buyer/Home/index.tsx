import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import ModalLogin from "./ModalLogin";
import { router, usePage } from "@inertiajs/react";

function LoginPopup() {
  const [show, setShow] = useState(false);
  const { user } = usePage().props;
  const handleLogout = () => {
    router.post(route("buyer.logout"), {}, {
      onSuccess: () => {
        // Reload page to refresh CSRF token after successful logout
        window.location.reload();
      }
    });
  }
  useEffect(() => {
    if (user) {
      setShow(false);
    }
  }, [user]);
  return (
    <>
      {user ? (
        <Button variant="primary" onClick={handleLogout} size="sm">
          Đăng xuất
        </Button>
      ) : (
        <Button variant="primary" onClick={() => {setShow(true)}} size="sm">
          Đăng nhập
        </Button>
      )}

      <ModalLogin show={show} handleClose={() => {setShow(false)}} />
    </>
  );
}

export default LoginPopup;
