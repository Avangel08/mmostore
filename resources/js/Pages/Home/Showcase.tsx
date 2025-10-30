import React, { useState } from "react";
import { Container, Row, Col, Nav, Modal } from "react-bootstrap";

// Import Images
import imgTheme1 from "../../../images/landing/showcase/theme-store-1.png";
import imgTheme2 from "../../../images/landing/showcase/theme-store-2.png";
import imgTheme3 from "../../../images/landing/showcase/theme-store-3.png";
import imgThemeDark1 from "../../../images/landing/showcase/theme-store-dark-1.png";
import imgThemeDark2 from "../../../images/landing/showcase/theme-store-dark-2.png";
import imgThemeDark3 from "../../../images/landing/showcase/theme-store-dark-3.png";
import { useTranslation } from "react-i18next";

interface ModalImageProps {
    image: string | null;
    show: boolean;
    onClose: () => void;
}

const ListImage = [
    {
        image: imgTheme1,
        style: 'theme-bg-primary'
    },
    {
        image: imgTheme2,
        style: 'theme-bg-secondary'
    },
    {
        image: imgTheme3,
        style: 'theme-bg-success'
    },
    {
        image: imgThemeDark1,
        style: 'theme-bg-primary'
    },
    {
        image: imgThemeDark2,
        style: 'theme-bg-secondary'
    },
    {
        image: imgThemeDark3,
        style: 'theme-bg-success'
    }
]

const Showcase = () => {
    const { t } = useTranslation();
    const [showImage, setShowImage] = useState(false)
    const [image, setImage] = useState<string | null>(null);
    const handleShowImage = (img: string | null) => {
        if (!img) return;
        setShowImage(true)
        setImage(img)
    }

    return (
        <React.Fragment>
            <section className="section bg-light" id="marketplace">
                <Container>
                    <Row className="justify-content-center">
                        <Col lg={8}>
                            <div className="text-center mb-5">
                                <h2 className="mb-3 lh-base display-6 page-home-title-md text-gray-title">
                                    {t("Multiple Themes")}
                                </h2>
                            </div>
                        </Col>
                    </Row>
                    <div className="showcase-grid">
                        {ListImage.map((item, index) => (
                            <div key={index} className={"card showcase-box card-animate " + item.style}>
                                <div className="showcase-img" onClick={() => handleShowImage(item.image)}>
                                    <img
                                        src={item.image}
                                        alt=""
                                        className="card-img-top explore-img"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>
            <ModalImage
                image={image}
                show={showImage}
                onClose={() => setShowImage(false)}
            />
        </React.Fragment>
    );
};

export default Showcase;

const ModalImage: React.FC<ModalImageProps> = ({ image, show, onClose }) => {
    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <img
                src={image as string}
                alt=""
                className="card-img-top explore-img"
            />
        </Modal>
    )
}