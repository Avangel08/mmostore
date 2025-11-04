<<<<<<<< HEAD:public/build/assets/index-e2ufP39C.js
import{X as z,d as w,j as t,f as N,u as v,R as k,S}from"./ContextMenuProvider-BnbZ3Xw_.js";import{a as y}from"./thunk-BdeJSdvk.js";import"./react-toastify.esm-Dj3bmGVf.js";/* empty css                      */import"./LightDark-DNWszmZt.js";import{c as L}from"./reselect-CiXCCDx7.js";import{u as T,N as D}from"./Navbar-Ct_Ir6cl.js";import{LayoutProvider as Y,useLayoutContext as $}from"./LayoutContext-CLuoSh_R.js";import E from"./Footer-VfJmqo4N.js";import{u as _}from"./useTranslation-CtwHyjpC.js";import"./scrollspy-L89SZfXR.js";import"./ThemeProvider-C0xt9VP8.js";import"./useEventCallback-CWLYZk1t.js";import"./NavbarContext-DjQnybmt.js";import"./inherits-C5_PO-Hh.js";import"./setPrototypeOf-DgZC2w_0.js";import"./index-DJrr_1Uz.js";import"./logo-light-D3OEWz0M.js";import"./ModalLogin-D66ESeoA.js";import"./index.esm-bbsQyNAz.js";import"./isSymbol-CYvIzdD2.js";import"./hoist-non-react-statics.cjs-D_S65KpP.js";import"./Modal-mwm3tf-U.js";import"./useMergedRefs-0e-0eNkH.js";import"./useWillUnmount-JMQ9EYbt.js";import"./TransitionWrapper-DdJIchS_.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./AbstractModalHeader-DeFu7Xk5.js";import"./useWindow-ByxVeiaK.js";import"./querySelectorAll-6mKGZXEM.js";import"./useEventCallback-BuAGpOO_.js";import"./hasClass-D5mdPDLg.js";import"./NoopTransition-Ck7A0kGI.js";import"./DataKey-DjdvojM5.js";import"./CloseButton-Be0iGRvt.js";import"./Fade-DiSce4YX.js";import"./divWithClassName-Egl5q-Z9.js";import"./Form-kohAgaPo.js";import"./Col-DMyGedr-.js";import"./Button-BRcUTJGP.js";import"./Button-C_zChQbi.js";import"./InputGroup-BiZSFxii.js";import"./InputGroupContext-CJ4MYKQG.js";import"./Row-D4DhAVVB.js";import"./LanguageDropdown-BKUk_KR5.js";import"./Dropdown-5Gi4Yv0j.js";import"./SSRProvider-deIbZZYa.js";import"./useIsomorphicEffect-CgDepx_Y.js";import"./SelectableContext-DwW_dd8V.js";import"./hook-UG-9p7bs.js";import"./extends-CF3RwP-h.js";import"./Anchor-Dx9niwmc.js";import"./Container-xmF8fBYZ.js";import"./Collapse-DMC4Mlvv.js";import"./NavLink-BV4-k6Vz.js";import"./TabContext-Bora0t70.js";import"./sweetalert2.esm.all-5zhdP7Ax.js";const F=({contacts:l=[],position:m="bottom-right"})=>{const{contact_types:x}=z().props,[n,f]=w.useState(!1),{t:o}=_(),s=l.filter(e=>e.value&&e.value.trim());if(s.length===0)return null;const g=e=>!x||!x[e]?null:x[e],b=(e,r)=>{const c=g(e);if(!c)return r;const u=c.url_format||"",i=(r||"").trim();if(!i||/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(i)||i.startsWith("http://")||i.startsWith("https://"))return i;const j=((C,d,H)=>{switch(C){case"telegram":return d.replace(/^@+/,"");case"youtube":return d.replace(/^@+/,"");case"whatsapp":return d.replace(/\D/g,"");case"website":return d;default:return d}})(e,i);return u.includes("%s")?u.replace("%s",j):`${u}${j}`},p=e=>{const r=b(e.type,e.value);window.open(r,"_blank","noopener,noreferrer")},h=()=>{const e={position:"fixed",zIndex:1e3,transition:"all 0.3s ease"};switch(m){case"bottom-right":return{...e,bottom:"40px",right:"20px"};case"bottom-left":return{...e,bottom:"100px",left:"20px"};case"top-right":return{...e,top:"100px",right:"20px"};case"top-left":return{...e,top:"100px",left:"20px"};default:return{...e,bottom:"100px",right:"20px"}}},a=e=>({telegram:"#0088cc",facebook:"#1877f2",instagram:"#e4405f",x:"#000000",whatsapp:"#25d366",discord:"#5865f2",email:"#ea4335",phone:"#34a853",website:"#4285f4",youtube:"#ff0000",zalo:"#0068ff"})[e]||"#6c757d";return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
========
import{X as z,d as w,j as t,f as N,u as v,R as k,S}from"./ContextMenuProvider-BhVN3MI2.js";import{a as y}from"./thunk-CNTob9NR.js";import"./react-toastify.esm-Bzp-JuTX.js";/* empty css                      */import"./LightDark-DREMPlwr.js";import{c as L}from"./reselect-CiXCCDx7.js";import{u as T,N as D}from"./Navbar-CPURu2fc.js";import{LayoutProvider as Y,useLayoutContext as $}from"./LayoutContext-cxyWDEXN.js";import E from"./Footer-BEzeOthk.js";import{u as _}from"./useTranslation-ZbZFIHja.js";import"./Dropdown-DAdvUZKT.js";import"./ThemeProvider-CUiVOj3n.js";import"./querySelectorAll-BZjzdW4C.js";import"./useMergedRefs-BdX62CzH.js";import"./SSRProvider-CdYR2PPq.js";import"./useEventCallback-kYw4fXYA.js";import"./useIsomorphicEffect-0xLopGc7.js";import"./useWindow-D06ww4p5.js";import"./SelectableContext-C5rX9-0C.js";import"./NavbarContext-DFScsAQa.js";import"./Button-ItoOpMhW.js";import"./DataKey-DjdvojM5.js";import"./hook-Dwnxsckw.js";import"./extends-CF3RwP-h.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./useEventCallback-DN7Xb1FR.js";import"./Anchor-Dcci9ZUU.js";import"./InputGroupContext-BOLuIn5_.js";import"./Button-CT1W-dlW.js";import"./scrollspy-uLmSEELI.js";import"./inherits-B2gPeQio.js";import"./index-CMi1q9xw.js";import"./logo-light-D3OEWz0M.js";import"./ModalLogin-DYgNIhan.js";import"./index.esm-C_ZlIYoE.js";import"./isSymbol-CYvIzdD2.js";import"./hoist-non-react-statics.cjs-3lIPCjJv.js";import"./Modal-C594Uytt.js";import"./useWillUnmount-RaeYL0I0.js";import"./TransitionWrapper-CHWC6Aev.js";import"./setPrototypeOf-DgZC2w_0.js";import"./AbstractModalHeader-ONgXPvo5.js";import"./hasClass-Du0ceSUq.js";import"./NoopTransition-Ba3l4ZU6.js";import"./CloseButton-D0xq5bFg.js";import"./Fade-DZUndS-E.js";import"./divWithClassName-DOGM4Upq.js";import"./Form-B_1_SP-R.js";import"./Col-CDTbDU3W.js";import"./InputGroup-CbYy0et-.js";import"./Row-DTCryV-T.js";import"./Container-DaelVuOS.js";import"./Collapse-jWBU_wvy.js";import"./NavLink-4S5agp7j.js";import"./TabContext-BvLUMeJu.js";import"./sweetalert2.esm.all-5zhdP7Ax.js";const F=({contacts:l=[],position:m="bottom-right"})=>{const{contact_types:x}=z().props,[n,f]=w.useState(!1),{t:o}=_(),s=l.filter(e=>e.value&&e.value.trim());if(s.length===0)return null;const g=e=>!x||!x[e]?null:x[e],b=(e,r)=>{const p=g(e);if(!p)return r;const u=p.url_format||"",i=(r||"").trim();if(!i||/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(i)||i.startsWith("http://")||i.startsWith("https://"))return i;const j=((C,d,H)=>{switch(C){case"telegram":return d.replace(/^@+/,"");case"youtube":return d.replace(/^@+/,"");case"whatsapp":return d.replace(/\D/g,"");case"website":return d;default:return d}})(e,i);return u.includes("%s")?u.replace("%s",j):`${u}${j}`},c=e=>{const r=b(e.type,e.value);window.open(r,"_blank","noopener,noreferrer")},h=()=>{const e={position:"fixed",zIndex:1e3,transition:"all 0.3s ease"};switch(m){case"bottom-right":return{...e,bottom:"40px",right:"20px"};case"bottom-left":return{...e,bottom:"100px",left:"20px"};case"top-right":return{...e,top:"100px",right:"20px"};case"top-left":return{...e,top:"100px",left:"20px"};default:return{...e,bottom:"100px",right:"20px"}}},a=e=>({telegram:"#0088cc",facebook:"#1877f2",instagram:"#e4405f",x:"#000000",whatsapp:"#25d366",discord:"#5865f2",email:"#ea4335",phone:"#34a853",website:"#4285f4",youtube:"#ff0000",zalo:"#0068ff"})[e]||"#6c757d";return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
>>>>>>>> main:public/build/assets/index-Bn6FTC_I.js
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
<<<<<<<< HEAD:public/build/assets/index-e2ufP39C.js
                `}),t.jsxs("div",{className:"contact-floating-container",style:h(),children:[s.map((e,r)=>{const c=g(e.type);if(!c)return null;const u=a(e.type);return t.jsxs("div",{className:`contact-item-wrapper ${n?"expanded":""}`,children:[t.jsx("span",{className:"contact-item-text",style:{transitionDelay:n?`${r*.1+.2}s`:"0s"},children:c.label}),t.jsx("button",{className:`contact-floating-button contact-item-button ${n?"expanded":""}`,onClick:()=>p(e),style:{transitionDelay:n?`${r*.1}s`:"0s",color:u},children:t.jsx("i",{className:c.icon})})]},r)}),t.jsxs("button",{className:"contact-floating-button contact-main-button",onClick:()=>f(!n),style:{marginTop:"20px"},children:[t.jsx("i",{className:"ri-customer-service-2-line"}),t.jsx("span",{style:{fontSize:"10px",lineHeight:"1"},children:o("Contact support")}),t.jsx("span",{className:"contact-main-label",children:o("Contact support")})]})]})]})},I=({children:l})=>{const m=N(),{contacts:x,store:n,domainSuffix:f}=z().props,o=T(),{pingDeposit:s}=$(),b=L(a=>a.Layout,a=>({layoutModeType:a.layoutModeType,layoutThemeType:a.layoutThemeType}));w.useEffect(()=>{s&&s()},[s]);const{layoutModeType:p}=v(a=>b(a));w.useEffect(()=>{p&&m(y(p))},[p,m]);const h=a=>{y&&m(y(a))};return t.jsxs(k.Fragment,{children:[t.jsxs(S,{children:[t.jsx("meta",{name:"description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"author",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{property:"og:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{property:"og:url",content:`https://${n==null?void 0:n.domain.find(a=>a.includes(f))}`}),t.jsx("meta",{property:"og:type",content:"product"}),t.jsx("meta",{property:"og:site_name",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),t.jsx("meta",{name:"twitter:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"twitter:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{name:"robots",content:"index, follow"})]}),t.jsxs("div",{id:"layout-wrapper",children:[t.jsx(D,{layoutModeType:p,onChangeLayoutMode:h}),t.jsx("div",{className:"main-page",children:l}),t.jsx(E,{}),t.jsx(F,{contacts:x,position:"bottom-right"})]})]})},At=({children:l})=>t.jsx(Y,{children:t.jsx(I,{children:l})});export{At as default};
========
                `}),t.jsxs("div",{className:"contact-floating-container",style:h(),children:[s.map((e,r)=>{const p=g(e.type);if(!p)return null;const u=a(e.type);return t.jsxs("div",{className:`contact-item-wrapper ${n?"expanded":""}`,children:[t.jsx("span",{className:"contact-item-text",style:{transitionDelay:n?`${r*.1+.2}s`:"0s"},children:p.label}),t.jsx("button",{className:`contact-floating-button contact-item-button ${n?"expanded":""}`,onClick:()=>c(e),style:{transitionDelay:n?`${r*.1}s`:"0s",color:u},children:t.jsx("i",{className:p.icon})})]},r)}),t.jsxs("button",{className:"contact-floating-button contact-main-button",onClick:()=>f(!n),style:{marginTop:"20px"},children:[t.jsx("i",{className:"ri-customer-service-2-line"}),t.jsx("span",{style:{fontSize:"10px",lineHeight:"1"},children:o("Contact support")}),t.jsx("span",{className:"contact-main-label",children:o("Contact support")})]})]})]})},I=({children:l})=>{const m=N(),{contacts:x,store:n,domainSuffix:f}=z().props,o=T(),{pingDeposit:s}=$(),b=L(a=>a.Layout,a=>({layoutModeType:a.layoutModeType,layoutThemeType:a.layoutThemeType}));w.useEffect(()=>{s&&s()},[s]);const{layoutModeType:c}=v(a=>b(a));w.useEffect(()=>{c&&m(y(c))},[c,m]);const h=a=>{y&&m(y(a))};return t.jsxs(k.Fragment,{children:[t.jsxs(S,{children:[t.jsx("meta",{name:"description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"author",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{property:"og:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{property:"og:url",content:`https://${n==null?void 0:n.domain.find(a=>a.includes(f))}`}),t.jsx("meta",{property:"og:type",content:"product"}),t.jsx("meta",{property:"og:site_name",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),t.jsx("meta",{name:"twitter:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"twitter:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{name:"robots",content:"index, follow"})]}),t.jsxs("div",{id:"layout-wrapper",children:[t.jsx(D,{layoutModeType:c,onChangeLayoutMode:h}),t.jsx("div",{className:"main-page",children:l}),t.jsx(E,{}),t.jsx(F,{contacts:x,position:"bottom-right"})]})]})},Xt=({children:l})=>t.jsx(Y,{children:t.jsx(I,{children:l})});export{Xt as default};
>>>>>>>> main:public/build/assets/index-Bn6FTC_I.js
