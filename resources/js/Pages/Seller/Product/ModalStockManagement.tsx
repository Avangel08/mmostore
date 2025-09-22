import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

interface ModalStockManagementProps {
  show: boolean;
  onHide: () => void;
  productId: number | string | null;
  refetchData: () => void;
}

export const ModalStockManagement = ({
  show,
  onHide,
  productId,
  refetchData,
}: ModalStockManagementProps) => {
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("Manage Stock")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* TODO: Implement stock management form */}
        <div className="text-center p-4">
          <p>{t("Stock management form will be implemented here")}</p>
          {productId && <p>Product ID: {productId}</p>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t("Close")}
        </Button>
        <Button variant="primary">
          {t("Save Changes")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};