import React, { useState } from "react";
import GuestLayout from "../../../Layouts/GuestLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Button, Card, Col, Container, Form, Row, InputGroup } from "react-bootstrap";
import logoLight from "../../../../images/logo-light.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import {t} from "i18next";

// Component icon cờ quốc gia
const FlagIcon = ({ countryCode }: { countryCode: string }) => {
    const flagStyle = {
        width: '16px',
        height: '12px',
        borderRadius: '2px',
        marginRight: '6px',
        display: 'inline-block',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid #ddd',
        verticalAlign: 'middle'
    };

    // Sử dụng flagcdn.com để hiển thị cờ quốc gia
    const getFlagUrl = (code: string) => {
        const countryMap: { [key: string]: string } = {
            "+84": "vn", // Vietnam
            "+1": "us", // United States
            "+44": "gb", // United Kingdom
            "+86": "cn", // China
            "+81": "jp", // Japan
            "+82": "kr", // South Korea
            "+65": "sg", // Singapore
            "+66": "th", // Thailand
            "+60": "my", // Malaysia
            "+63": "ph", // Philippines
            "+62": "id", // Indonesia
            "+91": "in", // India
            "+61": "au", // Australia
            "+64": "nz", // New Zealand
            "+33": "fr", // France
            "+49": "de", // Germany
            "+39": "it", // Italy
            "+34": "es", // Spain
            "+7": "ru", // Russia
            "+55": "br", // Brazil
            "+52": "mx", // Mexico
            "+54": "ar", // Argentina
            "+27": "za", // South Africa
            "+20": "eg", // Egypt
            "+971": "ae", // UAE
            "+966": "sa", // Saudi Arabia
            "+90": "tr", // Turkey
            "+98": "ir", // Iran
            "+92": "pk", // Pakistan
            "+880": "bd", // Bangladesh
        };
        
        const flagCode = countryMap[code] || "un"; // default to UN flag
        return `https://flagcdn.com/16x12/${flagCode}.png`;
    };

    return (
        <img 
            src={getFlagUrl(countryCode)} 
            alt={`Flag of ${countryCode}`}
            style={flagStyle}
            onError={(e) => {
                // Fallback to emoji if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentNode as HTMLElement;
                if (parent && !parent.querySelector('.flag-emoji')) {
                    const emoji = document.createElement('span');
                    emoji.className = 'flag-emoji';
                    emoji.textContent = '🏳️';
                    emoji.style.marginRight = '6px';
                    emoji.style.fontSize = '14px';
                    emoji.style.verticalAlign = 'middle';
                    parent.insertBefore(emoji, target);
                }
            }}
        />
    );
};

// Component hiển thị cờ quốc gia thực
const CountryFlag = ({ countryCode }: { countryCode: string }) => {
    const getFlagUrl = (code: string) => {
        const countryMap: { [key: string]: string } = {
            "+84": "vn", // Vietnam
            "+1": "us", // United States
            "+44": "gb", // United Kingdom
            "+86": "cn", // China
            "+81": "jp", // Japan
            "+82": "kr", // South Korea
            "+65": "sg", // Singapore
            "+66": "th", // Thailand
            "+60": "my", // Malaysia
            "+63": "ph", // Philippines
            "+62": "id", // Indonesia
            "+91": "in", // India
            "+61": "au", // Australia
            "+64": "nz", // New Zealand
            "+33": "fr", // France
            "+49": "de", // Germany
            "+39": "it", // Italy
            "+34": "es", // Spain
            "+7": "ru", // Russia
            "+55": "br", // Brazil
            "+52": "mx", // Mexico
            "+54": "ar", // Argentina
            "+27": "za", // South Africa
            "+20": "eg", // Egypt
            "+971": "ae", // UAE
            "+966": "sa", // Saudi Arabia
            "+90": "tr", // Turkey
            "+98": "ir", // Iran
            "+92": "pk", // Pakistan
            "+880": "bd", // Bangladesh
        };
        
        const flagCode = countryMap[code] || "un";
        return `https://flagcdn.com/20x15/${flagCode}.png`;
    };

    return (
        <img 
            src={getFlagUrl(countryCode)} 
            alt={`Flag of ${countryCode}`}
            style={{
                width: '20px',
                height: '15px',
                borderRadius: '2px',
                marginRight: '8px',
                display: 'inline-block',
                verticalAlign: 'middle',
                border: '1px solid #ddd'
            }}
            onError={(e) => {
                // Fallback nếu ảnh không load được
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
            }}
        />
    );
};

