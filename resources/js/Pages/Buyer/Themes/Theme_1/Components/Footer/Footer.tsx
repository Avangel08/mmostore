import React from 'react';
import { usePage } from '@inertiajs/react';

interface Contact {
    type: string;
    value: string;
}

interface ContactType {
    value: string;
    label: string;
    icon: string;
    placeholder?: string;
    url_format?: string;
}

interface FooterProps {
    contacts?: Contact[];
}

const Footer: React.FC<FooterProps> = ({ contacts = [] }) => {
    const { contact_types } = usePage().props as any;
    
    const getContactConfig = (type: string): ContactType | null => {
        if (!contact_types || !contact_types[type]) {
            return null;
        }
        return contact_types[type];
    };

    const getContactIcon = (type: string) => {
        const config = getContactConfig(type);
        return config?.icon || 'ri-links-line';
    };

    const getContactLabel = (type: string) => {
        const config = getContactConfig(type);
        return config?.label || type;
    };

    const formatContactValue = (type: string, value: string) => {
        const config = getContactConfig(type);
        if (!config) {
            return value;
        }

        const urlFormat = config.url_format || '';
        const raw = (value || '').trim();
        if (!raw) return raw;

        // If value already contains a protocol/scheme, use it as-is
        const hasScheme = /^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(raw) || raw.startsWith('http://') || raw.startsWith('https://');
        if (hasScheme) return raw;

        const normalizeValue = (t: string, v: string, fmt: string) => {
            switch (t) {
                case 'telegram':
                    return v.replace(/^@+/, '');
                case 'youtube':
                    // url_format ends with '@' for handles, avoid double '@'
                    return v.replace(/^@+/, '');
                case 'whatsapp':
                    return v.replace(/\D/g, '');
                case 'website':
                    // keep domain/path as entered; scheme will be provided by format
                    return v;
                default:
                    return v;
            }
        };

        const normalized = normalizeValue(type, raw, urlFormat);

        if (urlFormat.includes('%s')) {
            return urlFormat.replace('%s', normalized);
        }

        return `${urlFormat}${normalized}`;
    };

    return (
        <React.Fragment>
            <div className="footer-top" style={{
                backgroundColor: '#1a365d',
                padding: '20px 0',
                color: 'white',
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)',
                position: 'relative'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                    <div className="text-center">
                        <p className="mb-0" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                            <span style={{ color: 'white' }}>
                                Gặp vấn đề về Dịch vụ vui lòng liên hệ admin để được xử lý nhanh nhất có thể
                            </span>
                            {contacts && contacts.length > 0 && (
                                <>
                                    <br />
                                    <span style={{ color: '#10b981' }}>
                                        {contacts.map((contact, index) => (
                                            <React.Fragment key={index}>
                                                <a 
                                                    href={formatContactValue(contact.type, contact.value)}
                                                    style={{ color: '#10b981', textDecoration: 'none' }}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <i className={`${getContactIcon(contact.type)} me-1`}></i>
                                                    {getContactLabel(contact.type)}
                                                </a>
                                                {index < contacts.length - 1 && ' - '}
                                            </React.Fragment>
                                        ))}
                                    </span>
                                </>
                            )}
                        </p>
                    </div>
                </div>
            </div>

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
