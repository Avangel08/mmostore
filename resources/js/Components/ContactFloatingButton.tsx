import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from "react-i18next";

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

interface ContactFloatingButtonProps {
    contacts?: Contact[];
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

const ContactFloatingButton: React.FC<ContactFloatingButtonProps> = ({ 
    contacts = [], 
    position = 'bottom-right' 
}) => {
    const { contact_types } = usePage().props as any;
    const [isExpanded, setIsExpanded] = useState(false);
    const {t} = useTranslation();

    // Filter contacts that have values
    const activeContacts = contacts.filter(contact => contact.value && contact.value.trim());

    // Don't render if no active contacts
    if (activeContacts.length === 0) {
        return null;
    }

    const getContactConfig = (type: string): ContactType | null => {
        if (!contact_types || !contact_types[type]) {
            return null;
        }
        return contact_types[type];
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
                    return v.replace(/^@+/, '');
                case 'whatsapp':
                    return v.replace(/\D/g, '');
                case 'website':
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

    const handleContactClick = (contact: Contact) => {
        const url = formatContactValue(contact.type, contact.value);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const getPositionStyles = () => {
        const baseStyles = {
            position: 'fixed' as const,
            zIndex: 1000,
            transition: 'all 0.3s ease',
        };

        switch (position) {
            case 'bottom-right':
                return {
                    ...baseStyles,
                    bottom: '40px',
                    right: '20px',
                };
            case 'bottom-left':
                return {
                    ...baseStyles,
                    bottom: '100px',
                    left: '20px',
                };
            case 'top-right':
                return {
                    ...baseStyles,
                    top: '100px',
                    right: '20px',
                };
            case 'top-left':
                return {
                    ...baseStyles,
                    top: '100px',
                    left: '20px',
                };
            default:
                return {
                    ...baseStyles,
                    bottom: '100px',
                    right: '20px',
                };
        }
    };

    const getContactIconColor = (type: string) => {
        const colors: { [key: string]: string } = {
            telegram: '#0088cc',
            facebook: '#1877f2',
            instagram: '#e4405f',
            x: '#000000',
            whatsapp: '#25d366',
            discord: '#5865f2',
            email: '#ea4335',
            phone: '#34a853',
            website: '#4285f4',
            youtube: '#ff0000',
            zalo: '#0068ff', // Thêm màu cho Zalo
        };
        return colors[type] || '#6c757d';
    };

    return (
        <>
            <style>
                {`
                    .contact-floating-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .contact-item-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transform: translateX(0);
                        transition: all 0.3s ease;
                        width: 100%;
                        justify-content: center;
                    }
                    
                    .contact-item-wrapper.expanded {
                        transform: translateX(-40px);
                    }
                    
                    .contact-item-text {
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        white-space: nowrap;
                        opacity: 0;
                        transform: translateY(-10px);
                        transition: all 0.3s ease;
                        z-index: 1001;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
                    }
                    
                    .contact-item-wrapper.expanded .contact-item-text {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .contact-floating-button {
                        width: 60px;
                        height: 60px;
                        border-radius: 50%;
                        border: none;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        transition: all 0.3s ease;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .contact-floating-button::before {
                        content: '';
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        width: 0;
                        height: 0;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: translate(-50%, -50%);
                        transition: width 0.6s, height 0.6s;
                    }
                    
                    .contact-floating-button:active::before {
                        width: 120px;
                        height: 120px;
                    }
                    
                    .contact-floating-button:hover {
                        transform: scale(1.1);
                        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
                    }
                    
                    .contact-main-button {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        font-size: 12px;
                        font-weight: 600;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 2px;
                    }
                    
                    .contact-main-button i {
                        font-size: 16px;
                    }
                    
                    .contact-item-button {
                        width: 50px;
                        height: 50px;
                        background: white;
                        color: #333;
                        font-size: 20px;
                        opacity: 0;
                        transform: translateY(-20px);
                        transition: all 0.3s ease;
                        border: 2px solid rgba(255, 255, 255, 0.8);
                    }
                    
                    .contact-item-button.expanded {
                        opacity: 1;
                        transform: translateY(0);
                    }
                    
                    .contact-item-button:hover {
                        background: #f8f9fa;
                        transform: translateY(0) scale(1.15);
                    }
                    
                    .contact-main-button {
                        animation: mainPulse 2s infinite;
                    }
                    
                    @keyframes mainPulse {
                        0% {
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 0 rgba(102, 126, 234, 0.8);
                        }
                        50% {
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 15px rgba(102, 126, 234, 0.4);
                        }
                        100% {
                            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 30px rgba(102, 126, 234, 0.1);
                        }
                    }
                    
                    
                    .contact-label {
                        position: absolute;
                        right: 60px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0, 0, 0, 0.9);
                        color: white;
                        padding: 6px 10px;
                        border-radius: 4px;
                        font-size: 12px;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s ease;
                        z-index: 1001;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                    }
                    
                    .contact-item-button.expanded .contact-label {
                        opacity: 1 !important;
                        transition-delay: 0.2s;
                    }
                    
                    .contact-main-label {
                        position: absolute;
                        right: 70px;
                        top: 50%;
                        transform: translateY(-50%);
                        background: rgba(0, 0, 0, 0.8);
                        color: white;
                        padding: 8px 12px;
                        border-radius: 6px;
                        font-size: 14px;
                        white-space: nowrap;
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.3s ease;
                    }
                    
                    .contact-main-button:hover .contact-main-label {
                        opacity: 1;
                    }
                    
                    @media (max-width: 768px) {
                        .contact-floating-container {
                            gap: 8px;
                        }
                        
                        .contact-floating-button {
                            width: 50px;
                            height: 50px;
                        }
                        
                        .contact-main-button {
                            font-size: 20px;
                        }
                        
                        .contact-item-button {
                            width: 45px;
                            height: 45px;
                            font-size: 18px;
                        }
                        
                        .contact-label,
                        .contact-main-label,
                        .contact-item-text {
                            display: none;
                        }
                    }
                `}
            </style>
            
            <div className="contact-floating-container" style={getPositionStyles()}>
                {activeContacts.map((contact, index) => {
                    const config = getContactConfig(contact.type);
                    if (!config) return null;

                    const iconColor = getContactIconColor(contact.type);
                    
                    return (
                        <div key={index} className={`contact-item-wrapper ${isExpanded ? 'expanded' : ''}`}>
                            <span 
                                className="contact-item-text"
                                style={{
                                    transitionDelay: isExpanded ? `${index * 0.1 + 0.2}s` : '0s',
                                }}
                            >
                                {config.label}
                            </span>
                            <button
                                className={`contact-floating-button contact-item-button ${isExpanded ? 'expanded' : ''}`}
                                onClick={() => handleContactClick(contact)}
                                style={{
                                    transitionDelay: isExpanded ? `${index * 0.1}s` : '0s',
                                    color: iconColor,
                                }}
                            >
                                <i className={config.icon}></i>
                            </button>
                        </div>
                    );
                })}
                
                <button
                    className="contact-floating-button contact-main-button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{ marginTop: '20px' }}
                >
                    <i className="ri-customer-service-2-line"></i>
                    <span style={{ fontSize: '10px', lineHeight: '1' }}>{ t("Contact support") }</span>
                    <span className="contact-main-label">{ t("Contact support") }</span>
                </button>
            </div>
        </>
    );
};

export default ContactFloatingButton;