// Danh sách các quốc gia với mã số điện thoại và ISO country code
const countryCodes = [
    { code: "+84", country: "Vietnam", isoCode: "VN" },
    { code: "+1", country: "United States", isoCode: "US" },
    { code: "+44", country: "United Kingdom", isoCode: "GB" },
    { code: "+86", country: "China", isoCode: "CN" },
    { code: "+81", country: "Japan", isoCode: "JP" },
    { code: "+82", country: "South Korea", isoCode: "KR" },
    { code: "+65", country: "Singapore", isoCode: "SG" },
    { code: "+66", country: "Thailand", isoCode: "TH" },
    { code: "+60", country: "Malaysia", isoCode: "MY" },
    { code: "+63", country: "Philippines", isoCode: "PH" },
    { code: "+62", country: "Indonesia", isoCode: "ID" },
    { code: "+91", country: "India", isoCode: "IN" },
    { code: "+61", country: "Australia", isoCode: "AU" },
    { code: "+64", country: "New Zealand", isoCode: "NZ" },
    { code: "+33", country: "France", isoCode: "FR" },
    { code: "+49", country: "Germany", isoCode: "DE" },
    { code: "+39", country: "Italy", isoCode: "IT" },
    { code: "+34", country: "Spain", isoCode: "ES" },
    { code: "+7", country: "Russia", isoCode: "RU" },
    { code: "+55", country: "Brazil", isoCode: "BR" },
    { code: "+52", country: "Mexico", isoCode: "MX" },
    { code: "+54", country: "Argentina", isoCode: "AR" },
    { code: "+27", country: "South Africa", isoCode: "ZA" },
    { code: "+20", country: "Egypt", isoCode: "EG" },
    { code: "+971", country: "UAE", isoCode: "AE" },
    { code: "+966", country: "Saudi Arabia", isoCode: "SA" },
    { code: "+90", country: "Turkey", isoCode: "TR" },
    { code: "+98", country: "Iran", isoCode: "IR" },
    { code: "+92", country: "Pakistan", isoCode: "PK" },
    { code: "+880", country: "Bangladesh", isoCode: "BD" },
];

