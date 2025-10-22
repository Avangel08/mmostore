import{X as z,d as w,j as t,f as N,u as v,R as k,S}from"./ContextMenuProvider-DCdb8j9t.js";import{a as y}from"./thunk-CnhdTyKr.js";import"./react-toastify.esm-Bwsw1aoB.js";/* empty css                      */import"./LightDark-CrF8-1wK.js";import{c as L}from"./reselect-CiXCCDx7.js";import{u as T,N as D}from"./Navbar-CjAPrUK0.js";import{LayoutProvider as Y,useLayoutContext as $}from"./LayoutContext-ty_CWxqC.js";import E from"./Footer-oIjyy4GS.js";import{u as _}from"./useTranslation-BeBCG-tb.js";import"./Dropdown-D-szNC0L.js";import"./ThemeProvider-B2_W_dCu.js";import"./querySelectorAll-BUF6GxAr.js";import"./useMergedRefs-qO3RddUr.js";import"./SSRProvider-B7UJ9TZ1.js";import"./useEventCallback-B3WkzC8o.js";import"./useIsomorphicEffect-DBZcWV3F.js";import"./useWindow-XMw1SZRE.js";import"./SelectableContext-BXVmDtUi.js";import"./NavbarContext-BDjdnqqL.js";import"./Button-DW89RreQ.js";import"./DataKey-DjdvojM5.js";import"./hook-D-Q4NZE6.js";import"./extends-CF3RwP-h.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./useEventCallback-Blih2yEw.js";import"./Anchor-BBr3tu3N.js";import"./InputGroupContext-CSG2a_Xx.js";import"./Button-DkR4lkD4.js";import"./scrollspy-CUB9tACV.js";import"./inherits-B2gPeQio.js";import"./index-BSRKPwsw.js";import"./logo-light-D3OEWz0M.js";import"./ModalLogin-I41DMrFM.js";import"./index.esm-CC-SwQOh.js";import"./isSymbol-CYvIzdD2.js";import"./hoist-non-react-statics.cjs-Cl0fTsAK.js";import"./Modal-PiC5wIE_.js";import"./useWillUnmount-ClVsaD3q.js";import"./TransitionWrapper-WlnnEX3_.js";import"./setPrototypeOf-DgZC2w_0.js";import"./AbstractModalHeader-BzQN1u3g.js";import"./hasClass-CFrhebZ5.js";import"./NoopTransition-DV-WmqrX.js";import"./CloseButton-DmCN2KAW.js";import"./Fade-_gEJg8B2.js";import"./divWithClassName-CMPxMdR0.js";import"./Form-BwWb-AQG.js";import"./Col-BKpEL2i4.js";import"./InputGroup-DeMyQ-IT.js";import"./Row-DcrQzJSf.js";import"./Container-B-XzGzbE.js";import"./Collapse-DcrjWkI8.js";import"./NavLink-C2m6UJ-U.js";import"./TabContext-CQlkuOeg.js";import"./sweetalert2.esm.all-5zhdP7Ax.js";const F=({contacts:l=[],position:m="bottom-right"})=>{const{contact_types:x}=z().props,[n,f]=w.useState(!1),{t:o}=_(),s=l.filter(e=>e.value&&e.value.trim());if(s.length===0)return null;const g=e=>!x||!x[e]?null:x[e],b=(e,r)=>{const p=g(e);if(!p)return r;const u=p.url_format||"",i=(r||"").trim();if(!i||/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(i)||i.startsWith("http://")||i.startsWith("https://"))return i;const j=((C,d,H)=>{switch(C){case"telegram":return d.replace(/^@+/,"");case"youtube":return d.replace(/^@+/,"");case"whatsapp":return d.replace(/\D/g,"");case"website":return d;default:return d}})(e,i);return u.includes("%s")?u.replace("%s",j):`${u}${j}`},c=e=>{const r=b(e.type,e.value);window.open(r,"_blank","noopener,noreferrer")},h=()=>{const e={position:"fixed",zIndex:1e3,transition:"all 0.3s ease"};switch(m){case"bottom-right":return{...e,bottom:"40px",right:"20px"};case"bottom-left":return{...e,bottom:"100px",left:"20px"};case"top-right":return{...e,top:"100px",right:"20px"};case"top-left":return{...e,top:"100px",left:"20px"};default:return{...e,bottom:"100px",right:"20px"}}},a=e=>({telegram:"#0088cc",facebook:"#1877f2",instagram:"#e4405f",x:"#000000",whatsapp:"#25d366",discord:"#5865f2",email:"#ea4335",phone:"#34a853",website:"#4285f4",youtube:"#ff0000",zalo:"#0068ff"})[e]||"#6c757d";return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
                `}),t.jsxs("div",{className:"contact-floating-container",style:h(),children:[s.map((e,r)=>{const p=g(e.type);if(!p)return null;const u=a(e.type);return t.jsxs("div",{className:`contact-item-wrapper ${n?"expanded":""}`,children:[t.jsx("span",{className:"contact-item-text",style:{transitionDelay:n?`${r*.1+.2}s`:"0s"},children:p.label}),t.jsx("button",{className:`contact-floating-button contact-item-button ${n?"expanded":""}`,onClick:()=>c(e),style:{transitionDelay:n?`${r*.1}s`:"0s",color:u},children:t.jsx("i",{className:p.icon})})]},r)}),t.jsxs("button",{className:"contact-floating-button contact-main-button",onClick:()=>f(!n),style:{marginTop:"20px"},children:[t.jsx("i",{className:"ri-customer-service-2-line"}),t.jsx("span",{style:{fontSize:"10px",lineHeight:"1"},children:o("Contact support")}),t.jsx("span",{className:"contact-main-label",children:o("Contact support")})]})]})]})},I=({children:l})=>{const m=N(),{contacts:x,store:n,domainSuffix:f}=z().props,o=T(),{pingDeposit:s}=$(),b=L(a=>a.Layout,a=>({layoutModeType:a.layoutModeType,layoutThemeType:a.layoutThemeType}));w.useEffect(()=>{s&&s()},[s]);const{layoutModeType:c}=v(a=>b(a));w.useEffect(()=>{c&&m(y(c))},[c,m]);const h=a=>{y&&m(y(a))};return t.jsxs(k.Fragment,{children:[t.jsxs(S,{children:[t.jsx("meta",{name:"description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"author",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{property:"og:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{property:"og:url",content:`https://${n==null?void 0:n.domain.find(a=>a.includes(f))}`}),t.jsx("meta",{property:"og:type",content:"product"}),t.jsx("meta",{property:"og:site_name",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),t.jsx("meta",{name:"twitter:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"twitter:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{name:"robots",content:"index, follow"})]}),t.jsxs("div",{id:"layout-wrapper",children:[t.jsx(D,{layoutModeType:c,onChangeLayoutMode:h}),t.jsx("div",{className:"main-page",children:l}),t.jsx(E,{}),t.jsx(F,{contacts:x,position:"bottom-right"})]})]})},Xt=({children:l})=>t.jsx(Y,{children:t.jsx(I,{children:l})});export{Xt as default};
