import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

interface ModalRedirectStoreProps {
    message?: {
        success?: string;
        popup?: {
            user_id: string;
            token: string;
            expires_at: string;
        };
    }
}

const ModalRedirectStore = ({ message }: ModalRedirectStoreProps) => {
    const [show, setShow] = useState(false);
    const { t } = useTranslation();
    useEffect(() => {
        // Check if popup message exists in props
        if (message?.success && message?.popup?.user_id && message?.popup?.token) {
            setShow(true);
        }
    }, [message?.popup]);

    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>{t("Redirect to store")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{t("Would you like to switch to your store?")}</p>
                <div className="text-center mt-3">
                    <Button
                        className="btn btn-primary me-2"
                        onClick={() => {
                            const userId = message?.popup?.user_id;
                            const token = message?.popup?.token;
                            if (userId && token) {
                                const url = route("home.go-to-store", { id: userId }) + `?token=${token}`;
                                window.open(url, "_blank");
                            }
                        }}
                    >
                        {t("Go to store")}
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ModalRedirectStore;