export default function Register() {
    const { props } = usePage();
    const DOMAIN_SUFFIX = (props as any)?.domainSuffix;
    const [passwordShow, setPasswordShow] = useState<boolean>(false);
    const [confirmPasswordShow, setConfirmPasswordShow] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [selectedCountryCode, setSelectedCountryCode] = useState<string>("+84");
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false);

    // Function to convert store name to domain format
    const generateDomainFromStoreName = (storeName: string): string => {
        if (!storeName || storeName.trim() === '') return '';
        
        // Remove Vietnamese diacritics and convert to lowercase
        const removeDiacritics = (str: string): string => {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        };
        
        // Clean the store name: remove diacritics, spaces, special characters, convert to lowercase
        let cleanName = removeDiacritics(storeName)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '') // Remove all non-alphanumeric characters
            .substring(0, 12); // Limit to 12 characters to leave room for 3 random numbers
        
        // Generate 3 random numbers
        const randomNumbers = Math.floor(100 + Math.random() * 900); // 100-999
        
        return cleanName + randomNumbers;
    };

    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            email: "",
            store_name: "",
            domain_store: "",
            phone: "",
            password: "",
            confirm_password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string()
                .email(t("Invalid email"))
                .matches(
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    t("Invalid email")
                )
                .required(t("Email is required")),
            store_name: Yup.string()
                .min(3, t("Store name must be at least 3 characters"))
                .max(20, t("Store name must be at most 20 characters"))
                .required(t("Store name is required")),
            domain_store: Yup.string()
                .transform((value) => {
                    if (!value) return value;
                    let cleaned = value.replace(new RegExp(`\\.?${DOMAIN_SUFFIX.replace(/\./g, '\\.')}$`, 'i'), '');
                    cleaned = cleaned.replace(/^\.+/, '');
                    return cleaned;
                })
                .min(3, t("Domain store must be at least 3 characters"))
                .max(15, t("Domain store must be at most 15 characters"))
                .required(t("Domain store is required")),
            phone: Yup.string()
                .matches(/^[0-9\s\-\+\(\)]+$/, t("Phone number contains invalid characters"))
                .min(8, t("Phone must be at least 8 characters"))
                .max(15, t("Phone must be at most 15 characters"))
                .required(t("Phone is required")),
            password: Yup.string()
                .min(8, t("Password must be at least 8 characters"))
                .required(t("Password is required")),
            confirm_password: Yup.string()
                .oneOf([Yup.ref('password')], t("Passwords must match"))
                .required(t("Password is required")),
        }),
        onSubmit: (values) => {
            const selectedCountry = countryCodes.find(c => c.code === selectedCountryCode);
            const payload = {
                ...values,
                domain_store: values.domain_store
                    .replace(new RegExp(`\\.?${DOMAIN_SUFFIX.replace(/\./g, '\\.')}$`, 'i'), '')
                    .replace(/^\.+/, ''),
                country_code: selectedCountryCode,
                country: selectedCountry?.isoCode || 'VN',
                phone_number: values.phone,
                full_phone: `${selectedCountryCode}${values.phone}`,
            };
            setIsSubmitting(true);
            router.post(route('home.register.post'), payload, {
                preserveScroll: true,
                onSuccess: () => {
                    setServerError(null);
                    setIsSubmitting(false);
                },
                onError: (errors: any) => {
                    validation.setErrors(errors);
                    const topMessage = Array.isArray(errors?.register) ? errors.register[0] : errors?.register;
                    setIsSubmitting(false);
                }
            });
        },
    });


    return (
        <React.Fragment>
            <style>
                {`
                    .country-code-select option {
                        font-size: 14px !important;
                        font-weight: 500 !important;
                        padding: 8px 12px !important;
                    }
                    .country-code-select {
                        background-image: none !important;
                    }
                    .country-code-select:focus {
                        border-color: #86b7fe !important;
                        box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
                    }
                    .country-code-select option:first-child {
                        background-color: #f8f9fa;
                    }
                `}
            </style>
            <GuestLayout>
                <Head title={t("Register")} />
                <div className="auth-page-content mt-lg-5">
                    <Container>
                        <Row>
                            <Col lg={12}>
                                <div className="text-center mt-sm-5 mb-4 text-white-50">
                                    <div>
                                        <Link href="/" className="d-inline-block auth-logo">
                                            <img src={logoLight} alt="" height="20"/>
                                        </Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <Row className="justify-content-center">
                            <Col md={9} lg={7} xl={6}>
                                <Card className="mt-4">
                                    <Card.Body>
                                        <div className="text-center mt-2">
                                            <h5 className="text-primary">{t('Create New Account')}</h5>
                                            <p className="text-muted">{t('Get your free MMO Store account now')}</p>
                                        </div>
                                        <div className="p-2 mt-4">
                                            {serverError && (
                                                <div className="alert alert-danger" role="alert">
                                                    {serverError}
                                                </div>
                                            )}
                                            <Form onSubmit={validation.handleSubmit}>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="user-email">Email <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-email-inputgroup">
                                                        <Form.Control
                                                            type='email'
                                                            className="form-control pe-5 user-email-input"
                                                            placeholder={ t("Enter your email") }
                                                            id="user-email"
                                                            name="email"
                                                            value={validation.values.email}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.email && validation.touched.email ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.email && validation.touched.email ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.email && validation.touched.email ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.email && validation.touched.email ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.email}</Form.Control.Feedback>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="phone-number">{t("Phone")} <span className="text-danger">*</span></Form.Label>
                                                    <InputGroup className="position-relative auth-phone-inputgroup">
                                                        <div className="d-flex align-items-center rounded-start" style={{
                                                            padding: '5px 5px'
                                                        }}>
                                                            <CountryFlag countryCode={selectedCountryCode} />
                                                        </div>
                                                        <Form.Select
                                                            value={selectedCountryCode}
                                                            onChange={(e) => setSelectedCountryCode(e.target.value)}
                                                            className="country-code-select"
                                                            style={{ 
                                                                borderRadius: 'var(--vz-border-radius) 0 0 var(--vz-border-radius)',
                                                            }}
                                                        >
                                                            {countryCodes.map((country) => (
                                                                <option key={country.code} value={country.code}>
                                                                    {country.country} ({country.code})
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                        <Form.Control
                                                            type="tel"
                                                            className="form-control phone-input"
                                                            placeholder={t("Enter your phone number")}
                                                            id="phone-number"
                                                            name="phone"
                                                            value={validation.values.phone}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.phone && validation.touched.phone ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.phone && validation.touched.phone ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.phone && validation.touched.phone ? 'none' : undefined,
                                                                minWidth: '260px'
                                                            }}
                                                        />
                                                        {validation.errors.phone && validation.touched.phone ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.phone}</Form.Control.Feedback>
                                                        ) : null}
                                                    </InputGroup>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="store-name">{t("Store name")} <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-store-name-inputgroup">
                                                        <Form.Control
                                                            type='text'
                                                            className="form-control pe-5 store-name-input"
                                                            placeholder={ t("Enter your store name") }
                                                            id="store-name"
                                                            name="store_name"
                                                            value={validation.values.store_name}
                                                            onBlur={validation.handleBlur}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                const storeName = e.target.value;
                                                                validation.setFieldValue('store_name', storeName);
                                                                
                                                                if (storeName && storeName.trim() !== '') {
                                                                    const generatedDomain = generateDomainFromStoreName(storeName);
                                                                    validation.setFieldValue('domain_store', `${generatedDomain}.${DOMAIN_SUFFIX}`);
                                                                }
                                                            }}
                                                            isInvalid={validation.errors.store_name && validation.touched.store_name ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.store_name && validation.touched.store_name ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.store_name && validation.touched.store_name ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.store_name && validation.touched.store_name ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.store_name}</Form.Control.Feedback>
                                                        ) : null}
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="domain-store">{t("Domain store")} <span className="text-danger">*</span></Form.Label>
                                                    <div className="position-relative auth-store-name-inputgroup">
                                                        <Form.Control
                                                            type='text'
                                                            className="form-control pe-5 domain-store-input"
                                                            placeholder={ t("Enter your domain store") }
                                                            id="domain-store"
                                                            name="domain_store"
                                                            value={validation.values.domain_store}
                                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                                let rawValue = e.target.value.replace(new RegExp(`\\.?${DOMAIN_SUFFIX.replace(/\./g, '\\.')}$`, 'i'), '');
                                                                rawValue = rawValue.replace(/^\.+/, '');
                                                                validation.setFieldValue('domain_store', rawValue);
                                                            }}
                                                            onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                                validation.handleBlur(e);
                                                                let rawValue = validation.values.domain_store.trim();
                                                                rawValue = rawValue.replace(/^\.+/, '');
                                                                if (rawValue && !rawValue.toLowerCase().endsWith(DOMAIN_SUFFIX)) {
                                                                    validation.setFieldValue('domain_store', `${rawValue}.${DOMAIN_SUFFIX}`);
                                                                }
                                                            }}
                                                            onFocus={() => {
                                                                const currentValue = validation.values.domain_store;
                                                                let stripped = currentValue.replace(new RegExp(`\\.?${DOMAIN_SUFFIX.replace(/\./g, '\\.')}$`, 'i'), '');
                                                                stripped = stripped.replace(/^\.+/, '');
                                                                if (stripped !== currentValue) {
                                                                    validation.setFieldValue('domain_store', stripped);
                                                                }
                                                            }}
                                                            isInvalid={validation.errors.domain_store && validation.touched.domain_store ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.domain_store && validation.touched.domain_store ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.domain_store && validation.touched.domain_store ? 'none' : undefined
                                                            }}
                                                        />
                                                        { validation.errors.domain_store && validation.touched.domain_store ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.domain_store}</Form.Control.Feedback>
                                                        ) : null }
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="password-input">{ t("Password") }</Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={passwordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder={ t("Enter your password") }
                                                            id="password-input"
                                                            name="password"
                                                            value={validation.values.password}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.password && validation.touched.password ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.password && validation.touched.password ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.password && validation.touched.password ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.password && validation.touched.password ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.password}</Form.Control.Feedback>
                                                        ) : null}
                                                        <Button variant="link" onClick={() => setPasswordShow(!passwordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted password-addon material-shadow-none" type="button"
                                                            id="password-addon"><i className="ri-eye-fill align-middle"></i>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <Form.Label className="form-label" htmlFor="confirm-password-input">{ t("Confirm password") }</Form.Label>
                                                    <div className="position-relative auth-pass-inputgroup">
                                                        <Form.Control
                                                            type={confirmPasswordShow ? "text" : "password"}
                                                            className="form-control pe-5 password-input"
                                                            placeholder={ t("Enter your password") }
                                                            id="confirm-password-input"
                                                            name="confirm_password"
                                                            value={validation.values.confirm_password}
                                                            onBlur={validation.handleBlur}
                                                            onChange={validation.handleChange}
                                                            isInvalid={validation.errors.confirm_password && validation.touched.confirm_password ? true : false}
                                                            style={{
                                                                borderColor: validation.errors.confirm_password && validation.touched.confirm_password ? '#ced4da' : undefined,
                                                                backgroundImage: validation.errors.confirm_password && validation.touched.confirm_password ? 'none' : undefined
                                                            }}
                                                        />
                                                        {validation.errors.confirm_password && validation.touched.confirm_password ? (
                                                            <Form.Control.Feedback type="invalid" style={{display: 'block'}}>{validation.errors.confirm_password}</Form.Control.Feedback>
                                                        ) : null}
                                                        <Button variant="link" onClick={() => setConfirmPasswordShow(!confirmPasswordShow)} className="position-absolute end-0 top-0 text-decoration-none text-muted confirm-password-addon material-shadow-none" type="button"
                                                            id="confirm-password-addon"><i className="ri-eye-fill align-middle"></i></Button>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            id="agree-terms"
                                                            checked={agreeToTerms}
                                                            onChange={(e) => setAgreeToTerms(e.target.checked)}
                                                            className="form-check-input"
                                                        />
                                                        <Form.Label htmlFor="agree-terms" className="form-check-label fs-12 text-muted fst-italic">
                                                            {t('By registering you agree to the MMO Store')}
                                                            <Link href="#" className="text-primary text-decoration-underline fst-normal fw-medium ms-1">{t('Terms of Use')}</Link>
                                                        </Form.Label>
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <button 
                                                        className="btn btn-success w-100" 
                                                        type="submit" 
                                                        disabled={isSubmitting || !agreeToTerms}
                                                        style={{
                                                            opacity: (!agreeToTerms && !isSubmitting) ? 0.6 : 1,
                                                            cursor: (!agreeToTerms && !isSubmitting) ? 'not-allowed' : 'pointer'
                                                        }}
                                                    >
                                                        { t("Sign up store") }
                                                    </button>
                                                </div>
                                                {/*<div className="mt-4 text-center">*/}
                                                {/*    <div className="signin-other-title">*/}
                                                {/*        <h5 className="fs-13 mb-4 title text-muted">Create account with</h5>*/}
                                                {/*    </div>*/}

                                                {/*    <div>*/}
                                                {/*        <button type="button" className="btn btn-primary btn-icon waves-effect waves-light"><i className="ri-facebook-fill fs-16"></i></button>{" "}*/}
                                                {/*        <button type="button" className="btn btn-danger btn-icon waves-effect waves-light"><i className="ri-google-fill fs-16"></i></button>{" "}*/}
                                                {/*        <button type="button" className="btn btn-dark btn-icon waves-effect waves-light"><i className="ri-github-fill fs-16"></i></button>{" "}*/}
                                                {/*        <button type="button" className="btn btn-info btn-icon waves-effect waves-light"><i className="ri-twitter-fill fs-16"></i></button>*/}
                                                {/*    </div>*/}
                                                {/*</div>*/}
                                            </Form>
                                        </div>
                                    </Card.Body>
                                </Card>
                                <div className="text-center">
                                    <a 
                                        href={route('home.login')}
                                    >
                                        <i className="ri-arrow-left-line"></i> {t("Back to login")}
                                    </a>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </GuestLayout>

            {isSubmitting && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                    style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 2000 }}
                >
                    <div className="text-center text-white">
                        <div className="spinner-border text-light" role="status" style={{ width: 48, height: 48 }}>
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-3 fw-medium">{ t('Processing') }</div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
}
