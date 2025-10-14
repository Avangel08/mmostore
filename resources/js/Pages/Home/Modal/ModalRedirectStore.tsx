import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { router } from '@inertiajs/react';

interface ModalRedirectStoreProps {
    message?: {
        success?: string;
        popup?: string;
    }
}

const ModalRedirectStore = ({ message }: ModalRedirectStoreProps) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Check if popup message exists in props
        if (message?.success && message?.popup) {
            setShow(true);
        }
    }, [message?.popup]);

    const handleClose = () => setShow(false);

    const handleRedirectToStore = () => {
        router.visit('/store');
        setShow(false);
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chuyển hướng đến cửa hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Bạn có muốn chuyển sang cửa hàng của mình không?</p>
                <div className="text-center mt-3">
                    <Button
                        className="btn btn-primary me-2"
                        onClick={() => {
                            const url = route("home.go-to-store", { id: message?.popup });
                            window.open(url, "_blank");
                        }}
                    >
                        Có, chuyển đến cửa hàng
                    </Button>
                    <Button
                        className="btn btn-secondary"
                        onClick={handleClose}
                    >
                        Không, ở lại trang chủ
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalRedirectStore;
