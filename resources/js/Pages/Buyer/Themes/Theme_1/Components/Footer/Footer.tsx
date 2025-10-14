import { usePage } from '@inertiajs/react';
import React from 'react';

import secure from '../../../../../../../images/secure.png';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();

    return (
        <React.Fragment>
            <div className="footer-bottom" style={{
                backgroundColor: '#014475',
                padding: '20px 0',
                color: 'white',
                // width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                position: 'relative'
            }}>
                <div className='custom-container container-fluid' >
                    <Row>
                        <Col lg={6}>
                            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                                <p className="mb-2" style={{ margin: 0 }}>
                                    - {t('It is strictly prohibited to use email accounts for illegal purposes')}
                                </p>
                                <p className="mb-0" style={{ margin: 0 }}>
                                    - {t('We are not responsible for any misuse of resources')}
                                </p>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                                <p className="mb-2" style={{ margin: 0 }}>
                                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                                        - {t('Terms of Service')}
                                    </a>
                                </p>
                                <p className="mb-0" style={{ margin: 0 }}>
                                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                                        - {t('Privacy Policy')}
                                    </a>
                                </p>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <img className="w-100" src={secure} alt="" />
                        </Col>
                    </Row>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Footer;
