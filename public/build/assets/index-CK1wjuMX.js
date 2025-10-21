import{X as w,d as j,j as t,f as N,u as v,R as k,S}from"./ContextMenuProvider-DK3oxQYr.js";import{a as h}from"./thunk-BTJGEviI.js";import"./react-toastify.esm-9xgEgjS9.js";/* empty css                      */import"./LightDark-NCPZk2Cu.js";import{c as T}from"./reselect-CiXCCDx7.js";import{u as L,N as D}from"./Navbar-Cy7IvNCx.js";import{LayoutProvider as Y}from"./LayoutContext-D3qCD23e.js";import $ from"./Footer-H1PlNW90.js";import{u as _}from"./useTranslation-DPKXtvuf.js";import"./Dropdown-_eQxxY7W.js";import"./ThemeProvider-Ct_rgNLL.js";import"./querySelectorAll-DyAC2eix.js";import"./useMergedRefs-DpVwXFtQ.js";import"./SSRProvider-Bm_IBhbN.js";import"./useEventCallback-CkenMm09.js";import"./useIsomorphicEffect-DCEK52HO.js";import"./useWindow-C0YEyK7V.js";import"./SelectableContext-D5B5znED.js";import"./NavbarContext-6IejjhSq.js";import"./Button-V6sZ7J-q.js";import"./DataKey-DjdvojM5.js";import"./hook-CKvhJRCT.js";import"./extends-BFqQA52f.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./useEventCallback-vOopJezb.js";import"./Anchor-CwUEsFps.js";import"./InputGroupContext-baOa1g_u.js";import"./Button-CFXbok-i.js";import"./scrollspy-qNz_V94o.js";import"./inherits-BJ6TuR_q.js";import"./setPrototypeOf-DgZC2w_0.js";import"./index-DBORkYtJ.js";import"./logo-light-D3OEWz0M.js";import"./ModalLogin-BQHBObRf.js";import"./index.esm-BSLmOO6X.js";import"./isSymbol-CYvIzdD2.js";import"./hoist-non-react-statics.cjs-CLORWFEJ.js";import"./Modal-BfVe3cAO.js";import"./useWillUnmount-Dgjk51VS.js";import"./TransitionWrapper-Cd1cgGa9.js";import"./AbstractModalHeader-CvVyook-.js";import"./hasClass-FKaqrMiU.js";import"./NoopTransition-CTkquFTR.js";import"./CloseButton-moyFQeDE.js";import"./Fade-BVcVAuqg.js";import"./divWithClassName-D5EYi2Il.js";import"./Form-BL_QAQYe.js";import"./Col-CTtgbep0.js";import"./InputGroup-CnE0KqIM.js";import"./Row-yXb5PzTN.js";import"./Container-CKD4fvms.js";import"./Collapse-D97udJ4R.js";import"./NavLink-CR6viVXI.js";import"./TabContext-DxObg7O8.js";import"./sweetalert2.esm.all-5zhdP7Ax.js";const E=({contacts:u=[],position:c="bottom-right"})=>{const{contact_types:l}=w().props,[n,f]=j.useState(!1),{t:o}=_(),g=u.filter(e=>e.value&&e.value.trim());if(g.length===0)return null;const d=e=>!l||!l[e]?null:l[e],s=(e,r)=>{const p=d(e);if(!p)return r;const m=p.url_format||"",i=(r||"").trim();if(!i||/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(i)||i.startsWith("http://")||i.startsWith("https://"))return i;const y=((C,x,M)=>{switch(C){case"telegram":return x.replace(/^@+/,"");case"youtube":return x.replace(/^@+/,"");case"whatsapp":return x.replace(/\D/g,"");case"website":return x;default:return x}})(e,i);return m.includes("%s")?m.replace("%s",y):`${m}${y}`},b=e=>{const r=s(e.type,e.value);window.open(r,"_blank","noopener,noreferrer")},a=()=>{const e={position:"fixed",zIndex:1e3,transition:"all 0.3s ease"};switch(c){case"bottom-right":return{...e,bottom:"40px",right:"20px"};case"bottom-left":return{...e,bottom:"100px",left:"20px"};case"top-right":return{...e,top:"100px",right:"20px"};case"top-left":return{...e,top:"100px",left:"20px"};default:return{...e,bottom:"100px",right:"20px"}}},z=e=>({telegram:"#0088cc",facebook:"#1877f2",instagram:"#e4405f",x:"#000000",whatsapp:"#25d366",discord:"#5865f2",email:"#ea4335",phone:"#34a853",website:"#4285f4",youtube:"#ff0000",zalo:"#0068ff"})[e]||"#6c757d";return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
                `}),t.jsxs("div",{className:"contact-floating-container",style:a(),children:[g.map((e,r)=>{const p=d(e.type);if(!p)return null;const m=z(e.type);return t.jsxs("div",{className:`contact-item-wrapper ${n?"expanded":""}`,children:[t.jsx("span",{className:"contact-item-text",style:{transitionDelay:n?`${r*.1+.2}s`:"0s"},children:p.label}),t.jsx("button",{className:`contact-floating-button contact-item-button ${n?"expanded":""}`,onClick:()=>b(e),style:{transitionDelay:n?`${r*.1}s`:"0s",color:m},children:t.jsx("i",{className:p.icon})})]},r)}),t.jsxs("button",{className:"contact-floating-button contact-main-button",onClick:()=>f(!n),style:{marginTop:"20px"},children:[t.jsx("i",{className:"ri-customer-service-2-line"}),t.jsx("span",{style:{fontSize:"10px",lineHeight:"1"},children:o("Contact support")}),t.jsx("span",{className:"contact-main-label",children:o("Contact support")})]})]})]})},Rt=({children:u})=>{const c=N(),{contacts:l,store:n,domainSuffix:f}=w().props,o=L(),d=T(a=>a.Layout,a=>({layoutModeType:a.layoutModeType,layoutThemeType:a.layoutThemeType})),{layoutModeType:s}=v(a=>d(a));j.useEffect(()=>{s&&c(h(s))},[s,c]);const b=a=>{h&&c(h(a))};return t.jsx(k.Fragment,{children:t.jsxs(Y,{children:[t.jsxs(S,{children:[t.jsx("meta",{name:"description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"author",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{property:"og:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{property:"og:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{property:"og:url",content:`https://${n==null?void 0:n.domain.find(a=>a.includes(f))}`}),t.jsx("meta",{property:"og:type",content:"product"}),t.jsx("meta",{property:"og:site_name",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:card",content:"summary_large_image"}),t.jsx("meta",{name:"twitter:title",content:(o==null?void 0:o.storeName)||""}),t.jsx("meta",{name:"twitter:description",content:(o==null?void 0:o.metaDescription)||""}),t.jsx("meta",{name:"twitter:image",content:(o==null?void 0:o.pageHeaderImage)||""}),t.jsx("meta",{name:"robots",content:"index, follow"})]}),t.jsxs("div",{id:"layout-wrapper",children:[t.jsx(D,{layoutModeType:s,onChangeLayoutMode:b}),t.jsx("div",{className:"main-page",children:u}),t.jsx($,{}),t.jsx(E,{contacts:l,position:"bottom-right"})]})]})})};export{Rt as default};
