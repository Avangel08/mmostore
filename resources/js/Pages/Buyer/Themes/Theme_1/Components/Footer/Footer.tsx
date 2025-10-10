import React from 'react';

const Footer: React.FC = () => {

    return (
        <React.Fragment>
            <div className="footer-bottom" style={{
                backgroundColor: '#0f172a',
                padding: '20px 0',
                color: 'white',
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1', minWidth: '300px', marginBottom: '10px' }}>
                            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                                <p className="mb-2" style={{ margin: 0 }}>
                                    - Nghiêm cấm sử dụng tài khoản email với mục đích trái pháp luật
                                </p>
                                <p className="mb-0" style={{ margin: 0 }}>
                                    - Chúng tôi không chịu trách nhiệm cho bất kì hành vi nào sử dụng tài nguyên sai mục đích.
                                </p>
                            </div>
                        </div>
                        
                        <div style={{ flex: '0 0 auto', textAlign: 'right' }}>
                            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                                <p className="mb-2" style={{ margin: 0 }}>
                                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                                        - Điều khoản sử dụng
                                    </a>
                                </p>
                                <p className="mb-0" style={{ margin: 0 }}>
                                    <a href="#" style={{ color: 'white', textDecoration: 'none' }}>
                                        - Chính sách bảo mật
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Footer;
