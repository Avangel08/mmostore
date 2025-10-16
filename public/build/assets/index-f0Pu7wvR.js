import{X as j,d as z,j as o,f as v,u as k,R as N}from"./ContextMenuProvider-1cB75p-p.js";import{a as h}from"./thunk-Be97AmUV.js";import"./react-toastify.esm-CMP2010h.js";/* empty css                      */import"./LightDark-htucfSEQ.js";import{c as S}from"./reselect-CiXCCDx7.js";import{N as T}from"./Navbar-BG96mfRZ.js";import{LayoutProvider as L}from"./LayoutContext-D-LXs-0z.js";import Y from"./Footer-DUtnYrVO.js";import{u as $}from"./useTranslation-C7Yq1257.js";import"./Dropdown-DbfyrjbA.js";import"./ThemeProvider-CK0LS3qr.js";import"./querySelectorAll-CqHIJ078.js";import"./useMergedRefs-CMrknats.js";import"./SSRProvider-CvsQASJI.js";import"./useEventCallback-BCgLfiDM.js";import"./useIsomorphicEffect-B4y2oaWF.js";import"./useWindow-CZaNFBD5.js";import"./SelectableContext-BEvhv38Q.js";import"./NavbarContext-2E9S59ud.js";import"./Button-BmeryA7r.js";import"./DataKey-DjdvojM5.js";import"./hook-BU9VZj-J.js";import"./extends-CF3RwP-h.js";import"./objectWithoutPropertiesLoose-Dsqj8S3w.js";import"./useEventCallback-DraKR6BF.js";import"./Anchor-B2knYez4.js";import"./InputGroupContext-DjmFhsg1.js";import"./Button-DzpAM0nN.js";import"./scrollspy-BWqsbm6T.js";import"./inherits-B2gPeQio.js";import"./index-hS6bo2zO.js";import"./logo-light-D3OEWz0M.js";import"./ModalLogin-Dquhf1hE.js";import"./index.esm-AjD9Q23E.js";import"./isSymbol-CYvIzdD2.js";import"./hoist-non-react-statics.cjs-DfFFbtXD.js";import"./Modal-CuFoBLIG.js";import"./useWillUnmount-DiSYdiwn.js";import"./TransitionWrapper-ngY_ZkUi.js";import"./setPrototypeOf-DgZC2w_0.js";import"./AbstractModalHeader-B-hdN3Xj.js";import"./hasClass-H27NZzxf.js";import"./NoopTransition-BXOCVAi7.js";import"./CloseButton-DfZYovl8.js";import"./Fade-CJmjx7TG.js";import"./divWithClassName-B2UmvJl6.js";import"./Form-vqhQI7d8.js";import"./Col-D0392pNZ.js";import"./InputGroup-Bj3orn0P.js";import"./Row-Cp0Qg_e-.js";import"./Container-CTVmsFDx.js";import"./Collapse-DZoekSvS.js";import"./NavLink-BMcHD9ta.js";import"./TabContext-DOosZvpO.js";import"./sweetalert2.esm.all-5zhdP7Ax.js";const E=({contacts:x=[],position:s="bottom-right"})=>{const{contact_types:l}=j().props,[n,b]=z.useState(!1),{t:u}=$(),d=x.filter(t=>t.value&&t.value.trim());if(d.length===0)return null;const m=t=>!l||!l[t]?null:l[t],g=(t,e)=>{const i=m(t);if(!i)return e;const c=i.url_format||"",a=(e||"").trim();if(!a||/^(?:[a-zA-Z][a-zA-Z0-9+.-]*:)/.test(a)||a.startsWith("http://")||a.startsWith("https://"))return a;const w=((C,p,P)=>{switch(C){case"telegram":return p.replace(/^@+/,"");case"youtube":return p.replace(/^@+/,"");case"whatsapp":return p.replace(/\D/g,"");case"website":return p;default:return p}})(t,a);return c.includes("%s")?c.replace("%s",w):`${c}${w}`},y=t=>{const e=g(t.type,t.value);window.open(e,"_blank","noopener,noreferrer")},f=()=>{const t={position:"fixed",zIndex:1e3,transition:"all 0.3s ease"};switch(s){case"bottom-right":return{...t,bottom:"100px",right:"20px"};case"bottom-left":return{...t,bottom:"100px",left:"20px"};case"top-right":return{...t,top:"100px",right:"20px"};case"top-left":return{...t,top:"100px",left:"20px"};default:return{...t,bottom:"100px",right:"20px"}}},r=t=>({telegram:"#0088cc",facebook:"#1877f2",instagram:"#e4405f",x:"#000000",whatsapp:"#25d366",discord:"#5865f2",email:"#ea4335",phone:"#34a853",website:"#4285f4",youtube:"#ff0000",zalo:"#0068ff"})[t]||"#6c757d";return o.jsxs(o.Fragment,{children:[o.jsx("style",{children:`
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
                `}),o.jsxs("div",{className:"contact-floating-container",style:f(),children:[d.map((t,e)=>{const i=m(t.type);if(!i)return null;const c=r(t.type);return o.jsxs("div",{className:`contact-item-wrapper ${n?"expanded":""}`,children:[o.jsx("span",{className:"contact-item-text",style:{transitionDelay:n?`${e*.1+.2}s`:"0s"},children:i.label}),o.jsx("button",{className:`contact-floating-button contact-item-button ${n?"expanded":""}`,onClick:()=>y(t),style:{transitionDelay:n?`${e*.1}s`:"0s",color:c},children:o.jsx("i",{className:i.icon})})]},e)}),o.jsxs("button",{className:"contact-floating-button contact-main-button",onClick:()=>b(!n),style:{marginTop:"20px"},children:[o.jsx("i",{className:"ri-customer-service-2-line"}),o.jsx("span",{style:{fontSize:"10px",lineHeight:"1"},children:u("Contact support")}),o.jsx("span",{className:"contact-main-label",children:u("Contact support")})]})]})]})},At=({children:x})=>{const s=v(),{subdomain:l,user:n,isAuthenticated:b,theme:u,store_settings:d,contacts:m,contact_types:g}=j().props,f=S(e=>e.Layout,e=>({layoutModeType:e.layoutModeType,layoutThemeType:e.layoutThemeType})),{layoutModeType:r}=k(e=>f(e));z.useEffect(()=>{r&&s(h(r))},[r,s]);const t=e=>{h&&s(h(e))};return o.jsx(N.Fragment,{children:o.jsx(L,{children:o.jsxs("div",{id:"layout-wrapper",children:[o.jsx(T,{layoutModeType:r,onChangeLayoutMode:t}),o.jsx("div",{className:"main-page",children:x}),o.jsx(Y,{}),o.jsx(E,{contacts:m,position:"bottom-right"})]})})})};export{At as default};
