import{X as z,d as w,j as t,f as N,u as v,R as k,S}from"./ContextMenuProvider-DoI9LuTu.js";import{a as y}from"./thunk-Dyk6Tozc.js";import"./react-toastify.esm-8BWsAHON.js";/* empty css                      */import"./LightDark-VYlQJ348.js";import{c as L}from"./reselect-CiXCCDx7.js";import{u as T,N as D}from"./Navbar-d898nJbX.js";import{LayoutProvider as Y,useLayoutContext as $}from"./LayoutContext-BoHYABHW.js";import E from"./Footer-BsH6yqSV.js";import{u as _}from"./useTranslation-Bh5zzBC_.js";import"./scrollspy-C0ZWAZvY.js";import"./ThemeProvider-CQKb4rSK.js";import"./useEventCallback-BA23UYAQ.js";import"./NavbarContext-BuJEydxA.js";import"./inherits-B2gPeQio.js";import"./index-B7rcZTdA.js";import"./logo-light-D3OEWz0M.js";import"./ModalLogin-Dzzr3hgr.js";import"./index.esm-yjK6ua4W.js";import"./isSymbol-CYvIzdD2.js";import"./hoist-non-react-statics.cjs-BsRiVy2U.js";import"./Modal-Ct9dsq7D.js";import"./useMergedRefs-Cm3LQ1VB.js";import"./useWillUnmount-CWisbIWq.js";import"./TransitionWrapper-CRtjL7Sb.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./setPrototypeOf-DgZC2w_0.js";import"./AbstractModalHeader-Baf6fi1-.js";import"./useWindow-B3mPSubg.js";import"./querySelectorAll-rMMgkU1T.js";import"./useEventCallback-Bsoi2xyD.js";import"./hasClass-B9uJik72.js";import"./NoopTransition-Badst7zB.js";import"./DataKey-DjdvojM5.js";import"./CloseButton-feMrj_cP.js";import"./Fade-iG7JUvQW.js";import"./divWithClassName-Ct-4CK0x.js";import"./Form-C6Oq7frR.js";import"./Col-BERnSmBs.js";import"./Button-CdshqBqI.js";import"./Button-lElTeqs9.js";import"./InputGroup-CDI3KljJ.js";import"./InputGroupContext-CIB_KQgH.js";import"./Row-DaX0pFtU.js";import"./LanguageDropdown-DoeXY-nO.js";import"./Dropdown-CxMKodrb.js";import"./SSRProvider-CLk7drUW.js";import"./useIsomorphicEffect-DSAwC7_u.js";import"./SelectableContext-Cn0HZByE.js";import"./hook-Crll79d-.js";import"./extends-CF3RwP-h.js";import"./Anchor-B8rOyTnZ.js";import"./Container-AKEw1NBh.js";import"./Collapse-CckE0-uK.js";import"./NavLink-DAi6H7Zt.js";import"./TabContext-CGmNngma.js";import"./sweetalert2.esm.all-5zhdP7Ax.js";const F=({contacts:l=[],position:m="bottom-right"})=>{const{contact_types:x}=z().props,[n,f]=w.useState(!1),{t:o}=_(),s=l.filter(e=>e.value&&e.value.trim());if(s.length===0)return null;const g=e=>!x||!x[e]?null:x[e],b=(e,r)=>{const c=g(e);if(!c)return r;const u=c.url_format||"",i=(r||"").trim();if(!i||/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(i)||i.startsWith("http://")||i.startsWith("https://"))return i;const j=((C,d,H)=>{switch(C){case"telegram":return d.replace(/^@+/,"");case"youtube":return d.replace(/^@+/,"");case"whatsapp":return d.replace(/\D/g,"");case"website":return d;default:return d}})(e,i);return u.includes("%s")?u.replace("%s",j):`${u}${j}`},p=e=>{const r=b(e.type,e.value);window.open(r,"_blank","noopener,noreferrer")},h=()=>{const e={position:"fixed",zIndex:1e3,transition:"all 0.3s ease"};switch(m){case"bottom-right":return{...e,bottom:"40px",right:"20px"};case"bottom-left":return{...e,bottom:"100px",left:"20px"};case"top-right":return{...e,top:"100px",right:"20px"};case"top-left":return{...e,top:"100px",left:"20px"};default:return{...e,bottom:"100px",right:"20px"}}},a=e=>({telegram:"#0088cc",facebook:"#1877f2",instagram:"#e4405f",x:"#000000",whatsapp:"#25d366",discord:"#5865f2",email:"#ea4335",phone:"#34a853",website:"#4285f4",youtube:"#ff0000",zalo:"#0068ff"})[e]||"#6c757d";return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
                `}),t.jsxs("div",{className:"contact-floating-container",style:h(),children:[s.map((e,r)=>{const c=g(e.type);if(!c)return null;const u=a(e.type);return t.jsxs("div",{className:`contact-item-wrapper ${n?"expanded":""}`,children:[t.jsx("span",{className:"contact-item-text",style:{transitionDelay:n?`${r*.1+.2}s`:"0s"},children:c.label}),t.jsx("button",{className:`contact-floating-button contact-item-button ${n?"expanded":""}`,onClick:()=>p(e),style:{transitionDelay:n?`${r*.1}s`:"0s",color:u},children:t.jsx("i",{className:c.icon})})]},r)}),t.jsxs("button",{className:"contact-floating-button contact-main-button",onClick:()=>f(!n),style:{marginTop:"20px"},children:[t.jsx("i",{className:"ri-customer-service-2-line"}),t.jsx("span",{style:{fontSize:"10px",lineHeight:"1"},children:o("Contact support")}),t.jsx("span",{className:"contact-main-label",children:o("Contact support")})]})]})]})},I=({children:l})=>{const m=N(),{contacts:x,store:n,domainSuffix:f}=z().props,o=T(),{pingDeposit:s}=$(),b=L(a=>a.Layout,a=>({layoutModeType:a.layoutModeType,layoutThemeType:a.layoutThemeType}));w.useEffect(()=>{s&&s()},[s]);const{layoutModeType:p}=v(a=>b(a));w.useEffect(()=>{p&&m(y(p))},[p,m]);const h=a=>{y&&m(y(a))};return t.jsxs(k.Fragment,{children:[t.jsxs(S,{children:[t.jsx("meta",{name:"description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"author",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{property:"og:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{property:"og:url",content:`https://${n==null?void 0:n.domain.find(a=>a.includes(f))}`}),t.jsx("meta",{property:"og:type",content:"product"}),t.jsx("meta",{property:"og:site_name",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),t.jsx("meta",{name:"twitter:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"twitter:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{name:"robots",content:"index, follow"})]}),t.jsxs("div",{id:"layout-wrapper",children:[t.jsx(D,{layoutModeType:p,onChangeLayoutMode:h}),t.jsx("div",{className:"main-page",children:l}),t.jsx(E,{}),t.jsx(F,{contacts:x,position:"bottom-right"})]})]})},At=({children:l})=>t.jsx(Y,{children:t.jsx(I,{children:l})});export{At as default};
